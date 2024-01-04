import EventEmitter from './EventEmitter.js';

/**
 * Component - Base class for all FolioCraft UI components
 * Provides lifecycle management and common utilities
 */
class Component extends EventEmitter {
  constructor(element, options = {}) {
    super();
    
    // Support both element reference and selector
    if (typeof element === 'string') {
      this.element = document.querySelector(element);
    } else {
      this.element = element;
    }
    
    if (!this.element) {
      throw new Error('Component: Valid element or selector required');
    }
    
    this.options = { ...this.constructor.defaults, ...options };
    this.isInitialized = false;
    this.isDestroyed = false;
    this.boundHandlers = new Map();
    
    // Store instance reference on element for later retrieval
    this.element._fcComponent = this;
  }
  
  /**
   * Default options (override in subclasses)
   */
  static get defaults() {
    return {};
  }
  
  /**
   * Initialize the component
   */
  init() {
    if (this.isInitialized || this.isDestroyed) {
      return this;
    }
    
    this.render();
    this.bindEvents();
    this.isInitialized = true;
    
    this.emit('init', { component: this });
    
    return this;
  }
  
  /**
   * Render the component (override in subclasses)
   */
  render() {
    // Base implementation - override in subclasses
  }
  
  /**
   * Bind event listeners (override in subclasses)
   */
  bindEvents() {
    // Base implementation - override in subclasses
  }
  
  /**
   * Unbind event listeners (override in subclasses)
   */
  unbindEvents() {
    // Clean up all bound handlers
    this.boundHandlers.forEach((handler, key) => {
      const [element, event] = key.split(':');
      const targetElement = element === 'element' ? this.element : document.querySelector(element);
      if (targetElement) {
        targetElement.removeEventListener(event, handler);
      }
    });
    this.boundHandlers.clear();
  }
  
  /**
   * Add an event listener with automatic cleanup tracking
   * @param {HTMLElement} element - Target element
   * @param {string} event - Event name
   * @param {Function} handler - Event handler
   * @param {Object} options - Event listener options
   */
  addBoundListener(element, event, handler, options = {}) {
    if (!element || !event || !handler) {
      return this;
    }
    
    const boundHandler = handler.bind(this);
    const key = `${element === this.element ? 'element' : element.className || 'custom'}:${event}`;
    
    element.addEventListener(event, boundHandler, options);
    this.boundHandlers.set(key, { element, event, handler: boundHandler, options });
    
    return this;
  }
  
  /**
   * Remove a specific bound listener
   * @param {string} key - The key used when adding the listener
   */
  removeBoundListener(key) {
    const binding = this.boundHandlers.get(key);
    if (binding) {
      binding.element.removeEventListener(binding.event, binding.handler, binding.options);
      this.boundHandlers.delete(key);
    }
    return this;
  }
  
  /**
   * Update component options
   * @param {Object} newOptions
   */
  setOptions(newOptions) {
    this.options = { ...this.options, ...newOptions };
    this.emit('optionsChange', { options: this.options });
    return this;
  }
  
  /**
   * Add CSS classes to the element
   * @param {...string} classes
   */
  addClass(...classes) {
    this.element.classList.add(...classes);
    return this;
  }
  
  /**
   * Remove CSS classes from the element
   * @param {...string} classes
   */
  removeClass(...classes) {
    this.element.classList.remove(...classes);
    return this;
  }
  
  /**
   * Toggle CSS class on the element
   * @param {string} className
   * @param {boolean} force
   */
  toggleClass(className, force) {
    this.element.classList.toggle(className, force);
    return this;
  }
  
  /**
   * Set element attribute
   * @param {string} name
   * @param {string} value
   */
  setAttribute(name, value) {
    this.element.setAttribute(name, value);
    return this;
  }
  
  /**
   * Get element attribute
   * @param {string} name
   */
  getAttribute(name) {
    return this.element.getAttribute(name);
  }
  
  /**
   * Query within component element
   * @param {string} selector
   */
  find(selector) {
    return this.element.querySelector(selector);
  }
  
  /**
   * Query all within component element
   * @param {string} selector
   */
  findAll(selector) {
    return this.element.querySelectorAll(selector);
  }
  
  /**
   * Show the component
   */
  show() {
    this.element.style.display = '';
    this.element.removeAttribute('hidden');
    this.emit('show');
    return this;
  }
  
  /**
   * Hide the component
   */
  hide() {
    this.element.style.display = 'none';
    this.element.setAttribute('hidden', '');
    this.emit('hide');
    return this;
  }
  
  /**
   * Destroy the component and clean up
   */
  destroy() {
    if (this.isDestroyed) {
      return;
    }
    
    this.emit('beforeDestroy', { component: this });
    
    this.unbindEvents();
    this.removeAllListeners();
    
    // Clean up element reference
    if (this.element) {
      delete this.element._fcComponent;
    }
    
    this.isInitialized = false;
    this.isDestroyed = true;
    this.element = null;
    this.options = null;
    
    this.emit('destroy');
  }
  
  /**
   * Get component instance from element
   * @param {HTMLElement} element
   */
  static getInstance(element) {
    return element?._fcComponent || null;
  }
}

export default Component;
