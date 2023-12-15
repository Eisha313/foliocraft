# FolioCraft

A lightweight JavaScript library for building interactive, responsive portfolio sections with zero dependencies.

## Features

- **Modular Components**: Project cards, skill bars, timeline entries
- **Responsive Design**: Built-in breakpoint handling with customizable thresholds
- **Scroll Animations**: Intersection Observer-powered reveal effects
- **Theme System**: CSS custom properties for easy color scheme switching
- **Form Builder**: Lightweight contact forms with validation

## Installation

```bash
npm install foliocraft
```

Or include directly in your HTML:

```html
<script src="dist/foliocraft.min.js"></script>
```

## Usage

### Initialize FolioCraft

```javascript
import FolioCraft from 'foliocraft';

const portfolio = new FolioCraft({
  theme: 'dark',
  breakpoints: { mobile: 480, tablet: 768, desktop: 1024 }
});
```

### Project Cards

```javascript
portfolio.createProjectCard({
  container: '#projects',
  title: 'My Project',
  description: 'A cool project description',
  image: '/images/project.jpg',
  tags: ['JavaScript', 'CSS'],
  link: 'https://example.com'
});
```

### Skill Bars

```javascript
portfolio.createSkillBar({
  container: '#skills',
  skill: 'JavaScript',
  level: 85,
  animated: true
});
```

### Timeline

```javascript
portfolio.createTimelineEntry({
  container: '#timeline',
  date: '2023',
  title: 'Senior Developer',
  description: 'Led team of 5 developers'
});
```

### Contact Form

```javascript
portfolio.createContactForm({
  container: '#contact',
  fields: ['name', 'email', 'message'],
  onSubmit: (data) => console.log(data)
});
```

## Development

```bash
npm install
npm run dev    # Start development
npm run build  # Build for production
npm test       # Run tests
```

## License

MIT