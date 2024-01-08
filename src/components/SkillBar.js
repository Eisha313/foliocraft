import Component from '../core/Component.js';
import ScrollAnimator from '../core/ScrollAnimator.js';

/**
 * SkillBar component for displaying skills with animated progress bars
 */
export default class SkillBar extends Component {
    /**
     * Create a SkillBar component
     * @param {Object} options - Configuration options
     * @param {string} options.name - Skill name
     * @param {number} options.level - Skill level (0-100)
     * @param {string} [options.category] - Skill category
     * @param {string} [options.icon] - Icon URL or emoji
     * @param {string} [options.color] - Custom bar color
     * @param {boolean} [options.showPercentage=true] - Show percentage text
     * @param {boolean} [options.animate=true] - Enable animation
     * @param {number} [options.animationDuration=1000] - Animation duration in ms
     * @param {string} [options.animationEasing='ease-out'] - Animation easing function
     */
    constructor(options = {}) {
        super(options);
        
        this.name = options.name || 'Skill';
        this.level = Math.min(100, Math.max(0, options.level || 0));
        this.category = options.category || null;
        this.icon = options.icon || null;
        this.color = options.color || null;
        this.showPercentage = options.showPercentage !== false;
        this.animate = options.animate !== false;
        this.animationDuration = options.animationDuration || 1000;
        this.animationEasing = options.animationEasing || 'ease-out';
        
        this.hasAnimated = false;
        this.scrollAnimator = null;
    }

    /**
     * Get CSS classes for the component
     * @returns {string[]}
     */
    getClasses() {
        const classes = ['fc-skill-bar'];
        
        if (this.category) {
            classes.push(`fc-skill-bar--${this.category.toLowerCase().replace(/\s+/g, '-')}`);
        }
        
        if (this.level >= 80) {
            classes.push('fc-skill-bar--expert');
        } else if (this.level >= 50) {
            classes.push('fc-skill-bar--intermediate');
        } else {
            classes.push('fc-skill-bar--beginner');
        }
        
        return classes;
    }

    /**
     * Get inline styles for the progress bar
     * @returns {string}
     */
    getProgressStyles() {
        const styles = [];
        
        if (this.color) {
            styles.push(`--fc-skill-bar-fill: ${this.color}`);
        }
        
        styles.push(`--fc-skill-bar-duration: ${this.animationDuration}ms`);
        styles.push(`--fc-skill-bar-easing: ${this.animationEasing}`);
        
        return styles.join('; ');
    }

    /**
     * Get skill level label
     * @returns {string}
     */
    getLevelLabel() {
        if (this.level >= 90) return 'Expert';
        if (this.level >= 70) return 'Advanced';
        if (this.level >= 50) return 'Intermediate';
        if (this.level >= 30) return 'Basic';
        return 'Beginner';
    }

    /**
     * Render the component
     * @returns {HTMLElement}
     */
    render() {
        this.element = document.createElement('div');
        this.element.className = this.getClasses().join(' ');
        this.element.setAttribute('role', 'progressbar');
        this.element.setAttribute('aria-valuenow', this.level);
        this.element.setAttribute('aria-valuemin', '0');
        this.element.setAttribute('aria-valuemax', '100');
        this.element.setAttribute('aria-label', `${this.name}: ${this.level}%`);
        
        const header = document.createElement('div');
        header.className = 'fc-skill-bar__header';
        
        const nameContainer = document.createElement('div');
        nameContainer.className = 'fc-skill-bar__name-container';
        
        if (this.icon) {
            const iconEl = document.createElement('span');
            iconEl.className = 'fc-skill-bar__icon';
            
            if (this.icon.startsWith('http') || this.icon.startsWith('/') || this.icon.startsWith('.')) {
                const img = document.createElement('img');
                img.src = this.icon;
                img.alt = '';
                img.className = 'fc-skill-bar__icon-img';
                iconEl.appendChild(img);
            } else {
                iconEl.textContent = this.icon;
            }
            
            nameContainer.appendChild(iconEl);
        }
        
        const nameEl = document.createElement('span');
        nameEl.className = 'fc-skill-bar__name';
        nameEl.textContent = this.name;
        nameContainer.appendChild(nameEl);
        
        header.appendChild(nameContainer);
        
        if (this.showPercentage) {
            const percentageEl = document.createElement('span');
            percentageEl.className = 'fc-skill-bar__percentage';
            percentageEl.textContent = this.animate ? '0%' : `${this.level}%`;
            this.percentageEl = percentageEl;
            header.appendChild(percentageEl);
        }
        
        const track = document.createElement('div');
        track.className = 'fc-skill-bar__track';
        
        const fill = document.createElement('div');
        fill.className = 'fc-skill-bar__fill';
        fill.style.cssText = this.getProgressStyles();
        
        if (!this.animate) {
            fill.style.width = `${this.level}%`;
        }
        
        this.fillEl = fill;
        track.appendChild(fill);
        
        const levelLabel = document.createElement('span');
        levelLabel.className = 'fc-skill-bar__level-label';
        levelLabel.textContent = this.getLevelLabel();
        
        this.element.appendChild(header);
        this.element.appendChild(track);
        this.element.appendChild(levelLabel);
        
        if (this.animate) {
            this.setupScrollAnimation();
        }
        
        this.emit('render', { element: this.element });
        
        return this.element;
    }

    /**
     * Setup scroll-triggered animation
     */
    setupScrollAnimation() {
        this.scrollAnimator = new ScrollAnimator({
            threshold: 0.3,
            once: true
        });
        
        this.scrollAnimator.observe(this.element, () => {
            this.animateProgress();
        });
    }

    /**
     * Animate the progress bar fill
     */
    animateProgress() {
        if (this.hasAnimated) return;
        
        this.hasAnimated = true;
        this.element.classList.add('fc-skill-bar--animating');
        
        // Animate fill width
        requestAnimationFrame(() => {
            this.fillEl.style.width = `${this.level}%`;
        });
        
        // Animate percentage counter
        if (this.showPercentage && this.percentageEl) {
            this.animateCounter(0, this.level, this.animationDuration);
        }
        
        setTimeout(() => {
            this.element.classList.remove('fc-skill-bar--animating');
            this.element.classList.add('fc-skill-bar--animated');
            this.emit('animated', { level: this.level });
        }, this.animationDuration);
    }

    /**
     * Animate counter from start to end value
     * @param {number} start - Start value
     * @param {number} end - End value
     * @param {number} duration - Animation duration
     */
    animateCounter(start, end, duration) {
        const startTime = performance.now();
        
        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Ease-out function
            const easedProgress = 1 - Math.pow(1 - progress, 3);
            const currentValue = Math.round(start + (end - start) * easedProgress);
            
            this.percentageEl.textContent = `${currentValue}%`;
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        };
        
        requestAnimationFrame(updateCounter);
    }

    /**
     * Update skill level
     * @param {number} newLevel - New skill level
     * @param {boolean} [animate=true] - Animate the change
     */
    updateLevel(newLevel, animate = true) {
        const oldLevel = this.level;
        this.level = Math.min(100, Math.max(0, newLevel));
        
        this.element.setAttribute('aria-valuenow', this.level);
        this.element.setAttribute('aria-label', `${this.name}: ${this.level}%`);
        
        if (animate && this.hasAnimated) {
            this.animateCounter(
                parseInt(this.percentageEl.textContent),
                this.level,
                this.animationDuration / 2
            );
            this.fillEl.style.width = `${this.level}%`;
        } else {
            this.fillEl.style.width = `${this.level}%`;
            if (this.percentageEl) {
                this.percentageEl.textContent = `${this.level}%`;
            }
        }
        
        // Update level label
        const levelLabel = this.element.querySelector('.fc-skill-bar__level-label');
        if (levelLabel) {
            levelLabel.textContent = this.getLevelLabel();
        }
        
        this.emit('levelChange', { oldLevel, newLevel: this.level });
    }

    /**
     * Destroy the component
     */
    destroy() {
        if (this.scrollAnimator) {
            this.scrollAnimator.destroy();
        }
        super.destroy();
    }
}
