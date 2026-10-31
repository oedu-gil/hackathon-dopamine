import test from 'node:test'
import assert from 'node:assert/strict'
import { sortearSemRepetir } from '../src/compartilhado/kit-phaser/variedade.js'

const lista = ['a', 'b', 'c', 'd', 'e', 'f'].map((id) => ({ id }))
const idDe = (x) => x.id
const ids = (r) => r.map(idDe).sort()

test('prefere os itens que ainda não foram vistos', () => {
  for (let i = 0; i < 20; i++) {
    assert.deepEqual(ids(sortearSemRepetir(lista, 3, ['a', 'b', 'c'], idDe)), ['d', 'e', 'f'])
  }
})

test('quando faltam novos, completa com os vistos há mais tempo', () => {
  // vistos do mais antigo ao mais recente: a, b, c, d
  const r = ids(sortearSemRepetir(lista, 4, ['a', 'b', 'c', 'd'], idDe))
  assert.deepEqual(r, ['a', 'b', 'e', 'f']) // e, f são novos; a, b são os mais antigos
})

test('devolve exatamente n itens, sem repetir', () => {
  const r = sortearSemRepetir(lista, 5, ['a', 'b'], idDe)
  assert.equal(r.length, 5)
  assert.equal(new Set(r).size, 5)
})

test('se a lista é menor que n, devolve a lista inteira', () => {
  assert.equal(sortearSemRepetir(lista.slice(0, 3), 5, [], idDe).length, 3)
})

test('sem histórico, sorteia normalmente', () => {
  assert.equal(sortearSemRepetir(lista, 2, [], idDe).length, 2)
})
