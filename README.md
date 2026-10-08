# Quote of the Day — Spec Kit Week 2

A small page that shows a random quote, a **New quote** button that always shows a different
quote, and a **Favorite** toggle that survives a reload. Built spec-first with
[GitHub Spec Kit](https://github.com/github/spec-kit) (v1.1.2, Claude integration).

## Run

Open `index.html` in a browser (double-click works — no server, no build), or:

```bash
python3 -m http.server 8000   # http://localhost:8000
```

## Test

```bash
npm test      # Node ≥ 18, zero dependencies (node --test)
```

## Where things are

| Path | What |
|------|------|
| `.specify/memory/constitution.md` | Project principles (code quality, testing, maintainability) |
| `specs/001-quote-of-the-day/spec.md` | What & why (rev 2) |
| `specs/001-quote-of-the-day/plan.md` + `research.md`, `data-model.md`, `contracts/`, `quickstart.md` | How |
| `specs/001-quote-of-the-day/tasks.md` | Task list incl. three Convergence phases (7–9) |
| `index.html`, `src/` | The page |
| `tests/` | Unit tests for the logic modules + a UI-safety guard |
| `writeup.md` | Prompts, the spec refinement, convergence outcome, reflection |
| `docs/` | Screenshots |
