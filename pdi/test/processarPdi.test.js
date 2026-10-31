import { test } from 'node:test'
import assert from 'node:assert/strict'
import { processarPdi } from '../src/processarPdi.js'
import { HABILIDADES } from '../src/habilidades.js'

const AVISO = 'Estas sugestões são orientações gerais e não substituem acompanhamento profissional.'

function llmQueDevolve(objeto) {
  return async () => JSON.stringify(objeto)
}

test('classifica habilidades validas e sempre usa nivel 1', async () => {
  const chamarLLM = llmQueDevolve({
    itens: [{ habilidade: 'reconhecer-emocoes' }, { habilidade: 'empatia' }],
    resumoPais: {
      topicos: ['ignorado - recalculado pelo codigo'],
      porHabilidade: [
        { habilidade: 'reconhecer-emocoes', atencao: 'observar expressoes', atividades: ['jogo de cartas de emocoes'] },
        { habilidade: 'empatia', atencao: 'observar reacoes', atividades: ['historia social'] },
      ],
    },
  })

  const resultado = await processarPdi('texto do pdi', HABILIDADES, chamarLLM)

  assert.deepEqual(resultado.itens, [
    { habilidade: 'reconhecer-emocoes', nivel: 1 },
    { habilidade: 'empatia', nivel: 1 },
  ])
  assert.deepEqual(resultado.resumoPais.topicos, ['Reconhecer emoções', 'Empatia'])
  assert.equal(resultado.resumoPais.aviso, AVISO)
})

test('descarta habilidade fora da lista permitida, em itens e em porHabilidade', async () => {
  const chamarLLM = llmQueDevolve({
    itens: [{ habilidade: 'reconhecer-emocoes' }, { habilidade: 'alfabetizacao' }],
    resumoPais: { topicos: [], porHabilidade: [
      { habilidade: 'reconhecer-emocoes', atencao: 'x', atividades: [] },
      { habilidade: 'alfabetizacao', atencao: 'y', atividades: [] },
    ] },
  })

  const resultado = await processarPdi('texto', HABILIDADES, chamarLLM)

  assert.deepEqual(resultado.itens, [{ habilidade: 'reconhecer-emocoes', nivel: 1 }])
  assert.equal(resultado.resumoPais.porHabilidade.length, 1)
  assert.equal(resultado.resumoPais.porHabilidade[0].habilidade, 'reconhecer-emocoes')
})

test('normaliza variacao de caixa/espaco no id da habilidade', async () => {
  const chamarLLM = llmQueDevolve({ itens: [{ habilidade: ' Reconhecer-Emocoes ' }], resumoPais: { topicos: [], porHabilidade: [] } })
  const resultado = await processarPdi('texto', HABILIDADES, chamarLLM)
  assert.deepEqual(resultado.itens, [{ habilidade: 'reconhecer-emocoes', nivel: 1 }])
})

test('remove habilidade duplicada', async () => {
  const chamarLLM = llmQueDevolve({
    itens: [{ habilidade: 'empatia' }, { habilidade: 'empatia' }],
    resumoPais: { topicos: [], porHabilidade: [] },
  })
  const resultado = await processarPdi('texto', HABILIDADES, chamarLLM)
  assert.equal(resultado.itens.length, 1)
})

test('nenhuma habilidade reconhecida devolve itens vazio e resumoPais nulo', async () => {
  const chamarLLM = llmQueDevolve({ itens: [], resumoPais: { topicos: [], porHabilidade: [] } })
  const resultado = await processarPdi('texto', HABILIDADES, chamarLLM)
  assert.deepEqual(resultado, { itens: [], resumoPais: null })
})

test('resposta malformada da LLM nao lanca excecao, devolve resultado vazio', async () => {
  const chamarLLM = async () => 'isso nao e um JSON'
  const resultado = await processarPdi('texto', HABILIDADES, chamarLLM)
  assert.deepEqual(resultado, { itens: [], resumoPais: null })
})

test('atividades ausente ou invalida vira lista vazia, sem quebrar', async () => {
  const chamarLLM = llmQueDevolve({
    itens: [{ habilidade: 'empatia' }],
    resumoPais: { topicos: [], porHabilidade: [{ habilidade: 'empatia', atencao: 'x' }] },
  })
  const resultado = await processarPdi('texto', HABILIDADES, chamarLLM)
  assert.deepEqual(resultado.resumoPais.porHabilidade[0].atividades, [])
})

test('campo extra nao previsto no schema (ex.: link) nao aparece no resultado', async () => {
  const chamarLLM = llmQueDevolve({
    itens: [{ habilidade: 'empatia' }],
    resumoPais: {
      topicos: [],
      porHabilidade: [{ habilidade: 'empatia', atencao: 'x', atividades: [], linkFonte: 'https://exemplo-inventado.com' }],
    },
  })
  const resultado = await processarPdi('texto', HABILIDADES, chamarLLM)
  assert.deepEqual(Object.keys(resultado.resumoPais.porHabilidade[0]).sort(), ['atencao', 'atividades', 'habilidade'])
})

test('texto vazio (PDF sem conteudo extraivel) nao chama a LLM e sinaliza erro distinto', async () => {
  let chamou = false
  const chamarLLM = async () => { chamou = true; return '{}' }
  const resultado = await processarPdi('   ', HABILIDADES, chamarLLM)
  assert.equal(chamou, false)
  assert.equal(resultado.erro, 'pdf-sem-texto')
})
