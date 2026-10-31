// Períodos do histórico. Bimestres seguem o calendário: jan–fev, mar–abr, mai–jun, jul–ago, set–out e nov–dez.
const MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']

export const TIPOS = [
  { id: 'bimestre', nome: 'Bimestre', meses: 2 },
  { id: 'semestre', nome: 'Semestre', meses: 6 },
  { id: 'ano', nome: 'Ano', meses: 12 },
]

const mesesDoTipo = (tipo) => TIPOS.find((t) => t.id === tipo).meses

// Chave ordenável do período em que a data cai, ex.: "2026-5" (5º bimestre de 2026).
export function chaveDoPeriodo(data, tipo) {
  const d = new Date(data)
  const n = Math.floor(d.getMonth() / mesesDoTipo(tipo)) + 1
  return tipo === 'ano' ? `${d.getFullYear()}` : `${d.getFullYear()}-${n}`
}

export function nomeDoPeriodo(chave, tipo) {
  const [ano, n] = chave.split('-').map(Number)
  if (tipo === 'ano') return `${ano}`
  const m = mesesDoTipo(tipo)
  const meses = `${MESES[(n - 1) * m]}–${MESES[n * m - 1]}`
  return `${n}º ${tipo} de ${ano} (${meses})`
}

// Nome curto para o eixo do gráfico, ex.: "5º bim 2026".
export function nomeCurto(chave, tipo) {
  const [ano, n] = chave.split('-')
  if (tipo === 'ano') return ano
  return `${n}º ${tipo === 'bimestre' ? 'bim' : 'sem'} ${ano}`
}

export function inicioDoPeriodo(chave, tipo) {
  const [ano, n = 1] = chave.split('-').map(Number)
  return new Date(ano, (n - 1) * mesesDoTipo(tipo), 1)
}

export function fimDoPeriodo(chave, tipo) {
  const [ano, n = 1] = chave.split('-').map(Number)
  return new Date(ano, n * mesesDoTipo(tipo), 1)
}

// Todos os períodos entre a primeira e a última data, em ordem, inclusive os vazios.
export function periodosEntre(datas, tipo) {
  if (!datas.length) return []
  const ordenadas = datas.map((d) => new Date(d)).sort((a, b) => a - b)
  const chaves = []
  let atual = chaveDoPeriodo(ordenadas[0], tipo)
  const ultima = chaveDoPeriodo(ordenadas.at(-1), tipo)
  while (true) {
    chaves.push(atual)
    if (atual === ultima) return chaves
    atual = chaveDoPeriodo(fimDoPeriodo(atual, tipo), tipo)
  }
}

// PDIs que valeram no período: cada PDI vale da data de envio até o próximo.
export function pdisDoPeriodo(pdis, chave, tipo) {
  const inicio = inicioDoPeriodo(chave, tipo)
  const fim = fimDoPeriodo(chave, tipo)
  return pdis.filter((p, i) => {
    const de = new Date(p.criado_em)
    const ate = pdis[i + 1] ? new Date(pdis[i + 1].criado_em) : new Date(8.64e15)
    return de < fim && ate > inicio
  })
}

// Taxa de acerto (0–100) de um conjunto de partidas, ou null sem tentativas.
export function taxaDeAcerto(resultados) {
  const tentativas = resultados.reduce((s, r) => s + r.attempts, 0)
  return tentativas ? Math.round((resultados.reduce((s, r) => s + r.correct, 0) / tentativas) * 100) : null
}
