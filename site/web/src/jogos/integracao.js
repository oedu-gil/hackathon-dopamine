// Ponto único de integração entre o site e os jogos, que moram em hub/src/jogos (alias @hub).
// O contrato (manifesto.js + montar()) está em hub/src/jogos/contrato.js.
import { JOGOS, jogoPorId } from '@hub/jogos/registro.js'
import { HIPERFOCOS } from '@hub/compartilhado/temas.js'

// O site usa os mesmos temas do hub (temas.js). Aluno sem tema ou com um id antigo cai no primeiro.
export const temaDoHub = (temaId) => HIPERFOCOS.find((h) => h.id === temaId) ?? HIPERFOCOS[0]

export const jogoDoHub = jogoPorId

// Ids dos jogos que existem no hub, para conferir com o catálogo do servidor.
export const idsDosJogos = () => JOGOS.map((j) => j.id)

// Opções iguais para todos os jogos. Som baixo e música desligada por padrão (DESIGN.md, regra 7).
export const opcoesDosJogos = () => ({
  sons: true,
  musica: false,
  reduzirMovimento: matchMedia('(prefers-reduced-motion: reduce)').matches,
})

// Carrega o jogo e o monta dentro de `elemento`. Devolve a função desmontar().
export async function abrirJogo(elemento, { jogo, tema, nivel, opcoes, aoTerminar, aoSair }) {
  const { montar } = await jogo.carregar()
  return montar(elemento, { tema, nivel, opcoes, aoTerminar, aoSair })
}

// Resultado que o site envia ao servidor. `resultado` vem do jogo:
// { status: 'completed' | 'abandoned', attempts, correct, hints }.
export function paraServidor(jogoId, resultado) {
  const { status, attempts = 0, correct = 0, hints = 0 } = resultado
  return { jogoId, status, attempts, correct, hints }
}
