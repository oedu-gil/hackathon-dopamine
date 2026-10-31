import { useState } from 'react'
import { HIPERFOCOS } from './compartilhado/temas.js'
import { jogoPorId } from './jogos/registro.js'
import EscolhaTema from './telas/EscolhaTema.jsx'
import ListaJogos from './telas/ListaJogos.jsx'
import AntesDoJogo from './telas/AntesDoJogo.jsx'
import TelaJogo from './telas/TelaJogo.jsx'

// Telas: tema -> lista -> antes (aviso de troca de tela) -> jogo -> lista
const CHAVE_TEMA = 'dopamine-hub-tema'

function lerTema() {
  try {
    return HIPERFOCOS.find((h) => h.id === localStorage.getItem(CHAVE_TEMA)) ?? null
  } catch {
    return null
  }
}

function gravarTema(id) {
  try {
    localStorage.setItem(CHAVE_TEMA, id)
  } catch {
    // sem localStorage o tema vale só até fechar a página
  }
}

// Opções iguais para todos os jogos. Som baixo e música desligada por padrão (DESIGN.md, regra 7).
const OPCOES = {
  sons: true,
  musica: false,
  reduzirMovimento: matchMedia('(prefers-reduced-motion: reduce)').matches,
}

export default function App() {
  const [tema, setTema] = useState(lerTema)
  const [tela, setTela] = useState(() => (lerTema() ? 'lista' : 'tema'))
  const [jogoId, setJogoId] = useState(null)
  const jogo = jogoPorId(jogoId)

  // Ponto de integração com o site: aqui o resultado de cada partida iria para o servidor.
  function aoTerminar(resultado) {
    if (import.meta.env.DEV) console.info('[hub] resultado', jogo.id, resultado)
  }

  if (tela === 'tema' || !tema) {
    return (
      <EscolhaTema
        escolher={(h) => {
          gravarTema(h.id)
          setTema(h)
          setTela('lista')
        }}
      />
    )
  }

  if (tela === 'antes' && jogo) {
    return <AntesDoJogo tema={tema} jogo={jogo} comecar={() => setTela('jogo')} voltar={() => setTela('lista')} />
  }

  if (tela === 'jogo' && jogo) {
    return <TelaJogo tema={tema} jogo={jogo} opcoes={OPCOES} aoTerminar={aoTerminar} voltar={() => setTela('lista')} />
  }

  return (
    <ListaJogos
      tema={tema}
      escolher={(j) => {
        setJogoId(j.id)
        setTela('antes')
      }}
      trocarTema={() => setTela('tema')}
    />
  )
}
