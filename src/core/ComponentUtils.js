/**
 * Common utility functions shared across components
 */

/**
 * Creates a DOM element with specified attributes and children
 * @param {string} tag - HTML tag name
 * @param {Object} attributes - Element attributes
 * @param {Array|string} children - Child elements or text content
 * @returns {HTMLElement}
 */
export function createElement(tag, attributes = {}, children = []) {
  const element = document.createElement(tag);
  
  Object.entries(attributes).forEach(([key, value]) => {
    if (key === 'className') {
      element.className = value;
    } else if (key === 'style' && typeof value === 'object') {
      Object.assign(element.style, value);
    } else if (key.startsWith('data')) {
      const dataKey = key.replace('data', '').toLowerCase();
      element.dataset[dataKey] = value;
    } else if (key.startsWith('on') && typeof value === 'function') {
      const event = key.slice(2).toLowerCase();
      element.addEventListener(event, value);
    } else {
      element.setAttribute(key, value);
    }
  });
  
  if (typeof children === 'string') {
    element.textContent = children;
  } else if (Array.isArray(children)) {
    children.forEach(child => {
      if (typeof child === 'string') {
        element.appendChild(document.createTextNode(child));
      } else if (child instanceof HTMLElement) {
        element.appendChild(child);
      }
    });
  }
  
  return element;
}

/**
 * Applies CSS custom properties to an element
 * @param {HTMLElement} element - Target element
 * @param {Object} properties - CSS custom properties
 */
export function applyCustomProperties(element, properties) {
  Object.entries(properties).forEach(([key, value]) => {
    const propertyName = key.startsWith('--') ? key : `--${key}`;
    element.style.setProperty(propertyName, value);
  });
}

/**
 * Generates a unique ID with optional prefix
 * @param {string} prefix - ID prefix
 * @returns {string}
 */
export function generateId(prefix = 'fc') {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `${prefix}-${timestamp}-${random}`;
}

/**
 * Debounces a function call
 * @param {Function} fn - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function}
 */
export function debounce(fn, delay = 150) {
  let timeoutId;
  return function debounced(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
}

/**
 * Throttles a function call
 * @param {Function} fn - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function}
 */
export function throttle(fn, limit = 100) {
  let inThrottle;
  return function throttled(...args) {
    if (!inThrottle) {
      fn.apply(this, args);
      inThrottle = true;
      setTimeout(() => { inThrottle = false; }, limit);
    }
  };
}

/**
 * Deep merges multiple objects
 * @param {Object} target - Target object
 * @param {...Object} sources - Source objects
 * @returns {Object}
 */
export function deepMerge(target, ...sources) {
  if (!sources.length) return target;
  
  const source = sources.shift();
  
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!target[key]) {
          Object.assign(target, { [key]: {} });
        }
        deepMerge(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    });
  }
  
  return deepMerge(target, ...sources);
}

/**
 * Checks if value is a plain object
 * @param {*} item - Value to check
 * @returns {boolean}
 */
export function isObject(item) {
  return item && typeof item === 'object' && !Array.isArray(item);
}

/**
 * Clamps a number between min and max values
 * @param {number} value - Value to clamp
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number}
 */
export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

/**
 * Parses a CSS duration string to milliseconds
 * @param {string} duration - CSS duration (e.g., '300ms', '0.3s')
 * @returns {number}
 */
export function parseDuration(duration) {
  if (typeof duration === 'number') return duration;
  
  const match = duration.match(/^([\d.]+)(ms|s)$/);
  if (!match) return 0;
  
  const [, value, unit] = match;
  return unit === 's' ? parseFloat(value) * 1000 : parseFloat(value);
}

export default {
  createElement,
  applyCustomProperties,
  generateId,
  debounce,
  throttle,
  deepMerge,
  isObject,
  clamp,
  parseDuration
};
