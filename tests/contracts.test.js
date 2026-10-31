import test from 'node:test';
import assert from 'node:assert/strict';
import { validateActivity, createResult } from '../src/core/contracts.js';
const fixture = (gameId = 'memory', count = 3) => ({ activityId: 'demo', gameId, theme: 'dinossauros', images: Array.from({ length: count }, (_, i) => ({ id: `image-${i}`, url: `/demo/${i}.svg`, description: `Figura ${i}` })) });
test('each game requires its specific number of source images', () => {
  for (const [id, count] of [['memory', 3], ['puzzle', 1], ['sequence', 2]]) {
    assert.equal(validateActivity(fixture(id, count)).gameId, id);
    assert.throws(() => validateActivity(fixture(id, count + 1)));
  }
});
test('reject duplicate assets and unsafe image protocols', () => {
  const duplicate = fixture(); duplicate.images[1].id = duplicate.images[0].id;
  assert.throws(() => validateActivity(duplicate));
  const unsafe = fixture(); unsafe.images[0].url = 'javascript:alert(1)';
  assert.throws(() => validateActivity(unsafe));
});
test('results preserve identity and reject impossible counters', () => {
  const result = createResult(fixture(), { status: 'completed', attempts: 5, correct: 3, hints: 1 });
  assert.deepEqual(result, { activityId: 'demo', gameId: 'memory', status: 'completed', attempts: 5, correct: 3, hints: 1 });
  for (const invalid of [{ status: 'unknown' }, { status: 'completed', attempts: 1, correct: 2 }, { status: 'abandoned', hints: -1 }]) assert.throws(() => createResult(fixture(), invalid));
});
