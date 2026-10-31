// Copia o catálogo de jogos do hub (hub/src/jogos/*/manifesto.js) para a tabela `jogos` do Supabase.
// Roda sozinho quando o servidor sobe, e também com `npm run sincronizar-jogos`.
import { register } from 'node:module'
import { db, q } from './db.js'
import { sugerirJogos } from './regras.js'

let hooksRegistrados = false

export async function sincronizarJogos(log = console) {
  if (!hooksRegistrados) {
    // os manifestos importam svg e css, que o Node não entende: viram um texto fixo
    register('../scripts/stub-assets.mjs', import.meta.url)
    hooksRegistrados = true
  }
  const { JOGOS } = await import('../../../hub/src/jogos/registro.js')
  const linhas = JOGOS.map(({ id, nome, descricao, habilidades }) => ({ id, nome, descricao, habilidades }))
  try {
    await q(db.from('jogos').upsert(linhas))
  } catch (e) {
    // Banco criado com o schema antigo, onde `game_id` era obrigatório: repete preenchendo a coluna.
    if (!/game_id/.test(e.message)) throw e
    await q(db.from('jogos').upsert(linhas.map((l) => ({ ...l, game_id: l.id }))))
  }

  // Remove os jogos que saíram do catálogo (falha se algum aluno já tiver aprovação ou resultado nele).
  const existentes = await q(db.from('jogos').select('id'))
  for (const { id } of existentes.filter((j) => !linhas.some((l) => l.id === j.id))) {
    try {
      await q(db.from('jogos').delete().eq('id', id))
      log.log(`jogo removido do catálogo: ${id}`)
    } catch (e) {
      log.warn(`não removi "${id}": ${e.message}`)
    }
  }
  return linhas
}

// Jogos novos no catálogo também viram sugestão para quem já tem PDI. Só acrescenta o que falta:
// o que a escola já aprovou ou recusou não muda.
export async function completarSugestoes() {
  const [pdis, jogos, aprovacoes] = await Promise.all([
    q(db.from('pdis').select('aluno_id, itens, criado_em').order('criado_em', { ascending: false })),
    q(db.from('jogos').select('*')),
    q(db.from('aprovacoes').select('aluno_id, jogo_id')),
  ])
  const feitas = new Set(aprovacoes.map((a) => `${a.aluno_id}/${a.jogo_id}`))
  const vistos = new Set()
  const novas = []
  for (const pdi of pdis) {
    if (vistos.has(pdi.aluno_id)) continue // só o PDI mais recente de cada aluno vale
    vistos.add(pdi.aluno_id)
    for (const jogo of sugerirJogos(pdi.itens ?? [], jogos)) {
      if (!feitas.has(`${pdi.aluno_id}/${jogo.id}`)) novas.push({ aluno_id: pdi.aluno_id, jogo_id: jogo.id, status: 'sugerido' })
    }
  }
  if (novas.length) await q(db.from('aprovacoes').insert(novas))
  return novas
}
