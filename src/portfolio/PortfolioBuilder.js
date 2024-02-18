/**
 * PortfolioBuilder - Main orchestrator that creates an entire portfolio
 * from a declarative configuration object.
 *
 * Assembles Navbar, HeroSection, StatsCounter, ProjectCards, SkillGroups,
 * Timeline, ContactForm, Footer, and BackToTop into a cohesive single-page
 * portfolio with theme support and smooth-scroll navigation.
 *
 * @class PortfolioBuilder
 * @extends EventEmitter
 */

import { EventEmitter } from '../core/EventEmitter.js';
import { ThemeManager } from '../theme/ThemeManager.js';
import { ThemeToggle } from '../theme/ThemeToggle.js';
import { themePresets } from '../theme/presets.js';

// Component imports — these files are created by parallel agents.
// They are expected at the paths listed below; if a module is missing the
// corresponding section is gracefully skipped at build time.
import { HeroSection } from '../components/HeroSection.js';
import { StatsCounter } from '../components/StatsCounter.js';
import { SocialLinks } from '../components/SocialLinks.js';
import { Navbar } from '../components/Navbar.js';
import { Footer } from '../components/Footer.js';
import { BackToTop } from '../components/BackToTop.js';

import { ProjectCard } from '../components/ProjectCard.js';
import SkillGroup from '../components/SkillGroup.js';
import { Timeline } from '../components/Timeline.js';
import { ContactForm } from '../forms/ContactForm.js';

/**
 * Section metadata used when auto-generating navbar links.
 * @private
 */
const SECTION_META = {
  hero:       { id: 'fc-hero',       label: 'Home' },
  stats:      { id: 'fc-stats',      label: 'Stats' },
  projects:   { id: 'fc-projects',   label: 'Projects' },
  skills:     { id: 'fc-skills',     label: 'Skills' },
  experience: { id: 'fc-experience', label: 'Experience' },
  contact:    { id: 'fc-contact',    label: 'Contact' }
};

export class PortfolioBuilder extends EventEmitter {
  /**
   * @param {Object} config - Portfolio configuration
   * @param {string|HTMLElement} config.target - Mount target (selector or element)
   * @param {string} [config.name] - Portfolio owner name
   * @param {string} [config.title] - Portfolio owner title / role
   * @param {string} [config.theme='light'] - Preset name or 'light'/'dark'
   * @param {Object} [config.navbar] - Navbar configuration
   * @param {Object} [config.hero] - HeroSection configuration
   * @param {Array}  [config.stats] - Array of stat objects for StatsCounter
   * @param {Array}  [config.projects] - Array of ProjectCard option objects
   * @param {Array}  [config.skills] - Array of SkillGroup config objects
   * @param {Array}  [config.experience] - Array of Timeline entry configs
   * @param {Object} [config.contact] - ContactForm options
   * @param {Object} [config.footer] - Footer configuration
   */
  constructor(config = {}) {
    super();

    this.config = config;
    this.root = null;
    this.themeManager = null;
    this.themeToggle = null;
    this.components = {};
    this._built = false;
  }

  // ---------------------------------------------------------------------------
  // Public API
  // ---------------------------------------------------------------------------

  /**
   * Build and mount the entire portfolio.
   * @returns {PortfolioBuilder} this (for chaining)
   */
  build() {
    if (this._built) {
      console.warn('PortfolioBuilder: portfolio is already built. Call destroy() first.');
      return this;
    }

    const target = this._resolveTarget(this.config.target);
    if (!target) {
      throw new Error('PortfolioBuilder: target element not found');
    }

    // Root wrapper
    this.root = document.createElement('div');
    this.root.className = 'fc-portfolio';

    // Theme setup
    this._setupTheme();

    // Inject base portfolio styles
    this._injectStyles();

    // Determine which sections are present so we can auto-generate nav links
    const presentSections = this._getPresentSections();

    // Build each section in order
    this._buildNavbar(presentSections);
    this._buildHero();
    this._buildStats();
    this._buildProjects();
    this._buildSkills();
    this._buildExperience();
    this._buildContact();
    this._buildFooter();
    this._buildBackToTop();

    // Mount
    target.innerHTML = '';
    target.appendChild(this.root);

    // Wire smooth scrolling
    this._setupSmoothScrolling();

    this._built = true;
    this.emit('built', { builder: this });

    return this;
  }

  /**
   * Tear down the portfolio and clean up all components.
   */
  destroy() {
    // Destroy individual components
    Object.values(this.components).forEach(component => {
      if (component && typeof component.destroy === 'function') {
        component.destroy();
      }
    });
    this.components = {};

    if (this.themeToggle && typeof this.themeToggle.destroy === 'function') {
      this.themeToggle.destroy();
      this.themeToggle = null;
    }

    if (this.themeManager) {
      this.themeManager.destroy();
      this.themeManager = null;
    }

    if (this.root && this.root.parentNode) {
      this.root.parentNode.removeChild(this.root);
    }
    this.root = null;

    this._built = false;
    this.removeAllListeners();
    this.emit('destroyed');
  }

  /**
   * Get a specific component instance by name.
   * @param {string} name - Component key (e.g. 'hero', 'timeline', 'navbar')
   * @returns {*} The component instance, or undefined
   */
  getComponent(name) {
    return this.components[name];
  }

  /**
   * Change the active theme.
   * @param {string} name - Theme name (preset key or 'light'/'dark')
   */
  setTheme(name) {
    if (!this.themeManager) return;

    // If it is a preset name, register it first (may already be registered)
    if (themePresets[name]) {
      this.themeManager.registerTheme(name, themePresets[name]);
    }

    this.themeManager.setTheme(name);
    this.emit('themeChanged', { theme: name });
  }

  // ---------------------------------------------------------------------------
  // Private helpers — target & theme
  // ---------------------------------------------------------------------------

  /**
   * Resolve a selector string or HTMLElement to an element.
   * @private
   */
  _resolveTarget(target) {
    if (!target) return document.body;
    if (typeof target === 'string') return document.querySelector(target);
    return target;
  }

  /**
   * Set up the ThemeManager, register preset themes, and apply the chosen one.
   * @private
   */
  _setupTheme() {
    const themeName = this.config.theme || 'light';

    this.themeManager = new ThemeManager({
      defaultTheme: 'light',
      respectSystemPreference: false
    });

    // Register every preset so the user can switch between them later
    Object.entries(themePresets).forEach(([name, properties]) => {
      this.themeManager.registerTheme(name, properties);
    });

    // Apply the requested theme
    if (this.themeManager.themes[themeName]) {
      this.themeManager.setTheme(themeName, false);
    } else {
      console.warn(`PortfolioBuilder: unknown theme "${themeName}", falling back to light`);
      this.themeManager.setTheme('light', false);
    }
  }

  // ---------------------------------------------------------------------------
  // Private helpers — section detection & navbar
  // ---------------------------------------------------------------------------

  /**
   * Determine which optional sections are present in the config.
   * @private
   * @returns {string[]} Array of section keys that have config data.
   */
  _getPresentSections() {
    const sections = [];
    if (this.config.hero)       sections.push('hero');
    if (this.config.stats && this.config.stats.length)      sections.push('stats');
    if (this.config.projects && this.config.projects.length) sections.push('projects');
    if (this.config.skills && this.config.skills.length)     sections.push('skills');
    if (this.config.experience && this.config.experience.length) sections.push('experience');
    if (this.config.contact)    sections.push('contact');
    return sections;
  }

  /**
   * Auto-generate navbar links from present sections.
   * @private
   */
  _autoNavLinks(presentSections) {
    return presentSections
      .filter(key => key !== 'hero') // hero is "Home", handled separately
      .map(key => ({
        text: SECTION_META[key].label,
        href: `#${SECTION_META[key].id}`
      }));
  }

  // ---------------------------------------------------------------------------
  // Private helpers — section builders
  // ---------------------------------------------------------------------------

  /** @private */
  _buildNavbar(presentSections) {
    const navConfig = this.config.navbar;
    const brand = (navConfig && navConfig.brand) || this.config.name || 'Portfolio';
    const links = (navConfig && navConfig.links) || this._autoNavLinks(presentSections);

    try {
      const navbar = new Navbar({
        brand,
        links,
        themeToggle: true,
        themeManager: this.themeManager
      });

      const el = navbar.render();
      this.root.appendChild(el);
      this.components.navbar = navbar;
    } catch (err) {
      // Navbar component may not be available yet — build a simple fallback
      this._buildFallbackNavbar(brand, links);
    }
  }

  /** @private */
  _buildFallbackNavbar(brand, links) {
    const nav = document.createElement('nav');
    nav.className = 'fc-portfolio__navbar';
    nav.setAttribute('role', 'navigation');
    nav.setAttribute('aria-label', 'Main navigation');

    const brandEl = document.createElement('a');
    brandEl.className = 'fc-portfolio__navbar-brand';
    brandEl.href = '#';
    brandEl.textContent = brand;
    nav.appendChild(brandEl);

    const ul = document.createElement('ul');
    ul.className = 'fc-portfolio__navbar-links';
    links.forEach(link => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = link.href;
      a.textContent = link.text;
      a.className = 'fc-portfolio__navbar-link';
      li.appendChild(a);
      ul.appendChild(li);
    });
    nav.appendChild(ul);

    this.root.appendChild(nav);
  }

  /** @private */
  _buildHero() {
    if (!this.config.hero) return;

    const heroConfig = {
      ...this.config.hero,
      name: this.config.hero.name || this.config.name,
      title: this.config.hero.title || this.config.title
    };

    const section = this._createSection('fc-hero', null); // no heading — hero IS the heading

    try {
      const hero = new HeroSection(heroConfig);
      const el = hero.render();
      section.appendChild(el);
      this.components.hero = hero;
    } catch (err) {
      // Fallback hero
      section.innerHTML = this._fallbackHeroHTML(heroConfig);
    }

    this.root.appendChild(section);
  }

  /** @private */
  _fallbackHeroHTML(cfg) {
    const headline = cfg.headline || '';
    const subheadline = cfg.subheadline || '';
    const name = cfg.name || '';
    const ctaHTML = cfg.cta
      ? `<a href="${cfg.cta.href || '#'}" class="fc-portfolio__cta">${cfg.cta.text || 'Learn More'}</a>`
      : '';

    return `
      <div class="fc-portfolio__hero-inner">
        ${name ? `<p class="fc-portfolio__hero-name">${name}</p>` : ''}
        <h1 class="fc-portfolio__hero-headline">${headline}</h1>
        ${subheadline ? `<p class="fc-portfolio__hero-subheadline">${subheadline}</p>` : ''}
        ${ctaHTML}
      </div>
    `;
  }

  /** @private */
  _buildStats() {
    if (!this.config.stats || !this.config.stats.length) return;

    const section = this._createSection('fc-stats', null);

    try {
      const stats = new StatsCounter({ stats: this.config.stats });
      const el = stats.render();
      section.appendChild(el);
      this.components.stats = stats;
    } catch (err) {
      // Fallback stats
      const grid = document.createElement('div');
      grid.className = 'fc-portfolio__stats-grid';
      this.config.stats.forEach(stat => {
        const item = document.createElement('div');
        item.className = 'fc-portfolio__stat';
        item.innerHTML = `
          <span class="fc-portfolio__stat-value">${stat.value}${stat.suffix || ''}</span>
          <span class="fc-portfolio__stat-label">${stat.label}</span>
        `;
        grid.appendChild(item);
      });
      section.appendChild(grid);
    }

    this.root.appendChild(section);
  }

  /** @private */
  _buildProjects() {
    if (!this.config.projects || !this.config.projects.length) return;

    const section = this._createSection('fc-projects', 'Projects');

    const grid = document.createElement('div');
    grid.className = 'fc-portfolio__projects-grid';

    this.components.projectCards = [];

    this.config.projects.forEach((projectOpts, index) => {
      try {
        const card = new ProjectCard(projectOpts);
        const el = card.render();
        grid.appendChild(el);
        this.components.projectCards.push(card);
        // Trigger reveal animation with stagger
        setTimeout(() => card.reveal(), 100 * index);
      } catch (err) {
        // If ProjectCard import failed, build a plain card
        const article = document.createElement('article');
        article.className = 'fc-project-card';
        article.innerHTML = `
          <div class="fc-project-card__content">
            <h3 class="fc-project-card__title">${projectOpts.title || ''}</h3>
            <p class="fc-project-card__description">${projectOpts.description || ''}</p>
          </div>
        `;
        grid.appendChild(article);
      }
    });

    section.appendChild(grid);
    this.root.appendChild(section);
  }

  /** @private */
  _buildSkills() {
    if (!this.config.skills || !this.config.skills.length) return;

    const section = this._createSection('fc-skills', 'Skills');

    const wrapper = document.createElement('div');
    wrapper.className = 'fc-portfolio__skills-wrapper';

    this.components.skillGroups = [];

    this.config.skills.forEach(groupOpts => {
      try {
        const group = new SkillGroup(groupOpts);
        const el = group.render();
        wrapper.appendChild(el);
        this.components.skillGroups.push(group);
      } catch (err) {
        // Plain fallback
        const div = document.createElement('div');
        div.className = 'fc-skill-group';
        div.innerHTML = `<h3 class="fc-skill-group__title">${groupOpts.title || ''}</h3>`;
        wrapper.appendChild(div);
      }
    });

    section.appendChild(wrapper);
    this.root.appendChild(section);
  }

  /** @private */
  _buildExperience() {
    if (!this.config.experience || !this.config.experience.length) return;

    const section = this._createSection('fc-experience', 'Experience');

    try {
      const timeline = new Timeline({
        layout: 'left',
        entries: this.config.experience
      });
      const el = timeline.render();
      section.appendChild(el);
      this.components.timeline = timeline;
    } catch (err) {
      // Plain fallback
      const list = document.createElement('div');
      list.className = 'fc-portfolio__experience-list';
      this.config.experience.forEach(entry => {
        const item = document.createElement('div');
        item.className = 'fc-portfolio__experience-item';
        item.innerHTML = `
          <h3>${entry.title || ''}</h3>
          <p>${entry.subtitle || ''}</p>
          <time>${entry.date || ''}</time>
        `;
        list.appendChild(item);
      });
      section.appendChild(list);
    }

    this.root.appendChild(section);
  }

  /** @private */
  _buildContact() {
    if (!this.config.contact) return;

    const section = this._createSection('fc-contact', 'Contact');

    try {
      const form = new ContactForm(this.config.contact);
      const el = form.render();
      section.appendChild(el);
      this.components.contact = form;
    } catch (err) {
      section.innerHTML += '<p>Contact form could not be loaded.</p>';
    }

    this.root.appendChild(section);
  }

  /** @private */
  _buildFooter() {
    const footerConfig = this.config.footer;
    if (!footerConfig) return;

    try {
      const footer = new Footer({
        ...footerConfig,
        name: footerConfig.name || this.config.name
      });
      const el = footer.render();
      this.root.appendChild(el);
      this.components.footer = footer;
    } catch (err) {
      // Fallback footer
      const footerEl = document.createElement('footer');
      footerEl.className = 'fc-portfolio__footer';
      footerEl.setAttribute('role', 'contentinfo');
      footerEl.innerHTML = `
        <p class="fc-portfolio__footer-tagline">${footerConfig.tagline || ''}</p>
      `;
      this.root.appendChild(footerEl);
    }
  }

  /** @private */
  _buildBackToTop() {
    try {
      const btn = new BackToTop();
      const el = btn.render();
      this.root.appendChild(el);
      this.components.backToTop = btn;
    } catch (err) {
      // Fallback back-to-top button
      const btn = document.createElement('button');
      btn.className = 'fc-portfolio__back-to-top';
      btn.setAttribute('aria-label', 'Back to top');
      btn.textContent = '\u2191';
      btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
      this.root.appendChild(btn);
    }
  }

  // ---------------------------------------------------------------------------
  // Private helpers — DOM utilities
  // ---------------------------------------------------------------------------

  /**
   * Create a semantic section element with optional heading.
   * @private
   * @param {string} id - Section id attribute
   * @param {string|null} heading - Section heading text (null to skip)
   * @returns {HTMLElement}
   */
  _createSection(id, heading) {
    const section = document.createElement('section');
    section.id = id;
    section.className = 'fc-portfolio__section';

    if (heading) {
      const h2 = document.createElement('h2');
      h2.className = 'fc-portfolio__section-heading';
      h2.textContent = heading;
      section.appendChild(h2);
    }

    return section;
  }

  /**
   * Wire up smooth scrolling for all anchor links that target ids inside
   * the portfolio root.
   * @private
   */
  _setupSmoothScrolling() {
    if (!this.root) return;

    this.root.addEventListener('click', (e) => {
      const anchor = e.target.closest('a[href^="#"]');
      if (!anchor) return;

      const targetId = anchor.getAttribute('href').slice(1);
      if (!targetId) return;

      const targetEl = this.root.querySelector(`#${targetId}`) ||
                       document.getElementById(targetId);
      if (!targetEl) return;

      e.preventDefault();
      targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });

      // Update URL without triggering scroll
      if (history.pushState) {
        history.pushState(null, '', `#${targetId}`);
      }

      this.emit('navigate', { section: targetId });
    });
  }

  // ---------------------------------------------------------------------------
  // Private helpers — styles
  // ---------------------------------------------------------------------------

  /**
   * Inject base portfolio layout styles (once).
   * @private
   */
  _injectStyles() {
    const styleId = 'fc-portfolio-builder-styles';
    if (document.getElementById(styleId)) return;

    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      .fc-portfolio {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
                     Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue',
                     sans-serif;
        color: var(--fc-text, #2c3e50);
        background: var(--fc-background, #ffffff);
        min-height: 100vh;
        line-height: 1.6;
      }

      /* ---------- Navbar fallback ---------- */
      .fc-portfolio__navbar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 1rem 2rem;
        background: var(--fc-surface, #f8f9fa);
        border-bottom: 1px solid var(--fc-border, #ecf0f1);
        position: sticky;
        top: 0;
        z-index: 100;
      }

      .fc-portfolio__navbar-brand {
        font-weight: 700;
        font-size: 1.25rem;
        text-decoration: none;
        color: var(--fc-primary, #3498db);
      }

      .fc-portfolio__navbar-links {
        display: flex;
        list-style: none;
        margin: 0;
        padding: 0;
        gap: 1.5rem;
      }

      .fc-portfolio__navbar-link {
        text-decoration: none;
        color: var(--fc-text, #2c3e50);
        font-weight: 500;
        transition: color 0.2s ease;
      }

      .fc-portfolio__navbar-link:hover {
        color: var(--fc-primary, #3498db);
      }

      /* ---------- Sections ---------- */
      .fc-portfolio__section {
        max-width: 1200px;
        margin: 0 auto;
        padding: 4rem 2rem;
      }

      .fc-portfolio__section-heading {
        font-size: 2rem;
        font-weight: 700;
        color: var(--fc-text, #2c3e50);
        margin: 0 0 2.5rem;
        text-align: center;
      }

      /* ---------- Hero fallback ---------- */
      .fc-portfolio__hero-inner {
        text-align: center;
        padding: 4rem 0;
      }

      .fc-portfolio__hero-name {
        font-size: 1.125rem;
        color: var(--fc-primary, #3498db);
        font-weight: 600;
        margin: 0 0 0.75rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }

      .fc-portfolio__hero-headline {
        font-size: 3rem;
        font-weight: 800;
        color: var(--fc-text, #2c3e50);
        margin: 0 0 1rem;
        line-height: 1.2;
      }

      .fc-portfolio__hero-subheadline {
        font-size: 1.25rem;
        color: var(--fc-text-muted, #7f8c8d);
        margin: 0 0 2rem;
      }

      .fc-portfolio__cta {
        display: inline-block;
        padding: 0.75rem 2rem;
        background: var(--fc-primary, #3498db);
        color: #ffffff;
        text-decoration: none;
        border-radius: 8px;
        font-weight: 600;
        transition: background 0.2s ease;
      }

      .fc-portfolio__cta:hover {
        background: var(--fc-primary-dark, #2980b9);
      }

      /* ---------- Stats fallback ---------- */
      .fc-portfolio__stats-grid {
        display: flex;
        justify-content: center;
        gap: 3rem;
        flex-wrap: wrap;
      }

      .fc-portfolio__stat {
        text-align: center;
      }

      .fc-portfolio__stat-value {
        display: block;
        font-size: 2.5rem;
        font-weight: 800;
        color: var(--fc-primary, #3498db);
      }

      .fc-portfolio__stat-label {
        font-size: 0.875rem;
        color: var(--fc-text-muted, #7f8c8d);
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }

      /* ---------- Projects grid ---------- */
      .fc-portfolio__projects-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
        gap: 2rem;
      }

      /* ---------- Skills wrapper ---------- */
      .fc-portfolio__skills-wrapper {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 3rem;
        max-width: 800px;
        margin: 0 auto;
      }

      /* ---------- Contact form ---------- */
      #fc-contact .fc-contact-form {
        max-width: 560px;
        margin: 0 auto;
      }

      /* ---------- Footer fallback ---------- */
      .fc-portfolio__footer {
        text-align: center;
        padding: 2rem;
        background: var(--fc-surface, #f8f9fa);
        border-top: 1px solid var(--fc-border, #ecf0f1);
        color: var(--fc-text-muted, #7f8c8d);
      }

      .fc-portfolio__footer-tagline {
        margin: 0;
        font-size: 0.875rem;
      }

      /* ---------- Back to top fallback ---------- */
      .fc-portfolio__back-to-top {
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        width: 3rem;
        height: 3rem;
        border-radius: 50%;
        border: none;
        background: var(--fc-primary, #3498db);
        color: #ffffff;
        font-size: 1.25rem;
        cursor: pointer;
        box-shadow: 0 2px 8px var(--fc-shadow, rgba(0,0,0,0.1));
        transition: background 0.2s ease, transform 0.2s ease;
        z-index: 50;
      }

      .fc-portfolio__back-to-top:hover {
        background: var(--fc-primary-dark, #2980b9);
        transform: translateY(-2px);
      }

      /* ---------- Responsive ---------- */
      @media (max-width: 768px) {
        .fc-portfolio__section {
          padding: 3rem 1.25rem;
        }

        .fc-portfolio__hero-headline {
          font-size: 2rem;
        }

        .fc-portfolio__projects-grid {
          grid-template-columns: 1fr;
        }

        .fc-portfolio__skills-wrapper {
          grid-template-columns: 1fr;
        }

        .fc-portfolio__navbar {
          flex-direction: column;
          gap: 0.75rem;
        }

        .fc-portfolio__navbar-links {
          gap: 1rem;
          flex-wrap: wrap;
          justify-content: center;
        }
      }
    `;

    document.head.appendChild(style);
  }
}

export default PortfolioBuilder;
