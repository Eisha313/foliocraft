import { Component } from '../core/Component.js';
import { FormValidator } from './FormValidator.js';

/**
 * ContactForm - Configurable contact form component
 * @class ContactForm
 * @extends Component
 */
export class ContactForm extends Component {
  /**
   * Create a contact form
   * @param {Object} options - Form options
   */
  constructor(options = {}) {
    super(options);
    
    this.fields = options.fields || this.getDefaultFields();
    this.submitLabel = options.submitLabel || 'Send Message';
    this.onSubmit = options.onSubmit || null;
    this.showLabels = options.showLabels !== false;
    this.inlineErrors = options.inlineErrors !== false;
    this.successMessage = options.successMessage || 'Thank you! Your message has been sent.';
    this.errorMessage = options.errorMessage || 'Please correct the errors below.';
    
    this.validator = new FormValidator();
    this.formData = {};
    this.fieldElements = new Map();
    this.errorElements = new Map();
    
    this.setupValidation();
  }

  /**
   * Get default form fields
   * @returns {Array} Default fields configuration
   */
  getDefaultFields() {
    return [
      {
        name: 'name',
        type: 'text',
        label: 'Name',
        placeholder: 'Your name',
        required: true,
        minLength: 2
      },
      {
        name: 'email',
        type: 'email',
        label: 'Email',
        placeholder: 'your@email.com',
        required: true,
        email: true
      },
      {
        name: 'subject',
        type: 'text',
        label: 'Subject',
        placeholder: 'Message subject',
        required: false
      },
      {
        name: 'message',
        type: 'textarea',
        label: 'Message',
        placeholder: 'Your message...',
        required: true,
        minLength: 10,
        rows: 5
      }
    ];
  }

  /**
   * Setup validation rules from field config
   */
  setupValidation() {
    this.fields.forEach(field => {
      const rules = {};
      
      if (field.required) rules.required = true;
      if (field.email) rules.email = true;
      if (field.phone) rules.phone = true;
      if (field.url) rules.url = true;
      if (field.minLength) rules.minLength = field.minLength;
      if (field.maxLength) rules.maxLength = field.maxLength;
      if (field.pattern) {
        rules.pattern = field.pattern;
        rules.patternMessage = field.patternMessage;
      }
      if (field.custom) rules.custom = field.custom;
      
      if (Object.keys(rules).length > 0) {
        this.validator.addRules(field.name, rules);
      }
    });
  }

  /**
   * Create DOM element
   * @returns {HTMLElement} Form element
   */
  createElement() {
    const form = document.createElement('form');
    form.className = this.buildClassName();
    form.setAttribute('novalidate', '');
    
    // Status message area
    const statusArea = document.createElement('div');
    statusArea.className = 'fc-form-status';
    statusArea.setAttribute('role', 'alert');
    statusArea.setAttribute('aria-live', 'polite');
    form.appendChild(statusArea);
    this.statusElement = statusArea;
    
    // Form fields
    const fieldsContainer = document.createElement('div');
    fieldsContainer.className = 'fc-form-fields';
    
    this.fields.forEach(field => {
      const fieldElement = this.createField(field);
      fieldsContainer.appendChild(fieldElement);
    });
    
    form.appendChild(fieldsContainer);
    
    // Submit button
    const submitContainer = document.createElement('div');
    submitContainer.className = 'fc-form-submit';
    
    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.className = 'fc-form-button';
    submitButton.textContent = this.submitLabel;
    this.submitButton = submitButton;
    
    submitContainer.appendChild(submitButton);
    form.appendChild(submitContainer);
    
    // Event listeners
    form.addEventListener('submit', (e) => this.handleSubmit(e));
    
    return form;
  }

  /**
   * Create a form field
   * @param {Object} config - Field configuration
   * @returns {HTMLElement} Field wrapper element
   */
  createField(config) {
    const wrapper = document.createElement('div');
    wrapper.className = `fc-form-field fc-form-field--${config.type}`;
    wrapper.dataset.field = config.name;
    
    // Label
    if (this.showLabels && config.label) {
      const label = document.createElement('label');
      label.className = 'fc-form-label';
      label.setAttribute('for', `fc-field-${config.name}`);
      label.textContent = config.label;
      
      if (config.required) {
        const required = document.createElement('span');
        required.className = 'fc-form-required';
        required.textContent = ' *';
        required.setAttribute('aria-label', 'required');
        label.appendChild(required);
      }
      
      wrapper.appendChild(label);
    }
    
    // Input element
    let input;
    
    if (config.type === 'textarea') {
      input = document.createElement('textarea');
      if (config.rows) input.rows = config.rows;
    } else if (config.type === 'select') {
      input = document.createElement('select');
      if (config.options) {
        config.options.forEach(opt => {
          const option = document.createElement('option');
          option.value = opt.value;
          option.textContent = opt.label;
          input.appendChild(option);
        });
      }
    } else {
      input = document.createElement('input');
      input.type = config.type || 'text';
    }
    
    input.id = `fc-field-${config.name}`;
    input.name = config.name;
    input.className = 'fc-form-input';
    
    if (config.placeholder) input.placeholder = config.placeholder;
    if (config.required) input.setAttribute('aria-required', 'true');
    if (config.maxLength) input.maxLength = config.maxLength;
    if (config.autocomplete) input.autocomplete = config.autocomplete;
    
    // Real-time validation
    input.addEventListener('blur', () => this.validateField(config.name));
    input.addEventListener('input', () => {
      this.formData[config.name] = input.value;
      // Clear error on input
      if (this.errorElements.has(config.name)) {
        this.clearFieldError(config.name);
      }
    });
    
    wrapper.appendChild(input);
    this.fieldElements.set(config.name, input);
    
    // Error container
    if (this.inlineErrors) {
      const errorContainer = document.createElement('div');
      errorContainer.className = 'fc-form-error';
      errorContainer.setAttribute('aria-live', 'polite');
      wrapper.appendChild(errorContainer);
      this.errorElements.set(config.name, errorContainer);
    }
    
    return wrapper;
  }

  /**
   * Build component class name
   * @returns {string} Class name
   */
  buildClassName() {
    const classes = ['fc-contact-form'];
    if (this.options.className) {
      classes.push(this.options.className);
    }
    return classes.join(' ');
  }

  /**
   * Validate a single field
   * @param {string} fieldName - Field name
   * @returns {boolean} Is valid
   */
  validateField(fieldName) {
    const input = this.fieldElements.get(fieldName);
    if (!input) return true;
    
    const result = this.validator.validateField(fieldName, input.value);
    
    if (!result.valid) {
      this.showFieldError(fieldName, result.errors[0]);
      input.classList.add('fc-form-input--error');
      input.setAttribute('aria-invalid', 'true');
    } else {
      this.clearFieldError(fieldName);
      input.classList.remove('fc-form-input--error');
      input.removeAttribute('aria-invalid');
    }
    
    return result.valid;
  }

  /**
   * Show field error
   * @param {string} fieldName - Field name
   * @param {string} message - Error message
   */
  showFieldError(fieldName, message) {
    const errorElement = this.errorElements.get(fieldName);
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.classList.add('fc-form-error--visible');
    }
  }

  /**
   * Clear field error
   * @param {string} fieldName - Field name
   */
  clearFieldError(fieldName) {
    const errorElement = this.errorElements.get(fieldName);
    if (errorElement) {
      errorElement.textContent = '';
      errorElement.classList.remove('fc-form-error--visible');
    }
  }

  /**
   * Handle form submission
   * @param {Event} event - Submit event
   */
  async handleSubmit(event) {
    event.preventDefault();
    
    // Collect form data
    this.fieldElements.forEach((input, name) => {
      this.formData[name] = input.value;
    });
    
    // Validate all fields
    const validation = this.validator.validateAll(this.formData);
    
    if (!validation.valid) {
      // Show errors
      Object.entries(validation.fields).forEach(([fieldName, result]) => {
        if (!result.valid) {
          this.showFieldError(fieldName, result.errors[0]);
          const input = this.fieldElements.get(fieldName);
          if (input) {
            input.classList.add('fc-form-input--error');
            input.setAttribute('aria-invalid', 'true');
          }
        }
      });
      
      this.showStatus('error', this.errorMessage);
      this.emit('validationFailed', { fields: validation.fields });
      return;
    }
    
    // Submit
    this.setLoading(true);
    
    try {
      if (this.onSubmit) {
        await this.onSubmit(this.formData);
      }
      
      this.showStatus('success', this.successMessage);
      this.emit('submitted', { data: this.formData });
      this.reset();
    } catch (error) {
      this.showStatus('error', error.message || 'An error occurred. Please try again.');
      this.emit('submitError', { error });
    } finally {
      this.setLoading(false);
    }
  }

  /**
   * Show status message
   * @param {string} type - Status type (success, error)
   * @param {string} message - Message text
   */
  showStatus(type, message) {
    if (this.statusElement) {
      this.statusElement.textContent = message;
      this.statusElement.className = `fc-form-status fc-form-status--${type}`;
    }
  }

  /**
   * Clear status message
   */
  clearStatus() {
    if (this.statusElement) {
      this.statusElement.textContent = '';
      this.statusElement.className = 'fc-form-status';
    }
  }

  /**
   * Set loading state
   * @param {boolean} loading - Is loading
   */
  setLoading(loading) {
    if (this.submitButton) {
      this.submitButton.disabled = loading;
      this.submitButton.classList.toggle('fc-form-button--loading', loading);
    }
    if (this.element) {
      this.element.classList.toggle('fc-contact-form--loading', loading);
    }
  }

  /**
   * Reset form to initial state
   */
  reset() {
    this.formData = {};
    this.fieldElements.forEach((input, name) => {
      input.value = '';
      input.classList.remove('fc-form-input--error');
      input.removeAttribute('aria-invalid');
      this.clearFieldError(name);
    });
  }

  /**
   * Get current form data
   * @returns {Object} Form data
   */
  getData() {
    const data = {};
    this.fieldElements.forEach((input, name) => {
      data[name] = input.value;
    });
    return data;
  }

  /**
   * Set form data
   * @param {Object} data - Data to set
   */
  setData(data) {
    Object.entries(data).forEach(([name, value]) => {
      const input = this.fieldElements.get(name);
      if (input) {
        input.value = value;
        this.formData[name] = value;
      }
    });
  }
}

export default ContactForm;