import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { criarApp } from '../server.js'

function iniciarServidor(chamarLLM) {
  const app = criarApp(chamarLLM)
  return new Promise((resolve) => {
    const servidor = app.listen(0, () => resolve(servidor))
  })
}

function encerrar(servidor) {
  return new Promise((resolve) => servidor.close(resolve))
}

function urlBase(servidor) {
  return `http://127.0.0.1:${servidor.address().port}`
}

test('GET /health responde ok', async () => {
  const servidor = await iniciarServidor(async () => '{}')
  try {
    const resposta = await fetch(`${urlBase(servidor)}/health`)
    assert.equal(resposta.status, 200)
    const corpo = await resposta.json()
    assert.equal(corpo.status, 'ok')
  } finally {
    await encerrar(servidor)
  }
})

test('POST /pdi processa o PDF enviado e devolve itens e resumoPais', async () => {
  const chamarLLM = async () =>
    JSON.stringify({
      itens: [{ habilidade: 'empatia' }],
      resumoPais: { topicos: [], porHabilidade: [{ habilidade: 'empatia', atencao: 'x', atividades: ['pratique'] }] },
    })
  const servidor = await iniciarServidor(chamarLLM)
  try {
    const buffer = await readFile(new URL('./fixtures/pdi-pequeno.pdf', import.meta.url))
    const form = new FormData()
    form.append('pdf', new Blob([buffer], { type: 'application/pdf' }), 'pdi.pdf')

    const resposta = await fetch(`${urlBase(servidor)}/pdi`, { method: 'POST', body: form })
    assert.equal(resposta.status, 200)
    const corpo = await resposta.json()
    assert.deepEqual(corpo.itens, [{ habilidade: 'empatia', nivel: 1 }])
    assert.equal(corpo.resumoPais.porHabilidade[0].atividades[0], 'pratique')
  } finally {
    await encerrar(servidor)
  }
})

test('POST /pdi sem arquivo devolve 400 com erro claro', async () => {
  const servidor = await iniciarServidor(async () => '{}')
  try {
    const resposta = await fetch(`${urlBase(servidor)}/pdi`, { method: 'POST', body: new FormData() })
    assert.equal(resposta.status, 400)
    const corpo = await resposta.json()
    assert.match(corpo.erro, /pdf/i)
  } finally {
    await encerrar(servidor)
  }
})
