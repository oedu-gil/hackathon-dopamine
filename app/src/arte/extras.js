import { TRACO, svg, circulo, cam, ret, grupo } from './primitivas.js'

const C = 'stroke="#3b2a1a" stroke-width="2.5"'
const ESTRELA = 'M50 6 L61 36 L94 38 L68 58 L77 90 L50 71 L23 90 L32 58 L6 38 L39 36 Z'

// Estrela que gira: achata e volta, como uma moeda de jogo.
const estrelaGirando = (sx) =>
  svg(grupo(cam(ESTRELA, '#ffd23f', '#d99a14', 4) + cam('M50 22 L56 40', 'none', '#fff', 4, 'opacity="0.8"'), `translate(50 0) scale(${sx} 1) translate(-50 0)`))

const estrelaBonus = (brilho) =>
  svg(
    circulo(50, 50, 46, '#fff6b0', `opacity="${brilho ? 0.55 : 0.3}"`) +
      cam(ESTRELA, '#ffec4d', '#e8a014', 4) +
      cam('M50 22 L56 40', 'none', '#fff', 4) +
      cam(`M12 12 V${brilho ? 26 : 20} M5 ${brilho ? 19 : 16} H${brilho ? 19 : 27}`, 'none', '#fff', 3) +
      cam('M88 80 V94 M81 87 H95', 'none', '#fff', 3),
  )

const lesma = (f) =>
  svg(
    cam(`M10 82 Q8 66 22 66 H${f ? 78 : 74} Q94 ${f ? 66 : 70} ${f ? 94 : 88} 82 Z`, '#f2b84b', C) +
      circulo(38, 52, 22, '#c97a3a', C) +
      cam('M38 52 m-2 -2 a5 5 0 1 1 6 6 a10 10 0 1 1 -14 -10', 'none', '#8a4a1a', 3) +
      cam(`M${f ? 80 : 82} 66 V${f ? 40 : 46}`, 'none', '#d99a14', 3.5) + cam(`M${f ? 90 : 88} 68 V${f ? 44 : 38}`, 'none', '#d99a14', 3.5) +
      circulo(f ? 80 : 82, f ? 38 : 44, 4, '#fff', C) + circulo(f ? 90 : 88, f ? 42 : 36, 4, '#fff', C) +
      circulo(f ? 81 : 83, f ? 39 : 45, 1.8, TRACO) + circulo(f ? 91 : 89, f ? 43 : 37, 1.8, TRACO) +
      cam('M80 74 Q86 79 92 74', 'none', TRACO, 2),
  )

const mola = (comprimida) => {
  const topo = comprimida ? 62 : 36
  const voltas = comprimida ? 4 : 5
  const passo = (88 - topo - 8) / voltas
  let d = `M30 ${88}`
  for (let i = 0; i < voltas; i++) {
    const y = 88 - i * passo
    d += ` L70 ${y - passo / 2} L30 ${y - passo}`
  }
  return svg(
    ret(18, 88, 64, 10, '#e8554e', 4, C) +
      cam(d, 'none', '#9aa7b0', 7) +
      cam(d, 'none', '#cfd8dc', 3) +
      ret(14, topo - 8, 72, 12, '#f39a3d', 5, C) +
      cam(`M50 ${topo - 12} V${topo - 28} M40 ${topo - 20} L50 ${topo - 30} L60 ${topo - 20}`, 'none', '#fff', 4, 'opacity="0.9"'),
  )
}

const nuvem = svg(
  cam('M24 74 C6 74 4 50 24 48 C24 28 52 20 60 40 C78 30 96 44 88 62 C98 74 86 76 80 74 Z', '#ffffff', '#c5d6e4', 3),
)

const bandeira = (f) => {
  const quadro = (x, y, cor) => ret(x, y, 14, 12, cor, 0)
  let panos = ''
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 3; j++) {
      panos += quadro(28 + i * 14, 14 + j * 12 + Math.sin((i + f) * 1.4) * 3, (i + j) % 2 ? '#fff' : '#2b2b2b')
    }
  }
  return svg(ret(22, 6, 6, 90, '#9a6b3f', 3, C) + panos + circulo(25, 6, 5, '#ffd23f', C))
}

const gota = svg(cam('M50 8 C50 8 22 44 22 62 C22 80 36 92 50 92 C64 92 78 80 78 62 C78 44 50 8 50 8Z', '#6ec3ff', '#2f86c9', 4) + cam('M36 64 Q38 76 46 80', 'none', '#fff', 5, 'opacity="0.8"'))

const CORACAO = 'M50 88 C10 60 6 30 26 22 C40 17 48 26 50 32 C52 26 60 17 74 22 C94 30 90 60 50 88Z'

const trofeu = svg(
  cam('M26 10 H74 V38 C74 58 62 68 50 68 C38 68 26 58 26 38Z', '#ffd23f', '#d99a14', 4) +
    cam('M26 20 H10 C10 42 20 52 30 52 M74 20 H90 C90 42 80 52 70 52', 'none', '#d99a14', 5) +
    ret(44, 68, 12, 14, '#d99a14', 2) + ret(30, 82, 40, 12, '#9a6b3f', 4, C) +
    cam('M50 20 L55 32 L68 32 L58 40 L62 52 L50 45 L38 52 L42 40 L32 32 L45 32Z', '#fff', 'none', 0) +
    cam('M34 14 Q36 10 40 10', 'none', '#fff', 3, 'opacity="0.8"'),
)

export const EXTRAS_ARTE = {
  estrela: { frames: [1, 0.6, 0.15, 0.6].map(estrelaGirando), fps: 8, px: 64 },
  estrela_bonus: { frames: [estrelaBonus(0), estrelaBonus(1)], fps: 4, px: 96 },
  lesma: { frames: [lesma(0), lesma(1)], fps: 3, px: 96 },
  mola_solta: { frames: [mola(false)], px: 96 },
  mola_comprimida: { frames: [mola(true)], px: 96 },
  nuvem: { frames: [nuvem], px: 128 },
  bandeira: { frames: [0, 1, 2].map(bandeira), fps: 4, px: 128 },
  gota: { frames: [gota], px: 32 },
  trofeu: { frames: [trofeu], px: 128 },
  // partículas de confete
  p_estrela: { frames: [svg(cam(ESTRELA, '#ffd23f', '#d99a14', 5))], px: 48 },
  p_coracao: { frames: [svg(cam(CORACAO, '#ff5d73', '#c43a50', 5))], px: 48 },
  p_brilho: { frames: [svg(cam('M50 4 L60 40 L96 50 L60 60 L50 96 L40 60 L4 50 L40 40Z', '#fff2a8', '#f5c542', 4))], px: 48 },
  p_bolinha: { frames: [svg(circulo(50, 50, 38, '#4fb3ff', 'stroke="#1f79c2" stroke-width="5"'))], px: 48 },
  p_fita: { frames: [svg(ret(10, 36, 80, 28, '#5cd68a', 8, 'stroke="#2e9e5b" stroke-width="5"'))], px: 48 },
  icone_desempenho: {
    frames: [
      svg(
        ret(8, 8, 84, 84, '#eaf2fb', 10, 'stroke="#3f8fd9" stroke-width="4"') +
          ret(20, 54, 14, 28, '#e8554e', 3, C) +
          ret(43, 36, 14, 46, '#ffd23f', 3, C) +
          ret(66, 20, 14, 62, '#5cb85c', 3, C),
      ),
    ],
    px: 96,
  },
  // ícones dos jogos (menu)
  jogo_chuva: {
    frames: [
      svg(
        cam('M24 54 C6 54 4 32 24 30 C24 12 52 6 60 24 C78 14 96 28 88 46 C98 56 86 56 80 54 Z', '#e8f3fb', '#9ab8d0', 3.5) +
          [[30, 66], [50, 74], [70, 66]].map(([x, y]) => cam(`M${x} ${y} q-5 8 0 12 q5 -4 0 -12`, '#4fb3ff', '#1f79c2', 2)).join('') +
          circulo(40, 40, 3, TRACO) + circulo(58, 40, 3, TRACO) + cam('M44 46 Q49 51 54 46', 'none', TRACO, 2.5),
      ),
    ],
    px: 96,
  },
  jogo_plataforma: {
    frames: [
      svg(
        cam('M0 96 V70 Q30 50 54 66 Q76 80 100 62 V96Z', '#6fd56a', '#3a8a3a', 3) +
          ret(60, 34, 30, 10, '#caa472', 4, C) + ret(16, 56, 28, 10, '#caa472', 4, C) +
          cam('M72 20 L75 28 L83 28 L77 33 L79 41 L72 36 L65 41 L67 33 L61 28 L69 28Z', '#ffd23f', '#d99a14', 2) +
          circulo(30, 40, 10, '#e8554e', C) + circulo(27, 38, 3, '#fff') + circulo(33, 38, 3, '#fff'),
      ),
    ],
    px: 96,
  },
}

export { CORACAO }
