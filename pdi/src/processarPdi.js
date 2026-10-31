import { montarPrompt } from './prompt.js'
import { nomeHabilidade } from './habilidades.js'

const AVISO = 'Estas sugestões são orientações gerais e não substituem acompanhamento profissional.'
const PARECE_LINK = /https?:\/\/|www\.|\.(com|org|net|br)\b/i
const MAX_ATIVIDADES = 5
const MAX_CARACTERES_ATIVIDADE = 200

function respostaVazia(erro) {
  return { itens: [], resumoPais: null, erro }
}

function normalizar(id) {
  return String(id ?? '').trim().toLowerCase()
}

function extrairJson(bruto) {
  const semCercas = bruto.replace(/```json/gi, '').replace(/```/g, '').trim()
  const inicio = semCercas.indexOf('{')
  const fim = semCercas.lastIndexOf('}')
  const candidato = inicio !== -1 && fim !== -1 ? semCercas.slice(inicio, fim + 1) : semCercas
  const dados = JSON.parse(candidato)
  if (!dados || typeof dados !== 'object') {
    throw new Error('resposta da LLM não é um objeto JSON')
  }
  return dados
}

function sanitizarAtencao(atencao) {
  if (typeof atencao !== 'string') return ''
  if (PARECE_LINK.test(atencao)) return ''
  return atencao
}

function sanitizarAtividades(atividades) {
  if (!Array.isArray(atividades)) return []
  return atividades
    .filter((item) => typeof item === 'string')
    .map((item) => item.trim())
    .filter((item) => item.length > 0 && !PARECE_LINK.test(item))
    .slice(0, MAX_ATIVIDADES)
    .map((item) => item.slice(0, MAX_CARACTERES_ATIVIDADE))
}

export async function processarPdi(texto, habilidades, chamarLLM) {
  if (texto.trim() === '') {
    return { itens: [], resumoPais: null, erro: 'pdf-sem-texto' }
  }

  const idsValidos = new Set(habilidades.map((h) => normalizar(h.id)))

  let dados
  try {
    const mensagens = montarPrompt(texto, habilidades)
    const bruto = await chamarLLM(mensagens)
    dados = extrairJson(bruto)
  } catch (e) {
    console.warn('pdi: falha ao obter/interpretar resposta da LLM:', e.message)
    return respostaVazia('falha-llm')
  }

  const itensBrutos = Array.isArray(dados.itens) ? dados.itens : []
  const idsVistos = new Set()
  const idsValidosOrdenados = []
  for (const item of itensBrutos) {
    const id = normalizar(item?.habilidade)
    if (idsValidos.has(id) && !idsVistos.has(id)) {
      idsVistos.add(id)
      idsValidosOrdenados.push(id)
    }
  }

  if (idsValidosOrdenados.length === 0) {
    return respostaVazia('nenhuma-habilidade-reconhecida')
  }

  const itens = idsValidosOrdenados.map((id) => ({ habilidade: id, nivel: 1 }))

  const porHabilidadeBruto = Array.isArray(dados.resumoPais?.porHabilidade)
    ? dados.resumoPais.porHabilidade
    : []

  const porHabilidade = idsValidosOrdenados.map((id) => {
    const entrada = porHabilidadeBruto.find((p) => normalizar(p?.habilidade) === id)
    return {
      habilidade: id,
      atencao: sanitizarAtencao(entrada?.atencao),
      atividades: sanitizarAtividades(entrada?.atividades),
    }
  })

  const topicos = idsValidosOrdenados.map((id) => nomeHabilidade(id))

  return {
    itens,
    resumoPais: { topicos, porHabilidade, aviso: AVISO },
  }
}
