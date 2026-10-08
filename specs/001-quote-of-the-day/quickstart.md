# Quickstart & Validation: Quote of the Day

## Prerequisites

- A current browser.
- Node.js ≥ 18 (only to run the automated tests).

## Run

```bash
# Option A: open directly
open index.html            # macOS (or double-click the file)

# Option B: static server
python3 -m http.server 8000   # then visit http://localhost:8000
```

## Automated tests

```bash
npm test          # = node --test (auto-discovers tests/*.test.js)
```

Expected: all tests pass, 0 failures. Covers FR-001–FR-004, FR-006, FR-007 (see the mapping in
[plan.md](./plan.md)).

## Manual validation scenarios

1. **Quote on load (US1, FR-002)** — Open the page. One quote and its author are visible with no
   interaction. Reload a few times: the quote varies.
2. **New quote (US2, FR-003)** — Press "New quote" several times. A quote is shown after each
   press; the page does not reload.
3. **Favorite toggle (US3, FR-004/005)** — Press "☆ Favorite". It changes to "★ Favorited"
   (`aria-pressed="true"` in DevTools). Press again: back to "☆ Favorite".
4. **Persistence (FR-006)** — Favorite the current quote, reload, press "New quote" until it
   appears again: it shows "★ Favorited". In DevTools → Application → Local Storage, key
   `qotd:favorites:v1` contains its ID.
5. **Keyboard only (FR-008)** — Using only Tab, Enter and Space, change the quote and toggle the
   favorite. Focus is clearly visible.
6. **Resilience (FR-007, FR-009)** — In DevTools set `qotd:favorites:v1` to `not json` and reload:
   page works, nothing is favorited. In a private window with storage blocked: page works and a
   short note says favorites won't be saved.
