/**
 * ThemeManager - Manages theme switching with CSS custom properties
 * Supports light/dark themes and custom color schemes
 */

import { EventEmitter } from '../core/EventEmitter.js';

const DEFAULT_THEMES = {
  light: {
    '--fc-primary': '#3498db',
    '--fc-primary-dark': '#2980b9',
    '--fc-secondary': '#2ecc71',
    '--fc-secondary-dark': '#27ae60',
    '--fc-accent': '#e74c3c',
    '--fc-background': '#ffffff',
    '--fc-surface': '#f8f9fa',
    '--fc-text': '#2c3e50',
    '--fc-text-muted': '#7f8c8d',
    '--fc-border': '#ecf0f1',
    '--fc-shadow': 'rgba(0, 0, 0, 0.1)',
    '--fc-overlay': 'rgba(0, 0, 0, 0.5)'
  },
  dark: {
    '--fc-primary': '#3498db',
    '--fc-primary-dark': '#2980b9',
    '--fc-secondary': '#2ecc71',
    '--fc-secondary-dark': '#27ae60',
    '--fc-accent': '#e74c3c',
    '--fc-background': '#1a1a2e',
    '--fc-surface': '#16213e',
    '--fc-text': '#eaeaea',
    '--fc-text-muted': '#a0a0a0',
    '--fc-border': '#2d2d44',
    '--fc-shadow': 'rgba(0, 0, 0, 0.3)',
    '--fc-overlay': 'rgba(0, 0, 0, 0.7)'
  }
};

export class ThemeManager extends EventEmitter {
  constructor(options = {}) {
    super();
    
    this.options = {
      defaultTheme: 'light',
      storageKey: 'foliocraft-theme',
      respectSystemPreference: true,
      transitionDuration: 200,
      ...options
    };
    
    this.themes = { ...DEFAULT_THEMES };
    this.currentTheme = null;
    this.customProperties = new Map();
    this.styleElement = null;
    this.mediaQuery = null;
    
    this._init();
  }
  
  _init() {
    this._createStyleElement();
    this._setupSystemPreferenceListener();
    this._loadInitialTheme();
  }
  
  _createStyleElement() {
    this.styleElement = document.createElement('style');
    this.styleElement.id = 'foliocraft-theme-styles';
    document.head.appendChild(this.styleElement);
  }
  
  _setupSystemPreferenceListener() {
    if (!this.options.respectSystemPreference) return;
    
    this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e) => {
      if (!this._hasStoredPreference()) {
        this.setTheme(e.matches ? 'dark' : 'light', false);
      }
    };
    
    if (this.mediaQuery.addEventListener) {
      this.mediaQuery.addEventListener('change', handleChange);
    } else {
      this.mediaQuery.addListener(handleChange);
    }
  }
  
  _loadInitialTheme() {
    let theme = this.options.defaultTheme;
    
    // Check stored preference
    const stored = this._getStoredTheme();
    if (stored && this.themes[stored]) {
      theme = stored;
    } else if (this.options.respectSystemPreference && this.mediaQuery) {
      theme = this.mediaQuery.matches ? 'dark' : 'light';
    }
    
    this.setTheme(theme, false);
  }
  
  _hasStoredPreference() {
    try {
      return localStorage.getItem(this.options.storageKey) !== null;
    } catch {
      return false;
    }
  }
  
  _getStoredTheme() {
    try {
      return localStorage.getItem(this.options.storageKey);
    } catch {
      return null;
    }
  }
  
  _storeTheme(themeName) {
    try {
      localStorage.setItem(this.options.storageKey, themeName);
    } catch {
      // Storage not available
    }
  }
  
  _applyTheme(themeName) {
    const theme = this.themes[themeName];
    if (!theme) return;
    
    const root = document.documentElement;
    
    // Apply CSS custom properties
    Object.entries(theme).forEach(([property, value]) => {
      root.style.setProperty(property, value);
    });
    
    // Apply any additional custom properties
    this.customProperties.forEach((value, property) => {
      root.style.setProperty(property, value);
    });
    
    // Update body class for additional styling hooks
    document.body.classList.remove('fc-theme-light', 'fc-theme-dark');
    document.body.classList.add(`fc-theme-${themeName}`);
    
    // Update meta theme-color for mobile browsers
    this._updateMetaThemeColor(theme['--fc-background']);
  }
  
  _updateMetaThemeColor(color) {
    let meta = document.querySelector('meta[name="theme-color"]');
    
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'theme-color';
      document.head.appendChild(meta);
    }
    
    meta.content = color;
  }
  
  _generateTransitionStyles() {
    const duration = this.options.transitionDuration;
    
    return `
      :root {
        transition: 
          background-color ${duration}ms ease,
          color ${duration}ms ease;
      }
      
      *,
      *::before,
      *::after {
        transition: 
          background-color ${duration}ms ease,
          border-color ${duration}ms ease,
          box-shadow ${duration}ms ease;
      }
    `;
  }
  
  /**
   * Set the active theme
   * @param {string} themeName - Name of the theme to activate
   * @param {boolean} persist - Whether to persist the choice
   */
  setTheme(themeName, persist = true) {
    if (!this.themes[themeName]) {
      console.warn(`FolioCraft: Theme "${themeName}" not found`);
      return;
    }
    
    const previousTheme = this.currentTheme;
    this.currentTheme = themeName;
    
    // Add transition styles temporarily
    this.styleElement.textContent = this._generateTransitionStyles();
    
    this._applyTheme(themeName);
    
    if (persist) {
      this._storeTheme(themeName);
    }
    
    this.emit('themeChange', {
      theme: themeName,
      previousTheme,
      properties: this.themes[themeName]
    });
    
    // Remove transition styles after animation
    setTimeout(() => {
      this.styleElement.textContent = '';
    }, this.options.transitionDuration + 50);
  }
  
  /**
   * Toggle between light and dark themes
   */
  toggle() {
    const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }
  
  /**
   * Register a custom theme
   * @param {string} name - Theme name
   * @param {object} properties - CSS custom properties
   */
  registerTheme(name, properties) {
    // Merge with light theme as base
    this.themes[name] = {
      ...this.themes.light,
      ...properties
    };
    
    this.emit('themeRegistered', { name, properties: this.themes[name] });
  }
  
  /**
   * Set a custom CSS property
   * @param {string} property - Property name (with or without --fc- prefix)
   * @param {string} value - Property value
   */
  setProperty(property, value) {
    const normalizedProperty = property.startsWith('--') ? property : `--fc-${property}`;
    this.customProperties.set(normalizedProperty, value);
    document.documentElement.style.setProperty(normalizedProperty, value);
  }
  
  /**
   * Get a CSS property value
   * @param {string} property - Property name
   * @returns {string} Property value
   */
  getProperty(property) {
    const normalizedProperty = property.startsWith('--') ? property : `--fc-${property}`;
    return getComputedStyle(document.documentElement).getPropertyValue(normalizedProperty).trim();
  }
  
  /**
   * Get current theme name
   * @returns {string} Current theme name
   */
  getCurrentTheme() {
    return this.currentTheme;
  }
  
  /**
   * Get all available theme names
   * @returns {string[]} Array of theme names
   */
  getAvailableThemes() {
    return Object.keys(this.themes);
  }
  
  /**
   * Check if dark mode is active
   * @returns {boolean}
   */
  isDark() {
    return this.currentTheme === 'dark';
  }
  
  /**
   * Clean up resources
   */
  destroy() {
    if (this.styleElement && this.styleElement.parentNode) {
      this.styleElement.parentNode.removeChild(this.styleElement);
    }
    this.removeAllListeners();
  }
}

export default ThemeManager;
