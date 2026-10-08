'use strict';
// FR-001: built-in collection of at least 10 quotes, each with text and author.
const test = require('node:test');
const assert = require('node:assert/strict');
const { QUOTES } = require('../src/quotes.js');

const ID_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;

test('collection has at least 10 quotes', () => {
  assert.ok(Array.isArray(QUOTES));
  assert.ok(QUOTES.length >= 10, `expected >= 10 quotes, got ${QUOTES.length}`);
});

test('every quote has a kebab-case id, non-empty text and author', () => {
  for (const quote of QUOTES) {
    assert.match(quote.id, ID_PATTERN, `bad id: ${quote.id}`);
    assert.ok(quote.text.trim().length > 0, `empty text: ${quote.id}`);
    assert.ok(quote.author.trim().length > 0, `empty author: ${quote.id}`);
  }
});

test('quote ids are unique', () => {
  const ids = QUOTES.map((q) => q.id);
  assert.equal(new Set(ids).size, ids.length);
});

test('collection is frozen', () => {
  assert.ok(Object.isFrozen(QUOTES));
  assert.ok(QUOTES.every((q) => Object.isFrozen(q)));
});
