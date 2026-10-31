import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../api.js'
import { estiloTema, itensGanhos, temaPorId } from '../temas.js'
import { abrirJogo, jogoDoHub, opcoesDosJogos, paraServidor, temaDoHub } from '../jogos/integracao.js'
import Icone from './Icones.jsx'

// Abre o jogo real do hub e envia o resultado de cada partida ao servidor.
// Etapas: aviso antes do jogo (DESIGN.md, regra 3) → jogo → comemoração.
export default function Jogo({ usuario }) {
  const { jogoId } = useParams()
  const navegar = useNavigate()
  const palco = useRef(null)
  const [dados, setDados] = useState(null)
  const [etapa, setEtapa] = useState('antes')
  const [confirmarSaida, setConfirmarSaida] = useState(false)
  const [xpNovo, setXpNovo] = useState(null)
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
      if (resultado.status === 'completed') {
        setXpNovo(xp)
        setEtapa('fim')
      }
    } catch (e) {
      setErro(e.message)
    }
  }

  // Só monta depois do Começar e quando o servidor confirma que o jogo está aprovado.
  const nivel = jogo?.nivel
  const temaId = tema?.id
  const jogando = etapa === 'jogando' && Boolean(jogo && jogoHub)
  useEffect(() => {
    if (!jogando) return
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
  }, [jogando, jogoHub, temaId, nivel, opcoes, navegar])

  if (dados && (!jogo || !jogoHub)) {
    return (
      <div className="crianca" style={estiloTema(tema)}>
        <section className="crianca-secao cartao-centro">
          <p>Este jogo não está disponível.</p>
          <button className="botao-crianca" onClick={() => navegar('/crianca')}><Icone nome="voltar" /> Voltar</button>
        </section>
      </div>
    )
  }

  // Itens ganhos nesta partida (para comemorar o item novo).
  const novos = tema && xpNovo !== null ? tema.itens.slice(itensGanhos(tema, dados.xp), itensGanhos(tema, xpNovo)) : []

  return (
    <div className={etapa === 'jogando' ? 'crianca crianca-jogo' : 'crianca'} style={estiloTema(tema)}>
      <header className="crianca-barra">
        <button className="botao-crianca" onClick={() => (etapa === 'jogando' ? setConfirmarSaida(true) : navegar('/crianca'))}>
          <Icone nome="sair" /> Sair
        </button>
        {etapa === 'jogando' && jogo && <strong className="crianca-barra-titulo">{jogo.nome}</strong>}
      </header>

      {erro && <p className="erro crianca-erro" role="alert">{erro}</p>}

      {jogo && jogoHub && etapa === 'antes' && (
        <section className="crianca-secao cartao-centro">
          <img className="personagem-centro" src={jogoHub.icone ?? tema?.personagem} alt="" />
          <h1 className="crianca-titulo">Vamos jogar {jogo.nome}!</h1>
          <p className="passo-texto"><Icone nome="info" /> {jogoHub.descricao}</p>
          <button className="primario grande" onClick={() => setEtapa('jogando')} autoFocus><Icone nome="jogar" /> Começar</button>
        </section>
      )}

      {etapa === 'jogando' && falhou && (
        <section className="crianca-secao cartao-centro">
          <p>Não conseguimos abrir o jogo.</p>
          <button className="botao-crianca" onClick={() => navegar('/crianca')}><Icone nome="voltar" /> Voltar</button>
        </section>
      )}

      {etapa === 'jogando' && !falhou && <div className="palco-jogo" ref={palco} />}

      {etapa === 'fim' && (
        <section className="crianca-secao cartao-centro comemoracao">
          <span className="selo-estrela"><Icone nome="estrela" tamanho={56} /></span>
          <h1 className="crianca-titulo">Muito bem!</h1>
          <p className="passo-texto">Você agora tem <strong>{xpNovo} XP</strong>.</p>
          {novos.map((item) => (
            <div key={item.nome} className="item-novo">
              <img src={item.img} alt="" />
              <p>Você ganhou: <strong>{item.nome}</strong></p>
            </div>
          ))}
          <button className="primario grande" onClick={() => navegar('/crianca')}><Icone nome="voltar" /> Voltar aos jogos</button>
        </section>
      )}

      {confirmarSaida && (
        <div className="fundo-dialogo">
          <div className="dialogo" role="dialog" aria-modal="true" aria-labelledby="titulo-sair">
            {tema && <img src={tema.personagem} alt="" width="88" height="88" />}
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
