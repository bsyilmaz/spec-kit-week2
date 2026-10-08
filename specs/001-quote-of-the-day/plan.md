# Implementation Plan: Quote of the Day

**Branch**: `001-quote-of-the-day` | **Date**: 2026-10-09 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-quote-of-the-day/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command; its definition describes the execution workflow.

## Summary

A single static page shows one random quote (text + author) from a built-in list, a
"New quote" button that swaps it without reloading, and a favorite toggle whose state is saved in
`localStorage` so it survives reloads. Technical approach: plain HTML/CSS/JavaScript with no
backend and no build step; logic lives in small DOM-free modules (quote picker, favorites store)
that are unit-tested with Node's built-in test runner, and a thin UI script wires them to the page.

## Technical Context

**Language/Version**: HTML5, CSS3, JavaScript (ES2020) — no transpilation

**Primary Dependencies**: None at runtime. Tests use Node.js ≥ 18 built-in `node:test` and
`node:assert` only (zero installs).

**Storage**: Browser `localStorage`, key `qotd:favorites:v1`, value = JSON array of quote IDs.

**Testing**: `node --test tests/` for logic modules (picker, favorites store, quote data
validity); manual browser checks in [quickstart.md](./quickstart.md) for layout/keyboard.

**Target Platform**: Current evergreen browsers (desktop + mobile); opened via a static server
or directly from disk (`file://`).

**Project Type**: Static single-page web app (no backend).

**Performance Goals**: Quote visible on first paint (< 1 s, SC-001); "New quote" swap < 100 ms
(SC-002) — trivially met, all data is in memory.

**Constraints**: No network requests at runtime; no frameworks or build tools (Constitution I);
must work when storage is unavailable or corrupted (FR-007).

**Scale/Scope**: 1 page, ~15 quotes, 4 small JS files, ~200 lines of app code.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Gate | Status |
|-----------|------|--------|
| I. Code quality, dependency-free | Plain HTML/CSS/JS, no runtime deps, `textContent` only | ✅ Pass |
| II. Testable core, thin UI | Picker and favorites store are DOM-free; `Math.random` and `localStorage` injected | ✅ Pass |
| III. Testing discipline | Every FR mapped to a test or a quickstart check (see mapping below); `node --test`, zero installs | ✅ Pass |
| IV. Maintainability | Quotes in their own data file; versioned namespaced storage key; graceful degradation | ✅ Pass |
| V. Spec is source of truth | Plan traces every module to FR IDs | ✅ Pass |
| Constraints: accessibility | Real `<button>`s, `aria-pressed` on favorite, `aria-live` on quote | ✅ Pass |

**Post-design re-check (after Phase 1)**: ✅ Still passing — no new dependencies or layers were
introduced by the data model or contracts. No Complexity Tracking entries needed.

**Requirement → verification mapping**

| Requirement | Verified by |
|-------------|-------------|
| FR-001 | `tests/quotes.test.js` (≥ 10 quotes, unique IDs, non-empty text/author) |
| FR-002, FR-003 | `tests/quote-picker.test.js` + quickstart steps 1–2 |
| FR-004, FR-005 | `tests/favorites.test.js` (toggle) + quickstart step 3 (visual/ARIA state) |
| FR-006 | `tests/favorites.test.js` (round-trip through a fake storage) + quickstart step 4 |
| FR-007 | `tests/favorites.test.js` (corrupted JSON, throwing storage, missing storage) |
| FR-008 | quickstart step 5 (keyboard-only pass) |
| FR-009 | Code review rule (`textContent` only) + quickstart step 6 |

## Project Structure

### Documentation (this feature)

```text
specs/001-quote-of-the-day/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/           # Phase 1 output (/speckit-plan command)
│   ├── modules.md       # Public functions of the logic modules
│   └── ui.md            # DOM contract the UI script relies on
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)

```text
index.html               # The page (entry point, opens directly)
src/
├── quotes.js            # Data: built-in quote list (FR-001)
├── quote-picker.js      # Logic: pick a quote, injectable RNG (FR-002, FR-003)
├── favorites.js         # Logic: favorites store over injectable storage (FR-004–FR-007)
├── app.js               # UI: wires DOM events to logic, renders state (FR-005, FR-008, FR-009)
└── styles.css           # Presentation
tests/
├── quotes.test.js
├── quote-picker.test.js
└── favorites.test.js
package.json             # Only a "test" script; no dependencies
```

**Structure Decision**: Single static project. The page sits at the repository root so it can be
opened directly or served by any static host (e.g. GitHub Pages). Logic modules are classic
scripts that attach to a single `window.QOTD` namespace in the browser and also export via
`module.exports` for Node tests (see research R1), so the page works from `file://` with no
server.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No violations.
