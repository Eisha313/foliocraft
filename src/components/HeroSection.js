import { Component } from '../core/Component.js';

/**
 * SVG icon paths for social platforms (16x16 viewBox)
 * @private
 */
const SOCIAL_ICONS = {
  github: 'M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0016 8c0-4.42-3.58-8-8-8z',
  linkedin: 'M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016l.016-.025V6.169H6.29c.032.682 0 7.225 0 7.225h2.36z',
  twitter: 'M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75zm-.86 13.028h1.36L4.323 2.145H2.865l8.875 11.633z',
  email: 'M0 4a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2H2a2 2 0 01-2-2V4zm2-1a1 1 0 00-1 1v.217l7 4.2 7-4.2V4a1 1 0 00-1-1H2zm13 2.383l-4.758 2.855L15 11.114V5.383zm-.034 6.878L11.07 8.79 8 10.583 4.93 8.79l-3.896 3.47A1 1 0 002 13h12a1 1 0 00.966-.739zM1 11.114l4.758-2.876L1 5.383v5.731z',
  dribbble: 'M8 0C3.584 0 0 3.584 0 8s3.584 8 8 8 8-3.584 8-8-3.584-8-8-8zm5.284 3.688a6.802 6.802 0 011.545 4.251c-.226-.043-2.482-.503-4.755-.217-.052-.112-.096-.234-.148-.355-.139-.33-.295-.66-.451-.99 2.516-1.023 3.662-2.498 3.81-2.69zM8 1.18a6.81 6.81 0 014.284 1.529c-.123.163-1.147 1.554-3.572 2.464-1.118-2.052-2.36-3.74-2.551-3.993A6.862 6.862 0 018 1.18zM4.834 1.87c.182.243 1.4 1.94 2.532 3.95-3.194.854-6.013.838-6.32.832A6.831 6.831 0 014.834 1.87zM1.172 8.01v-.21c.299.005 3.61.054 7.02-.97.196.381.381.772.555 1.162l-.27.078c-3.559 1.152-5.452 4.292-5.612 4.562A6.793 6.793 0 011.172 8.01zm2.703 5.108c.103-.17 1.49-2.89 4.784-4.217.152-.052.304-.095.456-.13a28.677 28.677 0 011.264 4.49 6.812 6.812 0 01-6.504-.143zm7.695-.626a27.38 27.38 0 00-1.156-4.206c2.131-.34 4.003.217 4.238.287a6.82 6.82 0 01-3.082 3.919z'
};

/**
 * HeroSection component for portfolio landing pages.
 * Supports multiple layouts, avatar, CTA buttons, social links, and entrance animations.
 *
 * @class HeroSection
 * @extends Component
 * @example
 * const hero = new HeroSection({
 *   container: '#app',
 *   headline: 'Jane Doe',
 *   subheadline: 'Full-Stack Developer',
 *   description: 'Building elegant solutions to complex problems.',
 *   avatar: '/img/avatar.jpg',
 *   cta: { text: 'View Work', href: '#projects', secondary: { text: 'Contact', href: '#contact' } },
 *   socials: [{ platform: 'github', url: 'https://github.com/janedoe' }],
 *   layout: 'centered',
 *   animated: true
 * });
 * hero.mount();
 */
export class HeroSection extends Component {
  /**
   * Create a HeroSection component
   * @param {Object} options - Configuration options
   * @param {string} [options.headline=''] - Main heading text
   * @param {string} [options.subheadline=''] - Secondary text
   * @param {string} [options.description=''] - Paragraph text
   * @param {string|null} [options.avatar=null] - Image URL for avatar/profile photo
   * @param {Object|null} [options.cta=null] - CTA config { text, href, secondary?: { text, href } }
   * @param {Array} [options.socials=[]] - Social links [{ platform, url }]
   * @param {string} [options.layout='centered'] - Layout: 'centered', 'split', or 'minimal'
   * @param {boolean} [options.animated=true] - Enable staggered entrance animations
   */
  constructor(options = {}) {
    super(options);

    this.headline = options.headline || '';
    this.subheadline = options.subheadline || '';
    this.description = options.description || '';
    this.avatar = options.avatar || null;
    this.cta = options.cta || null;
    this.socials = options.socials || [];
    this.layout = options.layout || 'centered';
    this.animated = options.animated !== false;
  }

  /**
   * Create an inline SVG element for a social platform
   * @param {string} platform - Platform identifier
   * @returns {SVGElement}
   * @private
   */
  createSocialIcon(platform) {
    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('viewBox', '0 0 16 16');
    svg.setAttribute('width', '16');
    svg.setAttribute('height', '16');
    svg.setAttribute('fill', 'currentColor');
    svg.setAttribute('aria-hidden', 'true');

    const path = document.createElementNS(svgNS, 'path');
    path.setAttribute('d', SOCIAL_ICONS[platform] || '');
    svg.appendChild(path);

    return svg;
  }

  /**
   * Render the component
   * @returns {HTMLElement}
   */
  render() {
    this.element = document.createElement('header');
    this.element.className = `fc-hero fc-hero--${this.layout}`;
    this.element.setAttribute('role', 'banner');

    const animatableChildren = [];

    // Inner container for layout control
    const inner = document.createElement('div');
    inner.className = 'fc-hero__inner';

    // Avatar
    if (this.avatar) {
      const avatarWrap = document.createElement('div');
      avatarWrap.className = 'fc-hero__avatar';

      const avatarImg = document.createElement('img');
      avatarImg.className = 'fc-hero__avatar-img';
      avatarImg.src = this.avatar;
      avatarImg.alt = this.headline ? `${this.headline} avatar` : 'Profile avatar';
      avatarWrap.appendChild(avatarImg);

      inner.appendChild(avatarWrap);
      animatableChildren.push(avatarWrap);
    }

    // Content wrapper
    const content = document.createElement('div');
    content.className = 'fc-hero__content';

    // Headline
    if (this.headline) {
      const h1 = document.createElement('h1');
      h1.className = 'fc-hero__headline';
      h1.textContent = this.headline;
      content.appendChild(h1);
      animatableChildren.push(h1);
    }

    // Subheadline
    if (this.subheadline) {
      const sub = document.createElement('p');
      sub.className = 'fc-hero__subheadline';
      sub.textContent = this.subheadline;
      content.appendChild(sub);
      animatableChildren.push(sub);
    }

    // Description
    if (this.description) {
      const desc = document.createElement('p');
      desc.className = 'fc-hero__description';
      desc.textContent = this.description;
      content.appendChild(desc);
      animatableChildren.push(desc);
    }

    // CTA buttons
    if (this.cta) {
      const ctaWrap = document.createElement('div');
      ctaWrap.className = 'fc-hero__cta';

      const primaryBtn = document.createElement('a');
      primaryBtn.className = 'fc-hero__cta-btn fc-hero__cta-btn--primary';
      primaryBtn.href = this.cta.href || '#';
      primaryBtn.textContent = this.cta.text || 'Learn More';
      ctaWrap.appendChild(primaryBtn);

      if (this.cta.secondary) {
        const secondaryBtn = document.createElement('a');
        secondaryBtn.className = 'fc-hero__cta-btn fc-hero__cta-btn--secondary';
        secondaryBtn.href = this.cta.secondary.href || '#';
        secondaryBtn.textContent = this.cta.secondary.text || 'Contact';
        ctaWrap.appendChild(secondaryBtn);
      }

      content.appendChild(ctaWrap);
      animatableChildren.push(ctaWrap);
    }

    // Social links
    if (this.socials.length > 0) {
      const socialsWrap = document.createElement('div');
      socialsWrap.className = 'fc-hero__socials';
      socialsWrap.setAttribute('aria-label', 'Social links');

      this.socials.forEach(social => {
        const link = document.createElement('a');
        link.className = 'fc-hero__social-link';
        link.href = social.url || '#';
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.setAttribute('aria-label', social.platform);

        const icon = this.createSocialIcon(social.platform);
        link.appendChild(icon);

        socialsWrap.appendChild(link);
      });

      content.appendChild(socialsWrap);
      animatableChildren.push(socialsWrap);
    }

    inner.appendChild(content);
    this.element.appendChild(inner);

    // Animation setup
    if (this.animated) {
      animatableChildren.forEach(child => {
        child.style.opacity = '0';
        child.style.transform = 'translateY(20px)';
      });

      requestAnimationFrame(() => {
        animatableChildren.forEach((child, index) => {
          setTimeout(() => {
            child.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            child.style.opacity = '1';
            child.style.transform = 'translateY(0)';
          }, index * 120);
        });
      });
    }

    this.injectStyles();
    this.emit('render', { element: this.element });

    return this.element;
  }

  /**
   * Inject component styles into the document head
   * @private
   */
  injectStyles() {
    const styleId = 'fc-hero-styles';
    if (document.getElementById(styleId)) return;

    const styles = document.createElement('style');
    styles.id = styleId;
    styles.textContent = `
      .fc-hero {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 80vh;
        padding: var(--fc-hero-padding, 4rem 2rem);
        background: var(--fc-hero-bg, transparent);
        color: var(--fc-text-primary, #1f2937);
      }

      .fc-hero__inner {
        width: 100%;
        max-width: var(--fc-hero-max-width, 960px);
        margin: 0 auto;
      }

      /* Centered layout */
      .fc-hero--centered .fc-hero__inner {
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      /* Split layout */
      .fc-hero--split .fc-hero__inner {
        display: flex;
        align-items: center;
        gap: 3rem;
      }

      .fc-hero--split .fc-hero__avatar {
        flex-shrink: 0;
      }

      .fc-hero--split .fc-hero__content {
        flex: 1;
      }

      /* Minimal layout */
      .fc-hero--minimal .fc-hero__inner {
        display: flex;
        flex-direction: column;
      }

      .fc-hero--minimal {
        min-height: auto;
        padding: var(--fc-hero-padding, 3rem 2rem);
      }

      /* Avatar */
      .fc-hero__avatar {
        width: var(--fc-hero-avatar-size, 120px);
        height: var(--fc-hero-avatar-size, 120px);
        border-radius: 50%;
        overflow: hidden;
        margin-bottom: 1.5rem;
        box-shadow: 0 4px 14px rgba(0, 0, 0, 0.1);
      }

      .fc-hero__avatar-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      /* Text */
      .fc-hero__headline {
        margin: 0 0 0.75rem;
        font-size: var(--fc-hero-headline-size, 3rem);
        font-weight: 700;
        line-height: 1.1;
        color: var(--fc-text-primary, #1f2937);
      }

      .fc-hero__subheadline {
        margin: 0 0 1rem;
        font-size: var(--fc-hero-subheadline-size, 1.25rem);
        font-weight: 500;
        color: var(--fc-primary, #3b82f6);
      }

      .fc-hero__description {
        margin: 0 0 1.5rem;
        font-size: var(--fc-hero-description-size, 1.05rem);
        line-height: 1.7;
        color: var(--fc-text-secondary, #6b7280);
        max-width: 600px;
      }

      .fc-hero--centered .fc-hero__description {
        margin-left: auto;
        margin-right: auto;
      }

      /* CTA */
      .fc-hero__cta {
        display: flex;
        gap: 1rem;
        margin-bottom: 1.5rem;
      }

      .fc-hero--centered .fc-hero__cta {
        justify-content: center;
      }

      .fc-hero__cta-btn {
        display: inline-block;
        padding: 0.75rem 1.75rem;
        border-radius: 8px;
        font-size: 1rem;
        font-weight: 600;
        text-decoration: none;
        transition: background 0.2s ease, transform 0.2s ease;
        cursor: pointer;
      }

      .fc-hero__cta-btn:hover {
        transform: translateY(-2px);
      }

      .fc-hero__cta-btn--primary {
        background: var(--fc-primary, #3b82f6);
        color: #fff;
      }

      .fc-hero__cta-btn--primary:hover {
        background: var(--fc-primary-hover, #2563eb);
      }

      .fc-hero__cta-btn--secondary {
        background: var(--fc-secondary-bg, #e5e7eb);
        color: var(--fc-text-primary, #1f2937);
      }

      .fc-hero__cta-btn--secondary:hover {
        background: var(--fc-secondary-bg-hover, #d1d5db);
      }

      /* Social links */
      .fc-hero__socials {
        display: flex;
        gap: 0.75rem;
      }

      .fc-hero--centered .fc-hero__socials {
        justify-content: center;
      }

      .fc-hero__social-link {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: var(--fc-secondary-bg, #f3f4f6);
        color: var(--fc-text-secondary, #6b7280);
        text-decoration: none;
        transition: background 0.2s ease, color 0.2s ease, transform 0.2s ease;
      }

      .fc-hero__social-link:hover {
        background: var(--fc-primary, #3b82f6);
        color: #fff;
        transform: translateY(-2px);
      }

      .fc-hero__social-link svg {
        width: 18px;
        height: 18px;
      }

      @media (max-width: 768px) {
        .fc-hero__headline {
          font-size: 2rem;
        }

        .fc-hero--split .fc-hero__inner {
          flex-direction: column;
          text-align: center;
        }

        .fc-hero--split .fc-hero__cta,
        .fc-hero--split .fc-hero__socials {
          justify-content: center;
        }

        .fc-hero__cta {
          flex-direction: column;
          align-items: stretch;
        }

        .fc-hero__cta-btn {
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

export default HeroSection;
