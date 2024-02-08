import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { FormValidator } from './FormValidator.js';

describe('FormValidator', () => {
  describe('required validation', () => {
    it('should fail on empty string', () => {
      const v = new FormValidator();
      const result = v.validateValue('', { required: true });
      assert.equal(result.valid, false);
      assert.ok(result.errors[0].includes('required'));
    });

    it('should fail on null', () => {
      const v = new FormValidator();
      const result = v.validateValue(null, { required: true });
      assert.equal(result.valid, false);
    });

    it('should pass on non-empty string', () => {
      const v = new FormValidator();
      const result = v.validateValue('hello', { required: true });
      assert.equal(result.valid, true);
    });

    it('should skip validation if not required and empty', () => {
      const v = new FormValidator();
      const result = v.validateValue('', { email: true });
      assert.equal(result.valid, true);
    });
  });

  describe('email validation', () => {
    it('should accept valid emails', () => {
      const v = new FormValidator();
      assert.equal(v.validateValue('user@example.com', { email: true }).valid, true);
      assert.equal(v.validateValue('a@b.co', { email: true }).valid, true);
    });

    it('should reject invalid emails', () => {
      const v = new FormValidator();
      assert.equal(v.validateValue('notanemail', { email: true }).valid, false);
      assert.equal(v.validateValue('@missing.com', { email: true }).valid, false);
      assert.equal(v.validateValue('no@dots', { email: true }).valid, false);
    });
  });

  describe('minLength / maxLength', () => {
    it('should enforce minimum length', () => {
      const v = new FormValidator();
      assert.equal(v.validateValue('ab', { minLength: 3 }).valid, false);
      assert.equal(v.validateValue('abc', { minLength: 3 }).valid, true);
    });

    it('should enforce maximum length', () => {
      const v = new FormValidator();
      assert.equal(v.validateValue('toolong', { maxLength: 5 }).valid, false);
      assert.equal(v.validateValue('short', { maxLength: 5 }).valid, true);
    });

    it('should include length in error message', () => {
      const v = new FormValidator();
      const result = v.validateValue('a', { minLength: 5 });
      assert.ok(result.errors[0].includes('5'));
    });
  });

  describe('pattern validation', () => {
    it('should validate against regex pattern', () => {
      const v = new FormValidator();
      assert.equal(v.validateValue('abc', { pattern: /^[a-z]+$/ }).valid, true);
      assert.equal(v.validateValue('ABC', { pattern: /^[a-z]+$/ }).valid, false);
    });

    it('should validate against string pattern', () => {
      const v = new FormValidator();
      assert.equal(v.validateValue('123', { pattern: '^\\d+$' }).valid, true);
    });

    it('should use custom pattern message', () => {
      const v = new FormValidator();
      const result = v.validateValue('bad', { pattern: /^\d+$/, patternMessage: 'Numbers only' });
      assert.equal(result.errors[0], 'Numbers only');
    });
  });

  describe('custom validator', () => {
    it('should accept when custom returns true', () => {
      const v = new FormValidator();
      const result = v.validateValue('yes', { custom: () => true });
      assert.equal(result.valid, true);
    });

    it('should reject with custom message', () => {
      const v = new FormValidator();
      const result = v.validateValue('no', { custom: () => 'Custom error' });
      assert.equal(result.valid, false);
      assert.equal(result.errors[0], 'Custom error');
    });
  });

  describe('field management', () => {
    it('should add and validate fields by name', () => {
      const v = new FormValidator();
      v.addRules('email', { required: true, email: true });
      assert.equal(v.validateField('email', '').valid, false);
      assert.equal(v.validateField('email', 'test@test.com').valid, true);
    });

    it('should pass for fields with no rules', () => {
      const v = new FormValidator();
      assert.equal(v.validateField('unknown', 'anything').valid, true);
    });

    it('should remove rules', () => {
      const v = new FormValidator();
      v.addRules('name', { required: true });
      v.removeRules('name');
      assert.equal(v.validateField('name', '').valid, true);
    });
  });

  describe('validateAll', () => {
    it('should validate all fields at once', () => {
      const v = new FormValidator();
      v.addRules('name', { required: true });
      v.addRules('email', { required: true, email: true });

      const result = v.validateAll({ name: '', email: 'bad' });
      assert.equal(result.valid, false);
      assert.equal(result.fields.name.valid, false);
      assert.equal(result.fields.email.valid, false);
    });

    it('should pass when all fields are valid', () => {
      const v = new FormValidator();
      v.addRules('name', { required: true });
      v.addRules('email', { email: true });

      const result = v.validateAll({ name: 'John', email: 'john@test.com' });
      assert.equal(result.valid, true);
    });
  });

  describe('custom messages', () => {
    it('should allow overriding messages', () => {
      const v = new FormValidator();
      v.setMessages({ required: 'Fill this in!' });
      const result = v.validateValue('', { required: true });
      assert.equal(result.errors[0], 'Fill this in!');
    });
  });
});
