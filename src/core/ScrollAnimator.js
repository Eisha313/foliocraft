import EventEmitter from './EventEmitter.js';

/**
 * ScrollAnimator - Intersection Observer-powered scroll animations
 * Handles reveal effects and scroll-triggered animations
 */
class ScrollAnimator extends EventEmitter {
    constructor(options = {}) {
        super();
        
        this.options = {
            threshold: options.threshold || 0.1,
            rootMargin: options.rootMargin || '0px',
            once: options.once !== false,
            animationClass: options.animationClass || 'fc-animate-in',
            ...options
        };
        
        this.observer = null;
        this.observedElements = new Set();
        this.animatedElements = new WeakSet();
        this.isDestroyed = false;
        
        this._handleIntersection = this._handleIntersection.bind(this);
        this._init();
    }
    
    _init() {
        if (typeof IntersectionObserver === 'undefined') {
            console.warn('ScrollAnimator: IntersectionObserver not supported');
            return;
        }
        
        this.observer = new IntersectionObserver(this._handleIntersection, {
            threshold: this.options.threshold,
            rootMargin: this.options.rootMargin
        });
    }
    
    _handleIntersection(entries) {
        if (this.isDestroyed) return;
        
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                this._animateIn(entry.target);
                
                if (this.options.once) {
                    this.unobserve(entry.target);
                }
            } else if (!this.options.once) {
                this._animateOut(entry.target);
            }
        });
    }
    
    _animateIn(element) {
        if (this.isDestroyed) return;
        
        element.classList.add(this.options.animationClass);
        this.animatedElements.add(element);
        
        this.emit('animateIn', { element });
    }
    
    _animateOut(element) {
        if (this.isDestroyed) return;
        
        element.classList.remove(this.options.animationClass);
        
        this.emit('animateOut', { element });
    }
    
    observe(element) {
        if (this.isDestroyed) {
            console.warn('ScrollAnimator: Cannot observe, animator is destroyed');
            return this;
        }
        
        if (!this.observer) {
            element.classList.add(this.options.animationClass);
            return this;
        }
        
        if (element && !this.observedElements.has(element)) {
            this.observer.observe(element);
            this.observedElements.add(element);
        }
        
        return this;
    }
    
    unobserve(element) {
        if (!this.observer || !element) return this;
        
        this.observer.unobserve(element);
        this.observedElements.delete(element);
        
        return this;
    }
    
    observeAll(selector, context = document) {
        const elements = context.querySelectorAll(selector);
        elements.forEach(el => this.observe(el));
        
        return this;
    }
    
    reset() {
        this.observedElements.forEach(element => {
            element.classList.remove(this.options.animationClass);
            if (this.observer) {
                this.observer.unobserve(element);
            }
        });
        
        this.observedElements.clear();
        this.animatedElements = new WeakSet();
        
        return this;
    }
    
    refresh() {
        const elements = Array.from(this.observedElements);
        this.reset();
        elements.forEach(el => this.observe(el));
        
        return this;
    }
    
    destroy() {
        this.isDestroyed = true;
        
        if (this.observer) {
            this.observer.disconnect();
            this.observer = null;
        }
        
        this.observedElements.clear();
        this.animatedElements = new WeakSet();
        this.removeAllListeners();
    }
}

export default ScrollAnimator;