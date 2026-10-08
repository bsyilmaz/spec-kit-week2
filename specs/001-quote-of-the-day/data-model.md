# Data Model: Quote of the Day

## Quote

A saying from the built-in collection (`src/quotes.js`). Immutable at runtime.

| Field  | Type   | Rules |
|--------|--------|-------|
| id     | string | Required, unique within the collection, kebab-case (`/^[a-z0-9]+(-[a-z0-9]+)*$/`), never reused for a different quote |
| text   | string | Required, non-empty after trim |
| author | string | Required, non-empty after trim |

Collection rules: at least 10 quotes (FR-001); IDs unique. Verified by `tests/quotes.test.js`.

## Favorites

The set of quote IDs the visitor has marked, scoped to one browser profile.

| Field | Type        | Rules |
|-------|-------------|-------|
| ids   | Set<string> | Each ID must exist in the current quote collection; unknown IDs are dropped on load |

**Persisted form**: `localStorage["qotd:favorites:v1"] = JSON.stringify([...ids])`.

**Load rules** (FR-007):

| Stored value | Result |
|--------------|--------|
| key missing | empty set |
| valid JSON array of strings | set of those IDs that exist in the collection |
| invalid JSON / not an array / non-string items | empty set (non-string items ignored) |
| storage access throws | empty set, store runs in memory-only mode |

**State transitions** (per quote):

```text
not favorited --toggle--> favorited --toggle--> not favorited
```

Each transition updates the in-memory set first, then attempts to persist (failure is ignored).

## View state (UI only, not persisted)

| Field          | Meaning |
|----------------|---------|
| currentQuote   | The quote currently displayed |
| isFavorite     | Derived: `favorites.has(currentQuote.id)` — recomputed on every render |
