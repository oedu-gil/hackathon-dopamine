import test from 'node:test';
import assert from 'node:assert/strict';
import { choose, createRound, createSession, hintText, showHint, unlock, validateSequenceExtras, wordFor } from '../src/games/sequence/rules.js';
import { computeLayout } from '../src/games/sequence/layout.js';

const A = { id: 'a', url: '/a.svg', description: 'Dinossauro verde', label: 'dino' };
const B = { id: 'b', url: '/b.svg', description: 'Ovo de dinossauro' };
const newSession = () => createSession({ attempts: 0, correct: 0, hints: 0 });

test('fileira é A-B-A-B, resposta é A e as opções são A e B sorteadas', () => {
  const first = createRound([A, B], () => 0.1);
  const second = createRound([A, B], () => 0.9);
  assert.deepEqual(first.pattern.map(i => i.id), ['a', 'b', 'a', 'b']);
  assert.equal(first.answer, A);
  assert.deepEqual(first.options.map(i => i.id), ['a', 'b']);
  assert.deepEqual(second.options.map(i => i.id), ['b', 'a']);
});

test('erro permite nova tentativa depois do desbloqueio; escolhas no bloqueio não contam', () => {
  const round = createRound([A, B]);
  const s = newSession();
  assert.equal(choose(s, round, 'b'), 'wrong');
  assert.equal(choose(s, round, 'b'), 'ignored');
  unlock(s);
  assert.equal(choose(s, round, 'b'), 'wrong');
  unlock(s);
  assert.equal(choose(s, round, 'a'), 'right');
  assert.deepEqual(s.metrics, { attempts: 3, correct: 1, hints: 0 });
});

test('depois do acerto, cliques e desbloqueio não mudam nada', () => {
  const round = createRound([A, B]);
  const s = newSession();
  choose(s, round, 'a');
  unlock(s);
  assert.equal(choose(s, round, 'a'), 'ignored');
  assert.equal(showHint(s), false);
  assert.deepEqual(s.metrics, { attempts: 1, correct: 1, hints: 0 });
});

test('dica conta uma vez e usa rótulo ou descrição', () => {
  const round = createRound([A, B]);
  const s = newSession();
  assert.equal(showHint(s), true);
  assert.equal(showHint(s), false);
  assert.equal(s.metrics.hints, 1);
  assert.equal(wordFor(B), 'Ovo de dinossauro');
  assert.equal(hintText(round, false), 'dino · Ovo de dinossauro · dino · Ovo de dinossauro · ?');
  assert.ok(hintText(round, true).endsWith('· dino'));
});

test('campos opcionais do jogo são validados', () => {
  const ok = { images: [A, B], context: 'Uma fila.' };
  assert.equal(validateSequenceExtras(ok), ok);
  assert.throws(() => validateSequenceExtras({ images: [{ ...A, label: ' ' }, B] }));
  assert.throws(() => validateSequenceExtras({ images: [A, B], context: 42 }));
});

test('layout cabe na tela nos tamanhos previstos e respeita os alvos mínimos', () => {
  for (const [w, h, mode, minOpt] of [[390, 844, 'narrow', 120], [375, 667, 'narrow', 96], [844, 390, 'side', 104], [820, 1180, 'wide', 140], [1180, 820, 'wide', 140], [960, 600, 'wide', 96]]) {
    const L = computeLayout(w, h);
    assert.equal(L.mode, mode, `${w}x${h}`);
    assert.ok(L.opt >= minOpt, `${w}x${h} opções ${L.opt}`);
    assert.ok(L.msg.y + 12 <= L.tray.y || L.mode === 'side', `${w}x${h} mensagem sobre a bandeja`);
    for (const p of [...L.slots, ...L.options]) assert.ok(p.x > 0 && p.x < w && p.y > 0 && p.y < h, `${w}x${h} fora da tela`);
    const [o1, o2] = L.options;
    assert.ok(o2.x - o1.x - L.opt >= 23.99, `${w}x${h} opções muito próximas`);
  }
});
