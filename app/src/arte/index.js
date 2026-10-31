// Registro de toda a arte do jogo. Cada item: { frames: [svg], seq?: [índices], fps?, px }.
// Imagens com mais de um quadro viram animações no Phaser.
import { rosto, IDS_ROSTOS } from './rostos.js'
import { animal, NOMES_ANIMAIS } from './animais.js'
import { FERRAMENTAS_ARTE, CENAS_ARTE } from './ferramentas.js'
import { HF_PERSONAGENS, HF_ITENS } from './hiperfocos.js'
import { EXTRAS_ARTE } from './extras.js'

export const ARTE = {}

const estatico = (svg, px = 96) => ({ frames: [svg], px })

for (const id of IDS_ROSTOS) ARTE[`rosto_${id}`] = rosto(id)
for (const nome of NOMES_ANIMAIS) ARTE[`amigo_${nome}`] = animal(nome)
for (const [id, svg] of Object.entries(FERRAMENTAS_ARTE)) ARTE[`fer_${id}`] = estatico(svg)
for (const [id, svg] of Object.entries(CENAS_ARTE)) ARTE[`cena_${id}`] = estatico(svg)
// cenas que reaproveitam o desenho de uma ferramenta
ARTE.cena_bola = ARTE.fer_bola
ARTE.cena_ursinho = ARTE.fer_ursinho
ARTE.jogo_cuidar = ARTE.fer_abraco

for (const [id, desc] of Object.entries(HF_PERSONAGENS)) ARTE[`hf_${id}`] = desc
for (const [id, itens] of Object.entries(HF_ITENS)) {
  itens.forEach((desenhar, i) => (ARTE[`item_${id}_${i}`] = estatico(desenhar(), 96)))
}
Object.assign(ARTE, EXTRAS_ARTE)

export const ANIMAIS_AMIGOS = NOMES_ANIMAIS.map((n) => `amigo_${n}`)

// data URI do SVG, em base64 (o carregador do Phaser exige esse formato). Usado também
// pelas telas em React.
export const urlDoQuadro = (id, i = 0) =>
  `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(ARTE[id].frames[i])))}`
