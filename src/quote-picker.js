// Quote selection logic: pickRandom on load (FR-002), pickNext for "New quote" (FR-003 rev 2).
// DOM-free; randomness is injected for tests.
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) {
    module.exports = api;
  } else {
    root.QOTD = Object.assign(root.QOTD || {}, api);
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  /**
   * Pick a quote uniformly at random.
   * @param {Array} quotes non-empty list
   * @param {() => number} rng returns a number in [0, 1)
   */
  function pickRandom(quotes, rng = Math.random) {
    if (!Array.isArray(quotes) || quotes.length === 0) {
      throw new Error('pickRandom requires a non-empty array of quotes');
    }
    return quotes[Math.floor(rng() * quotes.length)];
  }

  /**
   * Pick a quote other than the current one, uniformly among the rest (FR-003 rev 2).
   * Falls back to the full list when nothing else is left (single-quote collection).
   * @param {Array} quotes non-empty list
   * @param {string} currentId id of the quote currently displayed
   * @param {() => number} rng returns a number in [0, 1)
   */
  function pickNext(quotes, currentId, rng = Math.random) {
    if (!Array.isArray(quotes) || quotes.length === 0) {
      throw new Error('pickNext requires a non-empty array of quotes');
    }
    const candidates = quotes.filter((quote) => quote.id !== currentId);
    return pickRandom(candidates.length > 0 ? candidates : quotes, rng);
  }

  return { pickRandom, pickNext };
});
