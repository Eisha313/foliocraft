import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { generateId, deepMerge, isObject, clamp, parseDuration, debounce, throttle } from './ComponentUtils.js';

describe('ComponentUtils', () => {
  describe('generateId', () => {
    it('should generate unique IDs', () => {
      const id1 = generateId();
      const id2 = generateId();
      assert.notEqual(id1, id2);
    });

    it('should use the default prefix', () => {
      const id = generateId();
      assert.ok(id.startsWith('fc-'));
    });

    it('should use a custom prefix', () => {
      const id = generateId('custom');
      assert.ok(id.startsWith('custom-'));
    });
  });

  describe('deepMerge', () => {
    it('should merge flat objects', () => {
      const result = deepMerge({ a: 1 }, { b: 2 });
      assert.deepEqual(result, { a: 1, b: 2 });
    });

    it('should merge nested objects', () => {
      const result = deepMerge(
        { a: { x: 1 } },
        { a: { y: 2 } }
      );
      assert.deepEqual(result, { a: { x: 1, y: 2 } });
    });

    it('should override primitive values', () => {
      const result = deepMerge({ a: 1 }, { a: 2 });
      assert.equal(result.a, 2);
    });

    it('should handle multiple sources', () => {
      const result = deepMerge({ a: 1 }, { b: 2 }, { c: 3 });
      assert.deepEqual(result, { a: 1, b: 2, c: 3 });
    });
  });

  describe('isObject', () => {
    it('should return true for plain objects', () => {
      assert.equal(isObject({}), true);
      assert.equal(isObject({ a: 1 }), true);
    });

    it('should return false for non-objects', () => {
      assert.ok(!isObject(null));
      assert.ok(!isObject([]));
      assert.ok(!isObject('string'));
      assert.ok(!isObject(42));
    });
  });

  describe('clamp', () => {
    it('should clamp values within range', () => {
      assert.equal(clamp(5, 0, 10), 5);
      assert.equal(clamp(-5, 0, 10), 0);
      assert.equal(clamp(15, 0, 10), 10);
    });

    it('should handle edge values', () => {
      assert.equal(clamp(0, 0, 10), 0);
      assert.equal(clamp(10, 0, 10), 10);
    });
  });

  describe('parseDuration', () => {
    it('should parse millisecond strings', () => {
      assert.equal(parseDuration('300ms'), 300);
      assert.equal(parseDuration('1500ms'), 1500);
    });

    it('should parse second strings', () => {
      assert.equal(parseDuration('0.3s'), 300);
      assert.equal(parseDuration('1.5s'), 1500);
    });

    it('should pass through numbers', () => {
      assert.equal(parseDuration(500), 500);
    });

    it('should return 0 for invalid input', () => {
      assert.equal(parseDuration('invalid'), 0);
    });
  });
});
