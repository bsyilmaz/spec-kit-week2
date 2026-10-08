// Quote selection logic (FR-002, FR-003). DOM-free; randomness is injected for tests.
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

  return { pickRandom };
});
