// Regras puras da sequência ABAB (sem Phaser), testadas em tests/sequence.test.js.

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

// A é a primeira imagem e sempre a resposta certa; as opções são sorteadas.
export function createRound(images, random = Math.random) {
  const [a, b] = images;
  return { pattern: [a, b, a, b], answer: a, options: random() < 0.5 ? [a, b] : [b, a] };
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
