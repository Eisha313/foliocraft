/**
 * FolioCraft - Lightweight portfolio component library
 * @module FolioCraft
 */

import { ProjectCard } from './components/ProjectCard.js';
import { SkillBar } from './components/SkillBar.js';
import { Timeline } from './components/Timeline.js';
import { ContactForm } from './components/ContactForm.js';
import { ThemeManager } from './core/ThemeManager.js';
import { ResponsiveHandler } from './core/ResponsiveHandler.js';
import { ScrollAnimator } from './core/ScrollAnimator.js';

/**
 * Default configuration options
 */
const DEFAULT_OPTIONS = {
  theme: 'light',
  breakpoints: {
    mobile: 480,
    tablet: 768,
    desktop: 1024,
    wide: 1440
  },
  animations: {
    enabled: true,
    threshold: 0.1,
    rootMargin: '0px'
  }
};

/**
 * Main FolioCraft class
 */
class FolioCraft {
  /**
   * Create a FolioCraft instance
   * @param {Object} options - Configuration options
   */
  constructor(options = {}) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
    this.components = new Map();
    
    // Initialize core systems
    this.theme = new ThemeManager(this.options.theme);
    this.responsive = new ResponsiveHandler(this.options.breakpoints);
    this.animator = new ScrollAnimator(this.options.animations);
    
    this._injectBaseStyles();
  }

  /**
   * Inject base CSS custom properties
   * @private
   */
  _injectBaseStyles() {
    if (document.getElementById('foliocraft-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'foliocraft-styles';
    style.textContent = `
      :root {
        --fc-primary: #3b82f6;
        --fc-secondary: #64748b;
        --fc-background: #ffffff;
        --fc-surface: #f8fafc;
        --fc-text: #1e293b;
        --fc-text-muted: #64748b;
        --fc-border: #e2e8f0;
        --fc-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
        --fc-radius: 8px;
        --fc-transition: 0.3s ease;
      }
      
      [data-fc-theme="dark"] {
        --fc-background: #0f172a;
        --fc-surface: #1e293b;
        --fc-text: #f8fafc;
        --fc-text-muted: #94a3b8;
        --fc-border: #334155;
      }
      
      .fc-reveal {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity var(--fc-transition), transform var(--fc-transition);
      }
      
      .fc-reveal.fc-visible {
        opacity: 1;
        transform: translateY(0);
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * Create a project card component
   * @param {Object} config - Project card configuration
   * @returns {ProjectCard} The created component
   */
  createProjectCard(config) {
    const card = new ProjectCard(config, this);
    this.components.set(card.id, card);
    return card;
  }

  /**
   * Create a skill bar component
   * @param {Object} config - Skill bar configuration
   * @returns {SkillBar} The created component
   */
  createSkillBar(config) {
    const bar = new SkillBar(config, this);
    this.components.set(bar.id, bar);
    return bar;
  }

  /**
   * Create a timeline entry component
   * @param {Object} config - Timeline configuration
   * @returns {Timeline} The created component
   */
  createTimelineEntry(config) {
    const entry = new Timeline(config, this);
    this.components.set(entry.id, entry);
    return entry;
  }

  /**
   * Create a contact form component
   * @param {Object} config - Form configuration
   * @returns {ContactForm} The created component
   */
  createContactForm(config) {
    const form = new ContactForm(config, this);
    this.components.set(form.id, form);
    return form;
  }

  /**
   * Set the current theme
   * @param {string} themeName - Theme name ('light' or 'dark')
   */
  setTheme(themeName) {
    this.theme.setTheme(themeName);
  }

  /**
   * Get current breakpoint
   * @returns {string} Current breakpoint name
   */
  getCurrentBreakpoint() {
    return this.responsive.getCurrentBreakpoint();
  }

  /**
   * Destroy all components and cleanup
   */
  destroy() {
    this.components.forEach(component => component.destroy());
    this.components.clear();
    this.animator.disconnect();
    this.responsive.disconnect();
  }
}

export default FolioCraft;
export { ProjectCard, SkillBar, Timeline, ContactForm };