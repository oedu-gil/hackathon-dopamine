import test from 'node:test'
import assert from 'node:assert/strict'
import { AVISO, GUARDA, NIVEIS, configDoNivel, deveAbrirGuarda, duracaoGuarda, proximaAcao } from '../src/jogos/guerra-tortas/regras.js'
import { ARTE_TORTAS } from '../src/jogos/guerra-tortas/arte.js'

const sempre = (v) => () => v

test('nível fora de 1 a 3 cai no nível mais próximo', () => {
  assert.equal(configDoNivel(0), NIVEIS[1])
  assert.equal(configDoNivel(undefined), NIVEIS[1])
  assert.equal(configDoNivel(2), NIVEIS[2])
  assert.equal(configDoNivel(9), NIVEIS[3])
})

test('o nível 1 é o mais calmo', () => {
  assert.ok(NIVEIS[1].voo > NIVEIS[3].voo, 'tortas mais lentas')
  assert.ok(NIVEIS[1].bandeja > NIVEIS[3].bandeja, 'janela de defesa maior')
  assert.ok(NIVEIS[1].aberto > NIVEIS[3].aberto, 'guaxinim desprotegido por mais tempo')
  assert.deepEqual([1, 2, 3].map((n) => NIVEIS[n].esperaMax), [2000, 3000, 4000])
})

test('o guaxinim só lança depois do tempo mínimo desde o último lançamento', () => {
  const config = NIVEIS[1]
  const base = { ultimoLancamento: 0, esperandoDesde: null, config, aleatorio: sempre(0) }
  assert.notEqual(proximaAcao({ ...base, agora: config.intervaloLancar - 1 }), 'lancar')
  assert.equal(proximaAcao({ ...base, agora: config.intervaloLancar }), 'lancar')
})

test('com a criança esperando demais, o guaxinim não ergue a guarda', () => {
  const config = NIVEIS[1]
  const agora = 10_000
  const esperandoDesde = agora - config.esperaMax
  // aleatorio 0 escolheria defender, se pudesse
  const acao = proximaAcao({ agora, ultimoLancamento: agora, esperandoDesde, config, aleatorio: sempre(0) })
  assert.equal(acao, 'aberto')
})

test('a guarda abre a tempo de cumprir a espera máxima', () => {
  const config = NIVEIS[2]
  assert.equal(deveAbrirGuarda({ agora: 5000, esperandoDesde: null, config }), false)
  assert.equal(deveAbrirGuarda({ agora: 1000 + config.esperaMax - AVISO - 1, esperandoDesde: 1000, config }), false)
  // começa a abrir aqui; com o aviso, fica desprotegido exatamente em esperaMax
  assert.equal(deveAbrirGuarda({ agora: 1000 + config.esperaMax - AVISO, esperandoDesde: 1000, config }), true)
})

test('a guarda dura entre o mínimo e o máximo', () => {
  assert.equal(duracaoGuarda(sempre(0)), GUARDA.min)
  assert.equal(duracaoGuarda(sempre(1)), GUARDA.max)
})

test('a arte do jogo é SVG válido', () => {
  for (const [id, desc] of Object.entries(ARTE_TORTAS)) {
    assert.ok(desc.frames.length >= 1, id)
    for (const f of desc.frames) assert.match(f, /^<svg [^>]+>.*<\/svg>$/s, id)
  }
})
