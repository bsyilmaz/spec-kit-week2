# Quote of the Day Constitution

## Core Principles

### I. Code Quality: Small, Readable, Dependency-Free

- Code MUST be plain, standards-based HTML, CSS and JavaScript (ES modules); no frameworks,
  build steps, bundlers or runtime dependencies unless an amendment justifies them.
- Each module MUST have one clear responsibility; functions SHOULD stay under ~30 lines and
  MUST have descriptive names. No dead code, no commented-out code, no `console.log` left in
  shipped files.
- User-facing text MUST be rendered with `textContent` (never `innerHTML` with data), so that
  quote content can never be interpreted as markup.

Rationale: a tiny static app should stay understandable at a glance and safe by construction;
every dependency or abstraction must earn its place.

### II. Testable Core, Thin UI (NON-NEGOTIABLE)

- Application logic (quote selection, favorites state, persistence) MUST live in pure or
  injectable modules that do not touch the DOM, so they can run under Node without a browser.
- Browser APIs that hold state (`localStorage`, `Math.random`) MUST be injected or wrapped,
  never reached for implicitly inside logic modules.
- The DOM layer MUST only wire events to the core and render the core's state.

Rationale: separating logic from presentation is what makes automated testing cheap and
regressions visible.

### III. Testing Discipline

- Every functional requirement in a spec MUST map to at least one automated test or, where
  automation is impractical (visual layout), to an explicit manual check in `quickstart.md`.
- Tests MUST run with zero installs using Node's built-in runner (`node --test`).
- Tests for a behavior SHOULD be written before or alongside its implementation, and the full
  suite MUST pass before a task is marked complete.
- Edge cases named in the spec (empty or corrupted storage, storage unavailable, single-item
  lists) MUST have tests.

Rationale: tests are the executable form of the spec and the evidence for convergence.

### IV. Maintainability & Traceability

- Data (the built-in quote list) MUST be separate from logic, so content can change without
  touching code.
- Persisted data MUST use a namespaced, versioned key and MUST degrade gracefully (app still
  works, favorites simply not saved) when storage is missing, full, or corrupted.
- Commits and tasks SHOULD reference the requirement or task ID they implement (e.g. `FR-004`,
  `T012`).

Rationale: future changes should be local, and every line should be traceable to a reason.

### V. Spec Is the Source of Truth

- Behavior changes MUST start as a change to `spec.md` (what/why) or `plan.md` (how); code is
  then regenerated or edited to match. Code MUST NOT silently diverge from the spec.
- When implementation reveals a vague or wrong requirement, the spec/plan is refined first and
  the refinement is recorded.

Rationale: the durable artifact is the spec; code is its current implementation.

## Additional Constraints

- Target: current evergreen browsers (Chrome, Firefox, Safari, Edge); the page MUST work when
  opened from a static server and SHOULD degrade gracefully from `file://`.
- Accessibility: interactive controls MUST be real `<button>` elements with accessible names;
  state such as "favorited" MUST be exposed to assistive tech (e.g. `aria-pressed`); the page
  MUST be usable by keyboard alone.
- Performance: no network requests at runtime; the page MUST be interactive immediately on load.

## Development Workflow

- Stages follow the Spec Kit loop: constitution → specify → plan → tasks → implement →
  converge. Each artifact is reviewed by a human before the next stage begins.
- Quality gates before a task is marked done: `node --test` passes, no principle above is
  violated, and the related requirement is checked off.
- Implement → converge repeats until converge reports no remaining gaps.

## Governance

- This constitution supersedes ad-hoc preferences. Plans MUST include a Constitution Check;
  any violation MUST be justified in the plan's Complexity Tracking table or removed.
- Amendments are made by editing this file, recording the reason in the commit message, and
  bumping the version: MAJOR for removed/redefined principles, MINOR for new principles or
  materially expanded guidance, PATCH for wording.
- Reviews (human or `/speckit-analyze` / `/speckit-converge`) MUST check compliance with these
  principles.

**Version**: 1.0.0 | **Ratified**: 2026-10-09 | **Last Amended**: 2026-10-09
