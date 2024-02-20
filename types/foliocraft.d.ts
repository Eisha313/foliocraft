/**
 * FolioCraft — Type Definitions
 * A zero-dependency vanilla JavaScript component library for portfolio websites.
 */

// ─── Core ────────────────────────────────────────────────────────────

export class EventEmitter {
  on(event: string, callback: (...args: any[]) => void): this;
  once(event: string, callback: (...args: any[]) => void): this;
  off(event: string, callback: (...args: any[]) => void): this;
  emit(event: string, ...args: any[]): this;
  removeAllListeners(event?: string): this;
  listenerCount(event: string): number;
  eventNames(): string[];
}

export class Component extends EventEmitter {
  element: HTMLElement | null;
  container: HTMLElement | null;
  mounted: boolean;
  state: Record<string, any>;
  id: string;

  constructor(options?: Record<string, any>);
  setContainer(container: HTMLElement | string): this;
  setState(newState: Record<string, any>): this;
  createElement(tag?: string, options?: { className?: string; html?: string; attributes?: Record<string, string> }): HTMLElement;
  mount(): this;
  unmount(): this;
  update(): this;
  render(): HTMLElement | string;
  destroy(): void;
}

export class ScrollAnimator extends EventEmitter {
  constructor(options?: ScrollAnimatorOptions);
  observe(element: HTMLElement, callback?: (el: HTMLElement) => void): this;
  unobserve(element: HTMLElement): this;
  observeAll(selector: string, context?: Document | HTMLElement): this;
  reset(): this;
  refresh(): this;
  destroy(): void;
}

export interface ScrollAnimatorOptions {
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
  animationClass?: string;
}

export class BreakpointManager extends EventEmitter {
  constructor(options?: { breakpoints?: Record<string, number> });
  getCurrent(): string;
  getCurrentBreakpoint(): string;
  getWidth(): number;
  is(breakpoint: string): boolean;
  isAtLeast(breakpoint: string): boolean;
  isAtMost(breakpoint: string): boolean;
  isBetween(min: string, max: string): boolean;
  addBreakpoint(name: string, width: number): this;
  removeBreakpoint(name: string): this;
  getBreakpoints(): Record<string, number>;
  destroy(): void;
}

// ─── Components ──────────────────────────────────────────────────────

export interface ProjectCardOptions {
  title?: string;
  description?: string;
  image?: string | null;
  tags?: string[];
  links?: { demo?: string; source?: string; caseStudy?: string };
  featured?: boolean;
  lazyLoad?: boolean;
}

export class ProjectCard extends Component {
  constructor(options?: ProjectCardOptions);
  render(): HTMLElement;
  reveal(): Promise<void>;
  update(newConfig: Partial<ProjectCardOptions>): this;
  destroy(): void;
}

export interface SkillBarOptions {
  name?: string;
  level?: number;
  category?: string;
  icon?: string;
  color?: string;
  showPercentage?: boolean;
  animate?: boolean;
  animationDuration?: number;
  animationEasing?: string;
}

export class SkillBar extends Component {
  constructor(options?: SkillBarOptions);
  render(): HTMLElement;
  updateLevel(newLevel: number, animate?: boolean): void;
  animateProgress(): void;
  destroy(): void;
}

export interface SkillGroupOptions {
  title?: string;
  skills?: SkillBarOptions[];
  layout?: 'vertical' | 'grid';
  columns?: number;
  staggerAnimation?: boolean;
  staggerDelay?: number;
  skillDefaults?: Partial<SkillBarOptions>;
}

export class SkillGroup extends Component {
  skillBars: SkillBar[];
  constructor(options?: SkillGroupOptions);
  render(): HTMLElement;
  addSkill(config: SkillBarOptions): SkillBar;
  removeSkill(name: string): boolean;
  getSkill(name: string): SkillBar | null;
  updateSkills(newSkills: SkillBarOptions[]): void;
  sortByLevel(order?: 'asc' | 'desc'): void;
  sortAlphabetically(order?: 'asc' | 'desc'): void;
  filterByLevel(minLevel: number): void;
  resetFilter(): void;
  destroy(): void;
}

export interface TimelineEntryOptions {
  title?: string;
  subtitle?: string;
  date?: string;
  dateEnd?: string | null;
  description?: string;
  tags?: string[];
  icon?: string | null;
  link?: string | null;
  dotColor?: string | null;
  highlighted?: boolean;
}

export interface TimelineOptions {
  entries?: TimelineEntryOptions[];
  layout?: 'alternating' | 'left' | 'right';
  animated?: boolean;
  animationDelay?: number;
  lineColor?: string | null;
  compact?: boolean;
}

export class Timeline extends Component {
  constructor(options?: TimelineOptions);
  render(): HTMLElement;
  mount(container: string | HTMLElement): this;
  addEntry(options: TimelineEntryOptions): any;
  removeEntry(index: number): any;
  clearEntries(): this;
  destroy(): void;
}

export interface HeroSectionOptions {
  headline?: string;
  subheadline?: string;
  description?: string;
  avatar?: string | null;
  cta?: { text: string; href: string; secondary?: { text: string; href: string } } | null;
  socials?: Array<{ platform: string; url: string; label?: string }>;
  layout?: 'centered' | 'split' | 'minimal';
  animated?: boolean;
}

export class HeroSection extends Component {
  constructor(options?: HeroSectionOptions);
  render(): HTMLElement;
  destroy(): void;
}

export interface StatsCounterOptions {
  stats?: Array<{ value: number; label: string; prefix?: string; suffix?: string }>;
  animated?: boolean;
  duration?: number;
  layout?: 'row' | 'grid';
  columns?: number;
}

export class StatsCounter extends Component {
  constructor(options?: StatsCounterOptions);
  render(): HTMLElement;
  destroy(): void;
}

export interface SocialLinksOptions {
  links?: Array<{ platform: string; url: string; label?: string }>;
  size?: 'sm' | 'md' | 'lg';
  style?: 'filled' | 'outline' | 'ghost';
}

export class SocialLinks extends Component {
  constructor(options?: SocialLinksOptions);
  render(): HTMLElement;
}

export interface NavbarOptions {
  brand?: string;
  links?: Array<{ text: string; href: string }>;
  themeToggle?: boolean;
  sticky?: boolean;
  transparent?: boolean;
}

export class Navbar extends Component {
  constructor(options?: NavbarOptions);
  render(): HTMLElement;
  getThemeSlot(): HTMLElement;
  destroy(): void;
}

export interface FooterOptions {
  brand?: string;
  tagline?: string;
  links?: Array<{ text: string; href: string }>;
  socials?: Array<{ platform: string; url: string }>;
  copyright?: string | null;
  badge?: boolean;
}

export class Footer extends Component {
  constructor(options?: FooterOptions);
  render(): HTMLElement;
}

export class BackToTop extends Component {
  constructor(options?: { threshold?: number; smooth?: boolean });
  render(): HTMLElement;
  destroy(): void;
}

// ─── Forms ───────────────────────────────────────────────────────────

export interface FormFieldConfig {
  name: string;
  type?: 'text' | 'email' | 'textarea' | 'select';
  label?: string;
  placeholder?: string;
  required?: boolean;
  email?: boolean;
  phone?: boolean;
  url?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp | string;
  patternMessage?: string;
  custom?: (value: any) => true | string;
  rows?: number;
  options?: Array<{ value: string; label: string }>;
  autocomplete?: string;
}

export interface ContactFormOptions {
  fields?: FormFieldConfig[];
  submitLabel?: string;
  onSubmit?: (data: Record<string, string>) => Promise<void>;
  showLabels?: boolean;
  inlineErrors?: boolean;
  successMessage?: string;
  errorMessage?: string;
}

export class ContactForm extends Component {
  constructor(options?: ContactFormOptions);
  render(): HTMLElement;
  validateField(fieldName: string): boolean;
  reset(): void;
  getData(): Record<string, string>;
  setData(data: Record<string, string>): void;
  destroy(): void;
}

export class FormValidator {
  constructor();
  addRules(fieldName: string, rules: Record<string, any>): void;
  removeRules(fieldName: string): void;
  validateValue(value: any, rules: Record<string, any>): { valid: boolean; errors: string[] };
  validateField(fieldName: string, value: any): { valid: boolean; errors: string[] };
  validateAll(data: Record<string, any>): { valid: boolean; fields: Record<string, { valid: boolean; errors: string[] }> };
  setMessages(messages: Partial<Record<string, string>>): void;
  clear(): void;
}

// ─── Theme ───────────────────────────────────────────────────────────

export interface ThemeManagerOptions {
  defaultTheme?: string;
  storageKey?: string;
  respectSystemPreference?: boolean;
  transitionDuration?: number;
}

export class ThemeManager extends EventEmitter {
  constructor(options?: ThemeManagerOptions);
  setTheme(name: string, persist?: boolean): void;
  toggle(): void;
  registerTheme(name: string, properties: Record<string, string>): void;
  setProperty(property: string, value: string): void;
  getProperty(property: string): string;
  getCurrentTheme(): string;
  getAvailableThemes(): string[];
  isDark(): boolean;
  destroy(): void;
}

export class ThemeToggle extends Component {
  constructor(themeManager: ThemeManager, options?: {
    container?: HTMLElement;
    showLabel?: boolean;
    lightIcon?: string;
    darkIcon?: string;
    lightLabel?: string;
    darkLabel?: string;
  });
  destroy(): void;
}

export const themePresets: Record<string, Record<string, string>>;

// ─── Portfolio Builder ───────────────────────────────────────────────

export interface PortfolioConfig {
  target: string | HTMLElement;
  name?: string;
  title?: string;
  theme?: string;
  navbar?: NavbarOptions | false;
  hero?: HeroSectionOptions;
  stats?: Array<{ value: number; label: string; prefix?: string; suffix?: string }>;
  projects?: ProjectCardOptions[];
  skills?: SkillGroupOptions[];
  experience?: TimelineEntryOptions[];
  contact?: ContactFormOptions;
  footer?: FooterOptions | false;
}

export class PortfolioBuilder extends EventEmitter {
  constructor(config: PortfolioConfig);
  build(): this;
  destroy(): void;
  getComponent(name: string): Component | null;
  setTheme(name: string): void;
}

export function createPortfolio(config: PortfolioConfig): PortfolioBuilder;

// ─── Default Export ──────────────────────────────────────────────────

declare const FolioCraft: {
  init(config?: Record<string, any>): any;
  createPortfolio(config: PortfolioConfig): PortfolioBuilder;
  defaultConfig: Record<string, any>;
  themePresets: Record<string, Record<string, string>>;
};

export default FolioCraft;
