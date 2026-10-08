# Contract: Page / DOM

Elements `src/app.js` relies on in `index.html`:

| Selector | Element | Behavior |
|----------|---------|----------|
| `#quote` | `<figure aria-live="polite">` | Container for the current quote |
| `#quote-text` | `<blockquote>` | Quote text, set with `textContent` |
| `#quote-author` | `<figcaption>` | Author, set with `textContent` (rendered as "— Author") |
| `#new-quote` | `<button type="button">` | Label "New quote"; click shows a new quote (FR-003) |
| `#favorite` | `<button type="button" aria-pressed>` | Toggles favorite for current quote (FR-004/005) |
| `#storage-note` | `<p hidden>` | Shown only when favorites cannot be saved (FR-007) |

Favorite button states:

| State | `aria-pressed` | Visible label |
|-------|----------------|---------------|
| not favorited | `"false"` | `☆ Favorite` |
| favorited | `"true"` | `★ Favorited` |

Rendering rule: after every action (load, new quote, toggle) the UI calls a single
`render()` that sets the text, author and favorite button state from current state.
