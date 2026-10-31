import { montarPrompt } from './prompt.js'
import { nomeHabilidade } from './habilidades.js'

const AVISO = 'Estas sugestões são orientações gerais e não substituem acompanhamento profissional.'

function respostaVazia() {
  return { itens: [], resumoPais: null }
}

function normalizar(id) {
  return String(id ?? '').trim().toLowerCase()
}

function extrairJson(bruto) {
  const semCercas = bruto.replace(/```json/gi, '').replace(/```/g, '').trim()
  return JSON.parse(semCercas)
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
  } catch {
    return respostaVazia()
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
    return respostaVazia()
  }

  const itens = idsValidosOrdenados.map((id) => ({ habilidade: id, nivel: 1 }))

  const porHabilidadeBruto = Array.isArray(dados.resumoPais?.porHabilidade)
    ? dados.resumoPais.porHabilidade
    : []

  const porHabilidade = idsValidosOrdenados.map((id) => {
    const entrada = porHabilidadeBruto.find((p) => normalizar(p?.habilidade) === id)
    return {
      habilidade: id,
      atencao: typeof entrada?.atencao === 'string' ? entrada.atencao : '',
      atividades: Array.isArray(entrada?.atividades) ? entrada.atividades : [],
    }
  })

  const topicos = idsValidosOrdenados.map((id) => nomeHabilidade(id))

  return {
    itens,
    resumoPais: { topicos, porHabilidade, aviso: AVISO },
  }
}
