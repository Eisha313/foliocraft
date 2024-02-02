import { Component } from '../core/Component.js';
import { ProjectCard } from './ProjectCard.js';
import BreakpointManager from '../responsive/BreakpointManager.js';

/**
 * ProjectGrid - A responsive grid container for ProjectCard components
 * Automatically adjusts columns based on viewport size
 */
export class ProjectGrid extends Component {
    static defaults = {
        columns: {
            xs: 1,
            sm: 1,
            md: 2,
            lg: 3,
            xl: 3
        },
        gap: '1.5rem',
        cardOptions: {},
        filterAnimationDuration: 300
    };

    constructor(options = {}) {
        super({ ...ProjectGrid.defaults, ...options });

        this.cards = [];
        this.projects = [];
        this.activeFilter = null;
        this.breakpointManager = null;
    }

    render() {
        this.element = document.createElement('div');
        this.element.classList.add('fc-project-grid');
        this.element.setAttribute('role', 'list');

        this.applyStyles();
        this.setupBreakpointListener();

        return this.element;
    }

    applyStyles() {
        this.element.style.display = 'grid';
        this.element.style.gap = this.options.gap;
        this.updateColumns();
    }

    setupBreakpointListener() {
        this.breakpointManager = new BreakpointManager();
        this.breakpointManager.on('change', () => this.updateColumns());
    }

    updateColumns() {
        const breakpoint = this.breakpointManager.getCurrentBreakpoint();
        const columns = this.options.columns[breakpoint] || this.options.columns.md;
        
        this.element.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
        this.emit('columnsChange', { breakpoint, columns });
    }

    /**
     * Set projects data and render cards
     * @param {Object[]} projects - Array of project data objects
     */
    setProjects(projects) {
        this.projects = projects;
        this.clearCards();
        
        projects.forEach((project, index) => {
            this.addProject(project, index);
        });
        
        this.emit('projectsLoaded', { count: projects.length });
        return this;
    }

    /**
     * Add a single project to the grid
     * @param {Object} project - Project data object
     * @param {number} [index] - Optional index for ordering
     */
    addProject(project, index) {
        const wrapper = document.createElement('div');
        wrapper.classList.add('fc-project-grid__item');
        wrapper.setAttribute('role', 'listitem');
        wrapper.dataset.index = index !== undefined ? index : this.cards.length;

        if (project.tags) {
            wrapper.dataset.tags = project.tags.join(',').toLowerCase();
        }

        const card = new ProjectCard({ ...this.options.cardOptions, ...project });
        const cardEl = card.render();
        wrapper.appendChild(cardEl);
        this.element.appendChild(wrapper);

        // Bubble up card events
        card.on('click', (data) => this.emit('cardClick', data));
        card.on('hover', (data) => this.emit('cardHover', data));

        this.cards.push(card);
        return card;
    }

    /**
     * Filter projects by tag
     * @param {string|null} tag - Tag to filter by, or null to show all
     */
    filterByTag(tag) {
        this.activeFilter = tag ? tag.toLowerCase() : null;
        
        this.cards.forEach((card, index) => {
            const wrapper = card.element;
            const tags = wrapper.dataset.tags || '';
            const shouldShow = !this.activeFilter || tags.includes(this.activeFilter);
            
            if (shouldShow) {
                wrapper.style.display = '';
                wrapper.style.opacity = '1';
                wrapper.style.transform = 'scale(1)';
            } else {
                wrapper.style.opacity = '0';
                wrapper.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    if (wrapper.style.opacity === '0') {
                        wrapper.style.display = 'none';
                    }
                }, this.options.filterAnimationDuration);
            }
        });
        
        this.emit('filter', { tag: this.activeFilter });
        return this;
    }

    /**
     * Get all unique tags from loaded projects
     * @returns {string[]} Array of unique tags
     */
    getAllTags() {
        const tagSet = new Set();
        this.projects.forEach(project => {
            if (project.tags) {
                project.tags.forEach(tag => tagSet.add(tag));
            }
        });
        return Array.from(tagSet).sort();
    }

    clearCards() {
        this.cards.forEach(card => card.destroy());
        this.cards = [];
        this.element.innerHTML = '';
    }

    destroy() {
        this.clearCards();
        if (this.breakpointManager) {
            this.breakpointManager.destroy();
        }
        this.element.classList.remove('fc-project-grid');
        this.element.removeAttribute('style');
        super.destroy();
    }
}

export default ProjectGrid;
