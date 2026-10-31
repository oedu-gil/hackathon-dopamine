import dino from './assets/dino.svg';
import ovo from './assets/ovo.svg';
import locomotiva from './assets/locomotiva.svg';
import vagao from './assets/vagao.svg';
import aranha from './assets/aranha.svg';
import teia from './assets/teia.svg';
import aviao from './assets/aviao.svg';
import nuvem from './assets/nuvem.svg';

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
  aranha: {
    context: 'As aranhas e as teias fizeram uma fila.',
    images: [
      { id: 'seq-aranha', url: aranha, description: 'Aranha roxa', label: 'aranha' },
      { id: 'seq-teia', url: teia, description: 'Teia de aranha', label: 'teia' },
    ],
  },
  aviao: {
    context: 'O avião está voando entre as nuvens.',
    images: [
      { id: 'seq-aviao', url: aviao, description: 'Avião azul', label: 'avião' },
      { id: 'seq-nuvem', url: nuvem, description: 'Nuvem branca', label: 'nuvem' },
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
