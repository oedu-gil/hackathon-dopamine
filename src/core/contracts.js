export const GAME_IDS = Object.freeze(['memory', 'puzzle', 'sequence']);
export const RESULT_EVENT = 'activity-result';
const requiredImages = { memory: 3, puzzle: 1, sequence: 2 };

export function validateActivity(activity) {
  if (!activity || typeof activity.activityId !== 'string' || !activity.activityId.trim()) throw new Error('Atividade sem identificador.');
  if (!GAME_IDS.includes(activity.gameId)) throw new Error('Jogo desconhecido.');
  if (typeof activity.theme !== 'string' || !activity.theme.trim()) throw new Error('Tema ausente.');
  if (!Array.isArray(activity.images) || activity.images.length !== requiredImages[activity.gameId]) throw new Error('Quantidade de imagens inválida.');
  const ids = new Set();
  for (const image of activity.images) {
    if (!image || typeof image.id !== 'string' || !image.id || typeof image.url !== 'string' || !image.url || typeof image.description !== 'string' || !image.description.trim() || ids.has(image.id)) throw new Error('Imagem inválida ou identificador duplicado.');
    const url = new URL(image.url, 'https://local.invalid');
    if (!['http:', 'https:'].includes(url.protocol)) throw new Error('Protocolo de imagem não permitido.');
    ids.add(image.id);
  }
  return activity;
}

// Metrics count user actions: pair comparisons, piece placements, or answer selections.
export function createResult(activity, { status, attempts = 0, correct = 0, hints = 0 }) {
  validateActivity(activity);
  if (!['completed', 'abandoned'].includes(status)) throw new Error('Estado inválido.');
  if (![attempts, correct, hints].every(n => Number.isSafeInteger(n) && n >= 0) || correct > attempts) throw new Error('Contadores inválidos.');
  return { activityId: activity.activityId, gameId: activity.gameId, status, attempts, correct, hints };
}
