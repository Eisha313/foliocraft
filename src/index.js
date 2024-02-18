/**
 * FolioCraft - A lightweight JavaScript library for building interactive,
 * responsive portfolio sections with zero dependencies.
 *
 * @module FolioCraft
 * @version 1.0.0
 * @license MIT
 */

// ---------------------------------------------------------------------------
// Imports (local bindings used by init() and createPortfolio())
// ---------------------------------------------------------------------------

import { Component, EventEmitter, ScrollAnimator, AnimationUtils, ComponentUtils, AnimationController } from './core/index.js';
import { BreakpointManager, ResponsiveContainer } from './responsive/index.js';
import { ThemeManager, ThemeToggle } from './theme/index.js';
import { themePresets, themePresetsDark } from './theme/presets.js';
import {
  ProjectCard,
  ProjectGrid,
  SkillBar,
  SkillGroup,
  TimelineEntry,
  Timeline,
  Navbar,
  Footer,
  HeroSection,
  StatsCounter,
  SocialLinks,
  BackToTop
} from './components/index.js';
import { FormValidator, ContactForm } from './forms/index.js';
import { PortfolioBuilder } from './portfolio/index.js';

// ---------------------------------------------------------------------------
// Re-exports
// ---------------------------------------------------------------------------

// Core modules
export { Component, EventEmitter, ScrollAnimator, AnimationUtils, ComponentUtils, AnimationController };

// Responsive modules
export { BreakpointManager, ResponsiveContainer };

// Theme modules
export { ThemeManager, ThemeToggle, themePresets, themePresetsDark };

// Component modules
export {
  ProjectCard,
  ProjectGrid,
  SkillBar,
  SkillGroup,
  TimelineEntry,
  Timeline,
  Navbar,
  Footer,
  HeroSection,
  StatsCounter,
  SocialLinks,
  BackToTop
};

// Form modules
export { FormValidator, ContactForm };

// Portfolio builder
export { PortfolioBuilder };

// ---------------------------------------------------------------------------
// Configuration & helpers
// ---------------------------------------------------------------------------

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
        ResponsiveContainer,
        Navbar,
        Footer,
        HeroSection,
        StatsCounter,
        SocialLinks,
        BackToTop
      };

      const ComponentClass = components[type];
      if (!ComponentClass) {
        throw new Error(`Unknown component type: ${type}`);
      }

      return new ComponentClass({ ...options, config: mergedConfig });
    }
  };
}

/**
 * Convenience function that creates a PortfolioBuilder and builds
 * the portfolio in a single call.
 *
 * @param {Object} config - Portfolio configuration (see PortfolioBuilder)
 * @returns {PortfolioBuilder} The built portfolio instance
 *
 * @example
 * const portfolio = createPortfolio({
 *   target: '#app',
 *   name: 'Jane Doe',
 *   theme: 'developer',
 *   hero: { headline: 'I build things' },
 *   projects: [{ title: 'My App', description: 'Cool stuff' }]
 * });
 */
export function createPortfolio(config = {}) {
  const builder = new PortfolioBuilder(config);
  return builder.build();
}

// Default export for convenience
export default {
  init,
  createPortfolio,
  defaultConfig
};
