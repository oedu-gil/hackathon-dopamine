import dino from './assets/dino.svg';
import ovo from './assets/ovo.svg';
import locomotiva from './assets/locomotiva.svg';
import vagao from './assets/vagao.svg';

// Dados de demonstração próprios: A e B com silhuetas diferentes, sem API.
const THEMES = {
  dinossauros: {
    context: 'Os dinossauros e os ovos fizeram uma fila.',
    images: [
      { id: 'seq-dino', url: dino, description: 'Dinossauro verde', label: 'dino' },
      { id: 'seq-ovo', url: ovo, description: 'Ovo de dinossauro', label: 'ovo' },
    ],
  },
  trem: {
    context: 'O trem está montando os vagões.',
    images: [
      { id: 'seq-locomotiva', url: locomotiva, description: 'Locomotiva verde', label: 'locomotiva' },
      { id: 'seq-vagao', url: vagao, description: 'Vagão-tanque laranja', label: 'vagão' },
    ],
  },
};

export function sequenceDemo({ theme = 'dinossauros', context = true, reducedMotion } = {}) {
  const data = THEMES[theme] ?? THEMES.dinossauros;
  return {
    activityId: crypto.randomUUID(),
    gameId: 'sequence',
    theme: THEMES[theme] ? theme : 'dinossauros',
    ...(context ? { context: data.context } : {}),
    images: data.images.map(image => ({ ...image })),
    settings: { sound: false, reducedMotion: reducedMotion ?? matchMedia('(prefers-reduced-motion: reduce)').matches },
  };
}
