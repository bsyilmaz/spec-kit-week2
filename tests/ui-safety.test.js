'use strict';
// FR-009 / Constitution I: quote text must never be interpreted as markup.
// Static guard: the UI layer may only write text via textContent.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const appSource = fs.readFileSync(path.join(__dirname, '..', 'src', 'app.js'), 'utf8');

for (const api of ['innerHTML', 'outerHTML', 'insertAdjacentHTML', 'document.write']) {
  test(`src/app.js does not use ${api}`, () => {
    assert.equal(appSource.includes(api), false, `${api} found in src/app.js`);
  });
}

test('src/app.js renders quote text and author with textContent', () => {
  assert.match(appSource, /els\.text\.textContent\s*=/);
  assert.match(appSource, /els\.author\.textContent\s*=/);
});
