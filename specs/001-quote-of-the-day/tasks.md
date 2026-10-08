---

description: "Task list for the Quote of the Day feature"
---

# Tasks: Quote of the Day

**Input**: Design documents from `/specs/001-quote-of-the-day/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Included — required by Constitution III (every FR maps to a test or a quickstart check).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)

## Path Conventions

Single static project: `index.html` at repository root, code in `src/`, tests in `tests/`.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Create directories `src/` and `tests/` per plan.md Project Structure
- [ ] T002 [P] Create `package.json` with `"private": true`, no dependencies, and script `"test": "node --test"` (no path argument — see research R6)
- [ ] T003 [P] Create `.gitignore` ignoring `node_modules/` and OS files (do NOT ignore `.specify/` or `specs/`)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Quote data and page skeleton needed by every story

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T004 [P] Write `tests/quotes.test.js`: collection has ≥ 10 quotes; every `id` is unique and matches `/^[a-z0-9]+(-[a-z0-9]+)*$/`; `text` and `author` are "Required, non-empty after trim"; array is frozen (FR-001)
- [ ] T005 Create `src/quotes.js` with ≥ 12 quotes `{ id, text, author }` using the dual-export pattern from research R1 (`window.QOTD.QUOTES` / `module.exports.QUOTES`), frozen with `Object.freeze`
- [ ] T006 Create `index.html` skeleton with the elements in contracts/ui.md (`#quote` with `aria-live="polite"`, `#quote-text`, `#quote-author`, `#new-quote`, `#favorite` with `aria-pressed="false"`, `#storage-note` hidden) and `<script defer>` tags in order: quotes.js, quote-picker.js, favorites.js, app.js
- [ ] T007 [P] Create `src/styles.css`: centered card layout, readable typography, visible `:focus-visible` outlines, distinct favorited state, responsive down to 320 px

**Checkpoint**: `npm test` passes for quote data; page skeleton opens.

---

## Phase 3: User Story 1 - See a quote when the page opens (Priority: P1) 🎯 MVP

**Goal**: A random quote and its author are visible on load.

**Independent Test**: Open `index.html`; a quote and author appear with no interaction.

### Tests for User Story 1

- [ ] T008 [P] [US1] Write `tests/quote-picker.test.js`: `pickRandom` returns `quotes[Math.floor(rng()*n)]` for injected rng values 0, 0.5, 0.999; throws on empty array / non-array; works with a single-item list (FR-002)

### Implementation for User Story 1

- [ ] T009 [US1] Implement `pickRandom(quotes, rng = Math.random)` in `src/quote-picker.js` per contracts/modules.md (dual export)
- [ ] T010 [US1] Implement `src/app.js` bootstrap: read `window.QOTD`, pick an initial quote, and a single `render()` that sets `#quote-text` and `#quote-author` via `textContent` (FR-002, FR-009)

**Checkpoint**: MVP — page shows a random quote on every load.

---

## Phase 4: User Story 2 - Get a new quote on demand (Priority: P2)

**Goal**: "New quote" swaps the displayed quote without reload.

**Independent Test**: Press "New quote" repeatedly; a quote is shown each time, no reload.

### Implementation for User Story 2

- [ ] T011 [US2] In `src/app.js`, handle `click` on `#new-quote`: pick a quote with `pickRandom`, update state, call `render()` (FR-003; native `<button>` gives Enter/Space for FR-008)

**Checkpoint**: Stories 1 and 2 work together.

---

## Phase 5: User Story 3 - Favorite a quote and keep it after reload (Priority: P3)

**Goal**: Toggle favorite on the displayed quote; state survives reload.

**Independent Test**: Favorite, reload, return to the quote; still favorited.

### Tests for User Story 3

- [ ] T012 [P] [US3] Write `tests/favorites.test.js` with an in-memory fake storage: toggle on/off; `has`; `list`; persists JSON array of IDs under `qotd:favorites:v1`; a second store over the same storage sees the same favorites (reload, FR-006); unknown IDs dropped; corrupted JSON → empty; non-array JSON → empty; `getItem`/`setItem` throwing → no throw, in-memory still works, `persisted === false`; `storage` null → memory-only (FR-004, FR-006, FR-007)

### Implementation for User Story 3

- [ ] T013 [US3] Implement `createFavoritesStore({ storage, validIds })` and `STORAGE_KEY` in `src/favorites.js` per contracts/modules.md and data-model.md load rules (dual export)
- [ ] T014 [US3] In `src/app.js`, safely obtain `window.localStorage` (access wrapped in try/catch), create the store with the quote IDs, handle `click` on `#favorite` → `toggle(current.id)` → `render()`
- [ ] T015 [US3] Extend `render()` in `src/app.js`: set `#favorite` `aria-pressed` and label (`☆ Favorite` / `★ Favorited`) from `store.has(current.id)`; show `#storage-note` when `store.persisted` is false (FR-005, FR-007)

**Checkpoint**: All user stories independently functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

- [ ] T016 [P] Add `README.md` with how to run, test, and where the spec artifacts live
- [ ] T017 Run `npm test` — all green
- [ ] T018 Run every scenario in `quickstart.md` in a real browser (including keyboard-only and corrupted-storage checks)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)** → **Foundational (Phase 2)** → **US1 (Phase 3)** → US2 / US3 → **Polish**
- US2 and US3 both depend on `render()` from US1 (T010); they touch the same file (`src/app.js`),
  so their app.js tasks run sequentially, but their logic/test files are independent.

### Within Each User Story

- Tests are written first and must fail before implementation (Constitution III).
- Logic module before UI wiring.

### Parallel Opportunities

- T002, T003 in parallel; T004 and T007 in parallel.
- T008 (US1 test) and T012 (US3 test) can be written in parallel — different files.
- T013 (`favorites.js`) can be built in parallel with T009–T011.

## Parallel Example: User Story 3

```bash
Task: "Write tests/favorites.test.js"          # T012
Task: "Implement src/favorites.js"             # T013 (after T012 is red)
```

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Phases 1–2, then Phase 3 → validate: a random quote shows on load. Stop and demo.

### Incremental Delivery

1. + US2 → "New quote" works → demo.
2. + US3 → favorites persist → demo.
3. Polish → README, full test run, quickstart walkthrough.
