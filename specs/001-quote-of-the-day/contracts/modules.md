# Contract: Logic Modules

All modules are DOM-free. In the browser they are exposed on `window.QOTD`; in Node they are
available via `require()`.

## `src/quotes.js`

```text
QUOTES: ReadonlyArray<{ id: string, text: string, author: string }>
```

Frozen array; see [data-model.md](../data-model.md) for rules.

## `src/quote-picker.js`

```text
pickRandom(quotes, rng = Math.random) -> Quote
```

- `quotes`: non-empty array. Throws `Error` if empty or not an array.
- `rng`: function returning a number in `[0, 1)`.
- Returns `quotes[Math.floor(rng() * quotes.length)]`.

## `src/favorites.js`

```text
STORAGE_KEY = "qotd:favorites:v1"

createFavoritesStore({ storage, validIds }) -> FavoritesStore
  storage:  object with getItem/setItem (e.g. window.localStorage), or null/undefined
  validIds: iterable of quote IDs that currently exist

FavoritesStore:
  has(id)    -> boolean
  toggle(id) -> boolean      // new state: true if now favorited
  list()     -> string[]     // current favorite IDs (copy)
  persisted  -> boolean      // false when the last read/write failed or no storage
```

Guarantees:
- Never throws because of storage (missing, throwing, quota, corrupted JSON).
- `toggle` updates memory first, then writes `JSON.stringify(list())` to `STORAGE_KEY`.
- Unknown IDs (not in `validIds`) are dropped when loading.
