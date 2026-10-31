import test from 'node:test'
import assert from 'node:assert/strict'
import { ARTE } from './arte/index.js'
import { HIPERFOCOS } from './data/hiperfocos.js'
import { JOGOS } from './data/jogos.js'
import { EMOCOES } from './data/emocoes.js'
import { SITUACOES } from './data/situacoes.js'
import { CUIDADOS, FERRAMENTAS } from './data/cuidados.js'

// Toda arte que os dados citam precisa existir, senão o jogo quebra na hora de desenhar.
const pedidos = () => {
  const ids = []
  for (const h of HIPERFOCOS) ids.push(h.arte, ...h.itens.map((i) => i.arte))
  for (const j of JOGOS) ids.push(j.arte)
  for (const e of EMOCOES) ids.push(e.arte)
  for (const s of SITUACOES) ids.push(`rosto_${s.cara}`)
  for (const c of CUIDADOS) ids.push(`rosto_${c.cara}`, `cena_${c.cena}`)
  for (const f of Object.values(FERRAMENTAS)) ids.push(f.arte)
  // usados direto no código dos jogos
  ids.push('rosto_feliz', 'rosto_confuso', 'rosto_neutro', 'estrela', 'estrela_bonus', 'lesma', 'bandeira')
  ids.push('mola_solta', 'mola_comprimida', 'nuvem', 'gota', 'trofeu', 'icone_desempenho', 'cena_lua')
  ids.push('p_estrela', 'p_coracao', 'p_brilho', 'p_bolinha', 'p_fita')
  return ids
}

test('toda arte citada pelos dados e pelos jogos existe', () => {
  for (const id of new Set(pedidos())) assert.ok(ARTE[id], `arte inexistente: ${id}`)
})

test('todo desenho é um SVG bem formado, com tamanho e quadros coerentes', () => {
  for (const [id, d] of Object.entries(ARTE)) {
    assert.ok(d.frames.length >= 1 && d.px > 0, `descrição de ${id}`)
    for (const svg of d.frames) {
      assert.ok(svg.startsWith('<svg') && svg.endsWith('</svg>'), `${id}: não é um SVG`)
      assert.ok(!svg.includes('undefined') && !svg.includes('NaN'), `${id}: valor inválido no desenho`)
      // um atributo repetido dentro da mesma tag deixa o SVG inválido (a imagem some)
      for (const tag of svg.match(/<[^>]+>/g)) {
        const nomes = [...tag.matchAll(/\s([a-z-]+)="/g)].map((m) => m[1])
        assert.equal(new Set(nomes).size, nomes.length, `${id}: atributo repetido em ${tag.slice(0, 60)}`)
      }
    }
    if (d.seq) assert.ok(d.seq.every((i) => i >= 0 && i < d.frames.length), `${id}: sequência fora dos quadros`)
  }
})

test('cada hiperfoco tem personagem animado e 10 itens com desenho próprio', () => {
  for (const h of HIPERFOCOS) {
    assert.ok(ARTE[h.arte].frames.length >= 2, `${h.nome} sem animação`)
    assert.equal(new Set(h.itens.map((i) => ARTE[i.arte].frames[0])).size, h.itens.length, `${h.nome}: itens repetidos`)
  }
})

test('os dados não usam mais emojis', () => {
  const emoji = /\p{Extended_Pictographic}/u
  const textos = JSON.stringify([HIPERFOCOS, JOGOS, EMOCOES, SITUACOES, CUIDADOS, FERRAMENTAS])
  assert.ok(!emoji.test(textos), 'sobrou emoji nos dados')
})
