import { TRACO, svg, circulo, elipse, cam, ret, grupo, gira } from './primitivas.js'

const C = 'stroke="#3b2a1a" stroke-width="2.5"'
const olhoFofo = (x, y, r = 6) => circulo(x, y, r, '#fff', C) + circulo(x + 1.5, y + 0.5, r * 0.5, TRACO)

// ---------------------------------------------------------------- TREM
function roda(cx, cy, r, f) {
  return (
    circulo(cx, cy, r, '#37474f', C) +
    circulo(cx, cy, r * 0.45, '#cfd8dc') +
    gira(cam(`M${cx - r + 3} ${cy} H${cx + r - 3} M${cx} ${cy - r + 3} V${cy + r - 3}`, 'none', '#cfd8dc', 2.5), f * 22.5, cx, cy)
  )
}

function locomotiva(f) {
  return svg(
    // fumaça
    circulo(70, 22 - f * 2, 5 + (f % 2), '#fff', 'opacity="0.85"') +
      circulo(78, 12 - f * 1.5, 4 + ((f + 1) % 2), '#fff', 'opacity="0.6"') +
      ret(8, 26, 26, 6, '#37474f', 2) +
      ret(8, 30, 24, 36, '#3f8fd9', 4, C) +
      ret(13, 36, 14, 12, '#bfe3ff', 2, C) +
      ret(60, 24, 12, 16, '#37474f', 2, C) +
      ret(56, 20, 20, 6, '#37474f', 3, C) +
      ret(30, 38, 52, 28, '#e8554e', 12, C) +
      ret(8, 62, 86, 10, '#37474f', 3, C) +
      olhoFofo(62, 50) + olhoFofo(76, 50) +
      cam('M62 58 Q69 64 76 58', 'none', TRACO, 2.5) +
      cam('M88 72 L98 82 L88 82 Z', '#ffd23f', TRACO, 2) +
      roda(26, 78, 12, f) + roda(50, 78, 12, f) + roda(76, 80, 9, f),
  )
}

// ---------------------------------------------------------------- ARANHA
// Perna com contorno escuro por baixo e miolo claro: aparece em fundo claro e escuro (as
// telas dos hiperfocos têm fundos roxos).
const perna = (d, cor, largura) => cam(d, 'none', '#26163d', largura + 3.5) + cam(d, 'none', cor, largura)

function pernas(pose, cor) {
  const p = pose ? 5 : -3
  const lado = (sx) =>
    [
      [34, 30, 14, 8 + p, 4, 22 + p],
      [32, 40, 8, 34 + p, 2, 50 + p],
      [32, 50, 8, 60 - p, 4, 76 - p],
      [36, 58, 16, 80 - p, 12, 94 - p],
    ]
      .map(([x0, y0, x1, y1, x2, y2]) => {
        const m = (x) => (sx < 0 ? x : 100 - x)
        return perna(`M${m(x0)} ${y0} L${m(x1)} ${y1} L${m(x2)} ${y2}`, cor, 4)
      })
      .join('')
  return lado(-1) + lado(1)
}

function aranha(f) {
  const roxo = '#7b4bb8'
  return svg(
    pernas(f % 2, '#a07ed6') +
      elipse(50, 62, 22, 22, roxo, C) +
      circulo(50, 38, 17, '#8e5ccc', C) +
      cam('M40 62 H60 M42 70 H58', 'none', '#b995e8', 3) +
      olhoFofo(43, 34, 7) + olhoFofo(57, 34, 7) +
      cam('M44 44 Q50 50 56 44', 'none', TRACO, 2.5),
  )
}

// ---------------------------------------------------------------- AVIÃO
function aviao(f) {
  const helice = f % 2 ? 16 : 8
  // Cada parte ocupa o seu lugar, sem traço cruzando o rosto: cauda atrás, asa na metade
  // de trás do corpo, rosto na frente e rodas embaixo do nariz.
  return svg(
    // trem de pouso (atrás do corpo)
    cam('M60 62 V74 M74 60 V73', 'none', '#37474f', 3) +
      circulo(60, 76, 5.5, '#37474f', C) + circulo(74, 75, 5.5, '#37474f', C) +
      // cauda
      cam('M22 48 L12 26 Q11 22 15 22 L24 22 L38 44 Z', '#d94a3d', C) +
      // corpo e brilho
      elipse(52, 50, 38, 16, '#ff6f61', C) +
      cam('M26 42 Q38 36 52 36', 'none', '#fff', 3, 'opacity="0.55"') +
      // asa
      cam('M28 52 L20 72 Q19 76 23 76 L36 76 L48 54 Z', '#e8554e', C) +
      // janela com o olho e o sorriso
      circulo(68, 46, 8, '#bfe3ff', C) +
      olhoFofo(67, 46, 4.5) +
      cam('M62 57 Q68 61 74 57', 'none', TRACO, 2.5) +
      // hélice
      elipse(95, 50, 3, helice, '#cfd8dc', 'opacity="0.8"') +
      circulo(91, 50, 4, '#37474f', C),
  )
}

// ---------------------------------------------------------------- DINOSSAURO
function dinossauro(f) {
  const rabo = f % 2 ? 8 : -2
  return svg(
    cam(`M30 60 C14 60 6 ${48 + rabo} 4 ${36 + rabo} C14 ${44 + rabo} 22 48 32 46 Z`, '#4aa84a', C) +
      [36, 46, 56, 66].map((x, i) => cam(`M${x} ${40 - i} L${x + 5} ${28 - i} L${x + 10} ${40 - i} Z`, '#ffd23f', TRACO, 2)).join('') +
      elipse(48, 58, 28, 22, '#5cb85c', C) +
      elipse(48, 66, 17, 12, '#c9ec9a') +
      ret(34, 74, 10, 18, '#4aa84a', 4, C) + ret(54, 74, 10, 18, '#4aa84a', 4, C) +
      elipse(74, 36, 17, 15, '#5cb85c', C) +
      ret(80, 40, 18, 14, '#5cb85c', 6, C) +
      olhoFofo(72, 30, 6) +
      cam('M82 50 Q90 55 96 50', 'none', TRACO, 2.5) +
      cam('M86 46 L88 50 L90 46 M92 46 L94 50', 'none', '#fff', 2) +
      cam('M66 60 L74 66', 'none', '#3a8a3a', 4),
  )
}

// ---------------------------------------------------------------- ITENS: TREM
const TREM = [
  () => locomotiva(0),
  () =>
    svg(
      ret(10, 34, 80, 38, '#e07a3f', 5, C) +
        cam('M10 46 H90 M10 58 H90', 'none', '#b85d22', 2) +
        ret(40, 44, 20, 28, '#a84f1c', 2, C) +
        ret(4, 62, 10, 5, '#37474f', 2) + ret(86, 62, 10, 5, '#37474f', 2) +
        roda(26, 78, 10, 0) + roda(74, 78, 10, 0),
    ),
  () =>
    svg(
      cam('M6 70 V50 C6 38 30 30 52 30 H80 C90 30 96 40 96 70 Z', '#f4f7f9', C) +
        cam('M30 38 H48 V52 H20 C20 44 24 40 30 38Z', '#3f8fd9', TRACO, 2) +
        ret(54, 38, 14, 14, '#3f8fd9', 2, C) + ret(72, 38, 14, 14, '#3f8fd9', 2, C) +
        ret(6, 58, 90, 6, '#e8554e', 0) +
        roda(26, 78, 9, 0) + roda(72, 78, 9, 0),
    ),
  () =>
    svg(
      ret(8, 28, 84, 46, '#3f8fd9', 12, C) +
        ret(14, 36, 16, 16, '#bfe3ff', 3, C) + ret(36, 36, 16, 16, '#bfe3ff', 3, C) + ret(58, 36, 16, 16, '#bfe3ff', 3, C) +
        ret(78, 34, 10, 30, '#2b6aa8', 3, C) +
        ret(8, 62, 84, 6, '#ffd23f', 0) +
        circulo(30, 80, 7, '#37474f', C) + circulo(70, 80, 7, '#37474f', C),
    ),
  () =>
    svg(
      cam('M10 18 H90', 'none', '#37474f', 3) + cam('M50 18 V34', 'none', '#37474f', 3) +
        ret(10, 34, 80, 40, '#ffd23f', 10, C) +
        ret(18, 42, 16, 14, '#bfe3ff', 3, C) + ret(42, 42, 16, 14, '#bfe3ff', 3, C) + ret(66, 42, 16, 14, '#bfe3ff', 3, C) +
        ret(10, 64, 80, 5, '#e8554e', 0) +
        circulo(28, 80, 8, '#37474f', C) + circulo(72, 80, 8, '#37474f', C),
    ),
  () =>
    svg(
      cam('M4 40 L50 12 L96 40 Z', '#c4443d', TRACO, 3) +
        ret(12, 40, 76, 48, '#f3d9a8', 3, C) +
        circulo(50, 30, 9, '#fff', C) + cam('M50 30 V24 M50 30 L55 33', 'none', TRACO, 2) +
        ret(40, 60, 20, 28, '#8a5a2b', 3, C) +
        ret(18, 50, 16, 14, '#bfe3ff', 2, C) + ret(66, 50, 16, 14, '#bfe3ff', 2, C) +
        ret(0, 88, 100, 6, '#9aa7b0', 2),
    ),
  () =>
    svg(
      cam('M30 10 L10 96 M70 10 L90 96', 'none', '#78909c', 7) +
        [22, 38, 54, 70, 86].map((y, i) => cam(`M${26 - i * 3.5} ${y} H${74 + i * 3.5}`, 'none', '#9a6b3f', 8)).join('') +
        cam('M30 10 L10 96 M70 10 L90 96', 'none', '#cfd8dc', 3),
    ),
  () =>
    svg(
      ret(44, 8, 12, 84, '#78909c', 4, C) +
        ret(30, 12, 40, 54, '#37474f', 8, C) +
        circulo(50, 26, 8, '#e8302b', C) + circulo(50, 40, 8, '#ffd23f', C) + circulo(50, 54, 8, '#3acf5a', C) +
        ret(36, 92, 28, 6, '#78909c', 2),
    ),
  () =>
    svg(
      ret(2, 70, 96, 12, '#9aa7b0', 3, C) +
        ret(6, 38, 88, 28, '#5cb85c', 12, C) +
        ret(14, 44, 14, 14, '#bfe3ff', 3, C) + ret(36, 44, 14, 14, '#bfe3ff', 3, C) + ret(58, 44, 14, 14, '#bfe3ff', 3, C) +
        cam('M6 66 H94', 'none', '#fff', 3, 'opacity="0.5"') +
        cam('M20 38 V28 M80 38 V28', 'none', '#37474f', 3),
    ),
  () =>
    svg(
      cam('M2 88 L60 34 L98 88 Z', '#8fa8b8', C) + cam('M46 48 L60 34 L72 48 L64 52 L58 46 L52 52 Z', '#fff', 'none', 0) +
        gira(ret(30, 40, 34, 18, '#e8554e', 6, C) + ret(36, 44, 8, 8, '#bfe3ff', 2) + ret(48, 44, 8, 8, '#bfe3ff', 2), -32, 47, 49) +
        circulo(22, 78, 5, '#37474f', C),
    ),
]

// ---------------------------------------------------------------- ITENS: ARANHA
const FIO = (x1, y1, x2, y2) => cam(`M${x1} ${y1} L${x2} ${y2}`, 'none', '#cfd8dc', 2)
function teia(orvalho) {
  const raios = [0, 45, 90, 135, 180, 225, 270, 315].map((a) => {
    const r = (a * Math.PI) / 180
    return FIO(50, 50, 50 + 46 * Math.cos(r), 50 + 46 * Math.sin(r))
  })
  const aneis = [14, 28, 42].map((raio) => {
    const pts = [0, 45, 90, 135, 180, 225, 270, 315].map((a) => {
      const r = (a * Math.PI) / 180
      return `${(50 + raio * Math.cos(r)).toFixed(1)} ${(50 + raio * Math.sin(r)).toFixed(1)}`
    })
    return cam(`M${pts.join(' L')} Z`, 'none', '#b0bec5', 2)
  })
  const gotas = orvalho
    ? [[50, 36], [64, 50], [50, 78], [34, 50], [74, 24], [26, 74]].map(([x, y]) => circulo(x, y, 4.5, '#8ad4ff', 'stroke="#2f86c9" stroke-width="1.5"') + circulo(x - 1, y - 1.5, 1.2, '#fff')).join('')
    : ''
  return svg(raios.join('') + aneis.join('') + gotas)
}

function aranhaPequena({ corpo = '#7b4bb8', abdomen = corpo, olhos = 'frontal', listras = false, coroa = false, leque = false, peludo = false, escala = 1 }) {
  const pernasSVG = [
    [30, 40, 10, 24, 4, 38], [28, 50, 6, 46, 2, 62], [28, 58, 8, 66, 6, 84], [34, 66, 18, 82, 14, 94],
  ]
    .map(([x0, y0, x1, y1, x2, y2]) => {
      const cor = peludo ? '#8a6034' : '#a07ed6'
      const largura = peludo ? 5 : 4
      return perna(`M${x0} ${y0} L${x1} ${y1} L${x2} ${y2}`, cor, largura) + perna(`M${100 - x0} ${y0} L${100 - x1} ${y1} L${100 - x2} ${y2}`, cor, largura)
    })
    .join('')
  const fundo = leque
    ? [-60, -36, -12, 12, 36, 60].map((a, i) => gira(elipse(50, 38, 5, 24, ['#e8302b', '#ffd23f', '#3acf5a', '#3f8fd9', '#7b4bb8', '#ff8fb1'][i], 'opacity="0.95"'), a, 50, 70)).join('')
    : ''
  return svg(
    grupo(fundo + pernasSVG + elipse(50, 70, 20, 20, abdomen, C) + (listras ? cam('M34 66 H66 M36 74 H64 M40 82 H60', 'none', '#ffd23f', 3.5) : '') + circulo(50, 46, 14, corpo, C) +
      (olhos === 'frontal' ? olhoFofo(43, 42, 6.5) + olhoFofo(57, 42, 6.5) : olhoFofo(44, 42, 4.5) + olhoFofo(56, 42, 4.5) + circulo(50, 36, 3, TRACO)) +
      cam('M45 52 Q50 56 55 52', 'none', TRACO, 2) +
      (coroa ? cam('M38 34 L40 20 L45 28 L50 16 L55 28 L60 20 L62 34 Z', '#ffd23f', TRACO, 2.5) : ''),
    `translate(${50 - 50 * escala} ${50 - 50 * escala}) scale(${escala})`),
  )
}

const ARANHA = [
  () => teia(false),
  () => aranhaPequena({ corpo: '#3a3a4a', abdomen: '#3a3a4a', olhos: 'varios', escala: 0.9 }),
  () => svg(cam('M2 86 Q30 60 60 70 Q80 78 98 66 Q80 96 40 94 Q16 94 2 86Z', '#5cb85c', '#3a8a3a', 2.5)) .replace('</svg>', '') + aranhaPequena({ corpo: '#8e5ccc', abdomen: '#7b4bb8', listras: true, escala: 0.75 }).replace(/^<svg[^>]*>/, '').replace('</svg>', '') + '</svg>',
  () =>
    svg(
      cam('M50 0 V22', 'none', '#cfd8dc', 3) +
        elipse(50, 56, 22, 34, '#f4f7f9', C) +
        cam('M30 44 Q50 52 70 40 M29 58 Q50 66 71 54 M32 72 Q50 78 68 68', 'none', '#cfd8dc', 3),
    ),
  () => teia(true),
  () =>
    svg(
      ret(26, 14, 48, 12, '#9a6b3f', 4, C) + ret(26, 74, 48, 12, '#9a6b3f', 4, C) +
        ret(32, 26, 36, 48, '#e8e1f7', 3, C) +
        cam('M32 34 Q50 28 68 36 M32 46 Q50 40 68 48 M32 58 Q50 52 68 60 M32 68 Q50 62 68 70', 'none', '#b0bec5', 2.5) +
        cam('M68 60 Q88 54 90 74 Q92 90 78 92', 'none', '#cfd8dc', 3),
    ),
  () =>
    svg(
      cam('M60 66 L92 94', 'none', '#6b4a2b', 10) +
        circulo(40, 40, 32, '#bfe3ff', 'stroke="#3b2a1a" stroke-width="5" fill-opacity="0.5"') +
        cam('M24 30 Q28 20 40 16', 'none', '#fff', 5, 'opacity="0.9"') +
        grupo(aranhaPequena({}).replace(/^<svg[^>]*>/, '').replace('</svg>', ''), 'translate(22 22) scale(0.36)'),
    ),
  () => aranhaPequena({ corpo: '#2f6fd0', abdomen: '#2f6fd0', leque: true, escala: 0.95 }),
  () => aranhaPequena({ corpo: '#7a5230', abdomen: '#8a6034', peludo: true, olhos: 'varios', escala: 1 }),
  () => aranhaPequena({ corpo: '#8e5ccc', abdomen: '#7b4bb8', coroa: true, escala: 0.95 }),
]

// ---------------------------------------------------------------- ITENS: AVIÃO
const AVIAO = [
  () =>
    svg(
      // aviãozinho de papel: três faces fechadas que só se tocam nas dobras
      cam('M42 56 L94 22 L62 84 L52 64 Z', '#dbe5ec', TRACO, 3) +
        cam('M42 56 L94 22 L52 64 Z', '#b9c8d2', TRACO, 3) +
        cam('M6 46 L94 22 L42 56 Z', '#ffffff', TRACO, 3),
    ),
  () =>
    svg(
      cam('M6 50 Q30 40 70 46 Q92 48 96 52 Q92 56 70 58 Q30 62 6 50Z', '#cfd8dc', C) +
        cam('M52 48 L28 18 L42 18 L66 48 Z', '#78909c', TRACO, 2.5) +
        cam('M52 58 L28 88 L42 88 L66 58 Z', '#78909c', TRACO, 2.5) +
        cam('M8 50 L2 38 L14 38 L22 48 Z', '#e8554e', TRACO, 2.5) +
        circulo(76, 52, 4, '#3f8fd9', C),
    ),
  () =>
    svg(
      cam('M6 24 H94', 'none', '#37474f', 4) + ret(46, 24, 8, 10, '#37474f', 2) +
        elipse(46, 54, 32, 20, '#e8554e', C) +
        cam('M62 50 Q78 48 82 56 Q78 62 62 60Z', '#bfe3ff', C) +
        cam('M16 54 H0 M0 46 V62', 'none', '#37474f', 4) +
        cam('M30 76 H72 M38 74 V80 M64 74 V80', 'none', '#37474f', 3),
    ),
  () =>
    svg(
      ret(0, 80, 100, 14, '#78909c', 0) + cam('M8 88 H92', 'none', '#fff', 3, 'stroke-dasharray="10 8"') +
        gira(
          cam('M10 54 L20 38 L40 40 L58 24 L72 24 L62 42 L90 46 Q96 54 86 58 L50 62 Z', '#f4f7f9', C) +
            circulo(76, 50, 4, '#3f8fd9', C),
          -24, 50, 50,
        ),
    ),
  () =>
    svg(
      cam('M50 4 C68 20 70 46 66 70 H34 C30 46 32 20 50 4Z', '#f4f7f9', C) +
        circulo(50, 36, 9, '#3f8fd9', C) +
        cam('M34 62 L18 84 L34 78 Z M66 62 L82 84 L66 78 Z', '#e8554e', TRACO, 2.5) +
        cam('M40 72 Q50 98 60 72 Z', '#ffb400', '#e8554e', 2.5),
    ),
  () =>
    svg(
      ret(42, 36, 16, 56, '#cfd8dc', 3, C) +
        cam('M30 36 H70 L62 18 H38 Z', '#3f8fd9', C) + ret(36, 14, 28, 6, '#78909c', 2, C) +
        ret(40, 22, 20, 10, '#bfe3ff', 2) + circulo(50, 8, 4, '#e8302b', C) +
        ret(30, 90, 40, 6, '#78909c', 2),
    ),
  () =>
    svg(
      circulo(32, 56, 22, '#fff', C) + circulo(54, 44, 26, '#fff', C) + circulo(74, 58, 20, '#fff', C) +
        ret(30, 56, 46, 22, '#fff', 0) + cam('M14 78 H94', 'none', '#fff', 0) +
        cam('M30 38 Q40 30 50 32', 'none', '#bfe3ff', 4, 'opacity="0.8"'),
    ),
  () =>
    svg(
      cam('M50 6 C16 6 12 50 30 66 L70 66 C88 50 84 6 50 6Z', '#e8554e', C) +
        cam('M50 6 C36 22 36 50 42 66 M50 6 C64 22 64 50 58 66', 'none', '#ffd23f', 6) +
        cam('M38 66 L42 80 H58 L62 66', 'none', TRACO, 3) + ret(40, 80, 20, 12, '#9a6b3f', 3, C) +
        cam('M34 70 L38 66 M66 70 L62 66', 'none', TRACO, 2.5),
    ),
  () =>
    svg(
      ret(20, 10, 60, 82, '#2f6fd0', 6, C) +
        circulo(50, 46, 18, 'none', 'stroke="#ffd23f" stroke-width="3"') +
        cam('M32 46 H68 M50 28 Q40 46 50 64 Q60 46 50 28', 'none', '#ffd23f', 2) +
        ret(30, 74, 40, 6, '#ffd23f', 2),
    ),
  () =>
    svg(
      cam('M30 14 H70 V40 C70 58 60 66 50 66 C40 66 30 58 30 40Z', '#ffd23f', '#d99a14', 3.5) +
        cam('M30 22 H16 C16 40 24 48 32 48 M70 22 H84 C84 40 76 48 68 48', 'none', '#d99a14', 4) +
        ret(44, 66, 12, 12, '#d99a14', 2) + ret(32, 78, 36, 12, '#9a6b3f', 4, C) +
        cam('M50 24 L54 34 L64 34 L56 40 L59 50 L50 44 L41 50 L44 40 L36 34 L46 34Z', '#fff', 'none', 0) +
        cam('M6 36 Q18 30 22 40 M94 36 Q82 30 78 40', 'none', '#cfd8dc', 4),
    ),
]

// ---------------------------------------------------------------- ITENS: DINOSSAURO
const DINO = [
  () => dinossauro(0),
  () =>
    svg(
      cam('M80 56 C90 56 96 48 94 40 C92 34 84 36 82 42', 'none', '#4aa84a', 6) +
        elipse(56, 60, 28, 18, '#5cb85c', C) +
        cam('M30 56 C20 40 20 20 26 10 L36 12 C34 24 36 40 42 50', '#5cb85c', C) +
        elipse(28, 10, 10, 7, '#5cb85c', C) + circulo(26, 8, 2.5, TRACO) +
        ret(34, 72, 9, 20, '#4aa84a', 3, C) + ret(48, 74, 9, 18, '#4aa84a', 3, C) + ret(66, 72, 9, 20, '#4aa84a', 3, C) +
        circulo(52, 58, 4, '#3a8a3a') + circulo(64, 62, 3.5, '#3a8a3a'),
    ),
  () =>
    svg(
      cam('M50 6 C26 6 16 40 16 60 C16 84 32 94 50 94 C68 94 84 84 84 60 C84 40 74 6 50 6Z', '#f9efd8', '#b8a070', 3.5) +
        circulo(38, 40, 6, '#7ac74f') + circulo(62, 54, 7, '#7ac74f') + circulo(40, 72, 5, '#7ac74f') + circulo(64, 28, 4, '#7ac74f') +
        cam('M30 30 Q34 20 44 16', 'none', '#fff', 5, 'opacity="0.8"'),
    ),
  () =>
    svg(
      cam('M10 26 Q4 14 18 16 L30 28 H70 L82 16 Q96 14 90 26 Q96 38 84 36 L70 44 H30 L16 36 Q4 38 10 26Z', '#f4efe4', '#9a8a60', 3) +
        cam('M30 54 H70 M32 66 H68 M36 78 H64', 'none', '#9a8a60', 4.5) +
        cam('M50 44 V86', 'none', '#9a8a60', 4.5),
    ),
  () =>
    svg(
      cam('M2 94 L36 36 H64 L98 94 Z', '#7a5a45', C) +
        cam('M36 36 L42 24 L50 32 L58 22 L64 36Z', '#e8554e', 'none', 0) +
        cam('M40 36 C34 16 44 6 50 2 C56 8 66 16 60 36Z', '#ff8a3d', C) +
        circulo(70, 14, 7, '#9aa7b0', 'opacity="0.7"') + circulo(80, 6, 5, '#9aa7b0', 'opacity="0.5"') +
        cam('M50 38 V90 M40 40 L28 90 M60 40 L72 90', 'none', '#e8554e', 4),
    ),
  () =>
    svg(
      [[34, 78, -10], [64, 52, 8], [32, 26, -8]].map(([x, y, a]) => gira(
        elipse(x, y, 14, 18, '#7a5a45', C) +
          [[-14, -14], [0, -22], [14, -14]].map(([dx, dy]) => elipse(x + dx, y + dy, 4, 6, '#7a5a45', C)).join(''), a, x, y)).join(''),
    ),
  () =>
    svg(
      cam('M48 94 C46 70 54 50 50 30', 'none', '#8a5a2b', 8) +
        [[-60, 0], [-30, -6], [0, -8], [30, -6], [60, 0]].map(([a, dy]) => gira(cam(`M50 ${28 + dy} Q70 ${10 + dy} 92 ${30 + dy}`, '#4aa84a', C), a, 50, 30)).join('') +
        circulo(44, 30, 5, '#9a6b3f', C) + circulo(56, 32, 5, '#9a6b3f', C),
    ),
  () =>
    svg(
      cam('M96 8 L46 40', 'none', '#ffb347', 14) + cam('M96 8 L46 40', 'none', '#ffe9a8', 6) +
        circulo(34, 52, 24, '#9aa7b0', C) + circulo(26, 46, 6, '#78909c') + circulo(42, 62, 5, '#78909c') + circulo(38, 42, 3.5, '#78909c') +
        cam('M92 30 L66 52 M80 6 L56 30', 'none', '#ffb347', 3, 'opacity="0.7"'),
    ),
  () =>
    svg(
      cam('M6 40 L50 12 L94 40 Z', '#c9a86b', C) +
        ret(10, 40, 80, 8, '#f4efe4', 2, C) +
        [16, 34, 52, 70].map((x) => ret(x, 48, 14, 36, '#f4efe4', 2, C)).join('') +
        ret(6, 84, 88, 10, '#c9a86b', 2, C) +
        circulo(50, 30, 7, '#fff', C) + cam('M46 30 H54', 'none', TRACO, 2),
    ),
  () => dinossauro(1).replace('</svg>', '') + cam('M62 24 L64 8 L70 16 L76 4 L82 16 L88 8 L90 24 Z', '#ffd23f', TRACO, 2.5) + '</svg>',
]

export const HF_PERSONAGENS = {
  trem: { frames: [0, 1, 2, 3].map(locomotiva), fps: 10, px: 128 },
  aranha: { frames: [0, 1].map(aranha), fps: 5, px: 128 },
  aviao: { frames: [0, 1].map(aviao), fps: 14, px: 128 },
  dinossauro: { frames: [0, 1].map(dinossauro), fps: 5, px: 128 },
}

export const HF_ITENS = { trem: TREM, aranha: ARANHA, aviao: AVIAO, dinossauro: DINO }
