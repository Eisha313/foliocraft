# Getting Started with FolioCraft

This guide will help you set up FolioCraft and build your first interactive portfolio section.

## Installation

### NPM

```bash
npm install foliocraft
```

### CDN

```html
<script src="https://unpkg.com/foliocraft@latest/dist/foliocraft.min.js"></script>
```

## Quick Start

### 1. Import FolioCraft

```javascript
// ES Modules
import FolioCraft from 'foliocraft';

// Or import specific components
import { ProjectGrid, SkillGroup, Timeline, ContactForm } from 'foliocraft';
```

### 2. Set Up Your HTML

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Portfolio</title>
  <link rel="stylesheet" href="node_modules/foliocraft/dist/foliocraft.css">
</head>
<body>
  <section id="projects"></section>
  <section id="skills"></section>
  <section id="experience"></section>
  <section id="contact"></section>

  <script type="module" src="./portfolio.js"></script>
</body>
</html>
```

### 3. Create Your Portfolio (portfolio.js)

```javascript
import {
  ProjectGrid,
  SkillGroup,
  Timeline,
  ContactForm,
  ThemeManager,
  ThemeToggle,
  ScrollAnimator
} from 'foliocraft';

// Initialize scroll animations
const animator = new ScrollAnimator({
  threshold: 0.2,
  once: true
});

animator.observe('.fc-component');

// Set up theme switching
const themeManager = new ThemeManager({
  defaultTheme: 'light',
  persist: true
});

const toggle = new ThemeToggle({ themeManager });
toggle.mount('#theme-toggle');

// Projects Section
const projects = new ProjectGrid({
  projects: [
    {
      title: 'E-Commerce Platform',
      description: 'Full-stack online store with payment integration',
      image: '/images/ecommerce.jpg',
      tags: ['React', 'Node.js', 'Stripe'],
      links: {
        demo: 'https://store.example.com',
        github: 'https://github.com/you/store'
      },
      featured: true
    },
    {
      title: 'Weather App',
      description: 'Real-time weather with beautiful visualizations',
      image: '/images/weather.jpg',
      tags: ['Vue.js', 'D3.js', 'API'],
      links: {
        demo: 'https://weather.example.com'
      }
    },
    // Add more projects...
  ],
  filterable: true,
  columns: { mobile: 1, tablet: 2, desktop: 3 }
});

projects.mount('#projects');

// Skills Section
const frontendSkills = new SkillGroup({
  title: 'Frontend Development',
  skills: [
    { name: 'JavaScript', level: 95 },
    { name: 'TypeScript', level: 85 },
    { name: 'React', level: 90 },
    { name: 'CSS/Sass', level: 88 }
  ]
});

const backendSkills = new SkillGroup({
  title: 'Backend Development',
  skills: [
    { name: 'Node.js', level: 85 },
    { name: 'Python', level: 75 },
    { name: 'PostgreSQL', level: 80 }
  ]
});

frontendSkills.mount('#skills');
backendSkills.mount('#skills');

// Experience Timeline
const experience = new Timeline({
  entries: [
    {
      date: '2022 - Present',
      title: 'Senior Frontend Developer',
      organization: 'Tech Startup Inc.',
      description: 'Leading the frontend team, implementing new features, and mentoring junior developers.',
      type: 'work'
    },
    {
      date: '2020 - 2022',
      title: 'Frontend Developer',
      organization: 'Digital Agency',
      description: 'Built responsive web applications for various clients using React and Vue.js.',
      type: 'work'
    },
    {
      date: '2016 - 2020',
      title: 'Computer Science Degree',
      organization: 'State University',
      description: 'Bachelor of Science in Computer Science with focus on web technologies.',
      type: 'education'
    }
  ],
  alternating: true
});

experience.mount('#experience');

// Contact Form
const contactForm = new ContactForm({
  fields: ['name', 'email', 'subject', 'message'],
  onSubmit: async (data) => {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) throw new Error('Failed to send');
    return response.json();
  },
  successMessage: 'Thanks! I\'ll get back to you soon.',
  errorMessage: 'Oops! Something went wrong. Please try again.'
});

contactForm.mount('#contact');
```

## Customizing Styles

FolioCraft uses CSS custom properties for easy theming:

```css
:root {
  /* Colors */
  --fc-primary: #6366f1;
  --fc-secondary: #8b5cf6;
  --fc-bg-primary: #ffffff;
  --fc-bg-secondary: #f8fafc;
  --fc-text-primary: #1e293b;
  --fc-text-secondary: #64748b;
  
  /* Spacing */
  --fc-spacing-sm: 0.5rem;
  --fc-spacing-md: 1rem;
  --fc-spacing-lg: 2rem;
  
  /* Border Radius */
  --fc-radius-sm: 4px;
  --fc-radius-md: 8px;
  --fc-radius-lg: 16px;
  
  /* Transitions */
  --fc-transition-fast: 150ms ease;
  --fc-transition-normal: 300ms ease;
}
```

## Next Steps

- Check out the [API Documentation](./API.md) for detailed component options
- View [Examples](./examples/) for complete portfolio implementations
- Learn about [Accessibility](./ACCESSIBILITY.md) best practices

## Browser Support

FolioCraft supports all modern browsers:

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

For older browsers, consider using polyfills for Intersection Observer and CSS Custom Properties.
