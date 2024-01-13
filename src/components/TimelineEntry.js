import Component from '../core/Component.js';
import { fadeIn, slideIn } from '../core/AnimationUtils.js';

/**
 * TimelineEntry - Individual entry in a timeline
 * Supports different layouts and content types
 */
class TimelineEntry extends Component {
    constructor(options = {}) {
        super(options);
        
        this.title = options.title || '';
        this.subtitle = options.subtitle || '';
        this.date = options.date || '';
        this.dateEnd = options.dateEnd || null;
        this.description = options.description || '';
        this.tags = options.tags || [];
        this.icon = options.icon || null;
        this.link = options.link || null;
        this.position = options.position || 'auto'; // 'left', 'right', 'auto'
        this.dotColor = options.dotColor || null;
        this.highlighted = options.highlighted || false;
        
        this.index = 0;
    }
    
    setIndex(index) {
        this.index = index;
        return this;
    }
    
    formatDateRange() {
        if (!this.date) return '';
        if (this.dateEnd) {
            return `${this.date} - ${this.dateEnd}`;
        }
        return this.date;
    }
    
    getPositionClass() {
        if (this.position === 'auto') {
            return this.index % 2 === 0 ? 'fc-timeline-entry--left' : 'fc-timeline-entry--right';
        }
        return `fc-timeline-entry--${this.position}`;
    }
    
    renderIcon() {
        if (!this.icon) return '';
        
        if (this.icon.startsWith('<')) {
            return `<span class="fc-timeline-entry__icon">${this.icon}</span>`;
        }
        
        return `<span class="fc-timeline-entry__icon"><img src="${this.icon}" alt="" /></span>`;
    }
    
    renderTags() {
        if (this.tags.length === 0) return '';
        
        const tagsHtml = this.tags.map(tag => 
            `<span class="fc-timeline-entry__tag">${tag}</span>`
        ).join('');
        
        return `<div class="fc-timeline-entry__tags">${tagsHtml}</div>`;
    }
    
    renderContent() {
        const titleElement = this.link 
            ? `<a href="${this.link}" class="fc-timeline-entry__title-link">${this.title}</a>`
            : this.title;
        
        return `
            <div class="fc-timeline-entry__content">
                <div class="fc-timeline-entry__header">
                    <h3 class="fc-timeline-entry__title">${titleElement}</h3>
                    ${this.subtitle ? `<p class="fc-timeline-entry__subtitle">${this.subtitle}</p>` : ''}
                </div>
                <span class="fc-timeline-entry__date">${this.formatDateRange()}</span>
                ${this.description ? `<p class="fc-timeline-entry__description">${this.description}</p>` : ''}
                ${this.renderTags()}
            </div>
        `;
    }
    
    render() {
        const classes = [
            'fc-timeline-entry',
            this.getPositionClass(),
            this.highlighted ? 'fc-timeline-entry--highlighted' : '',
            this.className
        ].filter(Boolean).join(' ');
        
        const dotStyle = this.dotColor ? `style="background-color: ${this.dotColor}"` : '';
        
        this.element = this.createElement('div', {
            className: classes,
            attributes: {
                'data-index': this.index
            },
            html: `
                <div class="fc-timeline-entry__marker">
                    <div class="fc-timeline-entry__dot" ${dotStyle}>
                        ${this.renderIcon()}
                    </div>
                    <div class="fc-timeline-entry__line"></div>
                </div>
                <div class="fc-timeline-entry__card">
                    ${this.renderContent()}
                </div>
            `
        });
        
        this.emit('rendered', { entry: this });
        return this.element;
    }
    
    animateIn(delay = 0) {
        if (!this.element) return Promise.resolve();
        
        const card = this.element.querySelector('.fc-timeline-entry__card');
        const dot = this.element.querySelector('.fc-timeline-entry__dot');
        
        return Promise.all([
            fadeIn(dot, { duration: 300, delay }),
            slideIn(card, { 
                direction: this.index % 2 === 0 ? 'left' : 'right',
                duration: 500,
                delay: delay + 150
            })
        ]);
    }
    
    update(options) {
        Object.assign(this, options);
        
        if (this.element) {
            const newElement = this.render();
            this.element.replaceWith(newElement);
            this.element = newElement;
        }
        
        this.emit('updated', { entry: this });
        return this;
    }
}

export default TimelineEntry;