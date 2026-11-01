import { TRACO, svg, circulo, elipse, cam, ret, grupo, COR } from '../../compartilhado/arte/primitivas.js'
import { tortinha } from './assets.js'

// Guaxinim e bandeja ainda usam SVG provisório. A tortinha usa PNG ilustrado;
// o SVG anterior fica preservado nos dados como referência da versão inicial.
const CONTORNO = `stroke="${TRACO}" stroke-width="2.5"`
const PELO = '#a7a7b0'
const PELO_ESCURO = '#5d5d66'
const MASCARA = '#3d3d45'
const CLARO = '#ece8e1'

function olhosGuaxinim(jeito) {
  if (jeito === 'fechado') return cam('M30 53 Q36 58 42 53 M58 53 Q64 58 70 53', 'none', '#ffffff', 2.5)
  if (jeito === 'careta') return cam('M31 49 L40 53 L31 57 M69 49 L60 53 L69 57', 'none', '#ffffff', 2.5)
  return (
    circulo(36, 53, 5.5, '#ffffff') + circulo(37, 53, 3.2, TRACO) +
    circulo(64, 53, 5.5, '#ffffff') + circulo(63, 53, 3.2, TRACO)
  )
}

// `barriga` cresce conforme o guaxinim come as tortas da criança.
function guaxinim({ barriga = 1, olhos = 'aberto', boca = 'sorriso' } = {}) {
  const rx = 22 * barriga
  const cauda = grupo(
    elipse(0, 0, 9, 24, PELO, CONTORNO) + ret(-9, -10, 18, 6, PELO_ESCURO) + ret(-9, 4, 18, 6, PELO_ESCURO),
    'translate(84 72) rotate(35)',
  )
  const bocas = {
    sorriso: cam('M42 75 Q50 82 58 75'),
    careta: cam('M42 77 Q50 73 58 77') + elipse(55, 80, 4, 5, COR.rosa, CONTORNO),
    dormindo: cam('M45 77 Q50 79 55 77'),
  }
  return svg(
    cauda +
      elipse(50, 86, rx, 13, PELO, CONTORNO) +
      elipse(50, 88, rx * 0.65, 9, CLARO) +
      circulo(24, 28, 11, PELO_ESCURO, CONTORNO) + circulo(24, 28, 5, CLARO) +
      circulo(76, 28, 11, PELO_ESCURO, CONTORNO) + circulo(76, 28, 5, CLARO) +
      circulo(50, 55, 32, PELO, CONTORNO) +
      elipse(50, 66, 24, 15, CLARO) +
      elipse(36, 53, 13, 9, MASCARA, 'transform="rotate(12 36 53)"') +
      elipse(64, 53, 13, 9, MASCARA, 'transform="rotate(-12 64 53)"') +
      olhosGuaxinim(olhos) +
      elipse(50, 67, 6, 4.5, TRACO) +
      bocas[boca] +
      elipse(26, 70, 6, 4, COR.rosa, 'opacity="0.55"') + elipse(74, 70, 6, 4, COR.rosa, 'opacity="0.55"'),
  )
}

const piscando = (desc) => ({
  frames: [guaxinim(desc), guaxinim({ ...desc, olhos: 'fechado' })],
  seq: [0, 0, 0, 0, 0, 0, 0, 1],
  fps: 4,
  px: 160,
})

const torta = svg(
  cam('M14 56 L86 56 L78 80 Q50 86 22 80 Z', '#d99a54', CONTORNO) +
    cam('M22 64 Q50 70 78 64', 'none', '#b5743a', 2.5) +
    elipse(50, 56, 37, 9, '#ff9fb8', CONTORNO) +
    cam('M18 54 Q24 36 34 46 Q40 30 50 42 Q60 30 66 46 Q76 36 82 54 Z', '#ffffff', CONTORNO) +
    circulo(50, 32, 6, COR.vermelho, CONTORNO),
)

const bandeja = svg(circulo(50, 50, 42, COR.cinzaClaro, CONTORNO) + circulo(50, 50, 32, '#e9eef1') + cam('M30 38 Q40 28 52 28', 'none', '#ffffff', 4))

const bandejaBaixo = svg(
  elipse(50, 74, 38, 11, COR.cinzaClaro, CONTORNO) + cam('M50 12 V52 M36 38 L50 52 L64 38', 'none', COR.azul, 7),
)

const chantili = svg(
  cam('M20 60 Q14 40 32 38 Q34 20 52 26 Q66 14 74 32 Q90 34 84 54 Q92 70 74 74 Q60 88 44 78 Q24 84 20 60 Z', '#ffffff', CONTORNO) +
    circulo(40, 50, 4, '#f3f3f3') + circulo(62, 44, 5, '#f3f3f3'),
)

// figuras da tela de papéis: um adulto (alto) e uma criança (baixinha)
const pessoa = (cor, alto) => {
  const topo = alto ? 12 : 30
  return svg(
    circulo(50, topo + 14, 14, '#f6d2b0', CONTORNO) +
      cam(`M28 96 Q28 ${topo + 34} 50 ${topo + 34} Q72 ${topo + 34} 72 96 Z`, cor, CONTORNO),
  )
}

export const ARTE_TORTAS = {
  guaxinim: piscando({}),
  guaxinim_cheio: piscando({ barriga: 1.45 }),
  guaxinim_careta: { frames: [guaxinim({ olhos: 'careta', boca: 'careta' })], px: 160 },
  guaxinim_cheio_careta: { frames: [guaxinim({ barriga: 1.45, olhos: 'careta', boca: 'careta' })], px: 160 },
  guaxinim_dormindo: { frames: [guaxinim({ barriga: 1.6, olhos: 'fechado', boca: 'dormindo' })], px: 160 },
  torta: { frames: [torta], px: 96, arquivo: tortinha },
  bandeja: { frames: [bandeja], px: 112 },
  bandeja_baixo: { frames: [bandejaBaixo], px: 96 },
  chantili: { frames: [chantili], px: 112 },
  adulto: { frames: [pessoa(COR.azul, true)], px: 112 },
  crianca: { frames: [pessoa(COR.laranja, false)], px: 112 },
}

// Mesmo formato de chave do kit (id#quadro), com prefixo para não colidir com a arte compartilhada.
export const chaveTorta = (id, quadro = 0) => `gt_${id}#${quadro}`

export const urlTorta = (id, i = 0) =>
  `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(ARTE_TORTAS[id].frames[i])))}`

export function carregarArteTortas(scene) {
  for (const [id, desc] of Object.entries(ARTE_TORTAS)) {
    if (desc.arquivo) {
      if (!scene.textures.exists(chaveTorta(id))) {
        scene.load.image(chaveTorta(id), desc.arquivo)
      }
      continue
    }
    desc.frames.forEach((_, i) => {
      if (!scene.textures.exists(chaveTorta(id, i))) {
        scene.load.svg(chaveTorta(id, i), urlTorta(id, i), { width: desc.px, height: desc.px })
      }
    })
  }
}

export function criarAnimacoesTortas(scene) {
  for (const [id, desc] of Object.entries(ARTE_TORTAS)) {
    if (desc.frames.length < 2 || scene.anims.exists(`gt_${id}`)) continue
    scene.anims.create({
      key: `gt_${id}`,
      frames: (desc.seq ?? desc.frames.map((_, i) => i)).map((i) => ({ key: chaveTorta(id, i) })),
      frameRate: desc.fps ?? 6,
      repeat: -1,
    })
  }
}

// Troca o desenho mantendo o tamanho na tela; anima (piscar) só com os efeitos ligados.
export function desenhar(sprite, id, efeitos) {
  const { displayWidth, displayHeight } = sprite
  sprite.stop()
  sprite.setTexture(chaveTorta(id, 0)).setDisplaySize(displayWidth, displayHeight)
  if (efeitos && ARTE_TORTAS[id].frames.length > 1) sprite.play(`gt_${id}`)
}
