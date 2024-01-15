import EventEmitter from '../core/EventEmitter.js';

/**
 * BreakpointManager - Handle responsive breakpoints
 * Provides customizable thresholds and change detection
 */
class BreakpointManager extends EventEmitter {
    constructor(options = {}) {
        super();
        
        this.breakpoints = options.breakpoints || {
            xs: 0,
            sm: 576,
            md: 768,
            lg: 992,
            xl: 1200,
            xxl: 1400
        };
        
        this.currentBreakpoint = null;
        this.currentWidth = 0;
        this.mediaQueries = new Map();
        this.isDestroyed = false;
        
        this._boundHandleResize = this._handleResize.bind(this);
        this._init();
    }
    
    _init() {
        this._setupMediaQueries();
        this._updateCurrentBreakpoint();
    }
    
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
                if (this.isDestroyed) return;
                if (e.matches) {
                    this._setBreakpoint(bp);
                }
            };
            
            // Use the modern API if available, fall back to deprecated addListener
            if (mql.addEventListener) {
                mql.addEventListener('change', handler);
            } else {
                mql.addListener(handler);
            }
            
            this.mediaQueries.set(bp, { mql, handler });
        });
    }
    
    _getSortedBreakpoints() {
        return Object.keys(this.breakpoints)
            .sort((a, b) => this.breakpoints[a] - this.breakpoints[b]);
    }
    
    _updateCurrentBreakpoint() {
        if (this.isDestroyed) return;
        
        this.currentWidth = window.innerWidth;
        const sortedBreakpoints = this._getSortedBreakpoints();
        
        for (let i = sortedBreakpoints.length - 1; i >= 0; i--) {
            const bp = sortedBreakpoints[i];
            if (this.currentWidth >= this.breakpoints[bp]) {
                this._setBreakpoint(bp);
                break;
            }
        }
    }
    
    _setBreakpoint(breakpoint) {
        if (this.isDestroyed) return;
        
        const previousBreakpoint = this.currentBreakpoint;
        
        if (previousBreakpoint !== breakpoint) {
            this.currentBreakpoint = breakpoint;
            this.currentWidth = window.innerWidth;
            
            this.emit('change', {
                current: breakpoint,
                previous: previousBreakpoint,
                width: this.currentWidth
            });
            
            this.emit(`breakpoint:${breakpoint}`, {
                previous: previousBreakpoint,
                width: this.currentWidth
            });
        }
    }
    
    _handleResize() {
        if (this.isDestroyed) return;
        this._updateCurrentBreakpoint();
    }
    
    /**
     * Get current breakpoint name
     */
    getCurrent() {
        return this.currentBreakpoint;
    }
    
    /**
     * Get current viewport width
     */
    getWidth() {
        return window.innerWidth;
    }
    
    /**
     * Check if current breakpoint matches
     */
    is(breakpoint) {
        return this.currentBreakpoint === breakpoint;
    }
    
    /**
     * Check if viewport is at least the given breakpoint
     */
    isAtLeast(breakpoint) {
        const currentValue = this.breakpoints[this.currentBreakpoint];
        const compareValue = this.breakpoints[breakpoint];
        
        return currentValue >= compareValue;
    }
    
    /**
     * Check if viewport is at most the given breakpoint
     */
    isAtMost(breakpoint) {
        const currentValue = this.breakpoints[this.currentBreakpoint];
        const compareValue = this.breakpoints[breakpoint];
        
        return currentValue <= compareValue;
    }
    
    /**
     * Check if viewport is between two breakpoints (inclusive)
     */
    isBetween(minBreakpoint, maxBreakpoint) {
        return this.isAtLeast(minBreakpoint) && this.isAtMost(maxBreakpoint);
    }
    
    /**
     * Add a custom breakpoint
     */
    addBreakpoint(name, width) {
        if (this.isDestroyed) {
            console.warn('BreakpointManager: Cannot add breakpoint, manager is destroyed');
            return this;
        }
        
        this.breakpoints[name] = width;
        this._cleanupMediaQueries();
        this._setupMediaQueries();
        this._updateCurrentBreakpoint();
        
        return this;
    }
    
    /**
     * Remove a breakpoint
     */
    removeBreakpoint(name) {
        if (this.isDestroyed) return this;
        
        if (this.breakpoints[name] !== undefined) {
            delete this.breakpoints[name];
            this._cleanupMediaQueries();
            this._setupMediaQueries();
            this._updateCurrentBreakpoint();
        }
        
        return this;
    }
    
    /**
     * Get all breakpoints
     */
    getBreakpoints() {
        return { ...this.breakpoints };
    }
    
    /**
     * Clean up media query listeners
     */
    _cleanupMediaQueries() {
        this.mediaQueries.forEach(({ mql, handler }) => {
            if (mql.removeEventListener) {
                mql.removeEventListener('change', handler);
            } else {
                mql.removeListener(handler);
            }
        });
        this.mediaQueries.clear();
    }
    
    /**
     * Destroy the manager
     */
    destroy() {
        if (this.isDestroyed) return;
        
        this.isDestroyed = true;
        this._cleanupMediaQueries();
        this.removeAllListeners();
    }
}

export default BreakpointManager;