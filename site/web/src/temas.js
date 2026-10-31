// Temas de hiperfoco: trocam só cor, cenário, personagem e itens da coleção.
// Layout, botões, fluxo e XP são iguais em todos (DESIGN.md, regra 8).
// Personagens e itens vêm da arte do hub de jogos, para o site e os jogos ficarem iguais.
import { HIPERFOCOS } from '../../../hub/src/compartilhado/temas.js'
import { urlDoQuadro } from '../../../hub/src/compartilhado/arte/index.js'

// Cores calmas do cenário de cada tema: `cor` (destaque), `fundo` (página), `ceu` e `chao` (cenário).
const VISUAL = {
  trem: { fundo: '#EEF5F0', ceu: '#DDEEE5', chao: '#BFDACA', chaoLonge: '#D0E4D7' },
  aranha: { fundo: '#F3EFF7', ceu: '#E7DFF1', chao: '#CDBFE0', chaoLonge: '#DBD1EA' },
  aviao: { fundo: '#EDF4F8', ceu: '#DAEBF5', chao: '#BBD6E7', chaoLonge: '#CCE0EE' },
  dinossauro: { fundo: '#F8F2E9', ceu: '#F2E6D3', chao: '#DCC7A5', chaoLonge: '#E7D7BD' },
}

export const TEMAS = HIPERFOCOS.map((h) => ({
  id: h.id,
  nome: h.nome,
  cor: h.cor,
  personagemNome: h.personagemNome,
  personagem: urlDoQuadro(h.arte),
  itens: h.itens.map((i) => ({ nome: i.nome, img: urlDoQuadro(i.arte) })),
  ...VISUAL[h.id],
}))

export const temaPorId = (id) => TEMAS.find((t) => t.id === id) ?? null

export const XP_POR_ITEM = 20 // igual a site/server/src/regras.js

export const itensGanhos = (tema, xp) => (tema ? Math.min(Math.floor((xp ?? 0) / XP_POR_ITEM), tema.itens.length) : 0)

// Aplica as cores do tema como tokens; a estrutura da tela não muda.
export function estiloTema(tema) {
  if (!tema) return undefined
  return { '--tema': tema.cor, '--tema-fundo': tema.fundo, '--ceu': tema.ceu, '--chao': tema.chao, '--chao-longe': tema.chaoLonge }
}
