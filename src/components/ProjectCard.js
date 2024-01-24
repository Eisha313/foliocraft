import Component from '../core/Component.js';
import { createElement, generateId, applyCustomProperties } from '../core/ComponentUtils.js';

/**
 * ProjectCard - Individual project display component
 * Displays project information with image, title, description, and links
 */
export default class ProjectCard extends Component {
  constructor(options = {}) {
    super(options);
    
    this.config = {
      title: options.title || 'Project Title',
      description: options.description || '',
      image: options.image || null,
      tags: options.tags || [],
      links: options.links || [],
      featured: options.featured || false,
      animateOnScroll: options.animateOnScroll !== false,
      hoverEffect: options.hoverEffect || 'lift',
      aspectRatio: options.aspectRatio || '16/9',
      ...options
    };
    
    this.id = generateId('project');
    this.isRevealed = false;
  }
  
  render() {
    const card = createElement('article', {
      className: this.getCardClasses(),
      id: this.id,
      dataFeatured: this.config.featured.toString()
    });
    
    applyCustomProperties(card, {
      'aspect-ratio': this.config.aspectRatio
    });
    
    if (this.config.image) {
      card.appendChild(this.renderImage());
    }
    
    card.appendChild(this.renderContent());
    
    this.element = card;
    this.attachEventListeners();
    
    return card;
  }
  
  getCardClasses() {
    const classes = ['fc-project-card'];
    
    if (this.config.featured) {
      classes.push('fc-project-card--featured');
    }
    
    if (this.config.hoverEffect) {
      classes.push(`fc-project-card--hover-${this.config.hoverEffect}`);
    }
    
    if (this.config.animateOnScroll) {
      classes.push('fc-project-card--animate');
    }
    
    return classes.join(' ');
  }
  
  renderImage() {
    const imageWrapper = createElement('div', {
      className: 'fc-project-card__image-wrapper'
    });
    
    const image = createElement('img', {
      className: 'fc-project-card__image',
      src: this.config.image,
      alt: this.config.title,
      loading: 'lazy'
    });
    
    imageWrapper.appendChild(image);
    
    if (this.config.tags.length > 0) {
      imageWrapper.appendChild(this.renderTags());
    }
    
    return imageWrapper;
  }
  
  renderTags() {
    const tagsContainer = createElement('div', {
      className: 'fc-project-card__tags'
    });
    
    this.config.tags.forEach(tag => {
      const tagElement = createElement('span', {
        className: 'fc-project-card__tag'
      }, tag);
      tagsContainer.appendChild(tagElement);
    });
    
    return tagsContainer;
  }
  
  renderContent() {
    const content = createElement('div', {
      className: 'fc-project-card__content'
    });
    
    const title = createElement('h3', {
      className: 'fc-project-card__title'
    }, this.config.title);
    
    content.appendChild(title);
    
    if (this.config.description) {
      const description = createElement('p', {
        className: 'fc-project-card__description'
      }, this.config.description);
      content.appendChild(description);
    }
    
    if (this.config.links.length > 0) {
      content.appendChild(this.renderLinks());
    }
    
    return content;
  }
  
  renderLinks() {
    const linksContainer = createElement('div', {
      className: 'fc-project-card__links'
    });
    
    this.config.links.forEach(link => {
      const anchor = createElement('a', {
        className: 'fc-project-card__link',
        href: link.url,
        target: link.external ? '_blank' : '_self',
        rel: link.external ? 'noopener noreferrer' : ''
      }, link.label);
      linksContainer.appendChild(anchor);
    });
    
    return linksContainer;
  }
  
  attachEventListeners() {
    if (!this.element) return;
    
    this.element.addEventListener('mouseenter', () => {
      this.emit('hover', { card: this, hovering: true });
    });
    
    this.element.addEventListener('mouseleave', () => {
      this.emit('hover', { card: this, hovering: false });
    });
    
    this.element.addEventListener('click', (e) => {
      if (!e.target.closest('a')) {
        this.emit('click', { card: this, event: e });
      }
    });
  }
  
  reveal() {
    if (this.isRevealed || !this.element) return;
    
    this.element.classList.add('fc-project-card--revealed');
    this.isRevealed = true;
    this.emit('reveal', { card: this });
  }
  
  update(newConfig) {
    Object.assign(this.config, newConfig);
    
    if (this.element && this.element.parentNode) {
      const parent = this.element.parentNode;
      const newElement = this.render();
      parent.replaceChild(newElement, this.element);
    }
    
    this.emit('update', { card: this });
  }
  
  destroy() {
    if (this.element) {
      this.element.remove();
      this.element = null;
    }
    this.removeAllListeners();
  }
}
