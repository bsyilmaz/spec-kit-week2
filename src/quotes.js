// Built-in quote collection (FR-001). Data only — no logic.
// IDs are stable: never reuse an ID for a different quote (favorites reference them).
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) {
    module.exports = api;
  } else {
    root.QOTD = Object.assign(root.QOTD || {}, api);
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const QUOTES = [
    { id: 'seneca-luck', text: 'Luck is what happens when preparation meets opportunity.', author: 'Seneca' },
    { id: 'lao-tzu-journey', text: 'A journey of a thousand miles begins with a single step.', author: 'Lao Tzu' },
    { id: 'heraclitus-river', text: 'No man ever steps in the same river twice.', author: 'Heraclitus' },
    { id: 'aurelius-obstacle', text: 'The impediment to action advances action. What stands in the way becomes the way.', author: 'Marcus Aurelius' },
    { id: 'epictetus-wealth', text: 'Wealth consists not in having great possessions, but in having few wants.', author: 'Epictetus' },
    { id: 'confucius-slowly', text: 'It does not matter how slowly you go as long as you do not stop.', author: 'Confucius' },
    { id: 'socrates-unexamined', text: 'The unexamined life is not worth living.', author: 'Socrates' },
    { id: 'aristotle-excellence', text: 'We are what we repeatedly do. Excellence, then, is not an act, but a habit.', author: 'Aristotle (as paraphrased by Will Durant)' },
    { id: 'franklin-time', text: 'Lost time is never found again.', author: 'Benjamin Franklin' },
    { id: 'emerson-path', text: 'Do not go where the path may lead; go instead where there is no path and leave a trail.', author: 'Ralph Waldo Emerson' },
    { id: 'thoreau-dreams', text: 'Go confidently in the direction of your dreams. Live the life you have imagined.', author: 'Henry David Thoreau' },
    { id: 'twain-start', text: 'The secret of getting ahead is getting started.', author: 'Mark Twain' },
    { id: 'wilde-yourself', text: 'Be yourself; everyone else is already taken.', author: 'Oscar Wilde' },
    { id: 'seneca-learning', text: 'While we teach, we learn.', author: 'Seneca' },
    { id: 'publilius-plan', text: 'It is a bad plan that admits of no modification.', author: 'Publilius Syrus' },
  ].map((quote) => Object.freeze(quote));

  return { QUOTES: Object.freeze(QUOTES) };
});
