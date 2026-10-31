import test from 'node:test'
import assert from 'node:assert/strict'
import { recomendar } from './recomendacao.js'
import { JOGOS } from './data/jogos.js'

const ids = (r) => r.map((x) => x.jogo.id)

test('PDI só com emoções recomenda só a Chuva de emoções', () => {
  const r = recomendar([{ habilidade: 'reconhecer-emocoes', nivel: 1 }], JOGOS)
  assert.deepEqual(ids(r), ['chuva-emocoes'])
  assert.equal(r[0].motivo, 'Reconhecer emoções (nível 1)')
})

test('quanto menor o nível, maior a prioridade', () => {
  const r = recomendar(
    [
      { habilidade: 'reconhecer-emocoes', nivel: 3 },
      { habilidade: 'causa-efeito-social', nivel: 1 },
    ],
    JOGOS,
  )
  assert.deepEqual(ids(r), ['historia-escolhas', 'chuva-emocoes'])
})

test('empatia aparece em dois jogos e soma pontos com outra habilidade', () => {
  const r = recomendar(
    [
      { habilidade: 'empatia', nivel: 2 },
      { habilidade: 'resposta-social', nivel: 2 },
    ],
    JOGOS,
  )
  assert.deepEqual(ids(r), ['plataforma-amigo', 'historia-escolhas'])
})

test('PDI vazio não recomenda nada', () => {
  assert.deepEqual(recomendar([], JOGOS), [])
})

test('o nível do jogo é o menor nível entre as habilidades em comum', () => {
  const r = recomendar(
    [
      { habilidade: 'empatia', nivel: 3 },
      { habilidade: 'resposta-social', nivel: 2 },
    ],
    JOGOS,
  )
  assert.equal(r.find((x) => x.jogo.id === 'plataforma-amigo').nivel, 2)
})
