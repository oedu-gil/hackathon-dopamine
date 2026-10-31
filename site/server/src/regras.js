// Regras puras do site, sem banco, para poder testar.

export const XP_POR_JOGO = 10
export const XP_POR_ITEM = 20

// Jogos do catálogo que treinam pelo menos uma habilidade (tag) do PDI.
// Os que cobrem mais tópicos do PDI vêm primeiro.
export function sugerirJogos(itens, jogos) {
  const habilidades = new Set(itens.map((i) => i.habilidade))
  const cobertas = (j) => j.habilidades.filter((h) => habilidades.has(h)).length
  return jogos.filter((j) => cobertas(j) > 0).sort((a, b) => cobertas(b) - cobertas(a))
}

// Nível (1 a 3) que o jogo recebe: o maior nível, entre as tags do PDI que o jogo treina.
export function nivelDoJogo(itens, jogo) {
  const niveis = itens.filter((i) => jogo.habilidades.includes(i.habilidade)).map((i) => Number(i.nivel))
  const nivel = Math.max(1, ...niveis.filter(Number.isFinite))
  return Math.min(3, Math.round(nivel))
}

export function calcularXp(resultados) {
  return resultados.filter((r) => r.status === 'completed').length * XP_POR_JOGO
}

export function itensDesbloqueados(xp) {
  return Math.floor(xp / XP_POR_ITEM)
}

// Resumo simplificado por jogo: partidas, conclusão e taxa de acerto.
export function resumirDesempenho(resultados, jogos) {
  return jogos.map((jogo) => {
    const doJogo = resultados.filter((r) => r.jogo_id === jogo.id)
    const tentativas = doJogo.reduce((s, r) => s + r.attempts, 0)
    const acertos = doJogo.reduce((s, r) => s + r.correct, 0)
    return {
      jogoId: jogo.id,
      nome: jogo.nome,
      partidas: doJogo.length,
      concluidas: doJogo.filter((r) => r.status === 'completed').length,
      dicas: doJogo.reduce((s, r) => s + r.hints, 0),
      taxaAcerto: tentativas ? Math.round((acertos / tentativas) * 100) : null,
    }
  })
}

export function validarResultado({ status, attempts, correct, hints = 0 }) {
  if (!['completed', 'abandoned'].includes(status)) return 'status inválido'
  const ok = [attempts, correct, hints].every((n) => Number.isSafeInteger(n) && n >= 0)
  if (!ok || correct > attempts) return 'contadores inválidos'
  return null
}
