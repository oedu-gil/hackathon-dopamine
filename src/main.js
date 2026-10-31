import Phaser from 'phaser';
import './style.css';
import { demoActivity } from './core/demo.js';
import { validateActivity, RESULT_EVENT } from './core/contracts.js';
import { MemoryScene } from './games/memory/MemoryScene.js';
import { PuzzleScene } from './games/puzzle/PuzzleScene.js';
import { SequenceScene } from './games/sequence/SequenceScene.js';

const scenes = { memory: MemoryScene, puzzle: PuzzleScene, sequence: SequenceScene };
const titles = { memory: 'Memória', puzzle: 'Quebra-cabeça', sequence: 'Complete a sequência' };
const status = document.querySelector('#status');
const exit = document.querySelector('#exit');
let game;
let activeScene;
let lastButton;
function closeGame() {
  if (activeScene?.activity) activeScene.finish('abandoned');
  game?.destroy(true);
  game = null;
  activeScene = null;
  document.querySelector('nav').hidden = false;
  exit.hidden = true;
  lastButton?.focus();
}
for (const button of document.querySelectorAll('[data-game]')) button.addEventListener('click', () => {
  if (game) return;
  lastButton = button;
  const id = button.dataset.game;
  const activity = validateActivity(demoActivity(id));
  status.textContent = `${titles[id]} — demonstração da base; regras ainda em desenvolvimento.`;
  document.querySelector('nav').hidden = true;
  exit.hidden = false;
  activeScene = new scenes[id]({ key: id });
  game = new Phaser.Game({ type: Phaser.AUTO, parent: 'game', width: 960, height: 600, backgroundColor: '#f2f7f2', scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH }, scene: [] });
  game.events.on(RESULT_EVENT, result => window.dispatchEvent(new CustomEvent(RESULT_EVENT, { detail: result })));
  game.events.on('activity-error', message => { status.textContent = message; });
  const instance = game;
  const scene = activeScene;
  instance.events.once('ready', () => { if (game === instance) instance.scene.add(id, scene, true, activity); });
  exit.focus();
});
exit.addEventListener('click', () => { closeGame(); status.textContent = 'Escolha uma atividade.'; });
