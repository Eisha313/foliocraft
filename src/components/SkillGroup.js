import Component from '../core/Component.js';
import SkillBar from './SkillBar.js';

/**
 * SkillGroup component for organizing multiple skill bars
 */
export default class SkillGroup extends Component {
    /**
     * Create a SkillGroup component
     * @param {Object} options - Configuration options
     * @param {string} [options.title] - Group title
     * @param {Array} [options.skills=[]] - Array of skill configurations
     * @param {string} [options.layout='vertical'] - Layout: 'vertical' or 'grid'
     * @param {number} [options.columns=2] - Number of columns for grid layout
     * @param {boolean} [options.staggerAnimation=true] - Stagger animation of child bars
     * @param {number} [options.staggerDelay=100] - Delay between each skill animation
     * @param {Object} [options.skillDefaults={}] - Default options for all skills
     */
    constructor(options = {}) {
        super(options);
        
        this.title = options.title || null;
        this.skills = options.skills || [];
        this.layout = options.layout || 'vertical';
        this.columns = options.columns || 2;
        this.staggerAnimation = options.staggerAnimation !== false;
        this.staggerDelay = options.staggerDelay || 100;
        this.skillDefaults = options.skillDefaults || {};
        
        this.skillBars = [];
    }

    /**
     * Get CSS classes for the component
     * @returns {string[]}
     */
    getClasses() {
        const classes = ['fc-skill-group', `fc-skill-group--${this.layout}`];
        return classes;
    }

    /**
     * Render the component
     * @returns {HTMLElement}
     */
    render() {
        this.element = document.createElement('div');
        this.element.className = this.getClasses().join(' ');
        
        if (this.layout === 'grid') {
            this.element.style.setProperty('--fc-skill-group-columns', this.columns);
        }
        
        if (this.title) {
            const titleEl = document.createElement('h3');
            titleEl.className = 'fc-skill-group__title';
            titleEl.textContent = this.title;
            this.element.appendChild(titleEl);
        }
        
        const container = document.createElement('div');
        container.className = 'fc-skill-group__container';
        
        this.skills.forEach((skillConfig, index) => {
            const skillOptions = {
                ...this.skillDefaults,
                ...skillConfig
            };
            
            if (this.staggerAnimation) {
                skillOptions.animationDelay = index * this.staggerDelay;
            }
            
            const skillBar = new SkillBar(skillOptions);
            this.skillBars.push(skillBar);
            
            const skillElement = skillBar.render();
            
            if (this.staggerAnimation) {
                skillElement.style.setProperty('--fc-skill-bar-delay', `${index * this.staggerDelay}ms`);
            }
            
            container.appendChild(skillElement);
        });
        
        this.element.appendChild(container);
        
        this.emit('render', { element: this.element, skillBars: this.skillBars });
        
        return this.element;
    }

    /**
     * Add a new skill to the group
     * @param {Object} skillConfig - Skill configuration
     * @returns {SkillBar}
     */
    addSkill(skillConfig) {
        const skillOptions = {
            ...this.skillDefaults,
            ...skillConfig
        };
        
        const skillBar = new SkillBar(skillOptions);
        this.skillBars.push(skillBar);
        this.skills.push(skillConfig);
        
        const container = this.element.querySelector('.fc-skill-group__container');
        if (container) {
            container.appendChild(skillBar.render());
        }
        
        this.emit('skillAdded', { skillBar, config: skillConfig });
        
        return skillBar;
    }

    /**
     * Remove a skill from the group
     * @param {string} skillName - Name of skill to remove
     * @returns {boolean}
     */
    removeSkill(skillName) {
        const index = this.skillBars.findIndex(bar => bar.name === skillName);
        
        if (index === -1) return false;
        
        const skillBar = this.skillBars[index];
        skillBar.destroy();
        
        this.skillBars.splice(index, 1);
        this.skills.splice(index, 1);
        
        this.emit('skillRemoved', { skillName, index });
        
        return true;
    }

    /**
     * Get a skill bar by name
     * @param {string} skillName - Name of skill
     * @returns {SkillBar|null}
     */
    getSkill(skillName) {
        return this.skillBars.find(bar => bar.name === skillName) || null;
    }

    /**
     * Update all skills
     * @param {Array} newSkills - Array of new skill configurations
     */
    updateSkills(newSkills) {
        // Destroy existing skill bars
        this.skillBars.forEach(bar => bar.destroy());
        this.skillBars = [];
        this.skills = newSkills;
        
        // Re-render
        const container = this.element.querySelector('.fc-skill-group__container');
        if (container) {
            container.innerHTML = '';
            
            newSkills.forEach((skillConfig, index) => {
                const skillOptions = {
                    ...this.skillDefaults,
                    ...skillConfig
                };
                
                const skillBar = new SkillBar(skillOptions);
                this.skillBars.push(skillBar);
                
                const skillElement = skillBar.render();
                
                if (this.staggerAnimation) {
                    skillElement.style.setProperty('--fc-skill-bar-delay', `${index * this.staggerDelay}ms`);
                }
                
                container.appendChild(skillElement);
            });
        }
        
        this.emit('skillsUpdated', { skills: this.skills });
    }

    /**
     * Sort skills by level
     * @param {string} [order='desc'] - Sort order: 'asc' or 'desc'
     */
    sortByLevel(order = 'desc') {
        const sortedSkills = [...this.skills].sort((a, b) => {
            return order === 'desc' ? b.level - a.level : a.level - b.level;
        });
        
        this.updateSkills(sortedSkills);
    }

    /**
     * Sort skills alphabetically
     * @param {string} [order='asc'] - Sort order: 'asc' or 'desc'
     */
    sortAlphabetically(order = 'asc') {
        const sortedSkills = [...this.skills].sort((a, b) => {
            const comparison = a.name.localeCompare(b.name);
            return order === 'asc' ? comparison : -comparison;
        });
        
        this.updateSkills(sortedSkills);
    }

    /**
     * Filter skills by minimum level
     * @param {number} minLevel - Minimum level to show
     */
    filterByLevel(minLevel) {
        this.skillBars.forEach((bar, index) => {
            const shouldShow = this.skills[index].level >= minLevel;
            bar.element.style.display = shouldShow ? '' : 'none';
        });
        
        this.emit('filtered', { minLevel });
    }

    /**
     * Reset filter to show all skills
     */
    resetFilter() {
        this.skillBars.forEach(bar => {
            bar.element.style.display = '';
        });
        
        this.emit('filterReset');
    }

    /**
     * Destroy the component and all child skill bars
     */
    destroy() {
        this.skillBars.forEach(bar => bar.destroy());
        this.skillBars = [];
        super.destroy();
    }
}
