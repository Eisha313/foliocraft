import EventEmitter from './EventEmitter.js';

/**
 * ScrollAnimator - Intersection Observer-powered scroll animations
 * Handles reveal effects when elements enter the viewport
 */
class ScrollAnimator extends EventEmitter {
  constructor(options = {}) {
    super();
    
    this.options = {
      root: null,
      rootMargin: options.rootMargin || '0px',
      threshold: options.threshold || 0.1,
      animationClass: options.animationClass || 'fc-revealed',
      once: options.once !== false
    };
    
    this.observer = null;
    this.observedElements = new Set();
    this.isInitialized = false;
    
    // Bind methods to preserve context
    this.handleIntersection = this.handleIntersection.bind(this);
  }
  
  /**
   * Initialize the Intersection Observer
   */
  init() {
    if (this.isInitialized) {
      return this;
    }
    
    if (typeof IntersectionObserver === 'undefined') {
      console.warn('ScrollAnimator: IntersectionObserver not supported');
      this.revealAllElements();
      return this;
    }
    
    this.observer = new IntersectionObserver(this.handleIntersection, {
      root: this.options.root,
      rootMargin: this.options.rootMargin,
      threshold: this.options.threshold
    });
    
    this.isInitialized = true;
    this.emit('init');
    
    return this;
  }
  
  /**
   * Handle intersection changes
   * @param {IntersectionObserverEntry[]} entries
   */
  handleIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        this.revealElement(entry.target);
        
        if (this.options.once) {
          this.unobserve(entry.target);
        }
      } else if (!this.options.once) {
        this.hideElement(entry.target);
      }
    });
  }
  
  /**
   * Observe an element for scroll animations
   * @param {HTMLElement} element
   * @param {Object} customOptions
   */
  observe(element, customOptions = {}) {
    if (!element || !(element instanceof HTMLElement)) {
      console.warn('ScrollAnimator: Invalid element provided');
      return this;
    }
    
    if (!this.isInitialized) {
      this.init();
    }
    
    if (!this.observer) {
      this.revealElement(element);
      return this;
    }
    
    // Store custom options on the element
    element._fcScrollOptions = customOptions;
    
    // Add initial hidden state
    element.classList.add('fc-scroll-target');
    
    this.observer.observe(element);
    this.observedElements.add(element);
    
    this.emit('observe', { element });
    
    return this;
  }
  
  /**
   * Stop observing an element
   * @param {HTMLElement} element
   */
  unobserve(element) {
    if (!element || !this.observer) {
      return this;
    }
    
    this.observer.unobserve(element);
    this.observedElements.delete(element);
    
    // Clean up custom options
    delete element._fcScrollOptions;
    
    this.emit('unobserve', { element });
    
    return this;
  }
  
  /**
   * Observe multiple elements
   * @param {NodeList|Array} elements
   * @param {Object} customOptions
   */
  observeAll(elements, customOptions = {}) {
    const elementArray = Array.from(elements);
    elementArray.forEach(el => this.observe(el, customOptions));
    return this;
  }
  
  /**
   * Reveal an element with animation
   * @param {HTMLElement} element
   */
  revealElement(element) {
    const options = element._fcScrollOptions || {};
    const animationClass = options.animationClass || this.options.animationClass;
    const delay = options.delay || 0;
    
    if (delay > 0) {
      setTimeout(() => {
        element.classList.add(animationClass);
      }, delay);
    } else {
      element.classList.add(animationClass);
    }
    
    this.emit('reveal', { element });
  }
  
  /**
   * Hide an element (reverse animation)
   * @param {HTMLElement} element
   */
  hideElement(element) {
    const options = element._fcScrollOptions || {};
    const animationClass = options.animationClass || this.options.animationClass;
    
    element.classList.remove(animationClass);
    
    this.emit('hide', { element });
  }
  
  /**
   * Reveal all observed elements (fallback for no IntersectionObserver)
   */
  revealAllElements() {
    this.observedElements.forEach(element => {
      this.revealElement(element);
    });
  }
  
  /**
   * Clean up and disconnect observer
   */
  destroy() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
    
    // Clean up custom options from all observed elements
    this.observedElements.forEach(element => {
      delete element._fcScrollOptions;
    });
    
    this.observedElements.clear();
    this.isInitialized = false;
    this.removeAllListeners();
    
    this.emit('destroy');
  }
}

export default ScrollAnimator;
