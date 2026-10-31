import Phaser from 'phaser'
import Boot from './Boot.js'
import { pararMusica } from './audio.js'
import { estado, registrarAcerto } from './progresso.js'

// Monta uma cena do kit (Chuva de emoções, Cuidar do amigo, Plataforma do amigo) no
// formato do contrato (jogos/contrato.js). A Boot carrega a arte e inicia a cena `chave`.
export function montarCena(elemento, Cena, chave, { tema, nivel = 1, opcoes = {}, aoTerminar, aoSair }) {
  let metricas = { attempts: 0, correct: 0, hints: 0 }
  let emAndamento = true
  let cancelado = false
  let game

  const entregar = (status) => {
    aoTerminar?.({ status, ...metricas })
    metricas = { attempts: 0, correct: 0, hints: 0 }
    emAndamento = false
  }

  const ctx = {
    aluno: 'hub',
    hiperfoco: tema,
    nivel,
    velocidade: 1,
    efeitos: !opcoes.reduzirMovimento,
    sons: opcoes.sons ?? true,
    musica: opcoes.musica ?? false,
    // o hub tem o próprio botão de sair, sempre no mesmo lugar
    mostrarSair: false,
    sair: () => aoSair?.(),
    concluir: () => entregar('completed'),
    estado: () => estado(tema),
    registrarAcerto: () => registrarAcerto(tema),
    registrarTentativa: (ok) => {
      emAndamento = true
      metricas.attempts++
      if (ok) metricas.correct++
    },
  }

  // o canvas só desenha com a fonte do jogo depois que ela carregou
  document.fonts
    .load('400 20px Fredoka')
    .catch(() => {})
    .then(() => {
      if (cancelado) return
      game = new Phaser.Game({
        type: Phaser.AUTO,
        parent: elemento,
        width: 800,
        height: 450,
        scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
        physics: { default: 'arcade', arcade: { gravity: { y: 1100 } } },
        scene: [Boot, Cena],
        callbacks: {
          preBoot: (g) => {
            g.registry.set('ctx', ctx)
            g.registry.set('cena', chave)
          },
        },
      })
      // só para testes automáticos no modo de desenvolvimento
      if (import.meta.env?.DEV) window.__phaser = game
    })

  return function desmontar() {
    cancelado = true
    if (emAndamento) entregar('abandoned')
    pararMusica()
    game?.destroy(true)
  }
}
