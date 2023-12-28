import { Component } from '../core/Component.js';
import { ScrollAnimator } from '../core/ScrollAnimator.js';

/**
 * ProjectCard - A component for displaying portfolio project items
 * Supports images, descriptions, tags, and links with hover effects
 */
export class ProjectCard extends Component {
    static defaults = {
        animateOnScroll: true,
        animationClass: 'fc-reveal',
        hoverEffect: 'lift',
        imageAspectRatio: '16/9',
        showTags: true,
        maxTags: 5,
        linkTarget: '_blank'
    };

    constructor(container, options = {}) {
        super(container, { ...ProjectCard.defaults, ...options });
        
        this.data = null;
        this.animator = null;
        
        this.init();
    }

    init() {
        this.element.classList.add('fc-project-card');
        this.element.setAttribute('role', 'article');
        
        if (this.options.hoverEffect) {
            this.element.classList.add(`fc-hover-${this.options.hoverEffect}`);
        }

        if (this.options.animateOnScroll) {
            this.animator = new ScrollAnimator({
                animationClass: this.options.animationClass
            });
        }

        this.bindEvents();
    }

    bindEvents() {
        this.element.addEventListener('mouseenter', () => this.onMouseEnter());
        this.element.addEventListener('mouseleave', () => this.onMouseLeave());
        this.element.addEventListener('click', (e) => this.onClick(e));
    }

    onMouseEnter() {
        this.emit('hover', { card: this, data: this.data });
    }

    onMouseLeave() {
        this.emit('hoverEnd', { card: this, data: this.data });
    }

    onClick(event) {
        // Don't trigger if clicking on a link
        if (event.target.tagName === 'A') return;
        
        this.emit('click', { card: this, data: this.data, event });
    }

    /**
     * Set project data and render the card
     * @param {Object} data - Project data object
     * @param {string} data.title - Project title
     * @param {string} [data.description] - Project description
     * @param {string} [data.image] - Image URL
     * @param {string} [data.imageAlt] - Image alt text
     * @param {string[]} [data.tags] - Array of tag strings
     * @param {Object[]} [data.links] - Array of link objects {url, label, icon}
     */
    setData(data) {
        this.data = data;
        this.render();
        
        if (this.animator) {
            this.animator.observe(this.element);
        }
        
        return this;
    }

    render() {
        if (!this.data) return;

        const { title, description, image, imageAlt, tags, links } = this.data;

        let html = '';

        // Image section
        if (image) {
            html += `
                <div class="fc-project-card__image" style="aspect-ratio: ${this.options.imageAspectRatio}">
                    <img src="${this.escapeHtml(image)}" alt="${this.escapeHtml(imageAlt || title)}" loading="lazy" />
                    <div class="fc-project-card__overlay"></div>
                </div>
            `;
        }

        // Content section
        html += '<div class="fc-project-card__content">';

        // Title
        html += `<h3 class="fc-project-card__title">${this.escapeHtml(title)}</h3>`;

        // Description
        if (description) {
            html += `<p class="fc-project-card__description">${this.escapeHtml(description)}</p>`;
        }

        // Tags
        if (this.options.showTags && tags && tags.length > 0) {
            const displayTags = tags.slice(0, this.options.maxTags);
            const remaining = tags.length - displayTags.length;
            
            html += '<div class="fc-project-card__tags">';
            displayTags.forEach(tag => {
                html += `<span class="fc-project-card__tag">${this.escapeHtml(tag)}</span>`;
            });
            if (remaining > 0) {
                html += `<span class="fc-project-card__tag fc-project-card__tag--more">+${remaining}</span>`;
            }
            html += '</div>';
        }

        // Links
        if (links && links.length > 0) {
            html += '<div class="fc-project-card__links">';
            links.forEach(link => {
                const iconHtml = link.icon ? `<span class="fc-project-card__link-icon">${link.icon}</span>` : '';
                html += `
                    <a href="${this.escapeHtml(link.url)}" 
                       class="fc-project-card__link" 
                       target="${this.options.linkTarget}"
                       rel="noopener noreferrer">
                        ${iconHtml}
                        <span>${this.escapeHtml(link.label)}</span>
                    </a>
                `;
            });
            html += '</div>';
        }

        html += '</div>';

        this.element.innerHTML = html;
        this.emit('render', { card: this, data: this.data });
    }

    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    destroy() {
        if (this.animator) {
            this.animator.unobserve(this.element);
            this.animator.destroy();
        }
        this.element.classList.remove('fc-project-card');
        this.element.innerHTML = '';
        super.destroy();
    }
}

export default ProjectCard;
