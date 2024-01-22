# FolioCraft API Documentation

Complete API reference for FolioCraft library.

## Table of Contents

- [Core](#core)
  - [Component](#component)
  - [EventEmitter](#eventemitter)
  - [ScrollAnimator](#scrollanimator)
  - [AnimationUtils](#animationutils)
- [Components](#components)
  - [ProjectCard](#projectcard)
  - [ProjectGrid](#projectgrid)
  - [SkillBar](#skillbar)
  - [SkillGroup](#skillgroup)
  - [TimelineEntry](#timelineentry)
  - [Timeline](#timeline)
- [Theme](#theme)
  - [ThemeManager](#thememanager)
  - [ThemeToggle](#themetoggle)
- [Responsive](#responsive)
  - [BreakpointManager](#breakpointmanager)
  - [ResponsiveContainer](#responsivecontainer)
- [Forms](#forms)
  - [FormValidator](#formvalidator)
  - [ContactForm](#contactform)

---

## Core

### Component

Base class for all FolioCraft components.

```javascript
import { Component } from 'foliocraft';

class MyComponent extends Component {
  constructor(options) {
    super(options);
  }

  render() {
    return '<div class="my-component">Content</div>';
  }
}
```

#### Constructor Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `container` | `HTMLElement\|string` | `null` | Container element or selector |
| `className` | `string` | `''` | Additional CSS classes |
| `animate` | `boolean` | `true` | Enable animations |

#### Methods

- `render()` - Returns HTML string for the component
- `mount(container)` - Mounts component to DOM
- `unmount()` - Removes component from DOM
- `update(options)` - Updates component with new options
- `destroy()` - Cleans up component and removes event listeners

---

### EventEmitter

Event handling mixin for components.

```javascript
import { EventEmitter } from 'foliocraft';

const emitter = new EventEmitter();

emitter.on('customEvent', (data) => {
  console.log('Event received:', data);
});

emitter.emit('customEvent', { message: 'Hello!' });
```

#### Methods

- `on(event, callback)` - Subscribe to an event
- `off(event, callback)` - Unsubscribe from an event
- `emit(event, ...args)` - Emit an event with data
- `once(event, callback)` - Subscribe to event once

---

### ScrollAnimator

Intersection Observer-powered scroll animations.

```javascript
import { ScrollAnimator } from 'foliocraft';

const animator = new ScrollAnimator({
  threshold: 0.2,
  rootMargin: '0px',
  animationClass: 'fc-animate-in'
});

animator.observe('.animate-on-scroll');
```

#### Constructor Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `threshold` | `number` | `0.1` | Visibility threshold (0-1) |
| `rootMargin` | `string` | `'0px'` | Root margin for observer |
| `animationClass` | `string` | `'fc-visible'` | Class added when visible |
| `once` | `boolean` | `true` | Animate only once |

#### Methods

- `observe(selector)` - Start observing elements
- `unobserve(element)` - Stop observing an element
- `disconnect()` - Disconnect observer entirely

---

### AnimationUtils

Utility functions for animations.

```javascript
import { AnimationUtils } from 'foliocraft';

// Easing functions
AnimationUtils.easeOutCubic(0.5); // 0.875

// Animate value
AnimationUtils.animate({
  from: 0,
  to: 100,
  duration: 500,
  onUpdate: (value) => console.log(value)
});
```

---

## Components

### ProjectCard

Displays a single portfolio project.

```javascript
import { ProjectCard } from 'foliocraft';

const card = new ProjectCard({
  title: 'My Project',
  description: 'A cool project I built',
  image: '/images/project.jpg',
  tags: ['JavaScript', 'CSS'],
  links: {
    demo: 'https://demo.example.com',
    github: 'https://github.com/user/project'
  }
});

card.mount('#projects');
```

#### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `title` | `string` | `''` | Project title |
| `description` | `string` | `''` | Project description |
| `image` | `string` | `null` | Image URL |
| `tags` | `array` | `[]` | Technology tags |
| `links` | `object` | `{}` | Project links |
| `featured` | `boolean` | `false` | Featured project flag |

---

### ProjectGrid

Responsive grid of project cards.

```javascript
import { ProjectGrid } from 'foliocraft';

const grid = new ProjectGrid({
  projects: [...],
  columns: { mobile: 1, tablet: 2, desktop: 3 },
  gap: '2rem',
  filterable: true
});

grid.mount('#project-grid');
grid.filter('JavaScript'); // Filter by tag
```

---

### SkillBar

Animated skill progress bar.

```javascript
import { SkillBar } from 'foliocraft';

const skill = new SkillBar({
  name: 'JavaScript',
  level: 90,
  color: '#f7df1e',
  animateOnScroll: true
});

skill.mount('#skills');
```

---

### SkillGroup

Group of related skill bars.

```javascript
import { SkillGroup } from 'foliocraft';

const group = new SkillGroup({
  title: 'Frontend',
  skills: [
    { name: 'JavaScript', level: 90 },
    { name: 'CSS', level: 85 },
    { name: 'React', level: 80 }
  ]
});

group.mount('#skill-groups');
```

---

### Timeline

Vertical timeline for experience/education.

```javascript
import { Timeline } from 'foliocraft';

const timeline = new Timeline({
  entries: [
    {
      date: '2023 - Present',
      title: 'Senior Developer',
      organization: 'Tech Corp',
      description: 'Leading frontend team'
    }
  ],
  alternating: true
});

timeline.mount('#experience');
```

---

## Theme

### ThemeManager

Manages color themes using CSS custom properties.

```javascript
import { ThemeManager } from 'foliocraft';

const themes = new ThemeManager({
  defaultTheme: 'light',
  themes: {
    light: {
      '--fc-bg-primary': '#ffffff',
      '--fc-text-primary': '#1a1a1a'
    },
    dark: {
      '--fc-bg-primary': '#1a1a1a',
      '--fc-text-primary': '#ffffff'
    }
  },
  persist: true
});

themes.setTheme('dark');
themes.toggle();
```

---

### ThemeToggle

UI component for theme switching.

```javascript
import { ThemeToggle } from 'foliocraft';

const toggle = new ThemeToggle({
  themeManager: themes,
  icons: { light: '☀️', dark: '🌙' }
});

toggle.mount('#theme-toggle');
```

---

## Responsive

### BreakpointManager

Manages responsive breakpoints.

```javascript
import { BreakpointManager } from 'foliocraft';

const breakpoints = new BreakpointManager({
  mobile: 0,
  tablet: 768,
  desktop: 1024,
  wide: 1440
});

breakpoints.on('change', (breakpoint) => {
  console.log('Current breakpoint:', breakpoint);
});

breakpoints.current; // 'desktop'
breakpoints.isMobile(); // false
```

---

## Forms

### ContactForm

Pre-built contact form with validation.

```javascript
import { ContactForm } from 'foliocraft';

const form = new ContactForm({
  fields: ['name', 'email', 'message'],
  onSubmit: async (data) => {
    await fetch('/api/contact', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },
  successMessage: 'Thanks for reaching out!'
});

form.mount('#contact');
```

---

### FormValidator

Custom validation rules.

```javascript
import { FormValidator } from 'foliocraft';

const validator = new FormValidator({
  rules: {
    email: [
      { type: 'required', message: 'Email is required' },
      { type: 'email', message: 'Invalid email format' }
    ],
    message: [
      { type: 'required', message: 'Message is required' },
      { type: 'minLength', value: 10, message: 'Minimum 10 characters' }
    ]
  }
});

const result = validator.validate({ email: 'test@example.com', message: 'Hi' });
// { valid: false, errors: { message: 'Minimum 10 characters' } }
```
