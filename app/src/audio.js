// Sons e música gerados no navegador (Web Audio), sem arquivos de áudio.
// Volume baixo por padrão, por causa da sensibilidade sonora; o educador pode desligar
// os efeitos e a música separadamente no menu.
const VOLUME_GERAL = 0.5

let ctx = null
let mestre = null
let tocarSons = true
let tocarMusica = true

// O navegador só libera o áudio depois de um clique; o contexto nasce no primeiro som.
function contexto() {
  if (!ctx) {
    const Audio = window.AudioContext || window.webkitAudioContext
    if (!Audio) return null
    ctx = new Audio()
    mestre = ctx.createGain()
    mestre.gain.value = VOLUME_GERAL
    mestre.connect(ctx.destination)
  }
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

function nota(freq, inicio, duracao, { tipo = 'sine', volume = 0.1, ate = null } = {}) {
  const a = contexto()
  if (!a) return
  const t = a.currentTime + Math.max(0, inicio)
  const osc = a.createOscillator()
  const ganho = a.createGain()
  osc.type = tipo
  osc.frequency.setValueAtTime(freq, t)
  if (ate) osc.frequency.exponentialRampToValueAtTime(ate, t + duracao)
  ganho.gain.setValueAtTime(0.0001, t)
  ganho.gain.exponentialRampToValueAtTime(volume, t + 0.02)
  ganho.gain.exponentialRampToValueAtTime(0.0001, t + duracao)
  osc.connect(ganho)
  ganho.connect(mestre)
  osc.start(t)
  osc.stop(t + duracao + 0.05)
}

export function configurarAudio({ sons, musica }) {
  tocarSons = sons
  tocarMusica = musica
  if (!musica) pararMusica()
}

const efeito = (tocar) => () => {
  if (tocarSons) tocar()
}

const escala = (freqs, passo, duracao, opcoes) =>
  freqs.forEach((f, i) => nota(f, i * passo, duracao, opcoes))

export const sons = {
  acerto: efeito(() => escala([523.25, 659.25, 783.99], 0.08, 0.2, { tipo: 'triangle', volume: 0.12 })),
  // erro suave: duas notas descendo, sem buzina
  erro: efeito(() => {
    nota(330, 0, 0.18, { volume: 0.07 })
    nota(262, 0.14, 0.24, { volume: 0.07 })
  }),
  pulo: efeito(() => nota(330, 0, 0.16, { tipo: 'square', volume: 0.035, ate: 660 })),
  estrela: efeito(() => {
    nota(988, 0, 0.08, { tipo: 'triangle', volume: 0.08 })
    nota(1319, 0.07, 0.16, { tipo: 'triangle', volume: 0.08 })
  }),
  desbloqueio: efeito(() =>
    escala([523.25, 659.25, 783.99, 1046.5, 1318.5], 0.1, 0.32, { tipo: 'triangle', volume: 0.13 }),
  ),
  fim: efeito(() =>
    escala([523.25, 659.25, 783.99, 659.25, 783.99, 1046.5], 0.14, 0.34, { tipo: 'triangle', volume: 0.13 }),
  ),
}

// Música de fundo: melodia pentatônica simples em loop (C D E G A), agendada à frente.
const PASSO = 0.34
const MELODIA = [
  523.25, 587.33, 659.25, 783.99, 659.25, 587.33, 523.25, 0,
  783.99, 880, 783.99, 659.25, 587.33, 659.25, 523.25, 0,
]
let timer = null
let proximaNota = 0
let indice = 0

function agendarMusica() {
  while (proximaNota < ctx.currentTime + 0.6) {
    const freq = MELODIA[indice % MELODIA.length]
    const quando = proximaNota - ctx.currentTime
    if (freq) nota(freq, quando, PASSO * 0.9, { volume: 0.035 })
    if (indice % 8 === 0) nota(freq ? freq / 4 : 130.81, quando, PASSO * 6, { volume: 0.03 })
    proximaNota += PASSO
    indice++
  }
}

export function iniciarMusica() {
  if (!tocarMusica || timer) return
  const a = contexto()
  if (!a) return
  proximaNota = a.currentTime + 0.1
  indice = 0
  agendarMusica()
  timer = setInterval(agendarMusica, 200)
}

export function pararMusica() {
  clearInterval(timer)
  timer = null
}
