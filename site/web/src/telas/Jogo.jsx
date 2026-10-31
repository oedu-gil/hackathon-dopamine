import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../api.js'
import { temaPorId } from '../temas.js'
import { abrirJogo, jogoDoHub, opcoesDosJogos, paraServidor, temaDoHub } from '../jogos/integracao.js'
import { estiloTema } from './Crianca.jsx'

// Abre o jogo real do hub e envia o resultado de cada partida ao servidor.
export default function Jogo({ usuario }) {
  const { jogoId } = useParams()
  const navegar = useNavigate()
  const palco = useRef(null)
  const [dados, setDados] = useState(null)
  const [confirmarSaida, setConfirmarSaida] = useState(false)
  const [ganhou, setGanhou] = useState(null)
  const [falhou, setFalhou] = useState(false)
  const [erro, setErro] = useState('')

  useEffect(() => {
    api(`/alunos/${usuario.aluno_id}`).then(setDados).catch((e) => setErro(e.message))
  }, [usuario.aluno_id])

  const jogo = dados?.jogos.find((j) => j.id === jogoId)
  const jogoHub = jogoDoHub(jogoId)
  const tema = temaPorId(dados?.aluno.hiperfoco)
  const opcoes = useMemo(opcoesDosJogos, [])

  // Os callbacks mudam a cada renderização; o jogo guarda os da primeira, por isso a ref.
  const aoTerminarRef = useRef(null)
  aoTerminarRef.current = async (resultado) => {
    try {
      const { xp } = await api(`/alunos/${usuario.aluno_id}/resultados`, { metodo: 'POST', corpo: paraServidor(jogoId, resultado) })
      if (resultado.status === 'completed') setGanhou(xp)
    } catch (e) {
      setErro(e.message)
    }
  }

  // Só monta quando o servidor confirma que o jogo está aprovado para este aluno.
  const nivel = jogo?.nivel
  const temaId = tema?.id
  const pronto = Boolean(jogo && jogoHub)
  useEffect(() => {
    if (!pronto || ganhou !== null) return
    let desmontar = null
    let cancelado = false
    abrirJogo(palco.current, {
      jogo: jogoHub,
      tema: temaDoHub(temaId),
      nivel,
      opcoes,
      aoTerminar: (resultado) => aoTerminarRef.current(resultado),
      aoSair: () => navegar('/crianca'),
    })
      .then((d) => (cancelado ? d() : (desmontar = d)))
      .catch(() => !cancelado && setFalhou(true))
    return () => {
      cancelado = true
      // desmontar() avisa o servidor com status "abandoned" se a partida não terminou.
      desmontar?.()
    }
  }, [pronto, jogoHub, temaId, nivel, opcoes, ganhou, navegar])

  if (dados && (!jogo || !jogoHub)) {
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
    <div className="crianca crianca-jogo" style={estiloTema(tema)}>
      <header className="crianca-topo">
        <button onClick={() => (ganhou === null ? setConfirmarSaida(true) : navegar('/crianca'))}>Sair</button>
        {jogo && <strong>{jogo.nome}</strong>}
      </header>

      {erro && <p className="erro" role="alert">{erro}</p>}
      {falhou && (
        <section className="crianca-bloco">
          <p>Não conseguimos abrir o jogo.</p>
          <button onClick={() => navegar('/crianca')}>Voltar</button>
        </section>
      )}

      {ganhou === null && !falhou && <div className="palco-jogo" ref={palco} />}

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
              <button onClick={() => navegar('/crianca')}>Sair</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
