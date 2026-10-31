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
