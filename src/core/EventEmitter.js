/**
 * EventEmitter - Simple event emitter for component communication
 * Provides pub/sub functionality with proper memory management
 */
class EventEmitter {
  constructor() {
    this.events = new Map();
  }
  
  /**
   * Subscribe to an event
   * @param {string} event - Event name
   * @param {Function} callback - Event handler
   * @returns {Function} Unsubscribe function
   */
  on(event, callback) {
    if (typeof callback !== 'function') {
      throw new TypeError('EventEmitter: callback must be a function');
    }
    
    if (!this.events.has(event)) {
      this.events.set(event, new Set());
    }
    
    this.events.get(event).add(callback);
    
    // Return unsubscribe function for convenience
    return () => this.off(event, callback);
  }
  
  /**
   * Subscribe to an event only once
   * @param {string} event - Event name
   * @param {Function} callback - Event handler
   * @returns {Function} Unsubscribe function
   */
  once(event, callback) {
    const wrapper = (...args) => {
      this.off(event, wrapper);
      callback.apply(this, args);
    };
    
    // Store reference to original callback for removal
    wrapper._originalCallback = callback;
    
    return this.on(event, wrapper);
  }
  
  /**
   * Unsubscribe from an event
   * @param {string} event - Event name
   * @param {Function} callback - Event handler to remove
   */
  off(event, callback) {
    const listeners = this.events.get(event);
    
    if (!listeners) {
      return this;
    }
    
    // Handle removal of 'once' wrapped callbacks
    listeners.forEach(listener => {
      if (listener === callback || listener._originalCallback === callback) {
        listeners.delete(listener);
      }
    });
    
    // Clean up empty event sets to prevent memory buildup
    if (listeners.size === 0) {
      this.events.delete(event);
    }
    
    return this;
  }
  
  /**
   * Emit an event
   * @param {string} event - Event name
   * @param {*} data - Event data
   */
  emit(event, data) {
    const listeners = this.events.get(event);
    
    if (!listeners || listeners.size === 0) {
      return this;
    }
    
    // Create a copy of listeners to avoid issues if listeners modify the set
    const listenersCopy = Array.from(listeners);
    
    listenersCopy.forEach(callback => {
      try {
        callback.call(this, data);
      } catch (error) {
        console.error(`EventEmitter: Error in '${event}' handler:`, error);
      }
    });
    
    return this;
  }
  
  /**
   * Remove all listeners for an event or all events
   * @param {string} [event] - Optional event name
   */
  removeAllListeners(event) {
    if (event) {
      this.events.delete(event);
    } else {
      this.events.clear();
    }
    
    return this;
  }
  
  /**
   * Get listener count for an event
   * @param {string} event - Event name
   * @returns {number}
   */
  listenerCount(event) {
    const listeners = this.events.get(event);
    return listeners ? listeners.size : 0;
  }
  
  /**
   * Check if event has listeners
   * @param {string} event - Event name
   * @returns {boolean}
   */
  hasListeners(event) {
    return this.listenerCount(event) > 0;
  }
  
  /**
   * Get all event names with listeners
   * @returns {string[]}
   */
  eventNames() {
    return Array.from(this.events.keys());
  }
}

export default EventEmitter;
