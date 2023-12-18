/**
 * ResponsiveContainer - Utility for applying responsive classes to elements
 * Works with BreakpointManager to update element states
 */

export class ResponsiveContainer {
  constructor(element, breakpointManager) {
    this.element = typeof element === 'string' 
      ? document.querySelector(element) 
      : element;
    
    if (!this.element) {
      throw new Error('FolioCraft: ResponsiveContainer requires a valid element');
    }
    
    this.breakpointManager = breakpointManager;
    this.classMap = new Map();
    this.boundHandler = this._handleBreakpointChange.bind(this);
  }

  /**
   * Initialize the responsive container
   */
  init() {
    this.breakpointManager.on('change', this.boundHandler);
    this.breakpointManager.on('init', this.boundHandler);
    
    // Apply initial state
    this._applyClasses(this.breakpointManager.getCurrentBreakpoint());
    
    return this;
  }

  /**
   * Define classes to apply at specific breakpoints
   * @param {string} breakpoint - Breakpoint name
   * @param {string|string[]} classes - Classes to apply
   */
  at(breakpoint, classes) {
    const classList = Array.isArray(classes) ? classes : [classes];
    this.classMap.set(breakpoint, classList);
    return this;
  }

  /**
   * Handle breakpoint changes
   * @private
   * @param {Object} data - Event data with current breakpoint
   */
  _handleBreakpointChange(data) {
    this._applyClasses(data.current || data.breakpoint);
  }

  /**
   * Apply classes for the given breakpoint
   * @private
   * @param {string} currentBreakpoint - Current breakpoint name
   */
  _applyClasses(currentBreakpoint) {
    // Remove all managed classes first
    this.classMap.forEach((classes) => {
      classes.forEach(cls => this.element.classList.remove(cls));
    });
    
    // Apply classes for current breakpoint
    const classes = this.classMap.get(currentBreakpoint);
    if (classes) {
      classes.forEach(cls => this.element.classList.add(cls));
    }
    
    // Update data attribute for CSS targeting
    this.element.dataset.breakpoint = currentBreakpoint;
  }

  /**
   * Clean up listeners
   */
  destroy() {
    this.breakpointManager.off('change', this.boundHandler);
    this.breakpointManager.off('init', this.boundHandler);
    
    // Remove all managed classes
    this.classMap.forEach((classes) => {
      classes.forEach(cls => this.element.classList.remove(cls));
    });
    
    delete this.element.dataset.breakpoint;
    this.classMap.clear();
  }
}

export default ResponsiveContainer;
