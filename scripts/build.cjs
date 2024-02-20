#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const srcDir = path.resolve(__dirname, '..', 'src');
const distDir = path.resolve(__dirname, '..', 'dist');

// Ensure dist directory exists
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Modules in dependency order
const modules = [
  'core/EventEmitter.js',
  'core/ComponentUtils.js',
  'core/AnimationUtils.js',
  'core/Component.js',
  'core/AnimationController.js',
  'core/ScrollAnimator.js',
  'responsive/BreakpointManager.js',
  'responsive/ResponsiveContainer.js',
  'theme/ThemeManager.js',
  'theme/ThemeToggle.js',
  'components/ProjectCard.js',
  'components/ProjectGrid.js',
  'components/SkillBar.js',
  'components/SkillGroup.js',
  'components/TimelineEntry.js',
  'components/Timeline.js',
  'components/HeroSection.js',
  'components/StatsCounter.js',
  'components/SocialLinks.js',
  'components/Navbar.js',
  'components/Footer.js',
  'components/BackToTop.js',
  'forms/FormValidator.js',
  'forms/ContactForm.js',
  'theme/presets.js',
  'portfolio/PortfolioBuilder.js',
];

// Public API — classes to expose on the FolioCraft namespace
const publicExports = [
  'EventEmitter',
  'Component',
  'ComponentUtils',
  'AnimationController',
  'AnimationState',
  'ScrollAnimator',
  'BreakpointManager',
  'ResponsiveContainer',
  'ThemeManager',
  'ThemeToggle',
  'ProjectCard',
  'ProjectGrid',
  'SkillBar',
  'SkillGroup',
  'TimelineEntry',
  'Timeline',
  'FormValidator',
  'ContactForm',
  'HeroSection',
  'StatsCounter',
  'SocialLinks',
  'Navbar',
  'Footer',
  'BackToTop',
  'PortfolioBuilder',
  'themePresets',
  'themePresetsDark',
  'easings',
];

let bundle = `/**
 * FolioCraft v1.0.0
 * A lightweight JavaScript library for building interactive,
 * responsive portfolio sections with zero dependencies.
 * MIT License
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global.FolioCraft = {}));
}(this, function (exports) {
  'use strict';

`;

for (const mod of modules) {
  const filePath = path.join(srcDir, mod);
  if (!fs.existsSync(filePath)) {
    console.warn(`  Warning: ${mod} not found, skipping`);
    continue;
  }

  let content = fs.readFileSync(filePath, 'utf-8');

  // Strip import statements
  content = content.replace(/^\s*import\s+.*?from\s+['"].*?['"]\s*;?\s*$/gm, '');

  // Strip export default statements (keep the value)
  content = content.replace(/^\s*export\s+default\s+(?:class|function)\s+/gm, 'class ');
  content = content.replace(/^\s*export\s+default\s+\w+\s*;\s*$/gm, '');
  content = content.replace(/^\s*export\s+default\s+/gm, '');

  // Strip named re-export blocks: export { ... } or export { ... } from '...'
  content = content.replace(/^\s*export\s+\{[^}]*\}\s*(from\s+['"].*?['"])?\s*;?\s*$/gm, '');

  // Strip export keyword from declarations (export class, export function, export const)
  content = content.replace(/^\s*export\s+(class|function|const|let|var)\s+/gm, '$1 ');

  bundle += `  // --- ${mod} ---\n${content}\n\n`;
}

// Add init function and config
bundle += `
  // --- init ---
  const defaultConfig = {
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

  function init(config = {}) {
    const mergedConfig = { ...defaultConfig, ...config };

    if (typeof window !== 'undefined' && window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      mergedConfig.reducedMotion = true;
    }

    return {
      config: mergedConfig,
      version: '1.0.0',
      create(type, options) {
        const components = {
          ProjectCard, ProjectGrid, SkillBar, SkillGroup,
          TimelineEntry, Timeline, ContactForm,
          ThemeToggle, ResponsiveContainer
        };
        const ComponentClass = components[type];
        if (!ComponentClass) {
          throw new Error('Unknown component type: ' + type);
        }
        return new ComponentClass({ ...options, config: mergedConfig });
      }
    };
  }

`;

// Export all public classes
bundle += `  // --- Public API ---\n`;
bundle += `  exports.init = init;\n`;
bundle += `  exports.defaultConfig = defaultConfig;\n`;
for (const name of publicExports) {
  bundle += `  exports.${name} = ${name};\n`;
}

bundle += `\n}));\n`;

const outPath = path.join(distDir, 'foliocraft.js');
fs.writeFileSync(outPath, bundle);
const sizeKB = (Buffer.byteLength(bundle) / 1024).toFixed(1);
console.log(`  Built ${outPath} (${sizeKB} KB)`);

// Copy CSS if it exists
const cssSource = path.join(srcDir, 'styles', 'foliocraft.css');
const cssDest = path.join(distDir, 'foliocraft.css');
if (fs.existsSync(cssSource)) {
  fs.copyFileSync(cssSource, cssDest);
  const cssSizeKB = (fs.statSync(cssDest).size / 1024).toFixed(1);
  console.log(`  Copied ${cssDest} (${cssSizeKB} KB)`);
} else {
  console.warn('  Warning: src/styles/foliocraft.css not found, skipping CSS');
}

console.log('\nBuild complete!');
