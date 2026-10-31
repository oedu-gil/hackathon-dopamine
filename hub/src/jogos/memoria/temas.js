import train from './assets/train.svg'
import wagon from './assets/wagon.svg'
import signal from './assets/signal.svg'
import backTrain from './assets/back-transport.svg'
import spider from './assets/spider.svg'
import web from './assets/web.svg'
import magnifier from './assets/magnifier.svg'
import backSpider from './assets/back-spider.svg'
import plane from './assets/plane.svg'
import helicopter from './assets/helicopter.svg'
import balloon from './assets/balloon.svg'
import backPlane from './assets/back-plane.svg'
import dinosaur from './assets/dinosaur.svg'
import egg from './assets/egg.svg'
import volcano from './assets/volcano.svg'
import backFootprint from './assets/back-footprint.svg'

// Um conjunto de figuras por hiperfoco do hub (compartilhado/temas.js): três pares e o verso.
export const ATIVIDADES = {
  trem: {
    theme: 'Trens',
    images: [
      { id: 'train', url: train, description: 'Trem' },
      { id: 'wagon', url: wagon, description: 'Vagão' },
      { id: 'signal', url: signal, description: 'Semáforo' },
    ],
    backImage: { url: backTrain, description: 'Símbolo de trem' },
  },
  aranha: {
    theme: 'Aranhas',
    images: [
      { id: 'spider', url: spider, description: 'Aranha' },
      { id: 'web', url: web, description: 'Teia' },
      { id: 'magnifier', url: magnifier, description: 'Lupa' },
    ],
    backImage: { url: backSpider, description: 'Símbolo de aranha' },
  },
  aviao: {
    theme: 'Aviões',
    images: [
      { id: 'plane', url: plane, description: 'Avião' },
      { id: 'helicopter', url: helicopter, description: 'Helicóptero' },
      { id: 'balloon', url: balloon, description: 'Balão' },
    ],
    backImage: { url: backPlane, description: 'Símbolo de avião' },
  },
  dinossauro: {
    theme: 'Dinossauros',
    images: [
      { id: 'dinosaur', url: dinosaur, description: 'Dinossauro' },
      { id: 'egg', url: egg, description: 'Ovo' },
      { id: 'volcano', url: volcano, description: 'Vulcão' },
    ],
    backImage: { url: backFootprint, description: 'Pegada de dinossauro' },
  },
}

export const atividadeDoTema = (id) => ATIVIDADES[id] ?? ATIVIDADES.trem
