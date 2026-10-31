import Phaser from 'phaser'
import './memoria.css'
import { validateActivity } from './model.js'
import { MemoryScene } from './MemoryScene.js'
import { atividadeDoTema } from './temas.js'

const HTML = `
<div class="album" aria-labelledby="mem-title">
  <header><span class="brand"><span aria-hidden="true">▱</span> Álbum de descobertas</span><span id="theme"></span></header>
  <section class="heading"><p class="eyebrow">Jogo da memória</p><h1 id="mem-title">Cadê o par?</h1><p id="message" role="status" aria-live="polite" aria-atomic="true">Preparando a brincadeira…</p></section>
  <div id="error" role="alert" hidden></div>
  <div id="board" class="board" role="group" aria-label="Tabuleiro com seis cartas" aria-busy="true">
    <div id="canvas-host" aria-hidden="true"></div>
    <div id="cards"></div>
  </div>
  <footer><span id="progress"><span class="pair-markers" aria-hidden="true"><span></span><span></span><span></span></span><span id="progress-text">0 de 3 pares</span></span><button id="action" type="button" disabled>Só um instante…</button></footer>
</div>`

export function montar(elemento, { tema, aoTerminar } = {}) {
  const atividade = atividadeDoTema(tema?.id)
  const raiz = document.createElement('div')
  raiz.className = 'memoria'
  raiz.innerHTML = HTML
  elemento.append(raiz)
  const $ = (seletor) => raiz.querySelector(seletor)

  const board = $('#board')
  const cards = $('#cards')
  const message = $('#message')
  const progress = $('#progress')
  const action = $('#action')
  const motion = matchMedia('(prefers-reduced-motion: reduce)')
  const onMotion = (event) => { if (event.matches) scene?.finishMotion() }
  motion.addEventListener('change', onMotion)
  let scene, game, failed = false
  // a partida começa ao tocar em "Vamos brincar!" e termina ao achar os 3 pares
  let ultimo = { phase: 'ready', attempts: 0, pairs: 0 }

  const entregar = (status) => aoTerminar?.({ status, attempts: ultimo.attempts, correct: ultimo.pairs, hints: 0 })

  const buttons = Array.from({ length: 6 }, (_, index) => {
    const button = document.createElement('button'); button.type = 'button'; button.className = 'card-button'; button.disabled = true
    const label = document.createElement('span'); label.className = 'card-label'; label.setAttribute('aria-hidden', 'true'); button.append(label)
    button.addEventListener('click', () => scene?.select(index)); cards.append(button); return button
  })
  function fail(text) {
    failed = true; board.hidden = true; board.setAttribute('aria-busy', 'false')
    $('#error').hidden = false; $('#error').textContent = text
    message.textContent = 'As figuras ainda não estão prontas.'
    message.hidden = false
    action.hidden = false; action.disabled = false; action.textContent = 'Tentar de novo'
  }
  function update(state, layout, width, height) {
    const terminou = state.phase === 'completed' && ultimo.phase !== 'completed'
    ultimo = state
    if (terminou) entregar('completed')
    board.setAttribute('aria-busy', String(state.interactionLocked || state.phase === 'mismatch'))
    buttons.forEach((button, index) => {
      const rect = layout[index]
      Object.assign(button.style, { left: `${rect.x / width * 100}%`, top: `${rect.y / height * 100}%`, width: `${rect.width / width * 100}%`, height: `${rect.height / height * 100}%` })
      const matched = state.matched.includes(index), open = matched || state.selected.includes(index)
      button.disabled = false
      button.setAttribute('aria-disabled', String(state.interactionLocked || state.phase !== 'playing' || open))
      button.setAttribute('aria-label', `Carta ${index + 1}: ${open ? state.cards[index].description + (matched ? ', par encontrado' : ', aberta') : 'fechada'}`)
      // The visible label is inside the Phaser card so it turns with the picture.
      button.firstChild.textContent = ''
    })
    const messages = {
      ready: '',
      playing: state.selected.length ? 'Agora, encontre a figura igual!' : state.pairs ? 'Um par! Vamos achar os outros?' : 'Escolha uma carta!',
      mismatch: 'São diferentes. Vamos tentar de novo!',
      completed: 'Você achou os 3 pares! Muito bem!',
    }
    const actions = { ready: 'Vamos brincar!', completed: 'Brincar de novo' }
    message.textContent = state.interactionLocked && state.phase === 'playing' ? 'Olha a carta virando!' : messages[state.phase]
    message.hidden = !message.textContent
    $('#progress-text').textContent = `${state.pairs} de 3 pares`
    progress.setAttribute('aria-label', `${state.pairs} de 3 pares encontrados`)
    progress.querySelectorAll('.pair-markers > span').forEach((marker, index) => {
      marker.classList.toggle('found', index < state.pairs)
    })
    action.hidden = state.interactionLocked || !actions[state.phase]; action.disabled = false; action.textContent = actions[state.phase] || ''
  }
  function iniciar() {
    try {
      const activity = validateActivity(atividade, location.href)
      $('#theme').textContent = activity.theme
      scene = new MemoryScene(activity, { update, fail, reducedMotion: () => motion.matches })
      const rect = board.getBoundingClientRect()
      game = new Phaser.Game({ type: Phaser.AUTO, parent: $('#canvas-host'), width: Math.round(rect.width), height: Math.round(rect.height), transparent: true, antialias: true, audio: { noAudio: true }, input: { keyboard: false }, scale: { mode: Phaser.Scale.NONE }, scene: [scene] })
    } catch (error) { fail(error instanceof Error ? error.message : 'Não foi possível preparar a atividade.') }
  }
  action.addEventListener('click', () => {
    // o original recarregava a página; dentro do hub, só recria o jogo
    if (failed) {
      failed = false; board.hidden = false; $('#error').hidden = true
      game?.destroy(true); iniciar(); return
    }
    scene?.act()
    requestAnimationFrame(() => { const next = buttons.find((button) => button.getAttribute('aria-disabled') === 'false'); next?.focus({ preventScroll: true }) })
  })
  // Observe the board itself: resizing a parent does not always resize the window.
  const observer = new ResizeObserver(() => {
    if (game?.isBooted) { const { width, height } = board.getBoundingClientRect(); if (width && height) game.scale.resize(Math.round(width), Math.round(height)) }
  })
  observer.observe(board)
  iniciar()

  return function desmontar() {
    if (ultimo.phase === 'playing' || ultimo.phase === 'mismatch') entregar('abandoned')
    observer.disconnect()
    motion.removeEventListener('change', onMotion)
    game?.destroy(true)
    raiz.remove()
  }
}
