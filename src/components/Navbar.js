import { Component } from '../core/Component.js';

/**
 * Navbar component — responsive sticky navigation bar for portfolio sites.
 * Supports brand text, navigation links, theme toggle slot, and hamburger menu.
 *
 * @class Navbar
 * @extends Component
 * @example
 * const navbar = new Navbar({
 *   brand: 'My Portfolio',
 *   links: [
 *     { text: 'About', href: '#about' },
 *     { text: 'Projects', href: '#projects' },
 *     { text: 'Contact', href: '#contact' }
 *   ],
 *   themeToggle: true,
 *   sticky: true,
 *   transparent: false
 * });
 */
export class Navbar extends Component {
  /**
   * Create a Navbar component
   * @param {Object} options - Configuration options
   * @param {string} options.brand - Brand/logo text
   * @param {Array<{text: string, href: string}>} options.links - Navigation links
   * @param {boolean} [options.themeToggle=true] - Show theme toggle slot
   * @param {boolean} [options.sticky=true] - Use sticky positioning
   * @param {boolean} [options.transparent=false] - Transparent background until scroll
   */
  constructor(options = {}) {
    super(options);

    this.config = {
      brand: options.brand || 'Portfolio',
      links: options.links || [],
      themeToggle: options.themeToggle !== false,
      sticky: options.sticky !== false,
      transparent: options.transparent || false,
      ...options
    };

    this.isMenuOpen = false;
    this.isScrolled = false;

    /** @private Bound handlers for cleanup */
    this._onScroll = this._handleScroll.bind(this);
    this._onHamburgerClick = this._toggleMenu.bind(this);
  }

  /**
   * Render the navbar DOM element
   * @returns {HTMLElement}
   */
  render() {
    const { brand, links, themeToggle, sticky, transparent } = this.config;

    // Build class list
    const classes = ['fc-navbar'];
    if (sticky) classes.push('fc-navbar--sticky');
    if (transparent) classes.push('fc-navbar--transparent');

    this.element = document.createElement('nav');
    this.element.className = classes.join(' ');
    this.element.setAttribute('role', 'navigation');
    this.element.setAttribute('aria-label', 'Main navigation');

    // Container
    const container = document.createElement('div');
    container.className = 'fc-navbar__container';

    // Brand
    const brandEl = document.createElement('a');
    brandEl.className = 'fc-navbar__brand';
    brandEl.href = '#';
    brandEl.textContent = brand;
    container.appendChild(brandEl);

    // Links
    const ul = document.createElement('ul');
    ul.className = 'fc-navbar__links';

    links.forEach(link => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = link.href || '#';
      a.textContent = link.text || '';
      a.className = 'fc-navbar__link';
      li.appendChild(a);
      ul.appendChild(li);
    });

    container.appendChild(ul);

    // Actions wrapper (theme slot + hamburger)
    const actions = document.createElement('div');
    actions.className = 'fc-navbar__actions';

    // Theme toggle slot
    if (themeToggle) {
      const themeSlot = document.createElement('div');
      themeSlot.className = 'fc-navbar__theme-slot';
      actions.appendChild(themeSlot);
    }

    // Hamburger button
    const hamburger = document.createElement('button');
    hamburger.className = 'fc-navbar__hamburger';
    hamburger.setAttribute('aria-label', 'Toggle menu');
    hamburger.setAttribute('aria-expanded', 'false');

    for (let i = 0; i < 3; i++) {
      hamburger.appendChild(document.createElement('span'));
    }

    actions.appendChild(hamburger);
    container.appendChild(actions);

    this.element.appendChild(container);

    this.bindEvents();
    this.injectStyles();

    return this.element;
  }

  /**
   * Bind DOM event listeners
   * @protected
   */
  bindEvents() {
    // Scroll listener for scrolled state
    window.addEventListener('scroll', this._onScroll, { passive: true });

    // Hamburger toggle
    const hamburger = this.element.querySelector('.fc-navbar__hamburger');
    if (hamburger) {
      hamburger.addEventListener('click', this._onHamburgerClick);
    }

    // Close mobile menu when a link is clicked
    const linkEls = this.element.querySelectorAll('.fc-navbar__link');
    linkEls.forEach(link => {
      link.addEventListener('click', () => {
        if (this.isMenuOpen) {
          this._toggleMenu();
        }
      });
    });
  }

  /**
   * Unbind DOM event listeners
   * @protected
   */
  unbindEvents() {
    window.removeEventListener('scroll', this._onScroll);

    const hamburger = this.element.querySelector('.fc-navbar__hamburger');
    if (hamburger) {
      hamburger.removeEventListener('click', this._onHamburgerClick);
    }
  }

  /**
   * Handle scroll — toggle scrolled class at 50px threshold
   * @private
   */
  _handleScroll() {
    const scrolled = window.scrollY > 50;
    if (scrolled !== this.isScrolled) {
      this.isScrolled = scrolled;
      this.element.classList.toggle('fc-navbar--scrolled', scrolled);
      this.emit('scroll', { scrolled });
    }
  }

  /**
   * Toggle mobile menu open/closed
   * @private
   */
  _toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    this.element.classList.toggle('fc-navbar--open', this.isMenuOpen);

    const hamburger = this.element.querySelector('.fc-navbar__hamburger');
    if (hamburger) {
      hamburger.setAttribute('aria-expanded', String(this.isMenuOpen));
    }

    this.emit('menuToggle', { open: this.isMenuOpen });
  }

  /**
   * Get the theme slot element so users can mount a ThemeToggle there
   * @returns {HTMLElement|null}
   */
  getThemeSlot() {
    if (!this.element) return null;
    return this.element.querySelector('.fc-navbar__theme-slot');
  }

  /**
   * Set the active navigation link by section identifier.
   * Adds `fc-navbar__link--active` to the matching link and removes it from others.
   * @param {string} section - The href value (e.g. '#about') to mark as active
   */
  set activeSection(section) {
    if (!this.element) return;

    const linkEls = this.element.querySelectorAll('.fc-navbar__link');
    linkEls.forEach(link => {
      if (link.getAttribute('href') === section) {
        link.classList.add('fc-navbar__link--active');
      } else {
        link.classList.remove('fc-navbar__link--active');
      }
    });

    this._activeSection = section;
    this.emit('activeSectionChange', { section });
  }

  get activeSection() {
    return this._activeSection || null;
  }

  /**
   * Inject component styles into the document head (once)
   * @private
   */
  injectStyles() {
    const styleId = 'fc-navbar-styles';
    if (document.getElementById(styleId)) return;

    const styles = document.createElement('style');
    styles.id = styleId;
    styles.textContent = `
      .fc-navbar {
        width: 100%;
        z-index: 1000;
        transition: background-color 0.3s ease, box-shadow 0.3s ease;
        background: var(--fc-navbar-bg, #ffffff);
      }

      .fc-navbar--sticky {
        position: sticky;
        top: 0;
      }

      .fc-navbar--transparent {
        background: transparent;
      }

      .fc-navbar--transparent.fc-navbar--scrolled {
        background: var(--fc-navbar-bg, #ffffff);
      }

      .fc-navbar--scrolled {
        box-shadow: var(--fc-navbar-shadow, 0 2px 8px rgba(0, 0, 0, 0.1));
      }

      .fc-navbar__container {
        display: flex;
        align-items: center;
        justify-content: space-between;
        max-width: var(--fc-container-width, 1200px);
        margin: 0 auto;
        padding: 0.75rem 1.5rem;
      }

      .fc-navbar__brand {
        font-size: 1.25rem;
        font-weight: 700;
        color: var(--fc-text-primary, #1f2937);
        text-decoration: none;
        white-space: nowrap;
      }

      .fc-navbar__links {
        display: flex;
        list-style: none;
        margin: 0;
        padding: 0;
        gap: 1.5rem;
      }

      .fc-navbar__link {
        color: var(--fc-text-secondary, #6b7280);
        text-decoration: none;
        font-size: 0.9375rem;
        font-weight: 500;
        transition: color 0.2s ease;
      }

      .fc-navbar__link:hover {
        color: var(--fc-primary, #3b82f6);
      }

      .fc-navbar__link--active {
        color: var(--fc-primary, #3b82f6);
      }

      .fc-navbar__actions {
        display: flex;
        align-items: center;
        gap: 0.75rem;
      }

      .fc-navbar__hamburger {
        display: none;
        flex-direction: column;
        justify-content: center;
        gap: 4px;
        width: 32px;
        height: 32px;
        padding: 4px;
        background: none;
        border: none;
        cursor: pointer;
      }

      .fc-navbar__hamburger span {
        display: block;
        width: 100%;
        height: 2px;
        background: var(--fc-text-primary, #1f2937);
        border-radius: 2px;
        transition: transform 0.3s ease, opacity 0.3s ease;
      }

      .fc-navbar--open .fc-navbar__hamburger span:nth-child(1) {
        transform: translateY(6px) rotate(45deg);
      }

      .fc-navbar--open .fc-navbar__hamburger span:nth-child(2) {
        opacity: 0;
      }

      .fc-navbar--open .fc-navbar__hamburger span:nth-child(3) {
        transform: translateY(-6px) rotate(-45deg);
      }

      @media (max-width: 768px) {
        .fc-navbar__links {
          display: none;
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          flex-direction: column;
          background: var(--fc-navbar-bg, #ffffff);
          padding: 1rem 1.5rem;
          box-shadow: var(--fc-navbar-shadow, 0 4px 12px rgba(0, 0, 0, 0.1));
        }

        .fc-navbar--open .fc-navbar__links {
          display: flex;
        }

        .fc-navbar__hamburger {
          display: flex;
        }
      }
    `;

    document.head.appendChild(styles);
  }

  /**
   * Destroy the component and clean up all listeners
   */
  destroy() {
    this.unbindEvents();
    if (this.element) {
      this.element.remove();
    }
    this.removeAllListeners();
  }
}

export default Navbar;
