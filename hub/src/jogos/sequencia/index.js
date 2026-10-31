import Phaser from 'phaser';
import './sequencia.css';
import { RESULT_EVENT, validateActivity } from '../../compartilhado/atividade/contracts.js';
import { EXIT_EVENT, READY_EVENT, SequenceScene } from './SequenceScene.js';
import { sequenceDemo } from './demo.js';

// Tema do hub → figuras da sequência (todos os hiperfocos de compartilhado/temas.js).
const TEMAS = { trem: 'trem', aranha: 'aranha', aviao: 'aviao', dinossauro: 'dinossauros' };

const HTML = `
<section class="seq-game" aria-label="Atividade: o que vem depois na sequência?"></section>
<section class="seq-overlay" data-estado="loading"><p role="status">Preparando as imagens…</p></section>
<section class="seq-overlay" data-estado="error" hidden>
  <p role="alert">Não conseguimos abrir as imagens.</p>
  <div class="seq-actions"><button class="primary" data-acao="retry">Tentar de novo</button></div>
</section>`;

export function montar(elemento, { tema, opcoes = {}, aoTerminar, aoSair } = {}) {
  const raiz = document.createElement('div');
  raiz.className = 'seq';
  raiz.innerHTML = HTML;
  elemento.append(raiz);
  const host = raiz.querySelector('.seq-game');
  const overlays = [...raiz.querySelectorAll('.seq-overlay')];
  const show = estado => { for (const el of overlays) el.hidden = el.dataset.estado !== estado; };

  const reducedMotion = opcoes.reduzirMovimento ?? matchMedia('(prefers-reduced-motion: reduce)').matches;
  const activity = validateActivity(sequenceDemo({ theme: TEMAS[tema?.id], reducedMotion }));
  const ratio = Math.min(window.devicePixelRatio || 1, 3);
  const scene = new SequenceScene({ key: 'sequence' });
  const game = new Phaser.Game({
    type: Phaser.AUTO, parent: host, backgroundColor: '#f4efe4', banner: false, scene: [],
    width: Math.round(host.clientWidth * ratio), height: Math.round(host.clientHeight * ratio),
    // Canvas na resolução do aparelho, exibido no tamanho CSS: imagens e textos nítidos no celular.
    scale: { mode: Phaser.Scale.NONE, zoom: 1 / ratio },
  });
  game.registry.set('pixelRatio', ratio);
  game.events.on(RESULT_EVENT, ({ status, attempts, correct, hints }) => aoTerminar?.({ status, attempts, correct, hints }));
  game.events.on('activity-error', () => show('error'));
  game.events.on(READY_EVENT, () => show('playing'));
  game.events.on(EXIT_EVENT, () => aoSair?.());
  game.events.once('ready', () => game.scene.add('sequence', scene, true, activity));
  raiz.querySelector('[data-acao="retry"]').addEventListener('click', () => { show('loading'); scene.scene.restart(activity); });

  const observer = new ResizeObserver(() => {
    if (game.isBooted) game.scale.resize(Math.round(host.clientWidth * ratio), Math.round(host.clientHeight * ratio));
  });
  observer.observe(host);

  return function desmontar() {
    if (scene.activity && !scene.finished) scene.finish('abandoned');
    observer.disconnect();
    game.destroy(true);
    raiz.remove();
  };
}
