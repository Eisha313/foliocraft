import EventEmitter from './EventEmitter.js';

/**
 * Component - Base class for all FolioCraft components
 * Provides lifecycle management and DOM rendering
 */
class Component extends EventEmitter {
    constructor(options = {}) {
        super();
        
        this.options = options;
        this.element = null;
        this.isRendered = false;
        this.isDestroyed = false;
        this.childComponents = new Set();
        this.boundEventHandlers = new Map();
    }
    
    /**
     * Create the component's DOM structure
     * Override in subclasses
     */
    render() {
        throw new Error('Component.render() must be implemented by subclass');
    }
    
    /**
     * Mount the component to a container
     */
    mount(container) {
        if (this.isDestroyed) {
            console.warn('Component: Cannot mount destroyed component');
            return this;
        }
        
        if (typeof container === 'string') {
            container = document.querySelector(container);
        }
        
        if (!container) {
            console.error('Component: Invalid mount container');
            return this;
        }
        
        if (!this.element) {
            this.element = this.render();
        }
        
        container.appendChild(this.element);
        this.isRendered = true;
        
        this.emit('mounted', { container });
        this.onMounted();
        
        return this;
    }
    
    /**
     * Called after component is mounted
     * Override for post-mount logic
     */
    onMounted() {}
    
    /**
     * Called before component is destroyed
     * Override for cleanup logic
     */
    onBeforeDestroy() {}
    
    /**
     * Remove the component from DOM
     */
    unmount() {
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
        
        this.isRendered = false;
        this.emit('unmounted');
        
        return this;
    }
    
    /**
     * Bind an event handler and track it for cleanup
     */
    bindEvent(element, event, handler, options) {
        if (this.isDestroyed) return this;
        
        const boundHandler = handler.bind(this);
        element.addEventListener(event, boundHandler, options);
        
        const key = `${event}-${handler.name || 'anonymous'}`;
        if (!this.boundEventHandlers.has(element)) {
            this.boundEventHandlers.set(element, new Map());
        }
        this.boundEventHandlers.get(element).set(key, { event, handler: boundHandler, options });
        
        return this;
    }
    
    /**
     * Remove all bound event handlers from an element
     */
    unbindEvents(element) {
        if (this.boundEventHandlers.has(element)) {
            const handlers = this.boundEventHandlers.get(element);
            handlers.forEach(({ event, handler, options }) => {
                element.removeEventListener(event, handler, options);
            });
            this.boundEventHandlers.delete(element);
        }
        
        return this;
    }
    
    /**
     * Remove all bound event handlers
     */
    unbindAllEvents() {
        this.boundEventHandlers.forEach((handlers, element) => {
            handlers.forEach(({ event, handler, options }) => {
                element.removeEventListener(event, handler, options);
            });
        });
        this.boundEventHandlers.clear();
        
        return this;
    }
    
    /**
     * Add a child component
     */
    addChild(component) {
        if (this.isDestroyed) return this;
        
        this.childComponents.add(component);
        return this;
    }
    
    /**
     * Remove a child component
     */
    removeChild(component) {
        this.childComponents.delete(component);
        return this;
    }
    
    /**
     * Update component with new options
     */
    update(newOptions = {}) {
        if (this.isDestroyed) {
            console.warn('Component: Cannot update destroyed component');
            return this;
        }
        
        this.options = { ...this.options, ...newOptions };
        
        if (this.isRendered && this.element) {
            const parent = this.element.parentNode;
            const nextSibling = this.element.nextSibling;
            
            this.unmount();
            this.element = this.render();
            
            if (parent) {
                if (nextSibling) {
                    parent.insertBefore(this.element, nextSibling);
                } else {
                    parent.appendChild(this.element);
                }
                this.isRendered = true;
            }
        }
        
        this.emit('updated', { options: this.options });
        
        return this;
    }
    
    /**
     * Destroy the component and clean up
     */
    destroy() {
        if (this.isDestroyed) return;
        
        this.onBeforeDestroy();
        this.emit('beforeDestroy');
        
        // Destroy all child components
        this.childComponents.forEach(child => {
            if (child && typeof child.destroy === 'function') {
                child.destroy();
            }
        });
        this.childComponents.clear();
        
        // Clean up all bound event handlers
        this.unbindAllEvents();
        
        // Unmount from DOM
        this.unmount();
        
        // Clear element reference
        this.element = null;
        this.isDestroyed = true;
        
        // Remove all event listeners
        this.removeAllListeners();
        
        this.emit('destroyed');
    }
    
    /**
     * Create a DOM element with attributes
     */
    createElement(tag, attributes = {}, children = []) {
        const element = document.createElement(tag);
        
        Object.entries(attributes).forEach(([key, value]) => {
            if (key === 'className') {
                element.className = value;
            } else if (key === 'dataset') {
                Object.entries(value).forEach(([dataKey, dataValue]) => {
                    element.dataset[dataKey] = dataValue;
                });
            } else if (key.startsWith('on') && typeof value === 'function') {
                const event = key.slice(2).toLowerCase();
                this.bindEvent(element, event, value);
            } else {
                element.setAttribute(key, value);
            }
        });
        
        children.forEach(child => {
            if (typeof child === 'string') {
                element.appendChild(document.createTextNode(child));
            } else if (child instanceof Node) {
                element.appendChild(child);
            } else if (child instanceof Component) {
                const childElement = child.render();
                element.appendChild(childElement);
                this.addChild(child);
            }
        });
        
        return element;
    }
}

export default Component;