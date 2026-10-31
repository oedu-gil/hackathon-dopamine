import { ARTE, urlDoQuadro } from '../arte/index.js'

// Ponte entre a arte (SVG em src/arte) e o Phaser: carrega todas as imagens uma vez, cria
// as animações por quadros e entrega sprites prontos para as cenas.
export const chave = (id, quadro = 0) => `${id}#${quadro}`

export function carregarArte(scene) {
  for (const [id, desc] of Object.entries(ARTE)) {
    desc.frames.forEach((_, i) => {
      scene.load.svg(chave(id, i), urlDoQuadro(id, i), { width: desc.px, height: desc.px })
    })
  }
}

export function criarAnimacoes(scene) {
  for (const [id, desc] of Object.entries(ARTE)) {
    if (desc.frames.length < 2) continue
    const sequencia = desc.seq ?? desc.frames.map((_, i) => i)
    scene.anims.create({
      key: id,
      frames: sequencia.map((i) => ({ key: chave(id, i) })),
      frameRate: desc.fps ?? 6,
      repeat: -1,
    })
  }
}

const animado = (scene, id) => ARTE[id].frames.length > 1 && scene.ctx?.efeitos !== false

// Sprite quadrado de `tamanho` pixels. Se a arte tem vários quadros, anima (a menos que
// `parado`, ou que "Reduzir efeitos" esteja ligado).
export function imagem(scene, x, y, id, tamanho, { parado = false } = {}) {
  if (!ARTE[id]) throw new Error(`Arte inexistente: ${id}`)
  const sprite = scene.add.sprite(x, y, chave(id, 0)).setDisplaySize(tamanho, tamanho)
  sprite.arteId = id
  if (!parado && animado(scene, id)) sprite.play(id)
  return sprite
}

// Troca o desenho de um sprite mantendo o tamanho na tela.
export function trocarImagem(sprite, id, { parado = false } = {}) {
  const { displayWidth, displayHeight } = sprite
  sprite.stop()
  sprite.setTexture(chave(id, 0))
  sprite.setDisplaySize(displayWidth, displayHeight)
  sprite.arteId = id
  if (!parado && animado(sprite.scene, id)) sprite.play(id)
}

// Ver imagem parada (primeiro quadro) ou animada, conforme o personagem anda.
export function animar(sprite, ligado) {
  if (!animado(sprite.scene, sprite.arteId) || sprite.animando === ligado) return
  sprite.animando = ligado
  if (ligado) sprite.play(sprite.arteId)
  else {
    sprite.stop()
    sprite.setTexture(chave(sprite.arteId, 0))
  }
}
