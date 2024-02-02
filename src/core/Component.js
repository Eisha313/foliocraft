import { EventEmitter } from './EventEmitter.js';
import ComponentUtils from './ComponentUtils.js';

/**
 * Base Component class that all FolioCraft components extend.
 * Provides lifecycle management, event handling, and DOM utilities.
 * 
 * @class Component
 * @extends EventEmitter
 * @example
 * class MyComponent extends Component {
 *   constructor(options) {
 *     super(options);
 *     this.state = { count: 0 };
 *   }
 *   
 *   render() {
 *     return `<div>${this.state.count}</div>`;
 *   }
 * }
 */
export class Component extends EventEmitter {
  /**
   * Create a new Component instance
   * @param {Object} options - Component configuration options
   * @param {HTMLElement|string} [options.container] - Container element or selector
   * @param {string} [options.className] - CSS class name for the component
   * @param {Object} [options.config] - Global FolioCraft configuration
   */
  constructor(options = {}) {
    super();
    
    /** @type {Object} Component options */
    this.options = options;
    
    /** @type {HTMLElement|null} Component's DOM element */
    this.element = null;
    
    /** @type {HTMLElement|null} Container element */
    this.container = null;
    
    /** @type {boolean} Whether component is mounted */
    this.mounted = false;
    
    /** @type {Object} Component state */
    this.state = {};
    
    /** @type {string} Unique component ID */
    this.id = ComponentUtils.generateId();
    
    if (options.container) {
      this.setContainer(options.container);
    }
  }
  
  /**
   * Set the container element for the component
   * @param {HTMLElement|string} container - Container element or CSS selector
   * @returns {Component} This component instance for chaining
   */
  setContainer(container) {
    if (typeof container === 'string') {
      this.container = document.querySelector(container);
    } else {
      this.container = container;
    }
    return this;
  }
  
  /**
   * Update component state and trigger re-render
   * @param {Object} newState - Partial state to merge
   * @returns {Component} This component instance for chaining
   */
  setState(newState) {
    const prevState = { ...this.state };
    this.state = { ...this.state, ...newState };
    
    this.emit('stateChange', { prevState, newState: this.state });
    
    if (this.mounted) {
      this.update();
    }
    
    return this;
  }
  
  /**
   * Create the component's DOM element
   * @returns {HTMLElement} The created element
   * @protected
   */
  createElement(tag, options) {
    // Overloaded: createElement('div', { className, html, attributes })
    if (typeof tag === 'string' && options) {
      const el = document.createElement(tag);
      if (options.className) el.className = options.className;
      if (options.html) el.innerHTML = options.html;
      if (options.attributes) {
        Object.entries(options.attributes).forEach(([k, v]) => el.setAttribute(k, v));
      }
      el.setAttribute('data-foliocraft-id', this.id);
      return el;
    }

    // Original: createElement() — build from render() HTML string
    const html = this.render();
    const temp = document.createElement('div');
    temp.innerHTML = html.trim();
    this.element = temp.firstChild;
    this.element.setAttribute('data-foliocraft-id', this.id);
    return this.element;
  }
  
  /**
   * Mount the component to its container
   * @returns {Component} This component instance for chaining
   * @fires Component#beforeMount
   * @fires Component#mounted
   */
  mount() {
    if (!this.container) {
      throw new Error('Component requires a container to mount');
    }
    
    this.emit('beforeMount');
    
    this.createElement();
    this.container.appendChild(this.element);
    this.mounted = true;
    
    this.bindEvents();
    this.emit('mounted');
    
    return this;
  }
  
  /**
   * Unmount the component from the DOM
   * @returns {Component} This component instance for chaining
   * @fires Component#beforeUnmount
   * @fires Component#unmounted
   */
  unmount() {
    if (!this.mounted) return this;
    
    this.emit('beforeUnmount');
    
    this.unbindEvents();
    
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
    
    this.mounted = false;
    this.emit('unmounted');
    
    return this;
  }
  
  /**
   * Update the component's DOM representation
   * @returns {Component} This component instance for chaining
   * @fires Component#beforeUpdate
   * @fires Component#updated
   */
  update() {
    if (!this.mounted) return this;
    
    this.emit('beforeUpdate');
    
    const newElement = this.createElement();
    this.element.parentNode.replaceChild(newElement, this.element);
    this.element = newElement;
    
    this.bindEvents();
    this.emit('updated');
    
    return this;
  }
  
  /**
   * Render the component's HTML
   * @abstract
   * @returns {string} HTML string representation
   */
  render() {
    return '<div></div>';
  }
  
  /**
   * Bind event listeners to the component
   * Override in subclasses to add event handling
   * @protected
   */
  bindEvents() {
    // Override in subclasses
  }
  
  /**
   * Unbind event listeners from the component
   * Override in subclasses to clean up event handling
   * @protected
   */
  unbindEvents() {
    // Override in subclasses
  }
  
  /**
   * Destroy the component and clean up resources
   * @returns {void}
   * @fires Component#destroyed
   */
  destroy() {
    this.unmount();
    this.removeAllListeners();
    this.emit('destroyed');
  }
}

export default Component;
