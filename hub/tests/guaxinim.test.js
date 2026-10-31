import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { AnimadorGuaxinim } from '../src/jogos/guerra-tortas/animador-guaxinim.js'
const dados = JSON.parse(readFileSync(new URL('../src/jogos/guerra-tortas/guaxinim-dados.json', import.meta.url)))

test('guaxinim só protege após erguer; sustenta e baixa sem loop', () => {
  const a = new AnimadorGuaxinim(dados)
  a.iniciar('raise'); a.atualizar(333)
  assert.equal(a.protegido, false)
  a.atualizar(1)
  assert.equal(a.protegido, true)
  a.atualizar(10000)
  assert.equal(a.quadro, 8)
  a.iniciar('lower')
  assert.equal(a.protegido, false)
  a.atualizar(334)
  assert.equal(a.estado, 'idle')
})

test('release único no tempo de reprodução, reação interrompe ataque e limpa', () => {
  const eventos = []
  const a = new AnimadorGuaxinim(dados, e => eventos.push(e))
  a.iniciar('ataque'); a.atualizar(874)
  assert.deepEqual(eventos, [])
  a.atualizar(1)
  assert.deepEqual(eventos, ['release'])
  a.atualizar(1000)
  assert.equal(eventos.filter(e => e === 'release').length, 1)
  a.iniciar('ataque'); a.atualizar(300); a.iniciar('reacao'); a.atualizar(3100)
  assert.equal(eventos.filter(e => e === 'release').length, 1)
  assert.ok(eventos.includes('wipe_start') && eventos.includes('wipe_finish'))
  assert.equal(a.estado, 'idle')
})

test('finalização continua após fim da partida e sustenta último quadro sem repetir eventos', () => {
  const eventos = []
  const a = new AnimadorGuaxinim(dados, e => eventos.push(e))
  a.iniciar('final'); a.atualizar(2417)
  assert.equal(a.estado, 'final')
  assert.equal(a.quadro, 57)
  assert.deepEqual(eventos, ['seated', 'tray_down', 'sleep', 'complete_final'])
  a.atualizar(100000)
  assert.equal(a.quadro, 57)
  assert.equal(eventos.length, 4)
})
