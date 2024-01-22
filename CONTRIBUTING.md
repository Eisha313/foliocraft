# Contributing to FolioCraft

Thank you for your interest in contributing to FolioCraft! This document provides guidelines and information about contributing.

## Code of Conduct

By participating in this project, you agree to maintain a welcoming, inclusive, and harassment-free environment for everyone.

## How to Contribute

### Reporting Bugs

1. Check existing issues to avoid duplicates
2. Use the bug report template
3. Include:
   - Clear description of the issue
   - Steps to reproduce
   - Expected vs actual behavior
   - Browser and OS information
   - Code samples if applicable

### Suggesting Features

1. Check existing feature requests
2. Use the feature request template
3. Describe the use case and benefits
4. Consider backwards compatibility

### Pull Requests

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Make your changes
4. Write/update tests
5. Update documentation if needed
6. Run linting: `npm run lint`
7. Run tests: `npm test`
8. Commit with conventional commits: `feat: add new feature`
9. Push and create a PR

## Development Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/foliocraft.git
cd foliocraft

# Install dependencies
npm install

# Start development
npm run dev

# Run tests
npm test

# Build
npm run build
```

## Code Style

- Use ES6+ features
- Follow existing code patterns
- Use meaningful variable/function names
- Add JSDoc comments for public APIs
- Keep functions small and focused

### Example Component

```javascript
/**
 * MyComponent - Description of what it does
 * @extends Component
 */
export class MyComponent extends Component {
  /**
   * Create a MyComponent instance
   * @param {Object} options - Configuration options
   * @param {string} options.title - The component title
   * @param {boolean} [options.animate=true] - Enable animations
   */
  constructor(options = {}) {
    super(options);
    this.title = options.title || 'Default';
    this.animate = options.animate !== false;
  }

  /**
   * Render the component HTML
   * @returns {string} HTML string
   */
  render() {
    return `
      <div class="fc-my-component ${this.options.className || ''}">
        <h3>${this.escapeHtml(this.title)}</h3>
      </div>
    `;
  }
}
```

## Commit Messages

We use [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `style:` Code style changes (formatting)
- `refactor:` Code refactoring
- `test:` Adding/updating tests
- `chore:` Maintenance tasks

## Testing

- Write tests for new features
- Maintain existing test coverage
- Test across browsers when possible

## Documentation

- Update README.md if needed
- Add JSDoc comments
- Update API docs for new features
- Include code examples

## Questions?

Feel free to open an issue for questions or join our discussions.

Thank you for contributing! 🎉
