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

    const imageHtml = image ? `
      <div class="fc-project-card__image-container">
        <img 
          class="fc-project-card__image"
          ${lazyLoad ? `data-src="${image}" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 9'%3E%3C/svg%3E"` : `src="${image}"`}
          alt="${title} preview"
          loading="${lazyLoad ? 'lazy' : 'eager'}"
        />
        <div class="fc-project-card__overlay"></div>
      </div>
    ` : '';

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
    this.injectStyles();

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

  injectStyles() {
    const styleId = 'fc-project-card-styles';
    if (document.getElementById(styleId)) return;

    const styles = document.createElement('style');
    styles.id = styleId;
    styles.textContent = `
      .fc-project-card {
        background: var(--fc-card-bg, #ffffff);
        border-radius: var(--fc-card-radius, 12px);
        box-shadow: var(--fc-card-shadow, 0 4px 6px -1px rgba(0, 0, 0, 0.1));
        overflow: hidden;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
        will-change: transform, opacity;
      }

      .fc-project-card:hover {
        transform: translateY(-8px);
        box-shadow: var(--fc-card-shadow-hover, 0 20px 25px -5px rgba(0, 0, 0, 0.1));
      }

      .fc-project-card--focused {
        outline: 2px solid var(--fc-focus-color, #3b82f6);
        outline-offset: 2px;
      }

      .fc-project-card--featured {
        grid-column: span 2;
      }

      .fc-project-card__image-container {
        position: relative;
        overflow: hidden;
        aspect-ratio: 16 / 9;
      }

      .fc-project-card__image {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.3s ease;
      }

      .fc-project-card__overlay {
        position: absolute;
        inset: 0;
        background: linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 50%);
        opacity: 0;
        transition: opacity 0.3s ease;
      }

      .fc-project-card:hover .fc-project-card__overlay {
        opacity: 1;
      }

      .fc-project-card__content {
        padding: var(--fc-card-padding, 1.5rem);
      }

      .fc-project-card__title {
        margin: 0 0 0.5rem;
        font-size: var(--fc-card-title-size, 1.25rem);
        font-weight: 600;
        color: var(--fc-text-primary, #1f2937);
      }

      .fc-project-card__description {
        margin: 0 0 1rem;
        color: var(--fc-text-secondary, #6b7280);
        font-size: var(--fc-card-text-size, 0.875rem);
        line-height: 1.6;
      }

      .fc-project-card__tags {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        margin-bottom: 1rem;
      }

      .fc-project-card__tag {
        padding: 0.25rem 0.75rem;
        background: var(--fc-tag-bg, #f3f4f6);
        color: var(--fc-tag-color, #4b5563);
        border-radius: 9999px;
        font-size: 0.75rem;
        font-weight: 500;
      }

      .fc-project-card__links {
        display: flex;
        gap: 0.75rem;
      }

      .fc-project-card__link {
        padding: 0.5rem 1rem;
        border-radius: 6px;
        font-size: 0.875rem;
        font-weight: 500;
        text-decoration: none;
        transition: background 0.2s ease, color 0.2s ease;
      }

      .fc-project-card__link--demo {
        background: var(--fc-primary, #3b82f6);
        color: white;
      }

      .fc-project-card__link--demo:hover {
        background: var(--fc-primary-hover, #2563eb);
      }

      .fc-project-card__link--source {
        background: var(--fc-secondary-bg, #e5e7eb);
        color: var(--fc-text-primary, #1f2937);
      }

      .fc-project-card__link--source:hover {
        background: var(--fc-secondary-bg-hover, #d1d5db);
      }

      @media (max-width: 768px) {
        .fc-project-card--featured {
          grid-column: span 1;
        }
      }
    `;

    document.head.appendChild(styles);
  }

  destroy() {
    if (this.element) {
      this.element.remove();
    }
    this.removeAllListeners();
  }
}

export default ProjectCard;
