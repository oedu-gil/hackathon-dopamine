import { nomeHabilidade } from './data/habilidades.js'

// pdi: [{ habilidade, nivel }] com nivel de 1 (iniciante) a 3 (avançado).
// Quanto menor o nível da criança, maior a prioridade do jogo que treina a habilidade.
export function recomendar(pdi, catalogo) {
  return catalogo
    .map((jogo) => {
      const casadas = pdi.filter((item) => jogo.habilidades.includes(item.habilidade))
      const pontos = casadas.reduce((soma, item) => soma + (4 - item.nivel), 0)
      return {
        jogo,
        pontos,
        // começa pelo nível mais baixo, para a criança não travar no início
        nivel: casadas.length ? Math.min(...casadas.map((item) => item.nivel)) : 1,
        motivo: casadas
          .map((item) => `${nomeHabilidade(item.habilidade)} (nível ${item.nivel})`)
          .join(', '),
      }
    })
    .filter((r) => r.pontos > 0)
    .sort((a, b) => b.pontos - a.pontos)
}
