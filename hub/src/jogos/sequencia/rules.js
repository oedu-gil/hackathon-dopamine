// Regras puras da sequência (ABAB e outros modelos) (sem Phaser), testadas em tests/sequence.test.js.

const MAX_LABEL = 24;
const MAX_CONTEXT = 120;

// Campos opcionais lidos só por este jogo: activity.context e images[].label.
export function validateSequenceExtras(activity) {
  if (activity.context !== undefined && (typeof activity.context !== 'string' || activity.context.length > MAX_CONTEXT)) throw new Error('Frase de contexto inválida.');
  for (const image of activity.images) {
    if (image.label !== undefined && (typeof image.label !== 'string' || !image.label.trim() || image.label.length > MAX_LABEL)) throw new Error('Rótulo de imagem inválido.');
  }
  return activity;
}

export function wordFor(image) {
  return (image.label ?? image.description).trim();
}

// Cada modelo tem 5 letras: as 4 primeiras formam a fileira e a 5ª é a resposta (A e B são as duas imagens).
const FIRST_TEMPLATE = 'ABABA';
const OTHER_TEMPLATES = ['AABAA', 'ABBAB', 'AABBA', 'ABAAB', 'BAABB'];
export const ROUNDS = 5;

function shuffle(list, random) {
  const out = [...list];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

// Uma rodada: o modelo escolhe a ordem; as opções (as duas imagens) são sorteadas.
export function createRound(images, random = Math.random, template = FIRST_TEMPLATE) {
  const swap = random() < 0.5;
  const pick = letter => images[(letter === 'A') !== swap ? 0 : 1];
  const cells = [...template].map(pick);
  return { template, pattern: cells.slice(0, 4), answer: cells[4], options: random() < 0.5 ? [images[0], images[1]] : [images[1], images[0]] };
}

// A primeira rodada é a mais simples (ABAB); as outras vêm em ordem sorteada, sem repetir modelo.
export function createRounds(images, random = Math.random, total = ROUNDS) {
  const templates = [FIRST_TEMPLATE, ...shuffle(OTHER_TEMPLATES, random).slice(0, total - 1)];
  return templates.map(template => createRound(images, random, template));
}

export function hintText(round, solved) {
  return [...round.pattern.map(wordFor), solved ? wordFor(round.answer) : '?'].join(' · ');
}

export function createSession(metrics) {
  return { metrics, locked: false, solved: false, hintShown: false };
}

// Devolve 'ignored', 'wrong' ou 'right'. Escolhas durante o bloqueio ou após o acerto não contam.
export function choose(session, round, imageId) {
  if (session.locked || session.solved) return 'ignored';
  session.locked = true;
  session.metrics.attempts++;
  if (imageId !== round.answer.id) return 'wrong';
  session.metrics.correct++;
  session.solved = true;
  return 'right';
}

export function unlock(session) {
  if (!session.solved) session.locked = false;
}

// A dica conta uma vez por partida.
export function showHint(session) {
  if (session.solved || session.hintShown) return false;
  session.hintShown = true;
  session.metrics.hints++;
  return true;
}
