import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { EventEmitter } from './EventEmitter.js';

describe('EventEmitter', () => {
  it('should register and emit events', () => {
    const emitter = new EventEmitter();
    let called = false;
    emitter.on('test', () => { called = true; });
    emitter.emit('test');
    assert.equal(called, true);
  });

  it('should pass arguments to listeners', () => {
    const emitter = new EventEmitter();
    let received;
    emitter.on('data', (val) => { received = val; });
    emitter.emit('data', { id: 42 });
    assert.deepEqual(received, { id: 42 });
  });

  it('should support multiple listeners', () => {
    const emitter = new EventEmitter();
    const results = [];
    emitter.on('multi', () => results.push('a'));
    emitter.on('multi', () => results.push('b'));
    emitter.emit('multi');
    assert.deepEqual(results, ['a', 'b']);
  });

  it('should remove specific listeners with off()', () => {
    const emitter = new EventEmitter();
    let count = 0;
    const handler = () => { count++; };
    emitter.on('test', handler);
    emitter.emit('test');
    emitter.off('test', handler);
    emitter.emit('test');
    assert.equal(count, 1);
  });

  it('should support once()', () => {
    const emitter = new EventEmitter();
    let count = 0;
    emitter.once('once', () => { count++; });
    emitter.emit('once');
    emitter.emit('once');
    assert.equal(count, 1);
  });

  it('should remove all listeners', () => {
    const emitter = new EventEmitter();
    let count = 0;
    emitter.on('a', () => { count++; });
    emitter.on('b', () => { count++; });
    emitter.removeAllListeners();
    emitter.emit('a');
    emitter.emit('b');
    assert.equal(count, 0);
  });

  it('should remove listeners for a specific event', () => {
    const emitter = new EventEmitter();
    let a = 0, b = 0;
    emitter.on('a', () => { a++; });
    emitter.on('b', () => { b++; });
    emitter.removeAllListeners('a');
    emitter.emit('a');
    emitter.emit('b');
    assert.equal(a, 0);
    assert.equal(b, 1);
  });

  it('should return correct listenerCount', () => {
    const emitter = new EventEmitter();
    emitter.on('test', () => {});
    emitter.on('test', () => {});
    assert.equal(emitter.listenerCount('test'), 2);
    assert.equal(emitter.listenerCount('other'), 0);
  });

  it('should return event names', () => {
    const emitter = new EventEmitter();
    emitter.on('foo', () => {});
    emitter.on('bar', () => {});
    const names = emitter.eventNames();
    assert.ok(names.includes('foo'));
    assert.ok(names.includes('bar'));
  });

  it('should support chaining', () => {
    const emitter = new EventEmitter();
    const result = emitter.on('test', () => {}).emit('test').off('test', () => {});
    assert.ok(result instanceof EventEmitter);
  });

  it('should not throw when emitting with no listeners', () => {
    const emitter = new EventEmitter();
    assert.doesNotThrow(() => emitter.emit('nonexistent'));
  });
});
