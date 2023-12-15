/**
 * ScrollAnimator - Handles Intersection Observer-based scroll animations
 * @module ScrollAnimator
 */

/**
 * Generate unique IDs for elements
 * @returns {string} Unique identifier
 */
const generateId = () => `fc-${Math.random().toString(36).substr(2, 9)}`;

/**
 * ScrollAnimator class for reveal animations
 */
export class ScrollAnimator {
  /**
   * Create a ScrollAnimator instance
   * @param {Object} options - Animation options
   */
  constructor(options = {}) {
    this.options = {
      enabled: true,
      threshold: 0.1,
      rootMargin: '0px',
      ...options
    };
    
    this.observer = null;
    this.observedElements = new Set();
    
    if (this.options.enabled) {
      this._initObserver();
    }
  }

  /**
   * Initialize the Intersection Observer
   * @private
   */
  _initObserver() {
    if (typeof IntersectionObserver === 'undefined') {
      console.warn('FolioCraft: IntersectionObserver not supported');
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => this._handleIntersection(entries),
      {
        threshold: this.options.threshold,
        rootMargin: this.options.rootMargin
      }
    );
  }

  /**
   * Handle intersection changes
   * @private
   * @param {IntersectionObserverEntry[]} entries - Observer entries
   */
  _handleIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fc-visible');
        
        // Trigger custom callback if defined
        const callback = entry.target._fcRevealCallback;
        if (typeof callback === 'function') {
          callback(entry.target);
        }
        
        // Optionally unobserve after reveal
        if (entry.target.dataset.fcRevealOnce !== 'false') {
          this.unobserve(entry.target);
        }
      } else if (entry.target.dataset.fcRevealOnce === 'false') {
        entry.target.classList.remove('fc-visible');
      }
    });
  }

  /**
   * Observe an element for scroll-triggered reveal
   * @param {HTMLElement} element - Element to observe
   * @param {Object} options - Reveal options
   */
  observe(element, options = {}) {
    if (!this.observer || !element) return;
    
    // Add reveal class for initial hidden state
    element.classList.add('fc-reveal');
    
    // Store callback if provided
    if (options.onReveal) {
      element._fcRevealCallback = options.onReveal;
    }
    
    // Set reveal-once behavior
    if (options.revealOnce === false) {
      element.dataset.fcRevealOnce = 'false';
    }
    
    // Apply custom delay if specified
    if (options.delay) {
      element.style.transitionDelay = `${options.delay}ms`;
    }
    
    this.observer.observe(element);
    this.observedElements.add(element);
  }

  /**
   * Stop observing an element
   * @param {HTMLElement} element - Element to unobserve
   */
  unobserve(element) {
    if (!this.observer || !element) return;
    
    this.observer.unobserve(element);
    this.observedElements.delete(element);
  }

  /**
   * Disconnect observer and cleanup
   */
  disconnect() {
    if (this.observer) {
      this.observer.disconnect();
      this.observedElements.clear();
    }
  }
}

export { generateId };