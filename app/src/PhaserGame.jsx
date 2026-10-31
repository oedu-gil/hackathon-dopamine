import { useEffect, useRef } from 'react'
import Phaser from 'phaser'
import { pararMusica } from './audio.js'
import ChuvaEmocoes from './games/ChuvaEmocoes.js'
import PlataformaAmigo from './games/PlataformaAmigo.js'
import CuidarAmigo from './games/CuidarAmigo.js'

const CENAS = { ChuvaEmocoes, PlataformaAmigo, CuidarAmigo }

// ctx: { hiperfoco, nivel, velocidade, efeitos, sair, estado, registrarAcerto }
export default function PhaserGame({ cena, ctx }) {
  const containerRef = useRef(null)
  const ctxRef = useRef(ctx)

  useEffect(() => {
    ctxRef.current = ctx
  })

  useEffect(() => {
    let game
    let cancelado = false

    // o canvas só desenha com a fonte do jogo depois que ela carregou
    document.fonts
      .load('400 20px Fredoka')
      .catch(() => {})
      .then(() => {
        if (cancelado) return
        game = new Phaser.Game({
          type: Phaser.AUTO,
          parent: containerRef.current,
          width: 800,
          height: 450,
          scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_HORIZONTALLY },
          physics: { default: 'arcade', arcade: { gravity: { y: 1100 } } },
          scene: [CENAS[cena]],
          callbacks: { preBoot: (g) => g.registry.set('ctx', ctxRef.current) },
        })
        // só para testes automáticos no modo de desenvolvimento
        if (import.meta.env.DEV) window.__phaser = game
      })

    return () => {
      cancelado = true
      pararMusica()
      game?.destroy(true)
    }
  }, [cena])

  return <div ref={containerRef} className="jogo" />
}
