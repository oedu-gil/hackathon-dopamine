import trem from './assets/trem.svg';
import aranha from './assets/aranha.svg';
import aviao from './assets/aviao.svg';
import dinossauro from './assets/dinossauro.svg';
import baleia from './assets/baleia.svg';
import foguete from './assets/foguete.svg';

// Imagens de demonstração feitas por nós, sem API. Uma por tema do hub; baleia (5:3) e foguete (1:1)
// servem para testar outros desenhos e formatos: jogo.html?id=quebra-cabeca&img=foguete
export const IMAGENS = {
  trem: { url: trem, theme: 'trem a vapor no campo', description: 'Trem colorido com locomotiva vermelha soltando fumaça, num campo verde com céu azul.' },
  aranha: { url: aranha, theme: 'aranha na teia do jardim', description: 'Aranha roxa sorrindo no meio da teia, com flores, uma joaninha e uma borboleta no jardim.' },
  aviao: { url: aviao, theme: 'avião voando sobre a cidade', description: 'Avião branco e vermelho voando entre nuvens, com um balão e prédios coloridos embaixo.' },
  dinossauro: { url: dinossauro, theme: 'dinossauro perto do vulcão', description: 'Dinossauro verde ao lado de uma palmeira, com um vulcão, ovos num ninho e um pterossauro no céu.' },
  baleia: { url: baleia, theme: 'baleia no fundo do mar', description: 'Baleia azul nadando no mar, com um barquinho na superfície e peixes no fundo de areia.' },
  foguete: { url: foguete, theme: 'foguete decolando à noite', description: 'Foguete branco e vermelho decolando num céu noturno com estrelas e lua.' },
};

// Atividade no formato de compartilhado/atividade/contracts.js (gameId 'puzzle').
export function puzzleDemo({ image = 'trem', reducedMotion = false } = {}) {
  const id = IMAGENS[image] ? image : 'trem';
  const { url, theme, description } = IMAGENS[id];
  return {
    activityId: crypto.randomUUID(),
    gameId: 'puzzle',
    theme,
    images: [{ id: `qc-${id}`, url, description }],
    settings: { sound: false, reducedMotion, puzzle: { cardColor: 'pessego' } },
  };
}
