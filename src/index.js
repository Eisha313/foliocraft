/**
 * FolioCraft - A lightweight JavaScript library for building interactive,
 * responsive portfolio sections with zero dependencies.
 * 
 * @module FolioCraft
 * @version 1.0.0
 * @license MIT
 */

// Core modules
export { Component, EventEmitter, ScrollAnimator, AnimationUtils, ComponentUtils, AnimationController } from './core/index.js';

// Responsive modules
export { BreakpointManager, ResponsiveContainer } from './responsive/index.js';

// Theme modules
export { ThemeManager, ThemeToggle } from './theme/index.js';

// Component modules
export { ProjectCard, ProjectGrid, SkillBar, SkillGroup, TimelineEntry, Timeline } from './components/index.js';

// Form modules
export { FormValidator, ContactForm } from './forms/index.js';

/**
 * FolioCraft default configuration
 * @type {Object}
 */
export const defaultConfig = {
  theme: 'light',
  animationDuration: 300,
  breakpoints: {
    mobile: 480,
    tablet: 768,
    desktop: 1024,
    wide: 1280
  },
  scrollAnimations: true,
  reducedMotion: false
};

/**
 * Initialize FolioCraft with optional configuration
 * @param {Object} config - Configuration options
 * @returns {Object} Initialized FolioCraft instance
 */
export function init(config = {}) {
  const mergedConfig = { ...defaultConfig, ...config };
  
  // Check for reduced motion preference
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    mergedConfig.reducedMotion = true;
  }
  
  return {
    config: mergedConfig,
    version: '1.0.0',
    
    /**
     * Create a new component instance
     * @param {string} type - Component type
     * @param {Object} options - Component options
     * @returns {Component} Component instance
     */
    create(type, options) {
      const components = {
        ProjectCard,
        ProjectGrid,
        SkillBar,
        SkillGroup,
        TimelineEntry,
        Timeline,
        ContactForm,
        ThemeToggle,
        ResponsiveContainer
      };
      
      const ComponentClass = components[type];
      if (!ComponentClass) {
        throw new Error(`Unknown component type: ${type}`);
      }
      
      return new ComponentClass({ ...options, config: mergedConfig });
    }
  };
}

// Default export for convenience
export default {
  init,
  defaultConfig
};
