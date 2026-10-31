import test from 'node:test'
import assert from 'node:assert/strict'
import { SITUACOES } from './data/situacoes.js'
import { HISTORIAS } from './data/historias.js'
import { HIPERFOCOS } from './data/hiperfocos.js'
import { CUIDADOS, FERRAMENTAS } from './data/cuidados.js'
import { LIMITES } from './progresso.js'

// Guardas para quem adicionar conteúdo novo: pegam erros de digitação que quebrariam o jogo.
const umaCerta = (opcoes) => opcoes.filter((o) => o.certo).length === 1

test('toda situação tem uma opção certa, expressão e feedback', () => {
  for (const s of SITUACOES) {
    assert.ok(umaCerta(s.opcoes), `uma certa em: ${s.texto}`)
    assert.ok(s.cara, `cara em: ${s.texto}`)
    assert.ok([1, 2, 3].includes(s.nivel), `nível em: ${s.texto}`)
    assert.ok(s.opcoes.every((o) => o.feedback), `feedback em: ${s.texto}`)
  }
})

test('situações não se repetem', () => {
  assert.equal(new Set(SITUACOES.map((s) => s.texto)).size, SITUACOES.length)
})

test('toda história tem título único, final e uma escolha certa por passo', () => {
  assert.equal(new Set(HISTORIAS.map((h) => h.titulo)).size, HISTORIAS.length)
  for (const h of HISTORIAS) {
    assert.ok(h.final, `final em: ${h.titulo}`)
    assert.ok([1, 2, 3].includes(h.nivel), `nível em: ${h.titulo}`)
    for (const p of h.passos) {
      assert.ok(umaCerta(p.escolhas), `uma certa em: ${h.titulo} / ${p.texto}`)
      assert.ok(p.escolhas.every((e) => e.consequencia), `consequência em: ${h.titulo}`)
    }
  }
})

test('há conteúdo suficiente em cada nível para variar', () => {
  for (const nivel of [1, 2, 3]) {
    const situacoes = SITUACOES.filter((s) => s.nivel <= nivel).length
    const historias = HISTORIAS.filter((h) => h.nivel <= nivel).length
    assert.ok(situacoes >= 8, `nível ${nivel}: ${situacoes} situações`)
    assert.ok(historias >= 3, `nível ${nivel}: ${historias} histórias`)
  }
})

test('cada cuidado usa ferramentas que existem, sem repetir entre certos e errados', () => {
  for (const c of CUIDADOS) {
    const todos = [...c.certos, ...c.errados]
    assert.ok(todos.every((id) => FERRAMENTAS[id]), `ferramenta inexistente em: ${c.texto}`)
    assert.equal(new Set(todos).size, todos.length, `repetição em: ${c.texto}`)
    assert.ok(c.certos.length >= 1 && c.errados.length >= 3, `quantidades em: ${c.texto}`)
    assert.ok(c.cara && c.cena && [1, 2, 3].includes(c.nivel), `campos em: ${c.texto}`)
  }
  assert.equal(new Set(CUIDADOS.map((c) => c.texto)).size, CUIDADOS.length)
  for (const nivel of [1, 2, 3]) {
    assert.ok(CUIDADOS.filter((c) => c.nivel <= nivel).length >= 5, `nível ${nivel} sem rodadas`)
  }
})

test('todo hiperfoco tem um item para cada marco', () => {
  for (const h of HIPERFOCOS) {
    assert.equal(h.itens.length, LIMITES.length, h.nome)
  }
  assert.deepEqual([...LIMITES].sort((a, b) => a - b), LIMITES, 'limites crescentes')
})
