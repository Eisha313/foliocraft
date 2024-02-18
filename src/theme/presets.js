/**
 * Theme Presets - Curated color schemes for FolioCraft portfolios
 * Each preset defines all CSS custom properties used by ThemeManager.
 */

/**
 * Light-mode theme presets
 * @type {Object.<string, Object.<string, string>>}
 */
export const themePresets = {
  /**
   * Minimal - Clean whites, soft grays, thin borders.
   * A restrained palette that puts content front and center.
   */
  minimal: {
    '--fc-primary': '#111827',
    '--fc-primary-dark': '#030712',
    '--fc-secondary': '#6b7280',
    '--fc-secondary-dark': '#4b5563',
    '--fc-accent': '#3b82f6',
    '--fc-background': '#ffffff',
    '--fc-surface': '#f9fafb',
    '--fc-text': '#111827',
    '--fc-text-muted': '#9ca3af',
    '--fc-border': '#e5e7eb',
    '--fc-shadow': 'rgba(0, 0, 0, 0.05)',
    '--fc-overlay': 'rgba(0, 0, 0, 0.4)'
  },

  /**
   * Developer - GitHub-dark inspired with blue primary and green accents.
   * Feels right at home next to a terminal.
   */
  developer: {
    '--fc-primary': '#58a6ff',
    '--fc-primary-dark': '#1f6feb',
    '--fc-secondary': '#3fb950',
    '--fc-secondary-dark': '#238636',
    '--fc-accent': '#f78166',
    '--fc-background': '#0d1117',
    '--fc-surface': '#161b22',
    '--fc-text': '#c9d1d9',
    '--fc-text-muted': '#8b949e',
    '--fc-border': '#30363d',
    '--fc-shadow': 'rgba(0, 0, 0, 0.4)',
    '--fc-overlay': 'rgba(0, 0, 0, 0.7)'
  },

  /**
   * Bold - Vibrant purple primary with strong shadows.
   * Makes a statement for portfolios that demand attention.
   */
  bold: {
    '--fc-primary': '#8b5cf6',
    '--fc-primary-dark': '#7c3aed',
    '--fc-secondary': '#ec4899',
    '--fc-secondary-dark': '#db2777',
    '--fc-accent': '#f59e0b',
    '--fc-background': '#faf5ff',
    '--fc-surface': '#f3e8ff',
    '--fc-text': '#1e1b4b',
    '--fc-text-muted': '#6b7280',
    '--fc-border': '#e9d5ff',
    '--fc-shadow': 'rgba(139, 92, 246, 0.15)',
    '--fc-overlay': 'rgba(30, 27, 75, 0.6)'
  },

  /**
   * Creative - Warm amber tones with playful energy.
   * Ideal for designers, artists, and creative professionals.
   */
  creative: {
    '--fc-primary': '#f59e0b',
    '--fc-primary-dark': '#d97706',
    '--fc-secondary': '#ef4444',
    '--fc-secondary-dark': '#dc2626',
    '--fc-accent': '#10b981',
    '--fc-background': '#fffbeb',
    '--fc-surface': '#fef3c7',
    '--fc-text': '#451a03',
    '--fc-text-muted': '#92400e',
    '--fc-border': '#fde68a',
    '--fc-shadow': 'rgba(245, 158, 11, 0.12)',
    '--fc-overlay': 'rgba(69, 26, 3, 0.5)'
  },

  /**
   * Elegant - Refined gold accents with subtle, sophisticated tones.
   * For portfolios that convey professionalism and polish.
   */
  elegant: {
    '--fc-primary': '#b8860b',
    '--fc-primary-dark': '#996f09',
    '--fc-secondary': '#78716c',
    '--fc-secondary-dark': '#57534e',
    '--fc-accent': '#0d9488',
    '--fc-background': '#fefce8',
    '--fc-surface': '#fefdf0',
    '--fc-text': '#1c1917',
    '--fc-text-muted': '#78716c',
    '--fc-border': '#e7e5e4',
    '--fc-shadow': 'rgba(184, 134, 11, 0.1)',
    '--fc-overlay': 'rgba(28, 25, 23, 0.5)'
  }
};

/**
 * Dark-mode variants of each theme preset
 * @type {Object.<string, Object.<string, string>>}
 */
export const themePresetsDark = {
  /**
   * Minimal Dark - Crisp monochrome on a deep background.
   */
  minimal: {
    '--fc-primary': '#f9fafb',
    '--fc-primary-dark': '#e5e7eb',
    '--fc-secondary': '#9ca3af',
    '--fc-secondary-dark': '#6b7280',
    '--fc-accent': '#60a5fa',
    '--fc-background': '#111827',
    '--fc-surface': '#1f2937',
    '--fc-text': '#f9fafb',
    '--fc-text-muted': '#9ca3af',
    '--fc-border': '#374151',
    '--fc-shadow': 'rgba(0, 0, 0, 0.3)',
    '--fc-overlay': 'rgba(0, 0, 0, 0.7)'
  },

  /**
   * Developer Dark - Already dark by default; deepened further with
   * slightly richer tones.
   */
  developer: {
    '--fc-primary': '#79c0ff',
    '--fc-primary-dark': '#58a6ff',
    '--fc-secondary': '#56d364',
    '--fc-secondary-dark': '#3fb950',
    '--fc-accent': '#ffa198',
    '--fc-background': '#010409',
    '--fc-surface': '#0d1117',
    '--fc-text': '#e6edf3',
    '--fc-text-muted': '#7d8590',
    '--fc-border': '#21262d',
    '--fc-shadow': 'rgba(0, 0, 0, 0.5)',
    '--fc-overlay': 'rgba(0, 0, 0, 0.8)'
  },

  /**
   * Bold Dark - Deep purple backdrop with vivid highlights.
   */
  bold: {
    '--fc-primary': '#a78bfa',
    '--fc-primary-dark': '#8b5cf6',
    '--fc-secondary': '#f472b6',
    '--fc-secondary-dark': '#ec4899',
    '--fc-accent': '#fbbf24',
    '--fc-background': '#0f0a1e',
    '--fc-surface': '#1a1333',
    '--fc-text': '#ede9fe',
    '--fc-text-muted': '#a5b4fc',
    '--fc-border': '#312e81',
    '--fc-shadow': 'rgba(139, 92, 246, 0.25)',
    '--fc-overlay': 'rgba(15, 10, 30, 0.8)'
  },

  /**
   * Creative Dark - Warm amber glow against a dark canvas.
   */
  creative: {
    '--fc-primary': '#fbbf24',
    '--fc-primary-dark': '#f59e0b',
    '--fc-secondary': '#f87171',
    '--fc-secondary-dark': '#ef4444',
    '--fc-accent': '#34d399',
    '--fc-background': '#1a1207',
    '--fc-surface': '#27200e',
    '--fc-text': '#fef3c7',
    '--fc-text-muted': '#d97706',
    '--fc-border': '#3d3316',
    '--fc-shadow': 'rgba(245, 158, 11, 0.2)',
    '--fc-overlay': 'rgba(26, 18, 7, 0.8)'
  },

  /**
   * Elegant Dark - Gold accents on a deep, warm charcoal.
   */
  elegant: {
    '--fc-primary': '#d4a017',
    '--fc-primary-dark': '#b8860b',
    '--fc-secondary': '#a8a29e',
    '--fc-secondary-dark': '#78716c',
    '--fc-accent': '#2dd4bf',
    '--fc-background': '#1c1917',
    '--fc-surface': '#292524',
    '--fc-text': '#fef3c7',
    '--fc-text-muted': '#a8a29e',
    '--fc-border': '#44403c',
    '--fc-shadow': 'rgba(184, 134, 11, 0.2)',
    '--fc-overlay': 'rgba(28, 25, 23, 0.8)'
  }
};

/**
 * Default export combining both light and dark preset collections.
 */
export default {
  themePresets,
  themePresetsDark
};
