import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { extrairTexto } from '../src/extrairTexto.js'

test('extrai texto de um PDF digital', async () => {
  const buffer = await readFile(new URL('./fixtures/pdi-pequeno.pdf', import.meta.url))
  const texto = await extrairTexto(buffer)
  assert.match(texto, /reconhecer e nomear emocoes/i)
  assert.match(texto, /causa e efeito social/i)
})

test('PDF sem texto extraivel devolve string vazia', async () => {
  const bufferVazio = Buffer.from('%PDF-1.4\n%%EOF')
  const texto = await extrairTexto(bufferVazio)
  assert.equal(texto.trim(), '')
})
