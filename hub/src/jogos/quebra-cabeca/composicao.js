// Monta a imagem no formato 5:3 do tabuleiro: inteira (contain); a sobra recebe a própria imagem
// ampliada e desfocada, para as peças de borda não ficarem iguais (REGRAS-E-INTERACOES.md §5).
import { COLS } from './regras.js'

export const PROPORCAO_TABULEIRO = 5 / 3

export function medidas(proporcao) {
  const larga = proporcao > PROPORCAO_TABULEIRO
  return {
    inteira: { w: larga ? 500 : 300 * proporcao, h: larga ? 500 / proporcao : 300 },
    fundo: { w: larga ? 300 * proporcao : 500, h: larga ? 300 : 500 / proporcao },
  }
}

// Conteúdo de um <symbol viewBox="0 0 500 300">. `filtro` é o id do <filter> de desfoque.
export function simbolo({ url, proporcao, filtro }) {
  const img = (x, y, w, h) => `<image href="${url}" x="${x}" y="${y}" width="${w}" height="${h}" preserveAspectRatio="none"/>`
  if (Math.abs(proporcao - PROPORCAO_TABULEIRO) < 0.01) return img(0, 0, 500, 300)
  const { inteira, fundo } = medidas(proporcao)
  return `<g filter="url(#${filtro})">${img((500 - fundo.w) / 2, (300 - fundo.h) / 2, fundo.w, fundo.h)}</g>`
    + '<rect width="500" height="300" fill="#fff" opacity=".22"/>'
    + img((500 - inteira.w) / 2, (300 - inteira.h) / 2, inteira.w, inteira.h)
}

// Recorte da peça p dentro do símbolo.
export function recorte(p, simboloId) {
  const x = (p % COLS) * 100
  const y = Math.floor(p / COLS) * 100
  return `<svg viewBox="${x} ${y} 100 100" aria-hidden="true"><use href="#${simboloId}" width="500" height="300"/></svg>`
}
