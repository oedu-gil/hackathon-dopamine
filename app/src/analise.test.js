import test from 'node:test'
import assert from 'node:assert/strict'
import { analisar, resumir } from './analise.js'
import { JOGOS } from './data/jogos.js'

// "xxo" = acerto, acerto, erro (em ordem de tempo)
const sequencia = (padrao, jogo = 'chuva-emocoes') =>
  [...padrao].map((c, i) => ({ t: i, jogo, ok: c === 'x' }))

test('conta acertos, erros e taxa', () => {
  const r = resumir(sequencia('xxxo'))
  assert.equal(r.tentativas, 4)
  assert.equal(r.acertos, 3)
  assert.equal(r.erros, 1)
  assert.equal(r.taxa, 0.75)
})

test('menos de 10 tentativas: poucos dados, sem tendência', () => {
  const r = resumir(sequencia('xxxxxxxxx'))
  assert.equal(r.estado, 'poucos-dados')
  assert.equal(r.delta, null)
})

test('taxa subindo 10 pontos ou mais: evoluindo', () => {
  const r = resumir(sequencia('xooooooooo' + 'xxxxxxxooo'))
  assert.equal(r.estado, 'evoluindo')
  assert.ok(r.delta >= 0.5)
})

test('acertos recentes altos: consolidando', () => {
  assert.equal(resumir(sequencia('xxxxxxxxxx' + 'xxxxxxxxxo')).estado, 'consolidando')
})

test('acertos recentes baixos e sem melhora: precisa de apoio', () => {
  assert.equal(resumir(sequencia('xxxooooooo' + 'xxxooooooo')).estado, 'apoio')
})

test('desempenho médio e parado: estável', () => {
  assert.equal(resumir(sequencia('xxxxxxoooo' + 'xxxxxxoooo')).estado, 'estavel')
})

test('a ordem é pelo tempo, não pela ordem da lista', () => {
  const desordenado = sequencia('oooooooooo' + 'xxxxxxxxxx').reverse()
  assert.equal(resumir(desordenado).estado, 'consolidando')
})

test('habilidade reúne as tentativas de todos os jogos que a treinam', () => {
  const tentativas = [
    ...sequencia('xxxx', 'plataforma-amigo'),
    ...sequencia('oo', 'cuidar-amigo'),
    ...sequencia('xxx', 'chuva-emocoes'),
  ]
  const r = analisar(tentativas, [{ habilidade: 'empatia', nivel: 2 }], JOGOS)
  assert.equal(r.habilidades[0].tentativas, 6) // empatia: plataforma + cuidar do amigo, sem a chuva
  assert.equal(r.habilidades[0].erros, 2)
  assert.equal(r.geral.tentativas, 9)
})

test('só lista jogos que foram jogados', () => {
  const r = analisar(sequencia('xo', 'chuva-emocoes'), [], JOGOS)
  assert.deepEqual(r.jogos.map((j) => j.id), ['chuva-emocoes'])
})
