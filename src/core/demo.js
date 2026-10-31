export function demoActivity(gameId) {
  const count = { memory: 3, puzzle: 1, sequence: 2 }[gameId];
  return { activityId: crypto.randomUUID(), gameId, theme: 'dinossauros', images: Array.from({ length: count ?? 0 }, (_, i) => ({ id: `dino-${i + 1}`, url: `/assets/demo/dino-${i + 1}.svg`, description: ['Dinossauro verde', 'Dinossauro azul', 'Dinossauro laranja'][i] })), settings: { sound: false, reducedMotion: matchMedia('(prefers-reduced-motion: reduce)').matches } };
}
