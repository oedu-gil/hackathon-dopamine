import test from 'node:test'
import assert from 'node:assert/strict'
import { HABILIDADES, nomeHabilidade } from '../../../pdi/src/habilidades.js'
import { montarPrompt } from '../../../pdi/src/prompt.js'
import { processarPdi } from '../../../pdi/src/processarPdi.js'
import guerraTortas from '../../../hub/src/jogos/guerra-tortas/manifesto.js'
import { sugerirJogos, nivelDoJogo } from './regras.js'

test('PDI aceita cooperação e sugere a Guerra de Tortas pelo manifesto real', async () => {
  const texto = 'Objetivo: desenvolver cooperação em atividades em dupla, coordenando ações com um adulto para alcançar uma meta compartilhada.'
  const resultado = await processarPdi(texto, HABILIDADES, async mensagens => {
    assert.match(mensagens[0].content, /cooperacao: Cooperação/)
    assert.equal(mensagens[1].content.includes(texto), true)
    return JSON.stringify({ itens: [{ habilidade: 'cooperacao' }], resumoPais: { porHabilidade: [] } })
  })
  assert.equal(resultado.erro, undefined)
  assert.deepEqual(resultado.itens, [{ habilidade: 'cooperacao', nivel: 1 }])
  assert.equal(nomeHabilidade('cooperacao'), 'Cooperação')
  assert.deepEqual(resultado.resumoPais.topicos, ['Cooperação'])
  assert.deepEqual(sugerirJogos(resultado.itens, [guerraTortas]).map(j => j.id), ['guerra-tortas'])
  assert.equal(nivelDoJogo(resultado.itens, guerraTortas), 1)
})

test('não sugere Guerra de Tortas sem cooperação identificada no PDI', () => {
  assert.deepEqual(sugerirJogos([], [guerraTortas]), [])
  assert.deepEqual(sugerirJogos([{ habilidade: 'reconhecer-emocoes' }], [guerraTortas]), [])
  const prompt = montarPrompt('Somente diagnóstico, sem objetivos.', HABILIDADES)[0].content
  assert.match(prompt, /evidência explícita/)
})
