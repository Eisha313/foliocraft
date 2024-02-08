import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { easings } from './AnimationUtils.js';

describe('AnimationUtils - Easings', () => {
  const EASING_NAMES = [
    'linear', 'easeInQuad', 'easeOutQuad', 'easeInOutQuad',
    'easeInCubic', 'easeOutCubic', 'easeInOutCubic',
    'easeOutBack', 'easeOutElastic'
  ];

  it('should export all easing functions', () => {
    for (const name of EASING_NAMES) {
      assert.equal(typeof easings[name], 'function', `Missing easing: ${name}`);
    }
  });

  for (const name of EASING_NAMES) {
    it(`${name}: should return ~0 at t=0`, () => {
      const result = easings[name](0);
      assert.ok(Math.abs(result) < 0.001, `${name}(0) = ${result}, expected ~0`);
    });

    it(`${name}: should return ~1 at t=1`, () => {
      const result = easings[name](1);
      assert.ok(Math.abs(result - 1) < 0.001, `${name}(1) = ${result}, expected ~1`);
    });

    it(`${name}: should return values for t=0.5`, () => {
      const result = easings[name](0.5);
      assert.equal(typeof result, 'number');
      assert.ok(!isNaN(result));
    });
  }

  it('linear should return input value', () => {
    assert.equal(easings.linear(0.25), 0.25);
    assert.equal(easings.linear(0.75), 0.75);
  });
});
