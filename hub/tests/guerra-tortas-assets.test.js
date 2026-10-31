import test from 'node:test'
import assert from 'node:assert/strict'
import { access, readFile } from 'node:fs/promises'
import { cenario, tortinha, gatinho, guaxinim } from '../src/jogos/guerra-tortas/assets.js'

test('todos os assets empacotáveis da Guerra de Tortas são PNGs locais existentes', async () => {
  for (const caminho of [cenario, tortinha, ...Object.values(gatinho), ...Object.values(guaxinim)]) {
    const url = new URL(caminho)
    assert.equal(url.protocol, 'file:')
    await access(url)
    const dados = await readFile(url)
    assert.deepEqual([...dados.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10])
  }
})
