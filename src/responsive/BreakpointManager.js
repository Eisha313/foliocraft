/**
 * BreakpointManager - Handles responsive breakpoint detection and callbacks
 * Provides customizable thresholds and media query management
 */

import { EventEmitter } from '../core/EventEmitter.js';

const DEFAULT_BREAKPOINTS = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1400
};

export class BreakpointManager extends EventEmitter {
  constructor(options = {}) {
    super();
    
    this.breakpoints = { ...DEFAULT_BREAKPOINTS, ...options.breakpoints };
    this.currentBreakpoint = null;
    this.mediaQueries = new Map();
    this.initialized = false;
  }

  /**
   * Initialize the breakpoint manager
   */
  init() {
    if (this.initialized) return this;
    
    this._setupMediaQueries();
    this._detectCurrentBreakpoint();
    this.initialized = true;
    
    return this;
  }

  /**
   * Set up media query listeners for each breakpoint
   * @private
   */
  _setupMediaQueries() {
    const sortedBreakpoints = this._getSortedBreakpoints();
    
    sortedBreakpoints.forEach((bp, index) => {
      const minWidth = this.breakpoints[bp];
      const nextBp = sortedBreakpoints[index + 1];
      const maxWidth = nextBp ? this.breakpoints[nextBp] - 1 : null;
      
      let query;
      if (maxWidth) {
        query = `(min-width: ${minWidth}px) and (max-width: ${maxWidth}px)`;
      } else {
        query = `(min-width: ${minWidth}px)`;
      }
      
      const mql = window.matchMedia(query);
      
      const handler = (e) => {
        if (e.matches) {
          this._handleBreakpointChange(bp);
        }
      };
      
      // Use addEventListener for modern browsers
      if (mql.addEventListener) {
        mql.addEventListener('change', handler);
      } else {
        // Fallback for older browsers
        mql.addListener(handler);
      }
      
      this.mediaQueries.set(bp, { mql, handler, query });
    });
  }

  /**
   * Get breakpoints sorted by value ascending
   * @private
   * @returns {string[]} Sorted breakpoint names
   */
  _getSortedBreakpoints() {
    return Object.keys(this.breakpoints)
      .sort((a, b) => this.breakpoints[a] - this.breakpoints[b]);
  }

  /**
   * Detect the current breakpoint on initialization
   * @private
   */
  _detectCurrentBreakpoint() {
    const width = window.innerWidth;
    const sortedBreakpoints = this._getSortedBreakpoints();
    
    for (let i = sortedBreakpoints.length - 1; i >= 0; i--) {
      const bp = sortedBreakpoints[i];
      if (width >= this.breakpoints[bp]) {
        this.currentBreakpoint = bp;
        break;
      }
    }
    
    this.emit('init', { breakpoint: this.currentBreakpoint, width });
  }

  /**
   * Handle breakpoint change
   * @private
   * @param {string} newBreakpoint - The new breakpoint name
   */
  _handleBreakpointChange(newBreakpoint) {
    const previousBreakpoint = this.currentBreakpoint;
    
    if (newBreakpoint !== previousBreakpoint) {
      this.currentBreakpoint = newBreakpoint;
      
      this.emit('change', {
        current: newBreakpoint,
        previous: previousBreakpoint,
        width: window.innerWidth
      });
    }
  }

  /**
   * Get the current breakpoint
   * @returns {string} Current breakpoint name
   */
  getCurrentBreakpoint() {
    return this.currentBreakpoint;
  }

  /**
   * Check if current viewport is at or above a breakpoint
   * @param {string} breakpoint - Breakpoint name to check
   * @returns {boolean}
   */
  isAtLeast(breakpoint) {
    if (!this.breakpoints[breakpoint]) {
      console.warn(`FolioCraft: Unknown breakpoint "${breakpoint}"`);
      return false;
    }
    
    return window.innerWidth >= this.breakpoints[breakpoint];
  }

  /**
   * Check if current viewport is below a breakpoint
   * @param {string} breakpoint - Breakpoint name to check
   * @returns {boolean}
   */
  isBelow(breakpoint) {
    return !this.isAtLeast(breakpoint);
  }

  /**
   * Check if current viewport matches a specific breakpoint
   * @param {string} breakpoint - Breakpoint name to check
   * @returns {boolean}
   */
  matches(breakpoint) {
    return this.currentBreakpoint === breakpoint;
  }

  /**
   * Add a custom breakpoint
   * @param {string} name - Breakpoint name
   * @param {number} value - Minimum width in pixels
   */
  addBreakpoint(name, value) {
    if (this.initialized) {
      console.warn('FolioCraft: Cannot add breakpoints after initialization. Call destroy() first.');
      return this;
    }
    
    this.breakpoints[name] = value;
    return this;
  }

  /**
   * Get all breakpoint values
   * @returns {Object} Breakpoint configuration
   */
  getBreakpoints() {
    return { ...this.breakpoints };
  }

  /**
   * Clean up event listeners
   */
  destroy() {
    this.mediaQueries.forEach(({ mql, handler }) => {
      if (mql.removeEventListener) {
        mql.removeEventListener('change', handler);
      } else {
        mql.removeListener(handler);
      }
    });
    
    this.mediaQueries.clear();
    this.removeAllListeners();
    this.initialized = false;
    this.currentBreakpoint = null;
  }
}

export default BreakpointManager;
