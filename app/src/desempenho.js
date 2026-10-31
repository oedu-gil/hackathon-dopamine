// Registro de cada tentativa (acerto ou erro) nos jogos, guardado no navegador.
// Tentativa: { t, aluno, jogo, nivel, hiperfoco, ok }.
const CHAVE = 'dopamine-desempenho-v1'

function ler() {
  try {
    return JSON.parse(localStorage.getItem(CHAVE)) || []
  } catch {
    return []
  }
}

function gravar(lista) {
  try {
    localStorage.setItem(CHAVE, JSON.stringify(lista))
  } catch {
    // sem localStorage o registro vale só até fechar a página
  }
}

export function registrarTentativa(tentativa) {
  const lista = ler()
  lista.push({ t: Date.now(), ...tentativa })
  gravar(lista)
}

export const tentativasDoAluno = (aluno) => ler().filter((t) => t.aluno === aluno)

export function apagarAluno(aluno) {
  gravar(ler().filter((t) => t.aluno !== aluno))
}
