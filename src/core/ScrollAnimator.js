import EventEmitter from './EventEmitter.js';
import { debounce, easings } from './AnimationUtils.js';

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
      once: options.once !== false,
      defaultAnimation: options.defaultAnimation || 'fadeInUp',
      defaultDuration: options.defaultDuration || 600,
      defaultEasing: options.defaultEasing || 'easeOutCubic',
      staggerDelay: options.staggerDelay || 100,
      ...options
    };
    
    this.observer = null;
    this.elements = new Map();
    this.staggerGroups = new Map();
    this.isSupported = 'IntersectionObserver' in window;
    
    this.animations = {
      fadeIn: {
        from: { opacity: 0 },
        to: { opacity: 1 }
      },
      fadeInUp: {
        from: { opacity: 0, transform: 'translateY(30px)' },
        to: { opacity: 1, transform: 'translateY(0)' }
      },
      fadeInDown: {
        from: { opacity: 0, transform: 'translateY(-30px)' },
        to: { opacity: 1, transform: 'translateY(0)' }
      },
      fadeInLeft: {
        from: { opacity: 0, transform: 'translateX(-30px)' },
        to: { opacity: 1, transform: 'translateX(0)' }
      },
      fadeInRight: {
        from: { opacity: 0, transform: 'translateX(30px)' },
        to: { opacity: 1, transform: 'translateX(0)' }
      },
      scaleIn: {
        from: { opacity: 0, transform: 'scale(0.9)' },
        to: { opacity: 1, transform: 'scale(1)' }
      },
      slideUp: {
        from: { transform: 'translateY(100%)' },
        to: { transform: 'translateY(0)' }
      }
    };
    
    this.init();
  }
  
  init() {
    if (!this.isSupported) {
      console.warn('ScrollAnimator: IntersectionObserver not supported');
      return;
    }
    
    this.observer = new IntersectionObserver(
      this.handleIntersection.bind(this),
      {
        root: this.options.root,
        rootMargin: this.options.rootMargin,
        threshold: this.options.threshold
      }
    );
    
    this.emit('init');
  }
  
  handleIntersection(entries) {
    entries.forEach(entry => {
      const element = entry.target;
      const config = this.elements.get(element);
      
      if (!config) return;
      
      if (entry.isIntersecting) {
        this.animateIn(element, config);
        
        if (this.options.once) {
          this.observer.unobserve(element);
        }
        
        this.emit('reveal', { element, config });
      } else if (!this.options.once) {
        this.animateOut(element, config);
        this.emit('hide', { element, config });
      }
    });
  }
  
  observe(element, options = {}) {
    if (!this.isSupported || !element) {
      if (element) this.showElementImmediately(element);
      return this;
    }
    
    const config = {
      animation: options.animation || this.options.defaultAnimation,
      duration: options.duration || this.options.defaultDuration,
      easing: options.easing || this.options.defaultEasing,
      delay: options.delay || 0,
      staggerGroup: options.staggerGroup || null
    };
    
    if (config.staggerGroup) {
      config.delay = this.calculateStaggerDelay(config.staggerGroup);
    }
    
    this.elements.set(element, config);
    this.prepareElement(element, config);
    this.observer.observe(element);
    
    return this;
  }
  
  observeAll(selector, options = {}) {
    const elements = document.querySelectorAll(selector);
    const staggerGroup = options.stagger ? selector : null;
    
    elements.forEach((element, index) => {
      this.observe(element, {
        ...options,
        staggerGroup: staggerGroup,
        delay: options.stagger ? index * this.options.staggerDelay : (options.delay || 0)
      });
    });
    
    return this;
  }
  
  calculateStaggerDelay(groupName) {
    const currentCount = this.staggerGroups.get(groupName) || 0;
    this.staggerGroups.set(groupName, currentCount + 1);
    return currentCount * this.options.staggerDelay;
  }
  
  prepareElement(element, config) {
    const animation = this.animations[config.animation];
    if (!animation) return;
    
    Object.assign(element.style, animation.from);
    element.style.transition = 'none';
    element.dataset.scrollAnimator = 'prepared';
  }
  
  animateIn(element, config) {
    const animation = this.animations[config.animation];
    if (!animation) return;
    
    const easing = easings[config.easing] ? this.getCSSeasing(config.easing) : config.easing;
    
    setTimeout(() => {
      element.style.transition = `all ${config.duration}ms ${easing}`;
      Object.assign(element.style, animation.to);
      element.dataset.scrollAnimator = 'visible';
    }, config.delay);
  }
  
  animateOut(element, config) {
    const animation = this.animations[config.animation];
    if (!animation) return;
    
    element.style.transition = `all ${config.duration}ms ${this.getCSSeasing(config.easing)}`;
    Object.assign(element.style, animation.from);
    element.dataset.scrollAnimator = 'hidden';
  }
  
  showElementImmediately(element) {
    element.style.opacity = '1';
    element.style.transform = 'none';
  }
  
  getCSSeasing(easingName) {
    const cssEasings = {
      linear: 'linear',
      easeInQuad: 'cubic-bezier(0.55, 0.085, 0.68, 0.53)',
      easeOutQuad: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      easeInOutQuad: 'cubic-bezier(0.455, 0.03, 0.515, 0.955)',
      easeInCubic: 'cubic-bezier(0.55, 0.055, 0.675, 0.19)',
      easeOutCubic: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
      easeInOutCubic: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
      easeOutBack: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      easeOutElastic: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
    };
    return cssEasings[easingName] || 'ease-out';
  }
  
  registerAnimation(name, animation) {
    this.animations[name] = animation;
    return this;
  }
  
  unobserve(element) {
    if (this.observer && element) {
      this.observer.unobserve(element);
      this.elements.delete(element);
    }
    return this;
  }
  
  reset() {
    this.elements.forEach((config, element) => {
      this.prepareElement(element, config);
    });
    this.staggerGroups.clear();
    return this;
  }
  
  destroy() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
    this.elements.clear();
    this.staggerGroups.clear();
    this.removeAllListeners();
    this.emit('destroy');
  }
}

export default ScrollAnimator;
