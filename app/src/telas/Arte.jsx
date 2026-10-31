import { useEffect, useState } from 'react'
import { ARTE, urlDoQuadro } from '../arte/index.js'

// Mostra um desenho de src/arte no site. Se tem mais de um quadro, anima (a menos que a
// pessoa tenha pedido menos movimento no sistema ou `animar` seja falso).
export default function Arte({ id, tamanho = 48, animar = true, className = '' }) {
  const desc = ARTE[id]
  const [quadro, setQuadro] = useState(0)

  useEffect(() => {
    if (!animar || desc.frames.length < 2) return
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return
    const sequencia = desc.seq ?? desc.frames.map((_, i) => i)
    let posicao = 0
    const relogio = setInterval(() => {
      posicao = (posicao + 1) % sequencia.length
      setQuadro(sequencia[posicao])
    }, 1000 / (desc.fps ?? 6))
    return () => clearInterval(relogio)
  }, [id, animar, desc])

  return (
    <img
      className={`arte ${className}`}
      src={urlDoQuadro(id, quadro)}
      width={tamanho}
      height={tamanho}
      alt=""
      draggable="false"
    />
  )
}
