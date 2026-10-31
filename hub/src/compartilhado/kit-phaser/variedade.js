import { embaralhar } from './ui.js'

// Sorteia `n` itens preferindo os que a criança ainda não viu. `vistos` vai do mais antigo
// ao mais recente; quando faltam itens novos, completa com os vistos há mais tempo.
export function sortearSemRepetir(lista, n, vistos, idDe) {
  const escolhidos = embaralhar(lista.filter((x) => !vistos.includes(idDe(x)))).slice(0, n)
  if (escolhidos.length < n) {
    const maisAntigos = lista
      .filter((x) => !escolhidos.includes(x))
      .sort((a, b) => vistos.indexOf(idDe(a)) - vistos.indexOf(idDe(b)))
    escolhidos.push(...maisAntigos.slice(0, n - escolhidos.length))
  }
  return embaralhar(escolhidos)
}

// Versão com memória no navegador. `chave` separa jogo e aluno (ex.: "historia:Ana").
const CHAVE = 'dopamine-vistos-v1'

function ler() {
  try {
    return JSON.parse(localStorage.getItem(CHAVE)) || {}
  } catch {
    return {}
  }
}

export function sortear(chave, lista, n, idDe) {
  const todos = ler()
  const vistos = todos[chave] ?? []
  const escolhidos = sortearSemRepetir(lista, n, vistos, idDe)

  const ids = escolhidos.map(idDe)
  todos[chave] = [...vistos.filter((id) => !ids.includes(id)), ...ids].slice(-lista.length)
  try {
    localStorage.setItem(CHAVE, JSON.stringify(todos))
  } catch {
    // sem localStorage, o sorteio só não lembra o que já saiu
  }
  return escolhidos
}
