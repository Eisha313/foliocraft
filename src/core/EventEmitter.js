/**
 * A lightweight event emitter implementation for component communication.
 * Provides pub/sub pattern without external dependencies.
 * 
 * @class EventEmitter
 * @example
 * const emitter = new EventEmitter();
 * 
 * emitter.on('update', (data) => {
 *   console.log('Updated:', data);
 * });
 * 
 * emitter.emit('update', { value: 42 });
 */
export class EventEmitter {
  /**
   * Create a new EventEmitter instance
   */
  constructor() {
    /** @type {Map<string, Set<Function>>} Event listeners map */
    this.listeners = new Map();
  }
  
  /**
   * Register an event listener
   * @param {string} event - Event name to listen for
   * @param {Function} callback - Function to call when event is emitted
   * @returns {EventEmitter} This instance for chaining
   * @example
   * emitter.on('click', (data) => console.log(data));
   */
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);
    return this;
  }
  
  /**
   * Register a one-time event listener
   * @param {string} event - Event name to listen for
   * @param {Function} callback - Function to call when event is emitted
   * @returns {EventEmitter} This instance for chaining
   * @example
   * emitter.once('init', () => console.log('Initialized!'));
   */
  once(event, callback) {
    const onceWrapper = (...args) => {
      callback.apply(this, args);
      this.off(event, onceWrapper);
    };
    return this.on(event, onceWrapper);
  }
  
  /**
   * Remove an event listener
   * @param {string} event - Event name
   * @param {Function} callback - Function to remove
   * @returns {EventEmitter} This instance for chaining
   * @example
   * emitter.off('click', myHandler);
   */
  off(event, callback) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).delete(callback);
    }
    return this;
  }
  
  /**
   * Emit an event to all registered listeners
   * @param {string} event - Event name to emit
   * @param {...*} args - Arguments to pass to listeners
   * @returns {EventEmitter} This instance for chaining
   * @example
   * emitter.emit('update', { id: 1, value: 'new' });
   */
  emit(event, ...args) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => {
        try {
          callback.apply(this, args);
        } catch (error) {
          console.error(`Error in event listener for "${event}":`, error);
        }
      });
    }
    return this;
  }
  
  /**
   * Remove all listeners for a specific event or all events
   * @param {string} [event] - Event name (if omitted, removes all listeners)
   * @returns {EventEmitter} This instance for chaining
   * @example
   * emitter.removeAllListeners('click'); // Remove click listeners
   * emitter.removeAllListeners(); // Remove all listeners
   */
  removeAllListeners(event) {
    if (event) {
      this.listeners.delete(event);
    } else {
      this.listeners.clear();
    }
    return this;
  }
  
  /**
   * Get the count of listeners for an event
   * @param {string} event - Event name
   * @returns {number} Number of listeners
   */
  listenerCount(event) {
    return this.listeners.has(event) ? this.listeners.get(event).size : 0;
  }
  
  /**
   * Get all event names that have listeners
   * @returns {string[]} Array of event names
   */
  eventNames() {
    return Array.from(this.listeners.keys());
  }
}
