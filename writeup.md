# Week 2 Write-up — Spec-Driven Development with Spec Kit

**Feature:** Quote-of-the-day page (random quote, "New quote" button, favorites that persist).
**Tooling:** Spec Kit `specify-cli` 1.1.2, `specify init spec-kit-week2 --integration claude`;
coding agent: Claude, using the `/speckit-*` skills that `specify init` installed in `.claude/skills/`.
**Result:** Converged after 4 converge runs; 30/30 automated tests pass; page opens directly from
`index.html` (no server, no build).

![Desktop, favorited quote](docs/screenshot-desktop.png)

---

## 1. Prompts given to each skill

| Stage | Prompt | Artifact(s) produced |
|-------|--------|----------------------|
| `/speckit-constitution` | `Create principles focused on code quality, testing, and maintainability.` | `.specify/memory/constitution.md` v1.0.0 — 5 principles: dependency-free readable code, testable core / thin UI (non-negotiable), testing discipline with `node --test`, maintainability & traceability, spec as source of truth |
| `/speckit-specify` | `A quote-of-the-day page: one random quote from a built-in list, a "New quote" button, and favoriting that persists across reloads.` | `specs/001-quote-of-the-day/spec.md` (3 prioritized user stories, FR-001…FR-009, SC-001…SC-005, edge cases), `checklists/requirements.md` |
| `/speckit-plan` | `Use plain HTML/CSS/JavaScript, no backend; persist favorites in localStorage.` | `plan.md`, `research.md` (R1–R6), `data-model.md`, `contracts/modules.md`, `contracts/ui.md`, `quickstart.md` |
| `/speckit-tasks` | *(no arguments)* | `tasks.md` — 18 tasks in 6 phases, organized by user story, tests first |
| `/speckit-implement` | *(no arguments)* — run 3 times (initial + after each converge that appended tasks) | `index.html`, `src/*.js`, `src/styles.css`, `tests/*.test.js`, `README.md` |
| `/speckit-converge` | *(no arguments)* — run 4 times | Phases 7, 8, 9 appended to `tasks.md`; 4th run reported **Converged** |
| Refinement (human review gate) | Edited `spec.md` by hand (FR-003, US2, SC-002), then updated the plan artifacts for the delta following the `/speckit-plan` workflow (equivalent prompt: `Spec rev 2: "New quote" must never show the quote that is currently displayed; keep the remaining quotes equally likely.`) | spec rev 2; `research.md` R2 rev 2; `pickNext` added to `contracts/modules.md`; plan revision log |

Every stage was reviewed before moving on and committed separately, so the git history shows the
loop step by step (`git log --oneline`).

## 2. Before / after: refining the spec changed the output

**What happened.** After the first `/speckit-implement`, all 19 tests passed and the first
`/speckit-converge` only found two small gaps (no automated check for FR-009, no README). But
clicking through the page in a browser, "New quote" sometimes *did nothing*. An automated browser
check confirmed it: **3 of 60 presses showed the same quote again** — with 15 quotes, a uniform
random pick repeats the current quote 1/15 ≈ 6.7% of the time.

The code was *correct according to the spec*, which is exactly why converge could not catch it.
So instead of patching the code, I fixed the spec.

**Before (spec rev 1, FR-003):**
> The page MUST provide a button labeled "New quote" that, when activated, replaces the displayed
> quote with a randomly selected quote from the collection, without a page reload.

**After (spec rev 2, FR-003):**
> … replaces the displayed quote with a quote chosen at random from the collection **excluding the
> currently displayed quote**, without a page reload. Every remaining quote MUST be equally likely.
> If the collection has only one quote, that quote is shown again.

Plus a new acceptance scenario (US2/AC2: "no two consecutive quotes are the same") and a sharper
SC-002 ("100% of presses produce a visible change").

**How the output changed.**

| | Before (rev 1) | After (rev 2) |
|-|----------------|---------------|
| Plan (research R2) | one function `pickRandom(quotes, rng)` used for load and button | `pickRandom` for load + new `pickNext(quotes, currentId, rng)`: filter out current, pick uniformly from the rest; alternatives "re-roll until different" and "shuffled deck" rejected |
| Converge | could not see the problem | run 2 flagged FR-003 as `contradicts` and appended T021–T023 |
| Tests | 4 picker tests | +6 `pickNext` tests (never returns current for any rng in [0,1), uniform over n−1, single-item fallback, …) |
| Code | `state.current = pickRandom(QUOTES)` | `state.current = pickNext(QUOTES, state.current.id)` |
| Browser check | 3/60 presses repeated | **0/300** presses repeated |

**A second, smaller plan refinement.** The first plan said tests run with `node --test tests/`.
During implement this failed on Node 22 (`Cannot find module '.../tests'`: a bare directory is
resolved as a module path). I corrected `plan.md`, `research.md` R6, `tasks.md` T002 and
`quickstart.md` to `node --test` (default discovery) *before* changing `package.json`, keeping the
constitution's "spec/plan first" rule.

## 3. Convergence outcome

| Run | Outcome | Findings → tasks appended |
|-----|---------|---------------------------|
| converge 1 | tasks appended (Phase 7) | FR-009 had no automated verification (partial) → T019 `tests/ui-safety.test.js`; README missing (missing) → T020 |
| *spec + plan rev 2* | — | FR-003 refined (see §2) |
| converge 2 | tasks appended (Phase 8) | FR-003 rev 2 not met — "New quote" can repeat (contradicts/missing) → T021–T023 |
| converge 3 | tasks appended (Phase 9) | `<noscript>` message not in the UI contract (unrequested, LOW) → T024 remove it |
| converge 4 | **✅ Converged — the implementation satisfies the spec, plan, and tasks.** `tasks.md` left byte-for-byte unchanged. | — |

Checked in the final run: 9 functional requirements, 4 buildable success criteria (SC-004 is a
user-research metric and was excluded), 9 acceptance scenarios, 5 edge cases, 6 plan decisions,
5 constitution principles + accessibility/performance constraints. 24/24 tasks complete.

**Verification evidence**

- `npm test` → 30 tests, 30 pass, 0 fail (quote data, picker, favorites store incl. corrupted /
  blocked / missing storage, UI-safety guard).
- Headless Chromium run of every `quickstart.md` scenario from `file://`: quote on load; 0/300
  repeated quotes; favorite → reload → still favorited (`qotd:favorites:v1` holds the id);
  keyboard-only (Tab order New quote → Favorite, Enter changes quote, Space toggles);
  corrupted storage → page works; blocked storage → page works and shows the "can't be saved"
  note; 360 px wide dark mode has no horizontal scroll; no console errors.

## 4. What I learned

SDD felt like overhead for the parts of this feature that were obvious — a one-line plan answer
("use localStorage") turned into a research file, a data model and two contracts, and most of
that text was never surprising. It paid off at the edges: writing edge cases and contracts up
front produced tests for corrupted and blocked storage that I would not have written otherwise,
and the "New quote" bug showed the real lesson — converge can only be as good as the spec, so
when behavior is wrong but "to spec," fixing the spec first made the agent's next pass produce the
right plan, tests and code without me touching the implementation. Keeping each stage as a
separate commit also made the human review gates concrete instead of a formality.
