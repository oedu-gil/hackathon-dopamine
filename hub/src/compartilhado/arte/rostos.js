import { TRACO, svg, circulo, elipse, cam, ret, grupo, COR } from './primitivas.js'

// Rostos de emoção. Cada expressão combina olhos, sobrancelhas, boca e detalhes (lágrima,
// vapor, suor...). Os detalhes se mexem entre dois quadros (t = 0 e 1) e há um quadro de
// piscada, então o rosto "respira" mesmo parado.
const CONTORNO = 'stroke="#3b2a1a" stroke-width="2.5"'
const XS = [34, 66]

function olhos(tipo, fechado) {
  if (fechado || tipo === 'fechado') {
    return XS.map((x) => cam(`M${x - 7} 44 Q${x} 51 ${x + 7} 44`)).join('')
  }
  switch (tipo) {
    case 'feliz':
      return XS.map((x) => cam(`M${x - 7} 46 Q${x} 35 ${x + 7} 46`, 'none', TRACO, 3.5)).join('')
    case 'grande':
      return XS.map((x) => circulo(x, 42, 10, '#fff', CONTORNO) + circulo(x, 42, 4.5, TRACO)).join('')
    case 'lado':
      return XS.map((x) => circulo(x, 42, 9, '#fff', CONTORNO) + circulo(x + 3.5, 44, 4.5, TRACO)).join('')
    case 'cansado':
      return XS.map((x) => elipse(x, 45, 6, 3.5, TRACO) + cam(`M${x - 8} 43 Q${x} 39 ${x + 8} 43`)).join('')
    default:
      return XS.map((x) => elipse(x, 42, 5.5, 7.5, TRACO) + circulo(x + 1.8, 39, 2, '#fff')).join('')
  }
}

function sobrancelhas(tipo) {
  const l = (d) => cam(d, 'none', TRACO, 3.5)
  switch (tipo) {
    case 'triste':
      return l('M23 34 L42 27') + l('M77 34 L58 27')
    case 'brava':
      return l('M23 27 L42 35') + l('M77 27 L58 35')
    case 'surpresa':
      return l('M25 28 Q34 19 43 28') + l('M57 28 Q66 19 75 28')
    case 'nervosa':
      return l('M24 32 Q33 25 42 31') + l('M58 31 Q67 25 76 32')
    default:
      return ''
  }
}

function boca(tipo, t) {
  switch (tipo) {
    case 'sorriso':
      return cam('M30 62 Q50 80 70 62')
    case 'sorrisao':
      return (
        cam('M27 59 Q50 92 73 59 Z', '#7a2e2e', TRACO, 3) +
        cam('M38 73 Q50 83 62 73 Q50 66 38 73', '#ff8a8a', 'none', 0)
      )
    case 'triste':
      return cam('M34 76 Q50 62 66 76')
    case 'reta':
      return cam('M37 70 L63 70')
    case 'aberta':
      return elipse(50, 71, 8, 10, '#7a2e2e', CONTORNO)
    case 'ondulada':
      return cam('M31 71 Q37 64 43 71 T55 71 T69 71')
    case 'brava':
      return cam('M33 76 Q50 63 67 76 L60 79 L40 79 Z', '#fff', TRACO, 2.5)
    case 'dentes':
      return (
        cam('M31 66 L69 66 L65 79 L35 79 Z', '#fff', TRACO, 3) +
        cam('M44 66 L44 79 M56 66 L56 79', 'none', TRACO, 2)
      )
    case 'lingua':
      return cam('M34 72 Q50 63 66 72') + elipse(50, 79, 7, 9, '#ff7a7a', CONTORNO)
    case 'semjeito':
      return (
        ret(33, 64, 34, 10, '#fff', 3, CONTORNO) + cam('M44 64 V74 M55 64 V74', 'none', TRACO, 2)
      )
    case 'falando':
      return elipse(50, 71, 8, 6 + 4 * t, '#7a2e2e', CONTORNO)
    default:
      return ''
  }
}

function extras(lista, t) {
  return lista
    .map((nome) => {
      switch (nome) {
        case 'lagrima': {
          const y = t * 7
          const gota = (x) =>
            `<path d="M${x} ${52 + y} q-6 9 0 13 q6 -4 0 -13z" fill="#6ec3ff" stroke="#2f86c9" stroke-width="1.5"/>`
          return gota(23) + gota(77)
        }
        case 'suor':
          return `<path d="M84 ${24 + t * 5} q-6 9 0 13 q6 -4 0 -13z" fill="#8ad4ff" stroke="#2f86c9" stroke-width="1.5"/>`
        case 'vapor':
          return (
            circulo(13, 18, 5 + t * 2, '#fff', `opacity="${0.9 - t * 0.3}"`) +
            circulo(87, 18, 5 + t * 2, '#fff', `opacity="${0.9 - t * 0.3}"`)
          )
        case 'bochecha': // as bochechas "pulsam" entre os dois quadros
          return (
            elipse(22, 62, 8 + t * 1.5, 5 + t, COR.rosa, `opacity="${0.55 + t * 0.2}"`) +
            elipse(78, 62, 8 + t * 1.5, 5 + t, COR.rosa, `opacity="${0.55 + t * 0.2}"`)
          )
        case 'rubor':
          return elipse(23, 60, 10, 7, '#ff6b8b', 'opacity="0.7"') + elipse(77, 60, 10, 7, '#ff6b8b', 'opacity="0.7"')
        case 'curativo':
          return grupo(
            ret(18, 12, 34, 13, '#f2c98e', 3, 'stroke="#c99a58" stroke-width="2"') +
              circulo(29, 18.5, 1.3, '#c99a58') +
              circulo(35, 18.5, 1.3, '#c99a58') +
              circulo(41, 18.5, 1.3, '#c99a58'),
            'rotate(-22 35 18)',
          )
        case 'zzz': {
          const z = (x, y, s) => cam(`M${x} ${y} h${s} l-${s} ${s} h${s}`, 'none', '#5a6bd8', 2.5)
          return z(72, 18 - t * 3, 9) + z(82, 8 - t * 3, 7)
        }
        case 'festa':
          return (
            cam('M36 18 L50 3 L64 18 Z', '#ff6ec7', TRACO, 2.5) +
            circulo(50, 4, 3.5, '#ffd23f', CONTORNO) +
            cam('M42 14 L58 14', 'none', '#fff', 2.5)
          )
        case 'coracaopartido':
          return (
            `<path d="M82 14 q-9 -9 -13 0 q-3 8 13 18 q16 -10 13 -18 q-4 -9 -13 0z" fill="#e8554e" stroke="#3b2a1a" stroke-width="2"/>` +
            cam('M82 14 L79 21 L85 25 L82 31', 'none', '#fff', 2)
          )
        case 'dedo':
          return ret(47, 56, 7, 30, '#ffd9a8', 3.5, CONTORNO)
        case 'oculos':
          return (
            ret(20, 34, 26, 15, '#222', 6) +
            ret(54, 34, 26, 15, '#222', 6) +
            cam('M46 40 H54', 'none', '#222', 3)
          )
        default:
          return ''
      }
    })
    .join('')
}

// id -> especificação
const EXPRESSOES = {
  alegre: { olhos: 'feliz', boca: 'sorrisao', extra: ['bochecha'] },
  triste: { olhos: 'normal', sobr: 'triste', boca: 'triste', extra: ['lagrima'] },
  bravo: { cor: '#ff8f6b', olhos: 'normal', sobr: 'brava', boca: 'brava', extra: ['vapor'] },
  medo: { cor: '#cfe3ff', olhos: 'grande', sobr: 'surpresa', boca: 'ondulada', extra: ['suor'] },
  surpreso: { olhos: 'grande', sobr: 'surpresa', boca: 'aberta' },
  nojo: { cor: '#b7dd6a', olhos: 'cansado', sobr: 'brava', boca: 'lingua' },
  calmo: { olhos: 'feliz', boca: 'sorriso', extra: ['bochecha'] },
  feliz: { olhos: 'feliz', boca: 'sorriso', extra: ['bochecha'] },
  sorriso: { olhos: 'normal', boca: 'sorriso' },
  festa: { olhos: 'feliz', boca: 'sorrisao', extra: ['festa', 'bochecha'] },
  machucado: { olhos: 'normal', sobr: 'triste', boca: 'triste', extra: ['lagrima', 'curativo'] },
  fome: { olhos: 'grande', sobr: 'triste', boca: 'ondulada' },
  sozinho: { olhos: 'lado', sobr: 'triste', boca: 'triste' },
  sono: { olhos: 'cansado', boca: 'aberta', extra: ['zzz'] },
  chateado: { olhos: 'lado', sobr: 'triste', boca: 'reta' },
  nervoso: { olhos: 'grande', sobr: 'nervosa', boca: 'ondulada', extra: ['suor'] },
  frustrado: { cor: '#ffb36b', olhos: 'normal', sobr: 'brava', boca: 'dentes', extra: ['vapor'] },
  saudade: { olhos: 'normal', sobr: 'triste', boca: 'triste', extra: ['lagrima', 'coracaopartido'] },
  envergonhado: { olhos: 'lado', boca: 'semjeito', extra: ['rubor', 'suor'] },
  neutro: { olhos: 'normal', boca: 'reta' },
  segredo: { olhos: 'lado', sobr: 'nervosa', extra: ['dedo'] },
  falando: { olhos: 'normal', boca: 'falando' },
  semjeito: { olhos: 'lado', boca: 'semjeito', extra: ['suor'] },
  convencido: { olhos: 'fechado', boca: 'sorriso', extra: ['oculos'] },
  calado: { olhos: 'lado', boca: 'reta' },
  confuso: { olhos: 'normal', sobr: 'nervosa', boca: 'ondulada' },
  pensando: { olhos: 'lado', sobr: 'nervosa', boca: 'reta' },
}

// Os dados do jogo usam estes ids em `cara` (ex.: cara: 'triste').
export const IDS_ROSTOS = Object.keys(EXPRESSOES)

function desenhar(id, { fechado, t }) {
  const e = EXPRESSOES[id]
  const cor = e.cor ?? COR.amarelo
  return svg(
    circulo(50, 52, 44, cor, 'stroke="#c98a14" stroke-width="3"') +
      olhos(e.olhos, fechado) +
      sobrancelhas(e.sobr) +
      (e.boca ? boca(e.boca, t) : '') +
      extras(e.extra ?? [], t),
  )
}

// { frames, seq, fps, px } para o registro de arte
export function rosto(id) {
  const e = EXPRESSOES[id]
  const a = desenhar(id, { fechado: false, t: 0 })
  const b = desenhar(id, { fechado: false, t: 1 })
  const piscavel = ['normal', 'grande', 'lado', 'cansado'].includes(e.olhos)
  const frames = a === b ? [a] : [a, b]
  let seq = frames.length === 2 ? [0, 1] : [0]
  if (piscavel) {
    frames.push(desenhar(id, { fechado: true, t: 0 }))
    const fecho = frames.length - 1
    seq = frames.length === 3 ? [0, 1, 0, 1, 0, 1, 0, 1, fecho] : [0, 0, 0, 0, 0, 0, fecho]
  }
  return { frames, seq, fps: 4, px: 96 }
}
