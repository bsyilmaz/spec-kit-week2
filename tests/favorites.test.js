'use strict';
// FR-004, FR-006, FR-007: favorites toggle, persistence, graceful degradation.
const test = require('node:test');
const assert = require('node:assert/strict');
const { createFavoritesStore, STORAGE_KEY } = require('../src/favorites.js');

const validIds = ['a', 'b', 'c'];

function fakeStorage(initial = {}) {
  const data = { ...initial };
  return {
    data,
    getItem: (key) => (key in data ? data[key] : null),
    setItem: (key, value) => { data[key] = String(value); },
  };
}

function throwingStorage() {
  return {
    getItem() { throw new Error('SecurityError'); },
    setItem() { throw new Error('QuotaExceededError'); },
  };
}

test('uses a namespaced, versioned key', () => {
  assert.equal(STORAGE_KEY, 'qotd:favorites:v1');
});

test('toggle turns a favorite on and off', () => {
  const store = createFavoritesStore({ storage: fakeStorage(), validIds });
  assert.equal(store.has('a'), false);
  assert.equal(store.toggle('a'), true);
  assert.equal(store.has('a'), true);
  assert.equal(store.toggle('a'), false);
  assert.equal(store.has('a'), false);
});

test('persists favorites as a JSON array of ids', () => {
  const storage = fakeStorage();
  const store = createFavoritesStore({ storage, validIds });
  store.toggle('b');
  store.toggle('c');
  assert.deepEqual(JSON.parse(storage.data[STORAGE_KEY]).sort(), ['b', 'c']);
  assert.equal(store.persisted, true);
});

test('a new store over the same storage sees saved favorites (reload)', () => {
  const storage = fakeStorage();
  createFavoritesStore({ storage, validIds }).toggle('a');
  const reloaded = createFavoritesStore({ storage, validIds });
  assert.equal(reloaded.has('a'), true);
  assert.deepEqual(reloaded.list(), ['a']);
});

test('un-favoriting persists too', () => {
  const storage = fakeStorage();
  const store = createFavoritesStore({ storage, validIds });
  store.toggle('a');
  store.toggle('a');
  assert.equal(createFavoritesStore({ storage, validIds }).has('a'), false);
});

test('drops ids that are not in the collection', () => {
  const storage = fakeStorage({ [STORAGE_KEY]: '["a","gone"]' });
  assert.deepEqual(createFavoritesStore({ storage, validIds }).list(), ['a']);
});

test('corrupted JSON is treated as no favorites', () => {
  const storage = fakeStorage({ [STORAGE_KEY]: 'not json{' });
  const store = createFavoritesStore({ storage, validIds });
  assert.deepEqual(store.list(), []);
  assert.equal(store.toggle('a'), true);
});

test('non-array JSON and non-string items are ignored', () => {
  const objectStore = createFavoritesStore({
    storage: fakeStorage({ [STORAGE_KEY]: '{"a":true}' }), validIds,
  });
  assert.deepEqual(objectStore.list(), []);
  const mixedStore = createFavoritesStore({
    storage: fakeStorage({ [STORAGE_KEY]: '["a", 1, null, "b"]' }), validIds,
  });
  assert.deepEqual(mixedStore.list().sort(), ['a', 'b']);
});

test('throwing storage never throws; works in memory; reports not persisted', () => {
  const store = createFavoritesStore({ storage: throwingStorage(), validIds });
  assert.equal(store.persisted, false);
  assert.equal(store.toggle('a'), true);
  assert.equal(store.has('a'), true);
  assert.equal(store.persisted, false);
});

test('missing storage gives a memory-only store', () => {
  const store = createFavoritesStore({ storage: null, validIds });
  assert.equal(store.persisted, false);
  assert.equal(store.toggle('c'), true);
  assert.deepEqual(store.list(), ['c']);
});

test('list() returns a copy', () => {
  const store = createFavoritesStore({ storage: fakeStorage(), validIds });
  store.toggle('a');
  store.list().push('b');
  assert.deepEqual(store.list(), ['a']);
});
