/**
 * AnimationController mixin
 * Provides shared animation control logic for components
 */

export const AnimationState = {
  IDLE: 'idle',
  RUNNING: 'running',
  PAUSED: 'paused',
  COMPLETED: 'completed'
};

export class AnimationController {
  constructor() {
    this.animations = new Map();
    this.state = AnimationState.IDLE;
    this.defaultDuration = 300;
    this.defaultEasing = 'ease-out';
  }

  /**
   * Register an animation
   * @param {string} name - Animation identifier
   * @param {Object} config - Animation configuration
   */
  registerAnimation(name, config) {
    this.animations.set(name, {
      duration: config.duration || this.defaultDuration,
      easing: config.easing || this.defaultEasing,
      keyframes: config.keyframes || [],
      onStart: config.onStart || null,
      onComplete: config.onComplete || null,
      ...config
    });
  }

  /**
   * Play a registered animation on an element
   * @param {string} name - Animation name
   * @param {HTMLElement} element - Target element
   * @param {Object} options - Override options
   * @returns {Promise<void>}
   */
  async play(name, element, options = {}) {
    const animation = this.animations.get(name);
    if (!animation) {
      console.warn(`Animation '${name}' not found`);
      return;
    }

    const config = { ...animation, ...options };
    
    this.state = AnimationState.RUNNING;
    
    if (config.onStart) {
      config.onStart(element);
    }

    return new Promise((resolve) => {
      if (config.keyframes && config.keyframes.length > 0) {
        const anim = element.animate(config.keyframes, {
          duration: config.duration,
          easing: config.easing,
          fill: config.fill || 'forwards'
        });

        anim.onfinish = () => {
          this.state = AnimationState.COMPLETED;
          if (config.onComplete) {
            config.onComplete(element);
          }
          resolve();
        };
      } else {
        // CSS transition fallback
        element.style.transition = `all ${config.duration}ms ${config.easing}`;
        
        if (config.styles) {
          Object.assign(element.style, config.styles);
        }

        setTimeout(() => {
          this.state = AnimationState.COMPLETED;
          if (config.onComplete) {
            config.onComplete(element);
          }
          resolve();
        }, config.duration);
      }
    });
  }

  /**
   * Play animation sequence
   * @param {Array} sequence - Array of {name, element, options}
   * @returns {Promise<void>}
   */
  async playSequence(sequence) {
    for (const item of sequence) {
      await this.play(item.name, item.element, item.options);
    }
  }

  /**
   * Play animations in parallel
   * @param {Array} animations - Array of {name, element, options}
   * @returns {Promise<void[]>}
   */
  async playParallel(animations) {
    return Promise.all(
      animations.map(item => this.play(item.name, item.element, item.options))
    );
  }

  /**
   * Create staggered animation
   * @param {string} name - Animation name
   * @param {NodeList|Array} elements - Target elements
   * @param {number} stagger - Delay between each element (ms)
   * @returns {Promise<void>}
   */
  async playStaggered(name, elements, stagger = 100) {
    const promises = Array.from(elements).map((element, index) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          this.play(name, element).then(resolve);
        }, index * stagger);
      });
    });

    return Promise.all(promises);
  }

  /**
   * Reset animation state
   */
  reset() {
    this.state = AnimationState.IDLE;
  }

  /**
   * Get current state
   * @returns {string}
   */
  getState() {
    return this.state;
  }

  /**
   * Check if animations are running
   * @returns {boolean}
   */
  isRunning() {
    return this.state === AnimationState.RUNNING;
  }
}

/**
 * Mixin function to add animation capabilities to a class
 * @param {Class} BaseClass - Class to extend
 * @returns {Class}
 */
export function withAnimationController(BaseClass) {
  return class extends BaseClass {
    constructor(...args) {
      super(...args);
      this.animationController = new AnimationController();
    }

    registerAnimation(name, config) {
      return this.animationController.registerAnimation(name, config);
    }

    playAnimation(name, element, options) {
      return this.animationController.play(name, element || this.element, options);
    }

    playAnimationSequence(sequence) {
      return this.animationController.playSequence(sequence);
    }

    playAnimationParallel(animations) {
      return this.animationController.playParallel(animations);
    }

    playAnimationStaggered(name, elements, stagger) {
      return this.animationController.playStaggered(name, elements, stagger);
    }
  };
}

export default AnimationController;
