import Phaser from 'phaser';
import './style.css';
import { validateActivity } from './model.js';
import { MemoryScene } from './MemoryScene.js';

const board = document.querySelector('#board');
const cards = document.querySelector('#cards');
const message = document.querySelector('#message');
const progress = document.querySelector('#progress');
const action = document.querySelector('#action');
const reduced = document.querySelector('#reduced-motion');
const motion = matchMedia('(prefers-reduced-motion: reduce)');
reduced.checked = motion.matches;
const onMotion = event => { reduced.checked = event.matches; };
motion.addEventListener('change', onMotion);
let scene, game, failed = false, previousPairs = 0;
const buttons = Array.from({ length: 6 }, (_, index) => {
  const button = document.createElement('button'); button.type = 'button'; button.className = 'card-button'; button.disabled = true;
  const label = document.createElement('span'); label.className = 'card-label'; label.setAttribute('aria-hidden', 'true'); button.append(label);
  button.addEventListener('click', () => scene?.select(index)); cards.append(button); return button;
});
function fail(text) {
  failed = true; board.hidden = true; board.setAttribute('aria-busy', 'false');
  document.querySelector('#error').hidden = false; document.querySelector('#error').textContent = text;
  message.textContent = 'Vamos preparar as imagens antes de começar.';
  action.hidden = false; action.disabled = false; action.textContent = 'Tentar carregar novamente';
}
function update(state, layout, width, height) {
  board.setAttribute('aria-busy', 'false');
  buttons.forEach((button, index) => {
    const rect = layout[index];
    Object.assign(button.style, { left: `${rect.x / width * 100}%`, top: `${rect.y / height * 100}%`, width: `${rect.width / width * 100}%`, height: `${rect.height / height * 100}%` });
    const matched = state.matched.includes(index), open = matched || state.selected.includes(index);
    button.disabled = false;
    button.setAttribute('aria-disabled', String(state.phase !== 'playing' || open));
    button.setAttribute('aria-label', `Carta ${index + 1}: ${open ? state.cards[index].description + (matched ? ', par encontrado' : ', aberta') : 'fechada'}`);
    button.firstChild.textContent = open ? state.cards[index].description : '';
  });
  const messages = { ready: 'Vamos descobrir os três pares?', playing: state.selected.length ? 'Agora, escolha outra carta.' : state.pairs > previousPairs ? 'Você encontrou um par! Escolha outra carta.' : 'Escolha uma carta.', mismatch: 'São diferentes. Observe as imagens por um momento.', completed: 'Você encontrou todos os pares!' };
  const actions = { ready: 'Começar', completed: 'Jogar novamente' };
  message.textContent = messages[state.phase]; progress.textContent = `${state.pairs} de 3 pares`;
  action.hidden = !actions[state.phase]; action.disabled = false; action.textContent = actions[state.phase] || '';
  previousPairs = state.pairs;
}
action.addEventListener('click', () => {
  if (failed) { location.reload(); return; }
  scene?.act();
  requestAnimationFrame(() => { const next = buttons.find(button => button.getAttribute('aria-disabled') === 'false'); next?.focus({ preventScroll: true }); });
});
// Observe the board itself: resizing a parent does not always resize the window.
const observer = new ResizeObserver(() => {
  if (game?.isBooted) { const { width, height } = board.getBoundingClientRect(); if (width && height) game.scale.resize(Math.round(width), Math.round(height)); }
});
observer.observe(board);
try {
  const configUrl = new URL(`${import.meta.env.BASE_URL}activity.json`, location.href);
  const response = await fetch(configUrl, { cache: 'no-store' });
  if (!response.ok) throw new Error('Não foi possível carregar a configuração da atividade.');
  const activity = validateActivity(await response.json(), configUrl.href);
  document.querySelector('#theme').textContent = activity.theme;
  scene = new MemoryScene(activity, { update, fail, reducedMotion: () => reduced.checked });
  const rect = board.getBoundingClientRect();
  game = new Phaser.Game({ type: Phaser.AUTO, parent: 'canvas-host', width: Math.round(rect.width), height: Math.round(rect.height), transparent: true, antialias: true, audio: { noAudio: true }, input: { keyboard: false }, scale: { mode: Phaser.Scale.NONE }, scene: [scene] });
} catch (error) { fail(error instanceof Error ? error.message : 'Não foi possível preparar a atividade.'); }
if (import.meta.hot) import.meta.hot.dispose(() => { observer.disconnect(); motion.removeEventListener('change', onMotion); game?.destroy(true); });
