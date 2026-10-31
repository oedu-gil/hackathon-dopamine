import { TRACO, svg, circulo, elipse, cam, ret, COR } from './primitivas.js'

// Os amigos: cabeça redonda e corpinho, cada bicho com orelhas e detalhes próprios.
// Piscam de tempos em tempos.
const CONTORNO = 'stroke="#3b2a1a" stroke-width="2.5"'

const BICHOS = {
  cachorro: { cor: '#d9a066', escuro: '#8a5a2b', orelha: 'caida', focinho: '#f6dcc0' },
  gato: { cor: '#f4a261', escuro: '#d57d36', orelha: 'ponta', focinho: '#fbe3c8', bigode: true },
  coelho: { cor: '#f4eadb', escuro: '#f4a3b5', orelha: 'longa', focinho: '#ffffff' },
  urso: { cor: '#b9835a', escuro: '#8a5a2b', orelha: 'redonda', focinho: '#e8c9a0' },
  raposa: { cor: '#f08a3c', escuro: '#c8631a', orelha: 'ponta', focinho: '#ffffff', bochechas: true },
  panda: { cor: '#ffffff', escuro: '#2b2b2b', orelha: 'redonda', manchas: true, focinho: '#ffffff' },
  sapo: { cor: '#7ac74f', escuro: '#4f9a2c', orelha: 'sapo', focinho: '#c9ec9a' },
  macaco: { cor: '#a9743f', escuro: '#7d5128', orelha: 'redonda', focinho: '#f0d2a4', rosto: true },
}

function orelhas(b) {
  switch (b.orelha) {
    case 'caida':
      return (
        elipse(20, 52, 10, 20, b.escuro, `transform="rotate(12 20 52)" ${CONTORNO}`) +
        elipse(80, 52, 10, 20, b.escuro, `transform="rotate(-12 80 52)" ${CONTORNO}`)
      )
    case 'ponta':
      return (
        cam('M20 40 L26 6 L48 24 Z', b.cor, TRACO, 2.5) +
        cam('M80 40 L74 6 L52 24 Z', b.cor, TRACO, 2.5) +
        cam('M27 30 L29 15 L40 25 Z', b.escuro, 'none', 0) +
        cam('M73 30 L71 15 L60 25 Z', b.escuro, 'none', 0)
      )
    case 'longa':
      return (
        elipse(36, 18, 8, 22, b.cor, CONTORNO) +
        elipse(64, 18, 8, 22, b.cor, CONTORNO) +
        elipse(36, 20, 4, 15, b.escuro) +
        elipse(64, 20, 4, 15, b.escuro)
      )
    case 'redonda':
      return (
        circulo(22, 26, 12, b.escuro, CONTORNO) +
        circulo(78, 26, 12, b.escuro, CONTORNO) +
        circulo(22, 26, 6, b.focinho) +
        circulo(78, 26, 6, b.focinho)
      )
    case 'sapo':
      return (
        circulo(30, 26, 13, b.cor, CONTORNO) + circulo(70, 26, 13, b.cor, CONTORNO)
      )
    default:
      return ''
  }
}

function rosto(b, fechado) {
  const olho = (x, y) =>
    fechado
      ? cam(`M${x - 6} ${y} Q${x} ${y + 6} ${x + 6} ${y}`)
      : circulo(x, y, 5.5, TRACO) + circulo(x + 1.8, y - 2, 1.8, '#fff')
  let s = ''
  if (b.manchas) {
    s += elipse(35, 54, 9, 11, '#2b2b2b', 'transform="rotate(20 35 54)"')
    s += elipse(65, 54, 9, 11, '#2b2b2b', 'transform="rotate(-20 65 54)"')
  }
  if (b.rosto) s += elipse(50, 66, 22, 18, b.focinho) + circulo(38, 50, 11, b.focinho) + circulo(62, 50, 11, b.focinho)
  if (b.bochechas) s += cam('M18 66 Q34 58 50 74 Q66 58 82 66 Q72 90 50 90 Q28 90 18 66Z', b.focinho, 'none', 0)
  else if (!b.rosto && b.orelha !== 'sapo') s += elipse(50, 74, 15, 11, b.focinho)

  const olhoY = b.orelha === 'sapo' ? 28 : 54
  const olhoX = b.orelha === 'sapo' ? [30, 70] : [36, 64]
  if (b.orelha === 'sapo') {
    s += circulo(30, 28, 9, '#fff', CONTORNO) + circulo(70, 28, 9, '#fff', CONTORNO)
    s += (fechado ? cam('M23 29 H37 M63 29 H77') : circulo(31, 29, 4.5, TRACO) + circulo(69, 29, 4.5, TRACO))
  } else {
    s += olho(olhoX[0], olhoY) + olho(olhoX[1], olhoY)
  }
  s += b.orelha === 'sapo' ? cam('M30 70 Q50 86 70 70') : ''
  if (b.orelha !== 'sapo') {
    s += elipse(50, 68, 6, 4.5, TRACO)
    s += cam('M50 72 V77 M42 79 Q50 85 58 79')
  }
  if (b.bigode) s += cam('M20 68 L36 70 M20 76 L36 74 M80 68 L64 70 M80 76 L64 74', 'none', TRACO, 1.8)
  s += elipse(24, 70, 6, 4, COR.rosa, 'opacity="0.55"') + elipse(76, 70, 6, 4, COR.rosa, 'opacity="0.55"')
  return s
}

function desenhar(b, fechado) {
  return svg(
    orelhas(b) +
      ret(26, 84, 48, 16, b.cor, 8, CONTORNO) +
      circulo(50, 56, 36, b.cor, CONTORNO) +
      rosto(b, fechado),
  )
}

export const NOMES_ANIMAIS = Object.keys(BICHOS)

export function animal(nome) {
  const b = BICHOS[nome]
  const aberto = desenhar(b, false)
  const fechado = desenhar(b, true)
  return { frames: [aberto, fechado], seq: [0, 0, 0, 0, 0, 0, 0, 1], fps: 4, px: 112 }
}
