import Phaser from 'phaser';
import './sequence.css';
import { RESULT_EVENT, validateActivity } from '../../core/contracts.js';
import { EXIT_EVENT, READY_EVENT, SequenceScene } from './SequenceScene.js';
import { sequenceDemo } from './demo.js';

// Entrada individual da sequência. Parâmetros de teste: ?tema=trem ?rm=1 ?contexto=0 ?falha=1 ?debug=1
const params = new URLSearchParams(location.search);
const demoOptions = {
  theme: params.get('tema') ?? undefined,
  context: params.get('contexto') !== '0',
  reducedMotion: params.get('rm') === '1' ? true : undefined,
};
const $ = id => document.getElementById(id);
const host = $('seq-game');
const overlays = { loading: $('seq-loading'), error: $('seq-error'), left: $('seq-left') };
let game = null;
let scene = null;
let activity = null;
let failOnce = params.get('falha') === '1';

function show(state) {
  for (const [name, el] of Object.entries(overlays)) el.hidden = name !== state;
  $('seq-exit').hidden = state !== 'playing';
  if (state === 'error') $('seq-retry').focus();
  if (state === 'left') $('seq-reenter').focus();
}

// Em ?falha=1, a primeira carga usa um endereço inexistente para demonstrar a recuperação.
function loadData() {
  if (!failOnce) return activity;
  failOnce = false;
  return { ...activity, images: [{ ...activity.images[0], url: '/nao-existe.svg' }, activity.images[1]] };
}

function start(next) {
  activity = validateActivity(next);
  show('loading');
  const ratio = Math.min(window.devicePixelRatio || 1, 3);
  scene = new SequenceScene({ key: 'sequence' });
  game = new Phaser.Game({
    type: Phaser.AUTO, parent: host, backgroundColor: '#f4efe4', banner: false, scene: [],
    width: Math.round(host.clientWidth * ratio), height: Math.round(host.clientHeight * ratio),
    // Canvas na resolução do aparelho, exibido no tamanho CSS: imagens e textos nítidos no celular.
    scale: { mode: Phaser.Scale.NONE, zoom: 1 / ratio },
  });
  game.registry.set('pixelRatio', ratio);
  game.events.on(RESULT_EVENT, result => {
    window.dispatchEvent(new CustomEvent(RESULT_EVENT, { detail: result }));
    debugLog(result);
  });
  game.events.on('activity-error', () => show('error'));
  game.events.on(READY_EVENT, () => show('playing'));
  game.events.on(EXIT_EVENT, requestExit);
  const instance = game;
  instance.events.once('ready', () => { if (game === instance) instance.scene.add('sequence', scene, true, loadData()); });
}

function fit() {
  if (!game) return;
  const ratio = game.registry.get('pixelRatio');
  game.scale.resize(Math.round(host.clientWidth * ratio), Math.round(host.clientHeight * ratio));
}

function requestExit() {
  if (!scene || scene.finished) return leave();
  $('seq-confirm').hidden = false;
  $('seq-stay').focus();
}

function leave() {
  $('seq-confirm').hidden = true;
  if (scene?.activity && !scene.finished) scene.finish('abandoned');
  game?.destroy(true);
  game = null;
  scene = null;
  show('left');
}

function debugLog(result) {
  if (params.get('debug') !== '1') return;
  const panel = $('seq-debug');
  panel.hidden = false;
  panel.textContent = `${panel.textContent}${JSON.stringify(result)}\n`;
}

if (params.get('debug') === '1') window.sequenceDebug = () => ({ metrics: scene?.metrics, session: scene?.session, finished: scene?.finished, layout: scene?.layout, options: scene?.round?.options.map(i => i.id), answer: scene?.round?.answer.id });

$('seq-exit').addEventListener('click', requestExit);
$('seq-stay').addEventListener('click', () => { $('seq-confirm').hidden = true; $('seq-exit').focus(); });
$('seq-leave').addEventListener('click', leave);
$('seq-back').addEventListener('click', leave);
$('seq-retry').addEventListener('click', () => { show('loading'); scene.scene.restart(loadData()); });
$('seq-reenter').addEventListener('click', () => start(sequenceDemo(demoOptions)));
window.addEventListener('resize', fit);
start(sequenceDemo(demoOptions));
