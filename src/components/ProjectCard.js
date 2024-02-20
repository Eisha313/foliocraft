import { Component } from '../core/Component.js';
import { withAnimationController } from '../core/AnimationController.js';

/**
 * ProjectCard component with animation controller mixin
 * Displays a single portfolio project with image, title, description, and links
 */
const AnimatedComponent = withAnimationController(Component);

export class ProjectCard extends AnimatedComponent {
  constructor(options = {}) {
    super(options);
    
    this.config = {
      title: options.title || 'Project Title',
      description: options.description || '',
      image: options.image || null,
      tags: options.tags || [],
      links: options.links || {},
      featured: options.featured || false,
      lazyLoad: options.lazyLoad !== false,
      ...options
    };

    this.isRevealed = false;
    this.isHovered = false;
    
    this.setupAnimations();
  }

  setupAnimations() {
    this.registerAnimation('reveal', {
      keyframes: [
        { opacity: 0, transform: 'translateY(30px)' },
        { opacity: 1, transform: 'translateY(0)' }
      ],
      duration: 500,
      easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
    });

    this.registerAnimation('hover', {
      keyframes: [
        { transform: 'translateY(0) scale(1)' },
        { transform: 'translateY(-8px) scale(1.02)' }
      ],
      duration: 200,
      easing: 'ease-out'
    });

    this.registerAnimation('imageZoom', {
      keyframes: [
        { transform: 'scale(1)' },
        { transform: 'scale(1.1)' }
      ],
      duration: 300,
      easing: 'ease-out'
    });
  }

  render() {
    const { title, description, image, tags, links, featured, lazyLoad } = this.config;

    this.element = document.createElement('article');
    this.element.className = `fc-project-card${featured ? ' fc-project-card--featured' : ''}`;
    this.element.setAttribute('role', 'article');
    this.element.setAttribute('aria-label', `Project: ${title}`);
    
    // Start hidden for reveal animation
    this.element.style.opacity = '0';
    this.element.style.transform = 'translateY(30px)';

    let imageHtml;
    if (image) {
      imageHtml = `
        <div class="fc-project-card__image-container">
          <img
            class="fc-project-card__image"
            ${lazyLoad ? `data-src="${image}" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 9'%3E%3C/svg%3E"` : `src="${image}"`}
            alt="${title} preview"
            loading="${lazyLoad ? 'lazy' : 'eager'}"
          />
          <div class="fc-project-card__overlay"></div>
        </div>
      `;
    } else {
      // Generate a deterministic gradient from the title
      const hash = title.split('').reduce((a, c) => ((a << 5) - a + c.charCodeAt(0)) | 0, 0);
      const hue1 = Math.abs(hash % 360);
      const hue2 = (hue1 + 40) % 360;
      imageHtml = `
        <div class="fc-project-card__image-container fc-project-card__placeholder"
             style="background: linear-gradient(135deg, hsl(${hue1}, 70%, 60%), hsl(${hue2}, 80%, 50%));">
          <div class="fc-project-card__placeholder-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" width="32" height="32">
              <polyline points="16 18 22 12 16 6"></polyline>
              <polyline points="8 6 2 12 8 18"></polyline>
            </svg>
          </div>
        </div>
      `;
    }

    const tagsHtml = tags.length > 0 ? `
      <div class="fc-project-card__tags" role="list" aria-label="Technologies used">
        ${tags.map(tag => `<span class="fc-project-card__tag" role="listitem">${tag}</span>`).join('')}
      </div>
    ` : '';

    const linksHtml = Object.keys(links).length > 0 ? `
      <div class="fc-project-card__links">
        ${links.demo ? `<a href="${links.demo}" class="fc-project-card__link fc-project-card__link--demo" target="_blank" rel="noopener noreferrer" aria-label="View live demo">Demo</a>` : ''}
        ${links.source ? `<a href="${links.source}" class="fc-project-card__link fc-project-card__link--source" target="_blank" rel="noopener noreferrer" aria-label="View source code">Source</a>` : ''}
        ${links.caseStudy ? `<a href="${links.caseStudy}" class="fc-project-card__link fc-project-card__link--case-study" aria-label="Read case study">Case Study</a>` : ''}
      </div>
    ` : '';

    this.element.innerHTML = `
      ${imageHtml}
      <div class="fc-project-card__content">
        <h3 class="fc-project-card__title">${title}</h3>
        ${description ? `<p class="fc-project-card__description">${description}</p>` : ''}
        ${tagsHtml}
        ${linksHtml}
      </div>
    `;

    this.bindEvents();

    return this.element;
  }

  bindEvents() {
    this.element.addEventListener('mouseenter', () => this.handleMouseEnter());
    this.element.addEventListener('mouseleave', () => this.handleMouseLeave());
    this.element.addEventListener('focus', () => this.handleFocus(), true);
    this.element.addEventListener('blur', () => this.handleBlur(), true);

    // Lazy load image when it comes into view
    if (this.config.lazyLoad && this.config.image) {
      this.setupLazyLoad();
    }
  }

  handleMouseEnter() {
    this.isHovered = true;
    this.emit('hover', { card: this, hovered: true });
    
    const imageEl = this.element.querySelector('.fc-project-card__image');
    if (imageEl) {
      this.playAnimation('imageZoom', imageEl);
    }
  }

  handleMouseLeave() {
    this.isHovered = false;
    this.emit('hover', { card: this, hovered: false });
    
    const imageEl = this.element.querySelector('.fc-project-card__image');
    if (imageEl) {
      imageEl.style.transform = 'scale(1)';
    }
  }

  handleFocus() {
    this.element.classList.add('fc-project-card--focused');
  }

  handleBlur() {
    this.element.classList.remove('fc-project-card--focused');
  }

  setupLazyLoad() {
    const img = this.element.querySelector('.fc-project-card__image');
    if (!img || !img.dataset.src) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          observer.disconnect();
        }
      });
    }, { rootMargin: '50px' });

    observer.observe(img);
  }

  reveal() {
    if (this.isRevealed) return Promise.resolve();
    
    this.isRevealed = true;
    return this.playAnimation('reveal', this.element).then(() => {
      this.element.style.opacity = '1';
      this.element.style.transform = 'translateY(0)';
      this.emit('revealed', { card: this });
    });
  }

  update(newConfig) {
    this.config = { ...this.config, ...newConfig };
    if (this.element && this.element.parentNode) {
      const parent = this.element.parentNode;
      const newElement = this.render();
      parent.replaceChild(newElement, this.element);
      if (this.isRevealed) {
        this.element.style.opacity = '1';
        this.element.style.transform = 'translateY(0)';
      }
    }
    return this;
  }

  destroy() {
    if (this.element) {
      this.element.remove();
    }
    this.removeAllListeners();
  }
}

export default ProjectCard;
