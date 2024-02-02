/**
 * Animation utility functions for FolioCraft
 * Provides easing functions and animation helpers
 */

export const easings = {
  linear: t => t,
  easeInQuad: t => t * t,
  easeOutQuad: t => t * (2 - t),
  easeInOutQuad: t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
  easeInCubic: t => t * t * t,
  easeOutCubic: t => (--t) * t * t + 1,
  easeInOutCubic: t => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
  easeOutBack: t => {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  },
  easeOutElastic: t => {
    const c4 = (2 * Math.PI) / 3;
    return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
  }
};

/**
 * Request animation frame with fallback
 */
export const raf = (callback) => {
  return (window.requestAnimationFrame || 
          window.webkitRequestAnimationFrame || 
          ((cb) => setTimeout(cb, 16)))(callback);
};

/**
 * Cancel animation frame with fallback
 */
export const cancelRaf = (id) => {
  return (window.cancelAnimationFrame || 
          window.webkitCancelAnimationFrame || 
          clearTimeout)(id);
};

/**
 * Animate a value over time
 * @param {Object} options - Animation options
 * @returns {Function} Cancel function
 */
export function animate({ from, to, duration, easing = 'easeOutCubic', onUpdate, onComplete }) {
  const easingFn = typeof easing === 'function' ? easing : easings[easing] || easings.linear;
  const startTime = performance.now();
  let rafId = null;
  
  const tick = (currentTime) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easingFn(progress);
    const currentValue = from + (to - from) * easedProgress;
    
    onUpdate(currentValue, progress);
    
    if (progress < 1) {
      rafId = raf(tick);
    } else if (onComplete) {
      onComplete();
    }
  };
  
  rafId = raf(tick);
  
  return () => {
    if (rafId) {
      cancelRaf(rafId);
    }
  };
}

export default {
  easings,
  raf,
  cancelRaf,
  animate
};
