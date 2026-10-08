'use strict';
// FR-002 / FR-003: random selection from the collection (rng injected for determinism).
const test = require('node:test');
const assert = require('node:assert/strict');
const { pickRandom } = require('../src/quote-picker.js');

const quotes = [{ id: 'a' }, { id: 'b' }, { id: 'c' }, { id: 'd' }];

test('maps rng output onto the list', () => {
  assert.equal(pickRandom(quotes, () => 0).id, 'a');
  assert.equal(pickRandom(quotes, () => 0.5).id, 'c');
  assert.equal(pickRandom(quotes, () => 0.999).id, 'd');
});

test('defaults to Math.random and always returns a list member', () => {
  for (let i = 0; i < 100; i += 1) {
    assert.ok(quotes.includes(pickRandom(quotes)));
  }
});

test('works with a single-item list', () => {
  assert.equal(pickRandom([{ id: 'only' }], () => 0.7).id, 'only');
});

test('throws on an empty list or a non-array', () => {
  assert.throws(() => pickRandom([]), /non-empty array/);
  assert.throws(() => pickRandom(null), /non-empty array/);
});
