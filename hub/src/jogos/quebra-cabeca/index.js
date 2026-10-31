import Phaser from 'phaser';
import './quebra-cabeca.css';
import { RESULT_EVENT, validateActivity } from '../../compartilhado/atividade/contracts.js';
import { EXIT_EVENT, MESSAGE_EVENT, PuzzleScene, READY_EVENT } from './PuzzleScene.js';
import { IMAGENS, puzzleDemo } from './demo.js';
import { cardColor } from './layout.js';
import { createPaperSound } from './som.js';

// Tablet em retrato: o jogo pede para girar e não aceita toques (REGRAS-E-INTERACOES.md §6).
const PORTRAIT = '(orientation: portrait) and (pointer: coarse)';

const PAPER = '<div class="qc-papel" aria-hidden="true"><i></i><i></i><i></i></div>';
const TABLET = `<svg width="200" height="130" viewBox="0 0 200 130" aria-hidden="true"><rect x="14" y="20" width="56" height="90" rx="9" fill="none" stroke="#2a1f3d" stroke-width="4" stroke-dasharray="7 6" opacity=".5"/><rect x="92" y="34" width="96" height="62" rx="9" fill="#fff" stroke="#2a1f3d" stroke-width="4"/><rect x="102" y="44" width="76" height="42" rx="3" fill="#7fc8a9"/><path d="M58 12 Q86 4 104 22" fill="none" stroke="#6a3fc8" stroke-width="5" stroke-linecap="round"/><path d="M92 22 L105 23 L102 10" fill="none" stroke="#6a3fc8" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

const HTML = `
<section class="qc-jogo"></section>
<p class="qc-leitor" role="status" aria-live="polite"></p>
<section class="qc-tela" data-estado="loading">${PAPER}<h2 role="status">Preparando as peças…</h2></section>
<section class="qc-tela" data-estado="error" hidden>${PAPER}
  <h2 role="alert">Não consegui abrir a imagem</h2>
  <p>Pode ser a internet. Tente de novo; se continuar, um adulto pode escolher outra atividade.</p>
  <div class="qc-acoes"><button class="primario" data-acao="retry">Tentar de novo</button><button data-acao="sair">Sair</button></div>
</section>
<section class="qc-tela qc-girar" hidden>${TABLET}<h2>Gire o tablet</h2><p>O quebra-cabeça funciona com o tablet deitado.</p></section>`;

export function montar(elemento, { tema, opcoes = {}, aoTerminar, aoSair } = {}) {
  const raiz = document.createElement('div');
  raiz.className = 'qc';
  raiz.innerHTML = HTML;
  elemento.append(raiz);
  const host = raiz.querySelector('.qc-jogo');
  const leitor = raiz.querySelector('.qc-leitor');
  const telas = [...raiz.querySelectorAll('.qc-tela[data-estado]')];
  const mostrar = estado => { for (const el of telas) el.hidden = el.dataset.estado !== estado; };

  // Só para testar outros desenhos e formatos: jogo.html?id=quebra-cabeca&img=foguete
  const pedida = new URLSearchParams(location.search).get('img');
  const image = IMAGENS[pedida] ? pedida : IMAGENS[tema?.id] ? tema.id : 'trem';
  const reducedMotion = opcoes.reduzirMovimento ?? matchMedia('(prefers-reduced-motion: reduce)').matches;
  const activity = validateActivity(puzzleDemo({ image, reducedMotion }));
  const cartolina = cardColor(activity.settings.puzzle.cardColor);
  raiz.style.setProperty('--qc-cartolina', cartolina);
  raiz.classList.toggle('qc-rm', reducedMotion);
  host.setAttribute('role', 'img');
  host.setAttribute('aria-label', `Quebra-cabeça de 15 peças. ${activity.images[0].description}`);

  const ratio = Math.min(window.devicePixelRatio || 1, 3);
  const scene = new PuzzleScene({ key: 'puzzle' });
  const paperSound = createPaperSound();
  const game = new Phaser.Game({
    type: Phaser.AUTO, parent: host, backgroundColor: cartolina, banner: false, scene: [], audio: { noAudio: true },
    width: Math.round(host.clientWidth * ratio), height: Math.round(host.clientHeight * ratio),
    // Canvas na resolução do aparelho, exibido no tamanho CSS: peças e textos nítidos.
    scale: { mode: Phaser.Scale.NONE, zoom: 1 / ratio },
  });
  game.registry.set('pixelRatio', ratio);
  // O som começa desligado; se o hub desligou os sons, o botão Som nem aparece.
  game.registry.set('soundAvailable', opcoes.sons !== false);
  game.registry.set('soundOn', false);
  game.registry.set('paperSound', paperSound);
  game.events.on(RESULT_EVENT, ({ status, attempts, correct, hints }) => aoTerminar?.({ status, attempts, correct, hints }));
  game.events.on('activity-error', () => mostrar('error'));
  game.events.on(READY_EVENT, () => mostrar('playing'));
  game.events.on(EXIT_EVENT, () => aoSair?.());
  game.events.on(MESSAGE_EVENT, texto => { if (leitor.textContent !== texto) leitor.textContent = texto; });
  game.events.once('ready', () => game.scene.add('puzzle', scene, true, activity));
  raiz.querySelector('[data-acao="retry"]').addEventListener('click', () => { mostrar('loading'); scene.scene.restart(activity); });
  raiz.querySelector('[data-acao="sair"]').addEventListener('click', () => aoSair?.());

  const girar = raiz.querySelector('.qc-girar');
  const retrato = matchMedia(PORTRAIT);
  const aoGirar = () => { girar.hidden = !retrato.matches; };
  retrato.addEventListener('change', aoGirar);
  aoGirar();

  const observer = new ResizeObserver(() => {
    if (game.isBooted && host.clientWidth && host.clientHeight) game.scale.resize(Math.round(host.clientWidth * ratio), Math.round(host.clientHeight * ratio));
  });
  observer.observe(host);

  return function desmontar() {
    if (scene.activity && !scene.finished) scene.finish('abandoned');
    observer.disconnect();
    retrato.removeEventListener('change', aoGirar);
    game.destroy(true);
    paperSound.close();
    raiz.remove();
  };
}
