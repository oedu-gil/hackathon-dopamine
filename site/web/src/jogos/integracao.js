// Ponto único de integração entre o site e os jogos (raiz do repo, src/games/).
// O formato ainda vai ser combinado com quem faz os jogos. Por enquanto seguimos
// src/core/contracts.js: o site monta uma activity e recebe um resultado como o de createResult().

export function montarAtividade({ alunoId, jogo, tema }) {
  return {
    activityId: `${alunoId}-${jogo.id}-${Date.now()}`,
    gameId: jogo.game_id,
    theme: tema?.id ?? 'neutro',
    images: [], // as imagens por tema ainda vão ser definidas com a equipe dos jogos
  }
}

// Resultado que o site envia ao servidor. `resultado` vem do jogo:
// { status: 'completed' | 'abandoned', attempts, correct, hints }.
export function paraServidor(jogo, resultado) {
  const { status, attempts = 0, correct = 0, hints = 0 } = resultado
  return { jogoId: jogo.id, status, attempts, correct, hints }
}
