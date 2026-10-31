import { test } from 'node:test'
import assert from 'node:assert/strict'
import { montarPrompt } from '../src/prompt.js'
import { HABILIDADES } from '../src/habilidades.js'

test('prompt lista todas as habilidades permitidas pelo id', () => {
  const mensagens = montarPrompt('texto do pdi', HABILIDADES)
  const sistema = mensagens.find((m) => m.role === 'system').content
  for (const h of HABILIDADES) assert.match(sistema, new RegExp(h.id))
})

test('prompt inclui o texto do pdi na mensagem do usuario', () => {
  const mensagens = montarPrompt('texto exclusivo do pdi XYZ', HABILIDADES)
  const usuario = mensagens.find((m) => m.role === 'user').content
  assert.match(usuario, /texto exclusivo do pdi XYZ/)
})

test('prompt instrui a nao sugerir acoes nem citar fontes/links', () => {
  const mensagens = montarPrompt('texto', HABILIDADES)
  const sistema = mensagens.find((m) => m.role === 'system').content
  assert.match(sistema, /n(ã|a)o (sugira|inclua|cite).*(a(ç|c)(ã|a)o|link|fonte)/i)
})

test('prompt instrui a basear a classificacao em evidencia explicita do texto, nao em inferencia geral do diagnostico', () => {
  const mensagens = montarPrompt('texto', HABILIDADES)
  const sistema = mensagens.find((m) => m.role === 'system').content
  assert.match(sistema, /evid(ê|e)ncia expl(í|i)cita/i)
  assert.match(sistema, /n(ã|a)o classifique.*(apenas|s(ó|o)).*diagn(ó|o)stico/i)
})

test('prompt pede pelo menos duas atividades por habilidade identificada', () => {
  const mensagens = montarPrompt('texto', HABILIDADES)
  const sistema = mensagens.find((m) => m.role === 'system').content
  assert.match(sistema, /2 a 3 atividades|duas a tr(ê|e)s atividades/i)
})
