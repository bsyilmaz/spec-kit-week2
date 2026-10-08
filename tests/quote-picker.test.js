'use strict';
// FR-002 (pickRandom, on load) and FR-003 rev 2 (pickNext, never repeats the current quote).
// rng is injected for determinism.
const test = require('node:test');
const assert = require('node:assert/strict');
const { pickRandom, pickNext } = require('../src/quote-picker.js');

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

// --- pickNext (FR-003 rev 2) ---------------------------------------------

test('pickNext never returns the current quote, for any rng value', () => {
  for (const current of quotes) {
    for (let r = 0; r < 1; r += 0.01) {
      assert.notEqual(pickNext(quotes, current.id, () => r).id, current.id);
    }
  }
});

test('pickNext is uniform over the remaining n-1 quotes', () => {
  // current = 'b' -> candidates [a, c, d]; rng buckets of width 1/3
  assert.equal(pickNext(quotes, 'b', () => 0).id, 'a');
  assert.equal(pickNext(quotes, 'b', () => 0.34).id, 'c');
  assert.equal(pickNext(quotes, 'b', () => 0.999).id, 'd');
});

test('pickNext with real randomness reaches every other quote and never the current one', () => {
  const seen = new Set();
  for (let i = 0; i < 500; i += 1) seen.add(pickNext(quotes, 'a').id);
  assert.deepEqual([...seen].sort(), ['b', 'c', 'd']);
});

test('pickNext on a single-item list returns that quote', () => {
  assert.equal(pickNext([{ id: 'only' }], 'only', () => 0.5).id, 'only');
});

test('pickNext with an unknown current id behaves like pickRandom', () => {
  assert.equal(pickNext(quotes, 'zzz', () => 0.5).id, pickRandom(quotes, () => 0.5).id);
});

test('pickNext throws on an empty list or a non-array', () => {
  assert.throws(() => pickNext([], 'a'), /non-empty array/);
  assert.throws(() => pickNext(undefined, 'a'), /non-empty array/);
});
