import { test } from 'node:test'
import assert from 'node:assert/strict'
import { chamarFeatherless } from '../src/featherlessClient.js'

test('monta a requisicao com autorizacao e mensagens corretas, devolve o conteudo da resposta', async () => {
  let requisicaoCapturada
  const fetchFalso = async (url, opcoes) => {
    requisicaoCapturada = { url, opcoes }
    return {
      ok: true,
      json: async () => ({ choices: [{ message: { content: '{"ok":true}' } }] }),
    }
  }

  const resultado = await chamarFeatherless([{ role: 'user', content: 'oi' }], {
    fetchImpl: fetchFalso,
    apiKey: 'chave-de-teste',
    modelo: 'modelo-de-teste',
  })

  assert.equal(resultado, '{"ok":true}')
  assert.equal(requisicaoCapturada.url, 'https://api.featherless.ai/v1/chat/completions')
  assert.equal(requisicaoCapturada.opcoes.headers.Authorization, 'Bearer chave-de-teste')
  const corpo = JSON.parse(requisicaoCapturada.opcoes.body)
  assert.equal(corpo.model, 'modelo-de-teste')
  assert.deepEqual(corpo.messages, [{ role: 'user', content: 'oi' }])
})

test('lanca erro claro se a chave de API nao for fornecida', async () => {
  await assert.rejects(
    () => chamarFeatherless([{ role: 'user', content: 'oi' }], { apiKey: undefined, fetchImpl: async () => ({}) }),
    /FEATHERLESS_API_KEY/,
  )
})

test('lanca erro se a resposta HTTP nao for ok', async () => {
  const fetchFalso = async () => ({ ok: false, status: 500, text: async () => 'erro interno' })
  await assert.rejects(
    () => chamarFeatherless([{ role: 'user', content: 'oi' }], { fetchImpl: fetchFalso, apiKey: 'x' }),
    /500/,
  )
})
