import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { validateActivity, MemoryRound, shuffledDeck, cardLayout } from '../src/model.js';
const fixture = () => ({ theme: 'Transportes', images: ['train', 'rocket', 'sailboat'].map(id => ({ id, url: `./assets/${id}.svg`, description: id })) });
const images = () => validateActivity(fixture()).images;
const round = () => new MemoryRound(images(), () => .999);
const indices = (state, id) => state.cards.flatMap((card, i) => card.id === id ? [i] : []);

test('configuration requires three distinct local files and usable descriptions', () => {
  const actual = validateActivity(fixture(), 'https://example.test/games/memory/activity.json');
  assert.equal(actual.images[0].url, 'https://example.test/games/memory/assets/train.svg');
  const cases = [null, { ...fixture(), theme: ' ' }, { ...fixture(), images: fixture().images.slice(1) }];
  for (const value of cases) assert.throws(() => validateActivity(value));
  for (const patch of [{ id: 'rocket' }, { id: ' ' }, { description: '' }, { url: 'javascript:alert(1)' }, { url: 'https://other.test/image.png' }, { url: './assets/rocket.svg' }]) {
    const value = fixture(); Object.assign(value.images[0], patch);
    assert.throws(() => validateActivity(value));
  }
});

test('shuffling preserves exactly two copies of each source and stable unique card keys', () => {
  for (const random of [() => 0, () => .5, () => .999]) {
    const deck = shuffledDeck(images(), random);
    assert.equal(deck.length, 6); assert.equal(new Set(deck.map(c => c.key)).size, 6);
    for (const image of images()) {
      const pair = deck.filter(c => c.id === image.id);
      assert.equal(pair.length, 2); assert.equal(pair[0].url, pair[1].url);
    }
  }
  assert.notDeepEqual(shuffledDeck(images(), () => 0), shuffledDeck(images(), () => .999));
});

test('start gate and invalid/repeated selections do not count as comparisons', () => {
  const game = round();
  assert.equal(game.select(0), false); assert.equal(game.start(), true); assert.equal(game.start(), false);
  for (const index of [-1, 6, NaN, .5, '1']) assert.equal(game.select(index), false);
  assert.equal(game.select(0), true); assert.equal(game.select(0), false);
  assert.equal(game.state.attempts, 0); assert.deepEqual(game.state.selected, [0]);
});

test('mismatch remains visible and blocks extra cards until explicit retry', () => {
  const game = round(); game.start(); game.select(0); game.select(2);
  const snapshot = game.state;
  assert.equal(snapshot.phase, 'mismatch'); assert.equal(snapshot.attempts, 1);
  assert.equal(game.select(4), false); assert.deepEqual(game.state, snapshot);
  assert.deepEqual(game.state.selected, [0, 2]);
  assert.equal(game.retry(), true); assert.deepEqual(game.state.selected, []);
  assert.equal(game.state.attempts, 1); assert.equal(game.retry(), false);
});

test('pairs stay in place, cannot score twice and complete exactly once', () => {
  const game = round(); game.start(); const cards = game.state.cards;
  for (const [pairIndex, image] of images().entries()) {
    const [a, b] = indices(game.state, image.id);
    game.select(a); game.select(b);
    assert.equal(game.state.pairs, pairIndex + 1);
    assert.equal(game.select(a), false); assert.equal(game.select(b), false);
    assert.equal(game.state.attempts, pairIndex + 1);
    assert.equal(game.state.cards, cards);
  }
  assert.equal(game.state.phase, 'completed'); assert.equal(game.select(0), false);
  const fresh = round(); fresh.start();
  assert.equal(fresh.state.attempts, 0); assert.equal(fresh.state.pairs, 0);
  assert.deepEqual(fresh.state.selected, []); assert.deepEqual(fresh.state.matched, []);
});

test('external snapshots cannot mutate selection or matched progress', () => {
  const game = round(); game.start(); game.select(0);
  game.state.selected.push(2); game.state.matched.push(0, 1);
  assert.deepEqual(game.state.selected, [0]); assert.equal(game.state.pairs, 0);
  assert.throws(() => { game.state.cards[0].id = 'changed'; });
});

test('responsive geometry fits portrait and landscape boards with separated touch targets', () => {
  for (const [w, h, columns] of [[288, 432, 2], [428, 642, 2], [424, 283, 3], [580, 387, 3]]) {
    const rects = cardLayout(w, h);
    assert.equal(rects.length, 6);
    assert.equal(new Set(rects.map(r => r.x)).size, columns);
    for (const rect of rects) {
      assert.ok(rect.x >= 0 && rect.y >= 0);
      assert.ok(rect.x + rect.width <= w && rect.y + rect.height <= h);
      assert.ok(rect.width > 44 && rect.height > 44);
    }
    rects.forEach((a, i) => rects.slice(i + 1).forEach(b => {
      assert.ok(a.x + a.width <= b.x || b.x + b.width <= a.x || a.y + a.height <= b.y || b.y + b.height <= a.y);
    }));
  }
});

test('bundled standalone activity references existing assets', async () => {
  const file = new URL('../public/activity.json', import.meta.url);
  const value = JSON.parse(await readFile(file, 'utf8'));
  validateActivity(value);
  for (const image of value.images) assert.ok((await readFile(new URL(image.url, file))).length > 0);
});
