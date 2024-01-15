/**
 * FormValidator - Lightweight form validation utility
 * @class FormValidator
 */
export class FormValidator {
  constructor() {
    this.rules = new Map();
    this.messages = {
      required: 'This field is required',
      email: 'Please enter a valid email address',
      minLength: 'Must be at least {min} characters',
      maxLength: 'Must be no more than {max} characters',
      pattern: 'Please match the requested format',
      phone: 'Please enter a valid phone number',
      url: 'Please enter a valid URL'
    };
  }

  /**
   * Set custom error messages
   * @param {Object} messages - Custom messages object
   */
  setMessages(messages) {
    this.messages = { ...this.messages, ...messages };
  }

  /**
   * Add validation rules for a field
   * @param {string} fieldName - Field name
   * @param {Object} rules - Validation rules
   */
  addRules(fieldName, rules) {
    this.rules.set(fieldName, rules);
  }

  /**
   * Remove rules for a field
   * @param {string} fieldName - Field name
   */
  removeRules(fieldName) {
    this.rules.delete(fieldName);
  }

  /**
   * Validate a single value against rules
   * @param {*} value - Value to validate
   * @param {Object} rules - Validation rules
   * @returns {Object} Validation result
   */
  validateValue(value, rules) {
    const errors = [];
    const stringValue = String(value || '').trim();

    // Required check
    if (rules.required && !stringValue) {
      errors.push(this.messages.required);
      return { valid: false, errors };
    }

    // Skip other validations if empty and not required
    if (!stringValue && !rules.required) {
      return { valid: true, errors: [] };
    }

    // Email validation
    if (rules.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(stringValue)) {
        errors.push(this.messages.email);
      }
    }

    // Phone validation
    if (rules.phone) {
      const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
      if (!phoneRegex.test(stringValue.replace(/\s/g, ''))) {
        errors.push(this.messages.phone);
      }
    }

    // URL validation
    if (rules.url) {
      try {
        new URL(stringValue);
      } catch {
        errors.push(this.messages.url);
      }
    }

    // Min length
    if (rules.minLength && stringValue.length < rules.minLength) {
      errors.push(
        this.messages.minLength.replace('{min}', rules.minLength)
      );
    }

    // Max length
    if (rules.maxLength && stringValue.length > rules.maxLength) {
      errors.push(
        this.messages.maxLength.replace('{max}', rules.maxLength)
      );
    }

    // Pattern validation
    if (rules.pattern) {
      const regex = rules.pattern instanceof RegExp 
        ? rules.pattern 
        : new RegExp(rules.pattern);
      if (!regex.test(stringValue)) {
        errors.push(rules.patternMessage || this.messages.pattern);
      }
    }

    // Custom validator
    if (rules.custom && typeof rules.custom === 'function') {
      const customResult = rules.custom(value);
      if (customResult !== true) {
        errors.push(customResult || 'Validation failed');
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate a field by name
   * @param {string} fieldName - Field name
   * @param {*} value - Value to validate
   * @returns {Object} Validation result
   */
  validateField(fieldName, value) {
    const rules = this.rules.get(fieldName);
    if (!rules) {
      return { valid: true, errors: [] };
    }
    return this.validateValue(value, rules);
  }

  /**
   * Validate all fields
   * @param {Object} data - Form data object
   * @returns {Object} Validation results
   */
  validateAll(data) {
    const results = {};
    let isValid = true;

    for (const [fieldName, rules] of this.rules) {
      const value = data[fieldName];
      const result = this.validateValue(value, rules);
      results[fieldName] = result;
      if (!result.valid) {
        isValid = false;
      }
    }

    return {
      valid: isValid,
      fields: results
    };
  }

  /**
   * Clear all validation rules
   */
  clear() {
    this.rules.clear();
  }
}

export default FormValidator;