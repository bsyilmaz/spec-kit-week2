// Favorites store (FR-004, FR-006, FR-007). DOM-free; storage is injected.
// Never throws because of storage: missing, blocked, full or corrupted storage
// degrades to an in-memory set and `persisted === false`.
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) {
    module.exports = api;
  } else {
    root.QOTD = Object.assign(root.QOTD || {}, api);
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const STORAGE_KEY = 'qotd:favorites:v1';

  function parseIds(raw, validIds) {
    if (raw === null || raw === undefined) return [];
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (_) {
      return [];
    }
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((id) => typeof id === 'string' && validIds.has(id));
  }

  function readIds(storage, validIds) {
    if (!storage) return { ids: [], ok: false };
    try {
      return { ids: parseIds(storage.getItem(STORAGE_KEY), validIds), ok: true };
    } catch (_) {
      return { ids: [], ok: false };
    }
  }

  function writeIds(storage, ids) {
    if (!storage) return false;
    try {
      storage.setItem(STORAGE_KEY, JSON.stringify(ids));
      return true;
    } catch (_) {
      return false;
    }
  }

  /**
   * @param {{ storage?: {getItem: Function, setItem: Function} | null,
   *           validIds: Iterable<string> }} options
   */
  function createFavoritesStore({ storage, validIds }) {
    const known = new Set(validIds);
    const loaded = readIds(storage, known);
    const favorites = new Set(loaded.ids);
    let persisted = loaded.ok;

    return {
      has: (id) => favorites.has(id),
      list: () => [...favorites],
      toggle(id) {
        if (favorites.has(id)) {
          favorites.delete(id);
        } else {
          favorites.add(id);
        }
        persisted = writeIds(storage, [...favorites]);
        return favorites.has(id);
      },
      get persisted() {
        return persisted;
      },
    };
  }

  return { createFavoritesStore, STORAGE_KEY };
});
