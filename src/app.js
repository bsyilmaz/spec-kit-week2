// UI layer: wires DOM events to the logic modules and renders state.
// All text is written with textContent (FR-009).
(function () {
  'use strict';

  const { QUOTES, pickRandom, createFavoritesStore } = window.QOTD;

  const els = {
    text: document.getElementById('quote-text'),
    author: document.getElementById('quote-author'),
    newQuote: document.getElementById('new-quote'),
    favorite: document.getElementById('favorite'),
    storageNote: document.getElementById('storage-note'),
  };

  // Reading window.localStorage can itself throw (e.g. blocked site data).
  function getLocalStorage() {
    try {
      return window.localStorage;
    } catch (_) {
      return null;
    }
  }

  const favorites = createFavoritesStore({
    storage: getLocalStorage(),
    validIds: QUOTES.map((quote) => quote.id),
  });

  const state = { current: pickRandom(QUOTES) };

  function render() {
    const isFavorite = favorites.has(state.current.id);
    els.text.textContent = state.current.text;
    els.author.textContent = state.current.author;
    els.favorite.setAttribute('aria-pressed', String(isFavorite));
    els.favorite.textContent = isFavorite ? '★ Favorited' : '☆ Favorite';
    els.storageNote.hidden = favorites.persisted;
  }

  els.newQuote.addEventListener('click', () => {
    state.current = pickRandom(QUOTES);
    render();
  });

  els.favorite.addEventListener('click', () => {
    favorites.toggle(state.current.id);
    render();
  });

  render();
})();
