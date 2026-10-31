import test from 'node:test';
import assert from 'node:assert/strict';
import { createGame, giveBack, help, isPlaced, N, placedCount, shuffledSlots, start, tapCell, tapPiece, unlock } from '../src/jogos/quebra-cabeca/rules.js';
import { BOARD, cellXY, CELL, composeRects, fitView, pieceFrame, SLOT, slotXY, TRAY, barLayout, cardColor } from '../src/jogos/quebra-cabeca/layout.js';

const newGame = () => {
  const s = createGame({ attempts: 0, correct: 0, hints: 0 });
  start(s);
  return s;
};
// Coloca a peça p na casa c e libera o encaixe, como a cena faz.
const put = (s, p, c) => {
  tapPiece(s, p);
  const r = tapCell(s, c);
  unlock(s);
  return r;
};

test('são 15 recortes únicos, um por casa, dentro da imagem composta', () => {
  const frames = Array.from({ length: N }, (_, p) => pieceFrame(p));
  assert.equal(new Set(frames.map(f => `${f.x},${f.y}`)).size, N);
  for (const f of frames) {
    assert.ok(f.x >= 0 && f.y >= 0 && f.x + f.w <= 1000 && f.y + f.h <= 600);
    assert.equal(f.w, f.h);
  }
});

test('a bandeja é uma permutação: cada peça tem um lugar só', () => {
  const slots = shuffledSlots(() => 0.37);
  assert.deepEqual([...slots].sort((a, b) => a - b), Array.from({ length: N }, (_, i) => i));
});

test('nada conta antes de Começar', () => {
  const s = createGame({ attempts: 0, correct: 0, hints: 0 });
  assert.equal(tapPiece(s, 0).type, 'ignored');
  assert.equal(help(s).type, 'ignored');
  assert.deepEqual(s.metrics, { attempts: 0, correct: 0, hints: 0 });
});

test('selecionar, trocar e cancelar a seleção não contam', () => {
  const s = newGame();
  tapPiece(s, 3);
  assert.equal(s.sel, 3);
  assert.deepEqual(s.msg, ['Agora toque na casa dela', '']);
  tapPiece(s, 5);
  assert.equal(s.sel, 5);
  tapPiece(s, 5);
  assert.equal(s.sel, null);
  assert.deepEqual(s.metrics, { attempts: 0, correct: 0, hints: 0 });
});

test('casa sem peça escolhida pede uma peça e não conta', () => {
  const s = newGame();
  tapCell(s, 4);
  assert.equal(s.msg[0], 'Primeiro escolha uma peça');
  assert.equal(s.metrics.attempts, 0);
});

test('colocação certa conta tentativa e acerto; a peça fica travada', () => {
  const s = newGame();
  const r = put(s, 2, 2);
  assert.equal(r.right, true);
  assert.deepEqual(s.metrics, { attempts: 1, correct: 1, hints: 0 });
  assert.equal(s.msg[0], 'Encaixou!');
  tapPiece(s, 2);
  assert.equal(s.msg[0], 'Essa casa já está completa');
  assert.equal(s.sel, null);
  tapPiece(s, 7);
  tapCell(s, 2);
  assert.equal(s.msg[0], 'Essa casa já está completa');
  assert.deepEqual(s.metrics, { attempts: 1, correct: 1, hints: 0 });
});

test('peça errada fica na casa, sem acerto, e pode ser trocada ou devolvida sem contar', () => {
  const s = newGame();
  const r = put(s, 1, 0);
  assert.equal(r.right, false);
  assert.equal(s.cellOf[1], 0);
  assert.equal(isPlaced(s, 1), false);
  assert.deepEqual(s.msg, ['Ela fica em outro lugar', 'Pode trocar quando quiser']);
  // Selecionar a peça errada do tabuleiro e devolver: não conta.
  tapPiece(s, 1);
  assert.equal(s.msg[1], 'Ou devolva para a bandeja');
  assert.equal(giveBack(s).type, 'move');
  unlock(s);
  assert.equal(s.cellOf[1], null);
  assert.equal(s.occ[0], null);
  assert.deepEqual(s.metrics, { attempts: 1, correct: 0, hints: 0 });
});

test('peça nova numa casa com peça errada: a errada volta à bandeja e conta uma tentativa', () => {
  const s = newGame();
  put(s, 1, 0);
  const r = put(s, 0, 0);
  assert.equal(r.displaced, 1);
  assert.equal(s.cellOf[1], null);
  assert.equal(s.occ[0], 0);
  assert.deepEqual(s.metrics, { attempts: 2, correct: 1, hints: 0 });
});

test('mover a peça errada de uma casa para outra libera a casa antiga', () => {
  const s = newGame();
  put(s, 1, 0);
  put(s, 1, 1);
  assert.equal(s.occ[0], null);
  assert.equal(s.occ[1], 1);
  assert.deepEqual(s.metrics, { attempts: 2, correct: 1, hints: 0 });
});

test('toques durante o encaixe são ignorados: nada duplica', () => {
  const s = newGame();
  tapPiece(s, 4);
  tapCell(s, 4);
  assert.equal(tapPiece(s, 6).type, 'ignored');
  assert.equal(tapCell(s, 6).type, 'ignored');
  assert.equal(help(s).type, 'ignored');
  assert.equal(giveBack(s).type, 'ignored');
  assert.deepEqual(s.metrics, { attempts: 1, correct: 1, hints: 0 });
  unlock(s);
  assert.equal(tapPiece(s, 6).type, 'select');
});

test('ajuda sem seleção escolhe a primeira peça que falta; repetir não conta', () => {
  const s = newGame();
  put(s, 0, 0);
  const r = help(s);
  assert.equal(r.type, 'hint');
  assert.equal(s.sel, 1);
  assert.equal(s.hint, 1);
  assert.equal(s.msg[0], 'A dica mostra a casa dela');
  help(s);
  assert.equal(s.msg[0], 'A dica já está na tela');
  assert.equal(s.metrics.hints, 1);
});

test('ajuda com peça selecionada mostra a casa dela; trocar de peça apaga a dica', () => {
  const s = newGame();
  tapPiece(s, 9);
  help(s);
  assert.equal(s.hint, 9);
  tapPiece(s, 3);
  assert.equal(s.hint, null);
  help(s);
  assert.equal(s.hint, 3);
  assert.equal(s.metrics.hints, 2);
  tapCell(s, 3);
  assert.equal(s.hint, null);
});

test('a partida só termina com as 15 peças nos lugares certos', () => {
  const s = newGame();
  put(s, 0, 1); // uma errada no caminho
  for (let p = 0; p < N - 1; p++) {
    const r = put(s, p, p);
    assert.equal(r.completed, false);
    assert.equal(s.phase, 'play');
  }
  const last = put(s, N - 1, N - 1);
  assert.equal(last.completed, true);
  assert.equal(s.phase, 'done');
  assert.equal(placedCount(s), N);
  assert.deepEqual(s.metrics, { attempts: N + 1, correct: N, hints: 0 });
  assert.equal(tapPiece(s, 0).type, 'ignored');
  assert.equal(help(s).type, 'ignored');
});

test('layout: casas dentro do tabuleiro e lugares dentro da bandeja, sem sobreposição', () => {
  for (let i = 0; i < N; i++) {
    const [cx, cy] = cellXY(i);
    assert.ok(cx >= BOARD.x && cy >= BOARD.y && cx + CELL <= BOARD.x + BOARD.w && cy + CELL <= BOARD.y + BOARD.h);
    const [sx, sy] = slotXY(i);
    assert.ok(sx >= TRAY.x && sy >= TRAY.y && sx + SLOT <= TRAY.x + TRAY.w && sy + SLOT <= TRAY.y + TRAY.h);
  }
  const slots = Array.from({ length: N }, (_, i) => slotXY(i).join(','));
  assert.equal(new Set(slots).size, N);
});

test('barra sem Som dá mais espaço à instrução', () => {
  const com = barLayout({ sound: true }), sem = barLayout({ sound: false });
  assert.equal(sem.som, null);
  assert.ok(sem.instr.w > com.instr.w);
  assert.equal(com.ajuda.x + com.ajuda.w + 14, com.som.x);
});

test('escala FIT mantém a proporção e centraliza', () => {
  assert.deepEqual(fitView(960, 600), { zoom: 1, x: 0, y: 0 });
  const v = fitView(1024, 768);
  assert.ok(Math.abs(v.zoom - 1024 / 960) < 1e-9);
  assert.equal(v.x, 0);
  assert.ok(v.y > 0);
});

test('imagem 5:3 preenche; imagem 1:1 fica inteira no centro e a ampliada cobre tudo', () => {
  assert.equal(composeRects(500, 300).fills, true);
  const { contain, cover, fills } = composeRects(300, 300);
  assert.equal(fills, false);
  assert.deepEqual(contain, { x: 200, y: 0, w: 600, h: 600 });
  assert.ok(cover.x <= 0 && cover.y <= 0 && cover.w >= 1000 && cover.h >= 600);
});

test('cor da cartolina desconhecida usa o pêssego', () => {
  assert.equal(cardColor('menta'), '#cdeedd');
  assert.equal(cardColor('roxo-neon'), '#ffd9a8');
  assert.equal(cardColor(undefined), '#ffd9a8');
});
