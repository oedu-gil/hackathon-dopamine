// Acertos acumulados por hiperfoco, guardados no navegador. Cada limite desbloqueia um item.
const CHAVE = 'dopamine-progresso-v1'
export const LIMITES = [5, 12, 22, 35, 50]

function ler() {
  try {
    return JSON.parse(localStorage.getItem(CHAVE)) || {}
  } catch {
    return {}
  }
}

function gravar(dados) {
  try {
    localStorage.setItem(CHAVE, JSON.stringify(dados))
  } catch {
    // sem localStorage o progresso vale só até fechar a página
  }
}

export function estado(hiperfoco) {
  const total = ler()[hiperfoco.id] || 0
  const desbloqueados = hiperfoco.itens.filter((_, i) => total >= LIMITES[i])
  const indice = desbloqueados.length
  return {
    total,
    desbloqueados,
    proximo: hiperfoco.itens[indice] ?? null,
    anterior: indice ? LIMITES[indice - 1] : 0,
    limite: LIMITES[indice] ?? null,
  }
}

export function registrarAcerto(hiperfoco) {
  const antes = estado(hiperfoco)
  const dados = ler()
  dados[hiperfoco.id] = antes.total + 1
  gravar(dados)
  const depois = estado(hiperfoco)
  const novoItem =
    depois.desbloqueados.length > antes.desbloqueados.length ? depois.desbloqueados.at(-1) : null
  return { ...depois, novoItem }
}

export function reiniciar() {
  gravar({})
}
