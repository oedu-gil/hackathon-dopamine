import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../api.js'
import { temaPorId } from '../temas.js'
import { montarAtividade, paraServidor } from '../jogos/integracao.js'
import { estiloTema } from './Crianca.jsx'

// Placeholder: enquanto os jogos não estão integrados, simula uma partida
// e envia um resultado no mesmo formato que os jogos vão enviar.
export default function Jogo({ usuario }) {
  const { jogoId } = useParams()
  const navegar = useNavigate()
  const [dados, setDados] = useState(null)
  const [confirmarSaida, setConfirmarSaida] = useState(false)
  const [ganhou, setGanhou] = useState(null)
  const [erro, setErro] = useState('')

  useEffect(() => {
    api(`/alunos/${usuario.aluno_id}`).then(setDados).catch((e) => setErro(e.message))
  }, [usuario.aluno_id])

  const jogo = dados?.jogos.find((j) => j.id === jogoId)
  const tema = temaPorId(dados?.aluno.hiperfoco)

  async function enviar(resultado) {
    try {
      const { xp } = await api(`/alunos/${usuario.aluno_id}/resultados`, { metodo: 'POST', corpo: paraServidor(jogo, resultado) })
      return xp
    } catch (e) {
      setErro(e.message)
      return null
    }
  }

  async function terminar() {
    const xp = await enviar({ status: 'completed', attempts: 4, correct: 3, hints: 1 })
    if (xp !== null) setGanhou(xp)
  }

  async function sair() {
    await enviar({ status: 'abandoned', attempts: 0, correct: 0, hints: 0 })
    navegar('/crianca')
  }

  if (dados && !jogo) {
    return (
      <div className="crianca" style={estiloTema(tema)}>
        <section className="crianca-bloco">
          <p>Este jogo não está disponível.</p>
          <button onClick={() => navegar('/crianca')}>Voltar</button>
        </section>
      </div>
    )
  }

  return (
    <div className="crianca" style={estiloTema(tema)}>
      <header className="crianca-topo">
        <button onClick={() => (ganhou === null ? setConfirmarSaida(true) : navegar('/crianca'))}>Sair</button>
      </header>

      {erro && <p className="erro" role="alert">{erro}</p>}

      {jogo && ganhou === null && (
        <section className="crianca-bloco jogo-area">
          <span className="emoji grande" aria-hidden="true">{tema?.personagem ?? '🎮'}</span>
          <h1>{jogo.nome}</h1>
          <p className="ajuda">O jogo de verdade vai aparecer aqui (atividade “{montarAtividade({ alunoId: usuario.aluno_id, jogo, tema }).gameId}”).</p>
          <button className="primario grande" onClick={terminar}>Terminar partida (simulação)</button>
        </section>
      )}

      {ganhou !== null && (
        <section className="crianca-bloco jogo-area">
          <span className="emoji grande" aria-hidden="true">⭐</span>
          <h1>Muito bem!</h1>
          <p>Você ganhou XP. Agora tem {ganhou} XP.</p>
          <button className="primario grande" onClick={() => navegar('/crianca')}>Voltar aos jogos</button>
        </section>
      )}

      {confirmarSaida && (
        <div className="fundo-dialogo">
          <div className="dialogo" role="dialog" aria-modal="true" aria-labelledby="titulo-sair">
            <p id="titulo-sair">Quer sair do jogo?</p>
            <div className="linha centro">
              <button className="primario" onClick={() => setConfirmarSaida(false)}>Continuar jogando</button>
              <button onClick={sair}>Sair</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
