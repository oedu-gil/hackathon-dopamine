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
const onMotion = event => { reduced.checked = event.matches; if (reduced.checked) scene?.finishMotion(); };
motion.addEventListener('change', onMotion);
let scene, game, failed = false;
reduced.addEventListener('change', () => { if (reduced.checked) scene?.finishMotion(); });
const buttons = Array.from({ length: 6 }, (_, index) => {
  const button = document.createElement('button'); button.type = 'button'; button.className = 'card-button'; button.disabled = true;
  const label = document.createElement('span'); label.className = 'card-label'; label.setAttribute('aria-hidden', 'true'); button.append(label);
  button.addEventListener('click', () => scene?.select(index)); cards.append(button); return button;
});
function fail(text) {
  failed = true; board.hidden = true; board.setAttribute('aria-busy', 'false');
  document.querySelector('#error').hidden = false; document.querySelector('#error').textContent = text;
  message.textContent = 'As figuras ainda não estão prontas.';
  message.hidden = false;
  action.hidden = false; action.disabled = false; action.textContent = 'Tentar de novo';
}
function update(state, layout, width, height) {
  board.setAttribute('aria-busy', String(state.interactionLocked || state.phase === 'mismatch'));
  buttons.forEach((button, index) => {
    const rect = layout[index];
    Object.assign(button.style, { left: `${rect.x / width * 100}%`, top: `${rect.y / height * 100}%`, width: `${rect.width / width * 100}%`, height: `${rect.height / height * 100}%` });
    const matched = state.matched.includes(index), open = matched || state.selected.includes(index);
    button.disabled = false;
    button.setAttribute('aria-disabled', String(state.interactionLocked || state.phase !== 'playing' || open));
    button.setAttribute('aria-label', `Carta ${index + 1}: ${open ? state.cards[index].description + (matched ? ', par encontrado' : ', aberta') : 'fechada'}`);
    // The visible label is inside the Phaser card so it turns with the picture.
    button.firstChild.textContent = '';
  });
  const messages = {
    ready: '',
    playing: state.selected.length ? 'Agora, encontre a figura igual!' : state.pairs ? 'Um par! Vamos achar os outros?' : 'Escolha uma carta!',
    mismatch: 'São diferentes. Vamos tentar de novo!',
    completed: 'Você achou os 3 pares! Muito bem!'
  };
  const actions = { ready: 'Vamos brincar!', completed: 'Brincar de novo' };
  message.textContent = state.interactionLocked && state.phase === 'playing' ? 'Olha a carta virando!' : messages[state.phase];
  message.hidden = !message.textContent;
  document.querySelector('#progress-text').textContent = `${state.pairs} de 3 pares`;
  progress.setAttribute('aria-label', `${state.pairs} de 3 pares encontrados`);
  progress.querySelectorAll('.pair-markers > span').forEach((marker, index) => {
    marker.classList.toggle('found', index < state.pairs);
  });
  action.hidden = state.interactionLocked || !actions[state.phase]; action.disabled = false; action.textContent = actions[state.phase] || '';
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
