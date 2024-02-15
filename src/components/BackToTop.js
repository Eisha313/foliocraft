import { Component } from '../core/Component.js';

/**
 * BackToTop component for scrolling back to the top of the page.
 * Displays a floating button that appears after scrolling past a threshold.
 *
 * @class BackToTop
 * @extends Component
 * @example
 * const backToTop = new BackToTop({
 *   container: 'body',
 *   threshold: 400,
 *   smooth: true
 * });
 * backToTop.mount();
 */
export class BackToTop extends Component {
  /**
   * Create a BackToTop component
   * @param {Object} options - Configuration options
   * @param {number} [options.threshold=400] - Scroll position in pixels to show the button
   * @param {boolean} [options.smooth=true] - Use smooth scrolling behavior
   */
  constructor(options = {}) {
    super(options);

    this.threshold = options.threshold || 400;
    this.smooth = options.smooth !== false;

    this._handleScroll = this._handleScroll.bind(this);
    this._handleClick = this._handleClick.bind(this);
    this._scrollBound = false;
  }

  /**
   * Render the component
   * @returns {HTMLElement}
   */
  render() {
    this.element = document.createElement('button');
    this.element.className = 'fc-back-to-top';
    this.element.setAttribute('aria-label', 'Back to top');
    this.element.setAttribute('type', 'button');

    // Up-arrow SVG icon
    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('viewBox', '0 0 16 16');
    svg.setAttribute('width', '20');
    svg.setAttribute('height', '20');
    svg.setAttribute('fill', 'currentColor');
    svg.setAttribute('aria-hidden', 'true');

    const path = document.createElementNS(svgNS, 'path');
    path.setAttribute('fill-rule', 'evenodd');
    path.setAttribute('d', 'M8 15a.5.5 0 00.5-.5V2.707l3.146 3.147a.5.5 0 00.708-.708l-4-4a.5.5 0 00-.708 0l-4 4a.5.5 0 10.708.708L7.5 2.707V14.5a.5.5 0 00.5.5z');
    svg.appendChild(path);

    this.element.appendChild(svg);

    // Start hidden
    this.element.style.opacity = '0';
    this.element.style.visibility = 'hidden';

    this.bindEvents();
    this.injectStyles();
    this.emit('render', { element: this.element });

    // Check initial scroll position
    this._handleScroll();

    return this.element;
  }

  /**
   * Bind scroll and click event listeners
   * @protected
   */
  bindEvents() {
    this.element.addEventListener('click', this._handleClick);

    if (!this._scrollBound) {
      window.addEventListener('scroll', this._handleScroll, { passive: true });
      this._scrollBound = true;
    }
  }

  /**
   * Unbind event listeners
   * @protected
   */
  unbindEvents() {
    if (this.element) {
      this.element.removeEventListener('click', this._handleClick);
    }

    if (this._scrollBound) {
      window.removeEventListener('scroll', this._handleScroll);
      this._scrollBound = false;
    }
  }

  /**
   * Handle window scroll — show/hide button based on threshold
   * @private
   */
  _handleScroll() {
    if (!this.element) return;

    const scrollY = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollY >= this.threshold) {
      this.element.style.opacity = '1';
      this.element.style.visibility = 'visible';
    } else {
      this.element.style.opacity = '0';
      this.element.style.visibility = 'hidden';
    }
  }

  /**
   * Handle button click — scroll to top
   * @private
   */
  _handleClick() {
    window.scrollTo({
      top: 0,
      behavior: this.smooth ? 'smooth' : 'auto'
    });

    this.emit('scrollToTop');
  }

  /**
   * Inject component styles into the document head
   * @private
   */
  injectStyles() {
    const styleId = 'fc-back-to-top-styles';
    if (document.getElementById(styleId)) return;

    const styles = document.createElement('style');
    styles.id = styleId;
    styles.textContent = `
      .fc-back-to-top {
        position: fixed;
        bottom: var(--fc-back-to-top-bottom, 2rem);
        right: var(--fc-back-to-top-right, 2rem);
        z-index: var(--fc-back-to-top-z, 1000);
        display: flex;
        align-items: center;
        justify-content: center;
        width: var(--fc-back-to-top-size, 44px);
        height: var(--fc-back-to-top-size, 44px);
        padding: 0;
        border: none;
        border-radius: 50%;
        background: var(--fc-primary, #3b82f6);
        color: #fff;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        transition: opacity 0.3s ease, visibility 0.3s ease, background 0.2s ease, transform 0.2s ease;
        will-change: opacity, visibility;
      }

      .fc-back-to-top:hover {
        background: var(--fc-primary-hover, #2563eb);
        transform: translateY(-3px);
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
      }

      .fc-back-to-top:focus-visible {
        outline: 2px solid var(--fc-focus-color, #3b82f6);
        outline-offset: 2px;
      }

      .fc-back-to-top:active {
        transform: translateY(-1px);
      }

      .fc-back-to-top svg {
        pointer-events: none;
      }
    `;

    document.head.appendChild(styles);
  }

  /**
   * Destroy the component and clean up the scroll listener
   */
  destroy() {
    this.unbindEvents();

    if (this.element) {
      this.element.remove();
    }

    this.removeAllListeners();
  }
}

export default BackToTop;
