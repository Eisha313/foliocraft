import { Component } from '../core/Component.js';

/**
 * Social platform SVG icons (16x16 viewBox, single path).
 * @private
 */
const SOCIAL_ICONS = {
  github: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>',
  linkedin: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16" fill="currentColor"><path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.712-2.165 1.198V6.169H6.249c.032.678 0 7.225 0 7.225h2.401z"/></svg>',
  twitter: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16" fill="currentColor"><path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0016 3.542a6.658 6.658 0 01-1.889.518 3.301 3.301 0 001.447-1.817 6.533 6.533 0 01-2.087.793A3.286 3.286 0 007.875 6.03a9.325 9.325 0 01-6.767-3.429 3.289 3.289 0 001.018 4.382A3.323 3.323 0 01.64 6.575v.045a3.288 3.288 0 002.632 3.218 3.203 3.203 0 01-.865.115 3.23 3.23 0 01-.614-.057 3.283 3.283 0 003.067 2.277A6.588 6.588 0 010 13.027a9.286 9.286 0 005.026 1.473"/></svg>',
  email: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16" fill="currentColor"><path d="M0 4a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2H2a2 2 0 01-2-2V4zm2-1a1 1 0 00-1 1v.217l7 4.2 7-4.2V4a1 1 0 00-1-1H2zm13 2.383l-4.708 2.825L15 11.105V5.383zm-.034 6.876L10.93 8.97 8 10.583 5.07 8.97l-4.036 3.29A1 1 0 002 13h12a1 1 0 00.966-.741zM1 11.105l4.708-2.897L1 5.383v5.722z"/></svg>'
};

/**
 * Footer component — portfolio footer with brand, links, socials, and copyright.
 *
 * @class Footer
 * @extends Component
 * @example
 * const footer = new Footer({
 *   brand: 'Jane Doe',
 *   tagline: 'Full-stack developer & designer',
 *   links: [
 *     { text: 'About', href: '#about' },
 *     { text: 'Projects', href: '#projects' }
 *   ],
 *   socials: [
 *     { platform: 'github', url: 'https://github.com/janedoe' },
 *     { platform: 'linkedin', url: 'https://linkedin.com/in/janedoe' }
 *   ],
 *   copyright: null,
 *   badge: true
 * });
 */
export class Footer extends Component {
  /**
   * Create a Footer component
   * @param {Object} options - Configuration options
   * @param {string} options.brand - Brand text
   * @param {string} [options.tagline] - Short description
   * @param {Array<{text: string, href: string}>} [options.links] - Navigation links
   * @param {Array<{platform: string, url: string}>} [options.socials] - Social links
   * @param {string|null} [options.copyright] - Custom copyright text (auto-generated if null)
   * @param {boolean} [options.badge=true] - Show "Built with FolioCraft" badge
   */
  constructor(options = {}) {
    super(options);

    this.config = {
      brand: options.brand || 'Portfolio',
      tagline: options.tagline || '',
      links: options.links || [],
      socials: options.socials || [],
      copyright: options.copyright !== undefined ? options.copyright : null,
      badge: options.badge !== false,
      ...options
    };
  }

  /**
   * Build copyright text. Uses custom text if provided, otherwise auto-generates.
   * @returns {string}
   * @private
   */
  _getCopyrightText() {
    if (this.config.copyright) {
      return this.config.copyright;
    }
    const year = new Date().getFullYear();
    return `\u00A9 ${year} ${this.config.brand}. All rights reserved.`;
  }

  /**
   * Get SVG markup for a social platform icon
   * @param {string} platform - Platform key (github, linkedin, twitter, email)
   * @returns {string} SVG markup or empty string if unknown platform
   * @private
   */
  _getSocialIcon(platform) {
    return SOCIAL_ICONS[platform.toLowerCase()] || '';
  }

  /**
   * Render the footer DOM element
   * @returns {HTMLElement}
   */
  render() {
    const { brand, tagline, links, socials, badge } = this.config;

    this.element = document.createElement('footer');
    this.element.className = 'fc-footer';
    this.element.setAttribute('role', 'contentinfo');

    // Main container
    const container = document.createElement('div');
    container.className = 'fc-footer__container';

    // Brand section
    const brandSection = document.createElement('div');
    brandSection.className = 'fc-footer__brand';

    const brandText = document.createElement('span');
    brandText.className = 'fc-footer__brand-text';
    brandText.textContent = brand;
    brandSection.appendChild(brandText);

    if (tagline) {
      const taglineEl = document.createElement('p');
      taglineEl.className = 'fc-footer__tagline';
      taglineEl.textContent = tagline;
      brandSection.appendChild(taglineEl);
    }

    container.appendChild(brandSection);

    // Navigation links
    if (links.length > 0) {
      const nav = document.createElement('nav');
      nav.className = 'fc-footer__links';
      nav.setAttribute('aria-label', 'Footer navigation');

      links.forEach(link => {
        const a = document.createElement('a');
        a.className = 'fc-footer__link';
        a.href = link.href || '#';
        a.textContent = link.text || '';
        nav.appendChild(a);
      });

      container.appendChild(nav);
    }

    // Social links
    if (socials.length > 0) {
      const socialsDiv = document.createElement('div');
      socialsDiv.className = 'fc-footer__socials';

      socials.forEach(social => {
        const a = document.createElement('a');
        a.className = 'fc-footer__social';
        a.href = social.url || '#';
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.setAttribute('aria-label', social.platform);

        const icon = this._getSocialIcon(social.platform);
        if (icon) {
          a.innerHTML = icon;
        } else {
          a.textContent = social.platform;
        }

        socialsDiv.appendChild(a);
      });

      container.appendChild(socialsDiv);
    }

    this.element.appendChild(container);

    // Bottom bar (copyright + badge)
    const bottom = document.createElement('div');
    bottom.className = 'fc-footer__bottom';

    const copyrightEl = document.createElement('p');
    copyrightEl.className = 'fc-footer__copyright';
    copyrightEl.textContent = this._getCopyrightText();
    bottom.appendChild(copyrightEl);

    if (badge) {
      const badgeEl = document.createElement('a');
      badgeEl.className = 'fc-footer__badge';
      badgeEl.href = 'https://github.com/foliocraft';
      badgeEl.target = '_blank';
      badgeEl.rel = 'noopener noreferrer';
      badgeEl.textContent = 'Built with FolioCraft';
      bottom.appendChild(badgeEl);
    }

    this.element.appendChild(bottom);

    this.injectStyles();

    return this.element;
  }

  /**
   * Inject component styles into the document head (once)
   * @private
   */
  injectStyles() {
    const styleId = 'fc-footer-styles';
    if (document.getElementById(styleId)) return;

    const styles = document.createElement('style');
    styles.id = styleId;
    styles.textContent = `
      .fc-footer {
        background: var(--fc-footer-bg, #111827);
        color: var(--fc-footer-text, #d1d5db);
        padding: 3rem 1.5rem 1.5rem;
      }

      .fc-footer__container {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        align-items: flex-start;
        gap: 2rem;
        max-width: var(--fc-container-width, 1200px);
        margin: 0 auto;
        padding-bottom: 2rem;
        border-bottom: 1px solid var(--fc-footer-border, #1f2937);
      }

      .fc-footer__brand {
        max-width: 280px;
      }

      .fc-footer__brand-text {
        display: block;
        font-size: 1.25rem;
        font-weight: 700;
        color: var(--fc-footer-heading, #ffffff);
        margin-bottom: 0.5rem;
      }

      .fc-footer__tagline {
        margin: 0;
        font-size: 0.875rem;
        line-height: 1.6;
        color: var(--fc-footer-text, #9ca3af);
      }

      .fc-footer__links {
        display: flex;
        flex-wrap: wrap;
        gap: 1.25rem;
      }

      .fc-footer__link {
        color: var(--fc-footer-text, #d1d5db);
        text-decoration: none;
        font-size: 0.875rem;
        transition: color 0.2s ease;
      }

      .fc-footer__link:hover {
        color: var(--fc-primary, #3b82f6);
      }

      .fc-footer__socials {
        display: flex;
        gap: 1rem;
      }

      .fc-footer__social {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background: var(--fc-footer-icon-bg, #1f2937);
        color: var(--fc-footer-text, #d1d5db);
        text-decoration: none;
        transition: background 0.2s ease, color 0.2s ease;
      }

      .fc-footer__social:hover {
        background: var(--fc-primary, #3b82f6);
        color: #ffffff;
      }

      .fc-footer__social svg {
        width: 16px;
        height: 16px;
      }

      .fc-footer__bottom {
        display: flex;
        justify-content: space-between;
        align-items: center;
        max-width: var(--fc-container-width, 1200px);
        margin: 0 auto;
        padding-top: 1.5rem;
      }

      .fc-footer__copyright {
        margin: 0;
        font-size: 0.8125rem;
        color: var(--fc-footer-muted, #6b7280);
      }

      .fc-footer__badge {
        font-size: 0.75rem;
        color: var(--fc-footer-muted, #6b7280);
        text-decoration: none;
        transition: color 0.2s ease;
      }

      .fc-footer__badge:hover {
        color: var(--fc-primary, #3b82f6);
      }

      @media (max-width: 768px) {
        .fc-footer__container {
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .fc-footer__brand {
          max-width: 100%;
        }

        .fc-footer__bottom {
          flex-direction: column;
          gap: 0.75rem;
          text-align: center;
        }
      }
    `;

    document.head.appendChild(styles);
  }

  /**
   * Destroy the component and clean up
   */
  destroy() {
    if (this.element) {
      this.element.remove();
    }
    this.removeAllListeners();
  }
}

export default Footer;
