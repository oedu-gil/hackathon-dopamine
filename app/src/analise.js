import { nomeHabilidade } from './data/habilidades.js'

// Mínimo de tentativas para estimar aprendizado; abaixo disso o resultado é só "poucos dados".
export const MIN_TENTATIVAS = 10

const ESTADOS = {
  'poucos-dados': {
    rotulo: 'Poucos dados',
    texto: `Ainda há menos de ${MIN_TENTATIVAS} tentativas: é cedo para estimar o aprendizado.`,
  },
  consolidando: {
    rotulo: 'Consolidando',
    texto: 'Acertos recentes de 80% ou mais: a habilidade parece consolidada nos jogos.',
  },
  evoluindo: {
    rotulo: 'Evoluindo',
    texto: 'A taxa de acerto subiu pelo menos 10 pontos ao longo do uso: sinal de aprendizado.',
  },
  apoio: {
    rotulo: 'Precisa de apoio',
    texto:
      'Acertos recentes abaixo de 50% e sem melhora: pode ser preciso apoio do educador ou outra estratégia.',
  },
  estavel: {
    rotulo: 'Estável',
    texto: 'Desempenho estável, sem sinal claro de evolução ainda.',
  },
}

const taxa = (ts) => (ts.length ? ts.filter((t) => t.ok).length / ts.length : null)

function classificar(n, recente, delta) {
  if (n < MIN_TENTATIVAS) return 'poucos-dados'
  if (recente >= 0.8) return 'consolidando'
  if (delta >= 0.1) return 'evoluindo'
  if (recente < 0.5) return 'apoio'
  return 'estavel'
}

// tentativas: [{ t, jogo, ok }]. Compara a primeira e a segunda metade, em ordem de tempo.
export function resumir(tentativas) {
  const ts = [...tentativas].sort((a, b) => a.t - b.t)
  const n = ts.length
  const acertos = ts.filter((t) => t.ok).length
  const metade = Math.floor(n / 2)
  const inicial = taxa(ts.slice(0, metade))
  const recente = taxa(ts.slice(metade))
  const delta = n >= MIN_TENTATIVAS ? recente - inicial : null
  const estado = classificar(n, recente, delta)
  return {
    tentativas: n,
    acertos,
    erros: n - acertos,
    taxa: taxa(ts),
    inicial: n >= MIN_TENTATIVAS ? inicial : null,
    recente: n >= MIN_TENTATIVAS ? recente : null,
    delta,
    estado,
    ...ESTADOS[estado],
  }
}

// pdi: [{ habilidade, nivel }]. Cada habilidade reúne as tentativas dos jogos que a treinam.
export function analisar(tentativas, pdi, catalogo) {
  const habilidades = pdi.map((item) => {
    const jogos = catalogo.filter((j) => j.habilidades.includes(item.habilidade)).map((j) => j.id)
    return {
      habilidade: item.habilidade,
      nome: nomeHabilidade(item.habilidade),
      nivelPdi: item.nivel,
      ...resumir(tentativas.filter((t) => jogos.includes(t.jogo))),
    }
  })
  const jogos = catalogo
    .map((j) => ({ id: j.id, nome: j.nome, arte: j.arte, ...resumir(tentativas.filter((t) => t.jogo === j.id)) }))
    .filter((j) => j.tentativas > 0)
  return { geral: resumir(tentativas), habilidades, jogos }
}
