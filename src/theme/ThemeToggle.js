/**
 * ThemeToggle - UI component for theme switching
 * Provides accessible toggle button with optional icons
 */

import { Component } from '../core/Component.js';

export class ThemeToggle extends Component {
  constructor(themeManager, options = {}) {
    super(options.container || document.body, {
      className: 'fc-theme-toggle',
      ariaLabel: 'Toggle theme',
      showLabel: false,
      lightIcon: '☀️',
      darkIcon: '🌙',
      lightLabel: 'Light mode',
      darkLabel: 'Dark mode',
      ...options
    });
    
    this.themeManager = themeManager;
    this.button = null;
    
    this._init();
  }
  
  _init() {
    this._createToggleButton();
    this._bindEvents();
    this._updateState();
  }
  
  _createToggleButton() {
    this.button = document.createElement('button');
    this.button.type = 'button';
    this.button.className = this.options.className;
    this.button.setAttribute('aria-label', this.options.ariaLabel);
    
    // Create icon container
    const iconSpan = document.createElement('span');
    iconSpan.className = 'fc-theme-toggle__icon';
    iconSpan.setAttribute('aria-hidden', 'true');
    this.button.appendChild(iconSpan);
    
    // Create optional label
    if (this.options.showLabel) {
      const labelSpan = document.createElement('span');
      labelSpan.className = 'fc-theme-toggle__label';
      this.button.appendChild(labelSpan);
    }
    
    this.container.appendChild(this.button);
    this._injectStyles();
  }
  
  _injectStyles() {
    if (document.getElementById('fc-theme-toggle-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'fc-theme-toggle-styles';
    style.textContent = `
      .fc-theme-toggle {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 0.75rem;
        border: 2px solid var(--fc-border, #ecf0f1);
        border-radius: 9999px;
        background: var(--fc-surface, #f8f9fa);
        color: var(--fc-text, #2c3e50);
        cursor: pointer;
        font-size: 1rem;
        transition: all 0.2s ease;
      }
      
      .fc-theme-toggle:hover {
        border-color: var(--fc-primary, #3498db);
        background: var(--fc-background, #ffffff);
      }
      
      .fc-theme-toggle:focus {
        outline: none;
        box-shadow: 0 0 0 3px var(--fc-primary, #3498db)40;
      }
      
      .fc-theme-toggle__icon {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.25em;
        transition: transform 0.3s ease;
      }
      
      .fc-theme-toggle:hover .fc-theme-toggle__icon {
        transform: rotate(15deg);
      }
      
      .fc-theme-toggle__label {
        font-size: 0.875rem;
        font-weight: 500;
      }
    `;
    document.head.appendChild(style);
  }
  
  _bindEvents() {
    this.button.addEventListener('click', () => this._handleClick());
    
    // Listen for external theme changes
    this.themeManager.on('themeChange', () => this._updateState());
  }
  
  _handleClick() {
    this.themeManager.toggle();
  }
  
  _updateState() {
    const isDark = this.themeManager.isDark();
    const icon = isDark ? this.options.lightIcon : this.options.darkIcon;
    const label = isDark ? this.options.lightLabel : this.options.darkLabel;
    
    const iconEl = this.button.querySelector('.fc-theme-toggle__icon');
    if (iconEl) {
      iconEl.textContent = icon;
    }
    
    const labelEl = this.button.querySelector('.fc-theme-toggle__label');
    if (labelEl) {
      labelEl.textContent = label;
    }
    
    this.button.setAttribute('aria-pressed', isDark ? 'false' : 'true');
    this.button.setAttribute('aria-label', `Switch to ${label.toLowerCase()}`);
  }
  
  /**
   * Update toggle options
   * @param {object} options - New options
   */
  setOptions(options) {
    Object.assign(this.options, options);
    this._updateState();
  }
  
  destroy() {
    if (this.button && this.button.parentNode) {
      this.button.parentNode.removeChild(this.button);
    }
    super.destroy();
  }
}

export default ThemeToggle;
