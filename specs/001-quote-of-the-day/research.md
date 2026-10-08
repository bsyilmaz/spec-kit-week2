# Research: Quote of the Day

No `NEEDS CLARIFICATION` items remained in Technical Context; this file records the technology
decisions and the alternatives that were rejected.

## R1. Module format that works in the browser *and* in Node tests

- **Decision**: Classic scripts loaded with `<script defer>` in dependency order. Each logic file
  wraps itself in a small factory and does both:
  `root.QOTD = Object.assign(root.QOTD || {}, api)` in the browser and
  `module.exports = api` when `module` exists (Node).
- **Rationale**: Native ES modules (`<script type="module">`) are blocked by browsers when the page
  is opened from `file://` (CORS), which would make "just open index.html" fail. The dual-export
  pattern keeps zero tooling and lets `node --test` `require()` the same files.
- **Alternatives considered**: ES modules + a mandatory static server (rejected: fragile for a
  grader double-clicking the file); a bundler (rejected: Constitution I, no build step); inlining
  all JS in the HTML (rejected: logic would be untestable under Node, Constitution II).

## R2. Random selection

- **Decision**: `pickRandom(quotes, rng = Math.random)` returns `quotes[Math.floor(rng() * n)]`.
- **Rationale**: Uniform, trivial, and deterministic in tests by injecting `rng`.
- **Alternatives considered**: `crypto.getRandomValues` (rejected: cryptographic randomness is
  unnecessary for quotes); shuffled deck (rejected for now: spec only asks for "random").

## R3. Persisting favorites

- **Decision**: `localStorage` key `qotd:favorites:v1` holding a JSON array of quote IDs, e.g.
  `["seneca-luck","lao-tzu-journey"]`. Writes happen on every toggle.
- **Rationale**: Spec FR-006 (survive reload/restart, same browser) and the plan input ("persist
  favorites in localStorage"). IDs rather than text keep data small and survive typo fixes in quote
  text. The `:v1` suffix allows a future migration (Constitution IV).
- **Alternatives considered**: storing full quote objects (rejected: duplicates data, breaks when
  text is edited); `IndexedDB` (rejected: async and heavier than needed); cookies (rejected: sent
  with requests, size limits).

## R4. Failure handling for storage

- **Decision**: All storage access goes through the favorites store, wrapped in `try/catch`.
  Read failures or invalid JSON → start with an empty set. Non-array JSON → empty set. Unknown IDs
  are filtered out against the current quote list. Write failures are swallowed; the in-memory set
  is still updated so the current visit keeps working.
- **Rationale**: FR-007 and the spec's edge cases (private mode, quota, hand-edited data, removed
  quotes). `localStorage` access itself can throw (e.g. blocked site data), not only `setItem`.
- **Alternatives considered**: showing an error banner (rejected: noisy for a non-critical
  feature; spec only requires the page to keep working).

## R5. Accessibility of the favorite toggle

- **Decision**: A `<button>` with `aria-pressed="true|false"`, visible label "☆ Favorite" /
  "★ Favorited", and the quote container marked `aria-live="polite"` so screen readers announce
  new quotes.
- **Rationale**: FR-005, FR-008 and the constitution's accessibility constraint. `aria-pressed` is
  the standard pattern for toggle buttons.
- **Alternatives considered**: a checkbox styled as a star (rejected: less natural semantics for a
  one-off action on the displayed item); icon-only button (rejected: needs extra labelling).

## R6. Test runner

- **Decision**: Node's built-in `node:test` + `node:assert/strict`, run with `npm test`
  (`node --test`, **no path argument**). Node's default discovery picks up every `*.test.js`
  file outside `node_modules/`.
- **Refinement (during implement)**: the first version of this plan said `node --test tests/`.
  On Node 22 a bare directory argument is resolved as a module path and fails with
  `Cannot find module '.../tests'`, so the plan was corrected before touching code.
- **Rationale**: Zero installs (Constitution III); available in Node ≥ 18.
- **Alternatives considered**: Jest/Vitest (rejected: dependencies); browser-based tests with
  Playwright (rejected for now: heavy; the DOM layer is thin and covered by quickstart checks).
