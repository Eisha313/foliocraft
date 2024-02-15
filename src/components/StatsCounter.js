import { Component } from '../core/Component.js';
import ScrollAnimator from '../core/ScrollAnimator.js';

/**
 * StatsCounter component for displaying animated counting statistics.
 * Numbers animate from 0 to their target value with easeOutCubic easing
 * when the element scrolls into view.
 *
 * @class StatsCounter
 * @extends Component
 * @example
 * const stats = new StatsCounter({
 *   container: '#stats-section',
 *   stats: [
 *     { value: 50, label: 'Projects', suffix: '+' },
 *     { value: 5, label: 'Years Experience' },
 *     { value: 12, label: 'Awards', prefix: '#' },
 *     { value: 99, label: 'Satisfaction', suffix: '%' }
 *   ],
 *   duration: 2000,
 *   layout: 'row'
 * });
 * stats.mount();
 */
export class StatsCounter extends Component {
  /**
   * Create a StatsCounter component
   * @param {Object} options - Configuration options
   * @param {Array} [options.stats=[]] - Array of stat objects { value, label, prefix?, suffix? }
   * @param {boolean} [options.animated=true] - Animate counters on scroll
   * @param {number} [options.duration=2000] - Animation duration in milliseconds
   * @param {string} [options.layout='row'] - Layout: 'row' or 'grid'
   * @param {number} [options.columns=4] - Number of grid columns
   */
  constructor(options = {}) {
    super(options);

    this.stats = options.stats || [];
    this.animated = options.animated !== false;
    this.duration = options.duration || 2000;
    this.layout = options.layout || 'row';
    this.columns = options.columns || 4;

    this.hasAnimated = false;
    this.scrollAnimator = null;
    this.valueElements = [];
    this.cancelFns = [];
  }

  /**
   * EaseOutCubic easing function
   * @param {number} t - Progress (0-1)
   * @returns {number} Eased progress
   * @private
   */
  easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  /**
   * Render the component
   * @returns {HTMLElement}
   */
  render() {
    this.element = document.createElement('div');
    this.element.className = `fc-stats fc-stats--${this.layout}`;

    if (this.layout === 'grid') {
      this.element.style.setProperty('--fc-stats-columns', this.columns);
    }

    this.valueElements = [];

    this.stats.forEach((stat, index) => {
      const item = document.createElement('div');
      item.className = 'fc-stats__item';

      const valueEl = document.createElement('div');
      valueEl.className = 'fc-stats__value';
      valueEl.setAttribute('data-index', index);

      const prefix = stat.prefix || '';
      const suffix = stat.suffix || '';

      if (this.animated) {
        valueEl.textContent = `${prefix}0${suffix}`;
      } else {
        valueEl.textContent = `${prefix}${stat.value}${suffix}`;
      }

      const labelEl = document.createElement('div');
      labelEl.className = 'fc-stats__label';
      labelEl.textContent = stat.label || '';

      item.appendChild(valueEl);
      item.appendChild(labelEl);
      this.element.appendChild(item);

      this.valueElements.push(valueEl);
    });

    if (this.animated) {
      this.setupScrollAnimation();
    }

    this.injectStyles();
    this.emit('render', { element: this.element });

    return this.element;
  }

  /**
   * Setup scroll-triggered animation using ScrollAnimator
   * @private
   */
  setupScrollAnimation() {
    this.scrollAnimator = new ScrollAnimator({
      threshold: 0.3,
      once: true
    });

    this.scrollAnimator.observe(this.element, () => {
      this.animateAllCounters();
    });
  }

  /**
   * Trigger animation for all stat counters
   * @private
   */
  animateAllCounters() {
    if (this.hasAnimated) return;
    this.hasAnimated = true;

    this.stats.forEach((stat, index) => {
      const valueEl = this.valueElements[index];
      if (valueEl) {
        this.animateCounter(valueEl, stat);
      }
    });

    this.emit('animationStart');
  }

  /**
   * Animate a single counter from 0 to its target value
   * @param {HTMLElement} element - The value element to update
   * @param {Object} stat - Stat object { value, prefix?, suffix? }
   * @private
   */
  animateCounter(element, stat) {
    const startTime = performance.now();
    const target = stat.value;
    const prefix = stat.prefix || '';
    const suffix = stat.suffix || '';
    let rafId = null;

    const tick = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / this.duration, 1);
      const easedProgress = this.easeOutCubic(progress);
      const currentValue = Math.round(target * easedProgress);

      element.textContent = `${prefix}${currentValue}${suffix}`;

      if (progress < 1) {
        rafId = requestAnimationFrame(tick);
      } else {
        // Ensure final value is exact
        element.textContent = `${prefix}${target}${suffix}`;
        this.emit('counterComplete', { stat, element });
      }
    };

    rafId = requestAnimationFrame(tick);

    // Store cancel function for cleanup
    this.cancelFns.push(() => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    });
  }

  /**
   * Inject component styles into the document head
   * @private
   */
  injectStyles() {
    const styleId = 'fc-stats-styles';
    if (document.getElementById(styleId)) return;

    const styles = document.createElement('style');
    styles.id = styleId;
    styles.textContent = `
      .fc-stats {
        padding: var(--fc-stats-padding, 3rem 2rem);
      }

      .fc-stats--row {
        display: flex;
        justify-content: center;
        gap: var(--fc-stats-gap, 3rem);
        flex-wrap: wrap;
      }

      .fc-stats--grid {
        display: grid;
        grid-template-columns: repeat(var(--fc-stats-columns, 4), 1fr);
        gap: var(--fc-stats-gap, 2rem);
      }

      .fc-stats__item {
        text-align: center;
        padding: var(--fc-stats-item-padding, 1.5rem 1rem);
      }

      .fc-stats__value {
        font-size: var(--fc-stats-value-size, 2.5rem);
        font-weight: 700;
        color: var(--fc-primary, #3b82f6);
        line-height: 1.2;
        margin-bottom: 0.5rem;
      }

      .fc-stats__label {
        font-size: var(--fc-stats-label-size, 0.95rem);
        color: var(--fc-text-secondary, #6b7280);
        font-weight: 500;
      }

      @media (max-width: 768px) {
        .fc-stats--row {
          gap: 2rem;
        }

        .fc-stats--grid {
          grid-template-columns: repeat(2, 1fr);
        }

        .fc-stats__value {
          font-size: 2rem;
        }
      }

      @media (max-width: 480px) {
        .fc-stats--grid {
          grid-template-columns: 1fr;
        }
      }
    `;

    document.head.appendChild(styles);
  }

  /**
   * Destroy the component and clean up resources
   */
  destroy() {
    // Cancel any running animations
    this.cancelFns.forEach(cancel => cancel());
    this.cancelFns = [];

    if (this.scrollAnimator) {
      this.scrollAnimator.destroy();
      this.scrollAnimator = null;
    }

    if (this.element) {
      this.element.remove();
    }

    this.valueElements = [];
    this.removeAllListeners();
  }
}

export default StatsCounter;
