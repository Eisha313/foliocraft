import Component from '../core/Component.js';
import ScrollAnimator from '../core/ScrollAnimator.js';
import TimelineEntry from './TimelineEntry.js';

/**
 * Timeline - Container for chronological entries
 * Supports vertical layout with alternating sides
 */
export class Timeline extends Component {
    constructor(options = {}) {
        super(options);
        
        this.entries = [];
        this.layout = options.layout || 'alternating'; // 'alternating', 'left', 'right'
        this.animated = options.animated !== false;
        this.animationDelay = options.animationDelay || 100;
        this.lineColor = options.lineColor || null;
        this.compact = options.compact || false;
        
        this.scrollAnimator = null;
        this.entriesData = options.entries || [];
    }
    
    addEntry(entryOptions) {
        const position = this.getEntryPosition(this.entries.length);
        
        const entry = new TimelineEntry({
            ...entryOptions,
            position
        });
        
        entry.setIndex(this.entries.length);
        this.entries.push(entry);
        
        // Forward entry events
        entry.on('rendered', (data) => this.emit('entryRendered', data));
        entry.on('updated', (data) => this.emit('entryUpdated', data));
        
        this.emit('entryAdded', { entry, index: this.entries.length - 1 });
        
        return entry;
    }
    
    getEntryPosition(index) {
        switch (this.layout) {
            case 'left':
                return 'left';
            case 'right':
                return 'right';
            case 'alternating':
            default:
                return 'auto';
        }
    }
    
    removeEntry(index) {
        if (index < 0 || index >= this.entries.length) return null;
        
        const [removed] = this.entries.splice(index, 1);
        
        // Update indices
        this.entries.forEach((entry, i) => entry.setIndex(i));
        
        if (removed.element) {
            removed.destroy();
        }
        
        this.emit('entryRemoved', { entry: removed, index });
        
        return removed;
    }
    
    clearEntries() {
        this.entries.forEach(entry => entry.destroy());
        this.entries = [];
        this.emit('entriesCleared');
        return this;
    }
    
    initScrollAnimations() {
        if (!this.animated || !this.element) return;
        
        this.scrollAnimator = new ScrollAnimator({
            threshold: 0.2,
            rootMargin: '0px 0px -50px 0px'
        });
        
        this.entries.forEach((entry, index) => {
            if (entry.element) {
                entry.element.style.opacity = '0';
                
                this.scrollAnimator.observe(entry.element, () => {
                    entry.element.style.opacity = '1';
                    entry.animateIn(index * this.animationDelay);
                });
            }
        });
    }
    
    renderLine() {
        const style = this.lineColor ? `style="background-color: ${this.lineColor}"` : '';
        return `<div class="fc-timeline__line" ${style}></div>`;
    }
    
    render() {
        // Process entries data
        this.entriesData.forEach(data => this.addEntry(data));
        
        const classes = [
            'fc-timeline',
            `fc-timeline--${this.layout}`,
            this.compact ? 'fc-timeline--compact' : '',
            this.options.className || ''
        ].filter(Boolean).join(' ');
        
        this.element = this.createElement('div', {
            className: classes,
            html: this.renderLine()
        });
        
        // Create entries container
        const entriesContainer = this.createElement('div', {
            className: 'fc-timeline__entries'
        });
        
        this.entries.forEach(entry => {
            entriesContainer.appendChild(entry.render());
        });
        
        this.element.appendChild(entriesContainer);
        
        // Setup scroll animations after render
        if (this.animated) {
            requestAnimationFrame(() => this.initScrollAnimations());
        }
        
        this.emit('rendered', { timeline: this });
        return this.element;
    }
    
    mount(container) {
        const target = typeof container === 'string' 
            ? document.querySelector(container) 
            : container;
        
        if (!target) {
            console.error('Timeline: Mount target not found');
            return this;
        }
        
        if (!this.element) {
            this.render();
        }
        
        target.appendChild(this.element);
        this.emit('mounted', { container: target });
        
        return this;
    }
    
    destroy() {
        if (this.scrollAnimator) {
            this.scrollAnimator.destroy();
            this.scrollAnimator = null;
        }
        
        this.entries.forEach(entry => entry.destroy());
        this.entries = [];
        
        super.destroy();
    }
}

export default Timeline;