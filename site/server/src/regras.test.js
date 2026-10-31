import { test } from 'node:test'
import assert from 'node:assert/strict'
import { sugerirJogos, calcularXp, itensDesbloqueados, resumirDesempenho, validarResultado } from './regras.js'

const jogos = [
  { id: 'memoria', nome: 'Memória', habilidades: ['reconhecer-emocoes'] },
  { id: 'sequencia', nome: 'Sequência', habilidades: ['empatia', 'resposta-social'] },
]

test('sugere só os jogos ligados às habilidades do PDI', () => {
  const sugeridos = sugerirJogos([{ habilidade: 'empatia', nivel: 1 }], jogos)
  assert.deepEqual(sugeridos.map((j) => j.id), ['sequencia'])
})

test('XP conta só partidas concluídas', () => {
  const xp = calcularXp([{ status: 'completed' }, { status: 'abandoned' }, { status: 'completed' }])
  assert.equal(xp, 20)
  assert.equal(itensDesbloqueados(xp), 1)
})

test('resume desempenho por jogo', () => {
  const r = resumirDesempenho(
    [
      { jogo_id: 'memoria', status: 'completed', attempts: 4, correct: 3, hints: 1 },
      { jogo_id: 'memoria', status: 'abandoned', attempts: 0, correct: 0, hints: 0 },
    ],
    jogos,
  )
  assert.deepEqual(r[0], { jogoId: 'memoria', nome: 'Memória', partidas: 2, concluidas: 1, dicas: 1, taxaAcerto: 75 })
  assert.equal(r[1].taxaAcerto, null)
})

test('valida resultado no formato de createResult', () => {
  assert.equal(validarResultado({ status: 'completed', attempts: 3, correct: 2 }), null)
  assert.ok(validarResultado({ status: 'completed', attempts: 1, correct: 2 }))
  assert.ok(validarResultado({ status: 'x', attempts: 1, correct: 0 }))
})
