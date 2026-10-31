import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { AnimadorGatinho } from '../src/jogos/guerra-tortas/animador.js'
const dados = JSON.parse(readFileSync(new URL('../src/jogos/guerra-tortas/gatinho-dados.json', import.meta.url)))

test('defesa sobe em 420ms, segura sem loop e só desce ao soltar', () => {
  const a = new AnimadorGatinho(dados)
  a.defender(true)
  a.atualizar(419)
  assert.equal(a.protegido, false)
  a.atualizar(1)
  assert.equal(a.protegido, true)
  a.atualizar(10000)
  assert.equal(a.quadro, 21)
  a.defender(false)
  assert.equal(a.protegido, false)
  a.atualizar(360)
  assert.equal(a.estado, 'idle')
})

test('soltar cedo e pressionar de novo usa passagens existentes', () => {
  const a = new AnimadorGatinho(dados)
  a.defender(true)
  a.atualizar(120)
  a.defender(false)
  assert.equal(a.estado, 'lower')
  a.defender(true)
  assert.ok(['raise', 'hold'].includes(a.estado))
  a.atualizar(420)
  assert.equal(a.protegido, true)
})

test('ataque solta uma única torta no marcador e retorna; reação emite limpeza', () => {
  const eventos = []
  const a = new AnimadorGatinho(dados, e => eventos.push(e))
  a.iniciar('ataque')
  a.atualizar(504)
  assert.deepEqual(eventos, [])
  a.atualizar(1)
  assert.deepEqual(eventos, ['release'])
  a.atualizar(1000)
  assert.equal(a.estado, 'idle')
  assert.deepEqual(eventos, ['release'])
  a.iniciar('reacao')
  a.atualizar(2300)
  assert.ok(eventos.includes('wipe_finish'))
})
