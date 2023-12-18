import { EventEmitter } from './EventEmitter.js';

/**
 * Base Component class for all FolioCraft UI components
 * Provides lifecycle management, event handling, and DOM utilities
 */
export class Component extends EventEmitter {
    /**
     * Create a new component
     * @param {HTMLElement|string} container - Container element or selector
     * @param {Object} options - Component configuration
     */
    constructor(container, options = {}) {
        super();
        
        this.container = typeof container === 'string'
            ? document.querySelector(container)
            : container;

        if (!this.container) {
            throw new Error('FolioCraft: Invalid container element');
        }

        this.options = this._mergeOptions(this.constructor.defaults || {}, options);
        this.state = {};
        this._mounted = false;
        this._elements = new Map();

        this._init();
    }

    /**
     * Deep merge default options with user options
     * @private
     */
    _mergeOptions(defaults, options) {
        const result = { ...defaults };
        
        for (const key in options) {
            if (options[key] !== null && typeof options[key] === 'object' && !Array.isArray(options[key])) {
                result[key] = this._mergeOptions(defaults[key] || {}, options[key]);
            } else {
                result[key] = options[key];
            }
        }
        
        return result;
    }

    /**
     * Initialize component - override in subclasses
     * @private
     */
    _init() {
        this.emit('beforeInit');
        this.render();
        this._bindEvents();
        this._mounted = true;
        this.emit('init');
    }

    /**
     * Render component - override in subclasses
     */
    render() {
        // Override in subclasses
    }

    /**
     * Bind DOM events - override in subclasses
     * @private
     */
    _bindEvents() {
        // Override in subclasses
    }

    /**
     * Update component state and re-render if needed
     * @param {Object} newState - State updates
     */
    setState(newState) {
        const prevState = { ...this.state };
        this.state = { ...this.state, ...newState };
        this.emit('stateChange', this.state, prevState);
        
        if (this._mounted) {
            this.update();
        }
    }

    /**
     * Update component after state change - override in subclasses
     */
    update() {
        // Override in subclasses
    }

    /**
     * Create an element with optional attributes and children
     * @param {string} tag - HTML tag name
     * @param {Object} attrs - Element attributes
     * @param {...(string|HTMLElement)} children - Child elements or text
     * @returns {HTMLElement}
     */
    createElement(tag, attrs = {}, ...children) {
        const element = document.createElement(tag);
        
        for (const [key, value] of Object.entries(attrs)) {
            if (key === 'className') {
                element.className = value;
            } else if (key === 'dataset') {
                Object.assign(element.dataset, value);
            } else if (key.startsWith('on') && typeof value === 'function') {
                element.addEventListener(key.slice(2).toLowerCase(), value);
            } else {
                element.setAttribute(key, value);
            }
        }

        children.forEach(child => {
            if (typeof child === 'string') {
                element.appendChild(document.createTextNode(child));
            } else if (child instanceof HTMLElement) {
                element.appendChild(child);
            }
        });

        return element;
    }

    /**
     * Query element within container and cache reference
     * @param {string} selector - CSS selector
     * @param {string} [key] - Cache key
     * @returns {HTMLElement|null}
     */
    $(selector, key) {
        if (key && this._elements.has(key)) {
            return this._elements.get(key);
        }
        
        const element = this.container.querySelector(selector);
        
        if (key && element) {
            this._elements.set(key, element);
        }
        
        return element;
    }

    /**
     * Query all elements within container
     * @param {string} selector - CSS selector
     * @returns {NodeList}
     */
    $$(selector) {
        return this.container.querySelectorAll(selector);
    }

    /**
     * Destroy component and cleanup
     */
    destroy() {
        this.emit('beforeDestroy');
        this._elements.clear();
        this.removeAllListeners();
        this.container.innerHTML = '';
        this._mounted = false;
        this.emit('destroy');
    }
}

export default Component;
