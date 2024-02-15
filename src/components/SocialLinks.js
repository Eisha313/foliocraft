import { Component } from '../core/Component.js';

/**
 * SVG icon paths for social platforms (16x16 viewBox, single-path)
 * @private
 */
const SOCIAL_ICON_PATHS = {
  github: 'M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0016 8c0-4.42-3.58-8-8-8z',
  linkedin: 'M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016l.016-.025V6.169H6.29c.032.682 0 7.225 0 7.225h2.36z',
  twitter: 'M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75zm-.86 13.028h1.36L4.323 2.145H2.865l8.875 11.633z',
  email: 'M0 4a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2H2a2 2 0 01-2-2V4zm2-1a1 1 0 00-1 1v.217l7 4.2 7-4.2V4a1 1 0 00-1-1H2zm13 2.383l-4.758 2.855L15 11.114V5.383zm-.034 6.878L11.07 8.79 8 10.583 4.93 8.79l-3.896 3.47A1 1 0 002 13h12a1 1 0 00.966-.739zM1 11.114l4.758-2.876L1 5.383v5.731z',
  dribbble: 'M8 0C3.584 0 0 3.584 0 8s3.584 8 8 8 8-3.584 8-8-3.584-8-8-8zm5.284 3.688a6.802 6.802 0 011.545 4.251c-.226-.043-2.482-.503-4.755-.217-.052-.112-.096-.234-.148-.355-.139-.33-.295-.66-.451-.99 2.516-1.023 3.662-2.498 3.81-2.69zM8 1.18a6.81 6.81 0 014.284 1.529c-.123.163-1.147 1.554-3.572 2.464-1.118-2.052-2.36-3.74-2.551-3.993A6.862 6.862 0 018 1.18zM4.834 1.87c.182.243 1.4 1.94 2.532 3.95-3.194.854-6.013.838-6.32.832A6.831 6.831 0 014.834 1.87zM1.172 8.01v-.21c.299.005 3.61.054 7.02-.97.196.381.381.772.555 1.162l-.27.078c-3.559 1.152-5.452 4.292-5.612 4.562A6.793 6.793 0 011.172 8.01zm2.703 5.108c.103-.17 1.49-2.89 4.784-4.217.152-.052.304-.095.456-.13a28.677 28.677 0 011.264 4.49 6.812 6.812 0 01-6.504-.143zm7.695-.626a27.38 27.38 0 00-1.156-4.206c2.131-.34 4.003.217 4.238.287a6.82 6.82 0 01-3.082 3.919z',
  codepen: 'M15.988 5.443c-.009-.056-.019-.112-.04-.165-.007-.02-.018-.037-.026-.057a.742.742 0 00-.066-.118c-.012-.017-.027-.033-.04-.049a.715.715 0 00-.087-.095l-.013-.012-7.384-4.922a.395.395 0 00-.439 0L.509 5.047l-.013.012a.714.714 0 00-.087.095c-.013.016-.028.032-.04.05a.74.74 0 00-.066.117c-.008.02-.019.037-.026.057-.021.053-.031.109-.04.165C.231 5.472.228 5.5.228 5.53v4.94c0 .03.003.058.009.087.009.056.019.112.04.165.007.02.018.037.026.057.02.04.041.08.066.118.012.017.027.033.04.049.026.031.055.066.087.095l.013.012 7.384 4.922a.394.394 0 00.439 0l7.384-4.922.013-.012a.716.716 0 00.087-.095c.013-.016.028-.032.04-.05a.74.74 0 00.066-.117c.008-.02.019-.037.026-.057.021-.053.031-.109.04-.165.006-.029.009-.057.009-.087V5.53c0-.03-.003-.058-.009-.087zM8.394 1.262l6.118 4.078L11.5 7.474 8.394 5.473V1.262zM7.606 1.262v4.211L4.5 7.474 1.488 5.34l6.118-4.078zm-6.834 5.2L2.97 8 .772 9.538V6.462zm6.834 9.538L1.488 10.66 4.5 8.526l3.106 2.001v4.473zm.394-5.395L5.806 8 8 6.432 10.194 8 8 9.568zm.394 5.395v-4.473l3.106-2.001 3.012 2.134-6.118 4.34zm6.834-5.2L13.03 8l2.198-1.538v3.076z',
  youtube: 'M8.051 1.999h.089c.822.003 4.987.033 6.11.335a2.01 2.01 0 011.415 1.42c.101.38.172.883.22 1.402l.01.104.022.26.008.104c.065.914.073 1.77.074 1.957v.075c-.001.194-.01 1.108-.082 2.06l-.008.105-.009.104c-.05.572-.124 1.14-.235 1.558a2.007 2.007 0 01-1.415 1.42c-1.16.312-5.569.334-6.18.335h-.142c-.309 0-1.587-.006-2.927-.052l-.17-.006-.087-.004-.171-.007-.171-.007c-1.11-.049-2.167-.128-2.654-.26a2.007 2.007 0 01-1.415-1.419c-.111-.417-.185-.986-.235-1.558L.09 9.82l-.008-.104A31.4 31.4 0 010 7.68v-.123c.002-.215.01-1.084.082-2.025l.008-.104.009-.104c.05-.572.124-1.14.235-1.558a2.007 2.007 0 011.415-1.42C2.822 2.04 6.744 2.007 7.79 2.002L8.05 2zM6.4 5.209v4.818l4.157-2.408L6.4 5.209z',
  website: 'M0 8a8 8 0 1116 0A8 8 0 010 8zm7.5-6.923c-.67.204-1.335.82-1.887 1.855A7.97 7.97 0 005.145 4H7.5V1.077zM4.09 4a9.267 9.267 0 01.64-1.539 6.7 6.7 0 01.597-.933A7.025 7.025 0 002.255 4H4.09zm-.582 3.5c.03-.877.138-1.718.312-2.5H1.674a6.958 6.958 0 00-.656 2.5h2.49zM4.847 5a12.5 12.5 0 00-.338 2.5H7.5V5H4.847zM8.5 5v2.5h2.99a12.495 12.495 0 00-.337-2.5H8.5zM4.51 8.5a12.5 12.5 0 00.337 2.5H7.5V8.5H4.51zm3.99 0V11h2.653c.187-.765.306-1.608.338-2.5H8.5zM5.145 12c.138.386.295.744.468 1.068.552 1.035 1.218 1.65 1.887 1.855V12H5.145zm.182 2.472a6.696 6.696 0 01-.597-.933A9.268 9.268 0 014.09 12H2.255a7.024 7.024 0 003.072 2.472zM3.82 11a13.652 13.652 0 01-.312-2.5h-2.49c.062.89.291 1.733.656 2.5H3.82zm6.853 3.472A7.024 7.024 0 0013.745 12H11.91a9.27 9.27 0 01-.64 1.539 6.688 6.688 0 01-.597.933zM8.5 12v2.923c.67-.204 1.335-.82 1.887-1.855.173-.324.33-.682.468-1.068H8.5zm3.68-1h2.146c.365-.767.594-1.61.656-2.5h-2.49a13.65 13.65 0 01-.312 2.5zm2.146-3.5a6.959 6.959 0 00-.656-2.5H11.82c.174.782.282 1.623.312 2.5h2.49zM11.91 4h1.835a7.024 7.024 0 00-3.072-2.472c.218.284.418.598.597.933.247.463.46.978.64 1.539zM8.5 1.077V4h2.355a7.967 7.967 0 00-.468-1.068C9.835 1.897 9.17 1.282 8.5 1.077z'
};

/**
 * SocialLinks component for displaying social media icon links.
 * Supports multiple platforms, sizes, and visual styles.
 *
 * @class SocialLinks
 * @extends Component
 * @example
 * const socials = new SocialLinks({
 *   container: '#footer-socials',
 *   links: [
 *     { platform: 'github', url: 'https://github.com/user' },
 *     { platform: 'linkedin', url: 'https://linkedin.com/in/user' },
 *     { platform: 'email', url: 'mailto:hello@example.com', label: 'Email me' }
 *   ],
 *   size: 'md',
 *   style: 'filled'
 * });
 * socials.mount();
 */
export class SocialLinks extends Component {
  /**
   * Create a SocialLinks component
   * @param {Object} options - Configuration options
   * @param {Array} [options.links=[]] - Social link objects [{ platform, url, label? }]
   * @param {string} [options.size='md'] - Icon size: 'sm', 'md', or 'lg'
   * @param {string} [options.style='filled'] - Visual style: 'filled', 'outline', or 'ghost'
   */
  constructor(options = {}) {
    super(options);

    this.links = options.links || [];
    this.size = options.size || 'md';
    this.iconStyle = options.style || 'filled';
  }

  /**
   * Create an inline SVG element for a given platform
   * @param {string} platform - Platform identifier
   * @returns {SVGElement}
   * @private
   */
  createIcon(platform) {
    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('viewBox', '0 0 16 16');
    svg.setAttribute('fill', 'currentColor');
    svg.setAttribute('aria-hidden', 'true');

    const iconPath = SOCIAL_ICON_PATHS[platform];
    if (iconPath) {
      const path = document.createElementNS(svgNS, 'path');
      path.setAttribute('d', iconPath);
      svg.appendChild(path);
    }

    return svg;
  }

  /**
   * Render the component
   * @returns {HTMLElement}
   */
  render() {
    this.element = document.createElement('div');
    this.element.className = `fc-socials fc-socials--${this.size} fc-socials--${this.iconStyle}`;
    this.element.setAttribute('role', 'navigation');
    this.element.setAttribute('aria-label', 'Social media links');

    this.links.forEach(link => {
      const anchor = document.createElement('a');
      anchor.className = 'fc-socials__link';
      anchor.href = link.url || '#';
      anchor.setAttribute('aria-label', link.label || link.platform);

      // External links open in new tab; mailto does not
      if (link.platform !== 'email') {
        anchor.target = '_blank';
        anchor.rel = 'noopener noreferrer';
      }

      const icon = this.createIcon(link.platform);
      anchor.appendChild(icon);

      this.element.appendChild(anchor);
    });

    this.injectStyles();
    this.emit('render', { element: this.element });

    return this.element;
  }

  /**
   * Inject component styles into the document head
   * @private
   */
  injectStyles() {
    const styleId = 'fc-socials-styles';
    if (document.getElementById(styleId)) return;

    const styles = document.createElement('style');
    styles.id = styleId;
    styles.textContent = `
      .fc-socials {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        align-items: center;
      }

      .fc-socials__link {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        text-decoration: none;
        transition: background 0.2s ease, color 0.2s ease, transform 0.2s ease, border-color 0.2s ease;
        cursor: pointer;
      }

      .fc-socials__link:hover {
        transform: translateY(-2px);
      }

      /* Sizes */
      .fc-socials--sm .fc-socials__link {
        width: 32px;
        height: 32px;
      }

      .fc-socials--sm .fc-socials__link svg {
        width: 14px;
        height: 14px;
      }

      .fc-socials--md .fc-socials__link {
        width: 40px;
        height: 40px;
      }

      .fc-socials--md .fc-socials__link svg {
        width: 18px;
        height: 18px;
      }

      .fc-socials--lg .fc-socials__link {
        width: 48px;
        height: 48px;
      }

      .fc-socials--lg .fc-socials__link svg {
        width: 22px;
        height: 22px;
      }

      /* Filled style */
      .fc-socials--filled .fc-socials__link {
        background: var(--fc-secondary-bg, #f3f4f6);
        color: var(--fc-text-secondary, #6b7280);
      }

      .fc-socials--filled .fc-socials__link:hover {
        background: var(--fc-primary, #3b82f6);
        color: #fff;
      }

      /* Outline style */
      .fc-socials--outline .fc-socials__link {
        background: transparent;
        color: var(--fc-text-secondary, #6b7280);
        border: 1.5px solid var(--fc-border-color, #d1d5db);
      }

      .fc-socials--outline .fc-socials__link:hover {
        border-color: var(--fc-primary, #3b82f6);
        color: var(--fc-primary, #3b82f6);
      }

      /* Ghost style */
      .fc-socials--ghost .fc-socials__link {
        background: transparent;
        color: var(--fc-text-secondary, #6b7280);
      }

      .fc-socials--ghost .fc-socials__link:hover {
        color: var(--fc-primary, #3b82f6);
        background: var(--fc-secondary-bg, #f3f4f6);
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

export default SocialLinks;
