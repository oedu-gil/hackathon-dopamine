// Regras do quebra-cabeça, sem Phaser: estado da partida, seleção, encaixe, ajuda e contagem.
// Segue docs/quebra-cabeca/REGRAS-E-INTERACOES.md (§2 e §3) e o protótipo aprovado.
export const N = 15;
export const COLS = 5;

// Bandeja estável: cada peça ganha um lugar fixo, sorteado no começo da partida.
export function shuffledSlots(random = Math.random) {
  const order = Array.from({ length: N }, (_, i) => i);
  for (let i = N - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  const slotOf = Array(N);
  order.forEach((piece, slot) => { slotOf[piece] = slot; });
  return slotOf;
}

// `metrics` é o objeto da BaseGameScene: as regras contam direto nele.
export function createGame(metrics, random) {
  return {
    phase: 'start',
    slotOf: shuffledSlots(random),
    cellOf: Array(N).fill(null), // casa onde cada peça está (null = na bandeja)
    occ: Array(N).fill(null), // peça que ocupa cada casa
    sel: null,
    hint: null,
    busy: false,
    msg: ['Escolha uma peça', ''],
    metrics,
  };
}

export const isPlaced = (s, p) => s.cellOf[p] === p;
export const placedCount = s => s.cellOf.filter((c, p) => c === p).length;
const say = (s, main, sub = '') => { s.msg = [main, sub]; };
const ready = s => s.phase === 'play' && !s.busy;
const IGNORED = { type: 'ignored' };

export function start(s) {
  if (s.phase !== 'start') return IGNORED;
  s.phase = 'play';
  say(s, 'Escolha uma peça');
  return { type: 'update' };
}

export function tapPiece(s, p) {
  if (!ready(s)) return IGNORED;
  const onBoard = s.cellOf[p] !== null;
  // Peça certa, ou peça do tabuleiro com outra selecionada: vale como tocar na casa dela.
  if (onBoard && (isPlaced(s, p) || (s.sel !== null && s.sel !== p))) return tapCell(s, s.cellOf[p]);
  if (s.sel === p) {
    s.sel = null; s.hint = null; say(s, 'Escolha uma peça');
    return { type: 'update' };
  }
  s.sel = p;
  if (s.hint !== p) s.hint = null;
  say(s, 'Agora toque na casa dela', onBoard ? 'Ou devolva para a bandeja' : '');
  return { type: 'select' };
}

export function tapCell(s, c) {
  if (!ready(s)) return IGNORED;
  const occ = s.occ[c];
  if (occ !== null && isPlaced(s, occ)) { say(s, 'Essa casa já está completa'); return { type: 'update' }; }
  if (s.sel === null) {
    if (occ !== null) return tapPiece(s, occ);
    say(s, 'Primeiro escolha uma peça');
    return { type: 'update' };
  }
  if (occ === s.sel) { s.sel = null; s.hint = null; say(s, 'Escolha uma peça'); return { type: 'update' }; }
  return place(s, s.sel, c);
}

// Cada colocação conta +1 tentativa; a certa conta também +1 acerto.
function place(s, p, c) {
  s.metrics.attempts++;
  const from = s.cellOf[p];
  if (from !== null) s.occ[from] = null;
  const displaced = s.occ[c];
  if (displaced !== null) s.cellOf[displaced] = null; // a peça errada que estava ali volta ao lugar dela
  s.cellOf[p] = c;
  s.occ[c] = p;
  s.sel = null;
  s.hint = null;
  s.busy = true;
  const right = p === c;
  if (right) {
    s.metrics.correct++;
    say(s, 'Encaixou!');
  } else {
    say(s, 'Ela fica em outro lugar', 'Pode trocar quando quiser');
  }
  const completed = placedCount(s) === N;
  if (completed) { s.phase = 'done'; say(s, 'Pronto!'); }
  return { type: 'place', piece: p, cell: c, right, displaced, completed };
}

// "Devolver aqui": a peça errada do tabuleiro volta à bandeja, sem contar.
export function giveBack(s) {
  if (!ready(s) || s.sel === null || s.cellOf[s.sel] === null) return IGNORED;
  const p = s.sel;
  s.occ[s.cellOf[p]] = null;
  s.cellOf[p] = null;
  s.sel = null;
  s.hint = null;
  s.busy = true;
  say(s, 'Escolha uma peça');
  return { type: 'move', piece: p };
}

// Sem peça selecionada, escolhe a primeira que falta. Só a dica nova conta.
export function help(s) {
  if (!ready(s)) return IGNORED;
  let target = s.sel;
  if (target === null) {
    target = Array.from({ length: N }, (_, i) => i).find(i => !isPlaced(s, i));
    s.sel = target;
  }
  if (s.hint === target) {
    say(s, 'A dica já está na tela', 'É a casa com o contorno tracejado');
    return { type: 'update' };
  }
  s.hint = target;
  s.metrics.hints++;
  say(s, 'A dica mostra a casa dela', s.cellOf[target] !== null ? 'Ou devolva para a bandeja' : '');
  return { type: 'hint', piece: target };
}

// Fim do encaixe: volta a aceitar toques.
export function unlock(s) {
  s.busy = false;
}
