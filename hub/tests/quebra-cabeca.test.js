import test from 'node:test'
import assert from 'node:assert/strict'
import { Partida, embaralhar, N } from '../src/jogos/quebra-cabeca/regras.js'
import { medidas, simbolo } from '../src/jogos/quebra-cabeca/composicao.js'
import { casaXY, lugarXY, encaixar, emRetrato } from '../src/jogos/quebra-cabeca/layout.js'

test('a bandeja tem as 15 peças, sem repetir, e a mesma semente dá a mesma ordem', () => {
  assert.deepEqual([...embaralhar(5)].sort((a, b) => a - b), Array.from({ length: N }, (_, i) => i))
  assert.deepEqual(embaralhar(5), embaralhar(5))
  assert.notDeepEqual(embaralhar(5), embaralhar(6))
  assert.equal(new Set(Object.values(new Partida(2).slotOf)).size, N)
})

test('selecionar, cancelar e trocar de peça não contam tentativa', () => {
  const p = new Partida()
  p.tocarPeca(3)
  assert.equal(p.sel, 3)
  p.tocarPeca(3)
  assert.equal(p.sel, null)
  p.tocarPeca(3)
  p.tocarPeca(4)
  assert.equal(p.sel, 4)
  assert.deepEqual(p.metrics, { attempts: 0, correct: 0, hints: 0 })
})

test('colocar conta uma tentativa; a casa certa conta também um acerto', () => {
  const p = new Partida()
  p.tocarPeca(3)
  assert.equal(p.tocarCasa(3).tipo, 'certa')
  p.tocarPeca(4)
  assert.equal(p.tocarCasa(9).tipo, 'errada')
  assert.deepEqual(p.metrics, { attempts: 2, correct: 1, hints: 0 })
})

test('tocar numa casa sem peça escolhida, ou numa casa já certa, não conta', () => {
  const p = new Partida()
  p.tocarCasa(0)
  assert.equal(p.msg[0], 'Primeiro escolha uma peça')
  p.tocarPeca(0)
  p.tocarCasa(0)
  p.tocarPeca(0) // peça certa: travada
  assert.equal(p.sel, null)
  assert.equal(p.msg[0], 'Essa casa já está completa')
  assert.deepEqual(p.metrics, { attempts: 1, correct: 1, hints: 0 })
})

test('a peça errada fica na casa e pode ser devolvida sem tentativa extra', () => {
  const p = new Partida()
  p.tocarPeca(2)
  p.tocarCasa(7)
  assert.equal(p.cellOf[2], 7)
  assert.equal(p.certa(2), false)
  p.tocarPeca(2) // pega a peça errada de volta do tabuleiro
  assert.equal(p.sel, 2)
  assert.equal(p.devolver(), true)
  assert.equal(p.cellOf[2], null)
  assert.equal(p.metrics.attempts, 1)
})

test('colocar numa casa com peça errada devolve a anterior à bandeja', () => {
  const p = new Partida()
  p.tocarPeca(2)
  p.tocarCasa(7)
  p.tocarPeca(5)
  p.tocarCasa(7)
  assert.equal(p.cellOf[2], null)
  assert.equal(p.cellOf[5], 7)
  assert.equal(p.occ[7], 5)
  assert.equal(p.metrics.attempts, 2)
})

test('cada dica nova soma uma ajuda; repetir a mesma não soma', () => {
  const p = new Partida()
  assert.equal(p.ajuda(), true)
  assert.equal(p.sel, 0) // sem peça escolhida, a primeira que falta
  assert.equal(p.ajuda(), false)
  assert.equal(p.metrics.hints, 1)
  p.tocarPeca(4)
  assert.equal(p.ajuda(), true)
  assert.equal(p.metrics.hints, 2)
})

test('a partida só termina com as 15 peças nos lugares certos', () => {
  const p = new Partida(4)
  let ultima
  for (let i = 0; i < N; i++) {
    assert.equal(ultima?.completa ?? false, false)
    p.tocarPeca(i)
    ultima = p.tocarCasa(i)
  }
  assert.equal(ultima.completa, true)
  assert.deepEqual(p.metrics, { attempts: N, correct: N, hints: 0 })
  p.concluir()
  assert.equal(p.tocarPeca(0), null)
})

test('imagem 5:3 vai inteira; outras proporções ganham fundo desfocado sem cortar', () => {
  assert.ok(!simbolo({ url: 'a.svg', proporcao: 5 / 3, filtro: 'f' }).includes('filter'))
  assert.ok(simbolo({ url: 'a.svg', proporcao: 1, filtro: 'f' }).includes('filter="url(#f)"'))
  assert.deepEqual(medidas(1).inteira, { w: 300, h: 300 })
  assert.deepEqual(medidas(2).inteira, { w: 500, h: 250 })
})

test('as 15 casas e os 15 lugares da bandeja são distintos e ficam dentro das áreas', () => {
  const casas = Array.from({ length: N }, (_, c) => casaXY(c))
  assert.equal(new Set(casas.map((x) => x.join())).size, N)
  for (const [x, y] of casas) assert.ok(x >= 352 && x + 96 <= 852 && y >= 84 && y + 96 <= 392)
  const lugares = Array.from({ length: N }, (_, s) => lugarXY(s))
  assert.equal(new Set(lugares.map((x) => x.join())).size, N)
  for (const [x, y] of lugares) assert.ok(x >= 24 && x + 72 <= 936 && y >= 404 && y + 72 <= 588)
})

test('a escala FIT não distorce, e o tablet em retrato pede para girar', () => {
  assert.deepEqual(encaixar(1920, 600), { escala: 1, x: 480, y: 0 })
  assert.equal(emRetrato(768, 1024), true)
  assert.equal(emRetrato(1024, 768), false)
})
