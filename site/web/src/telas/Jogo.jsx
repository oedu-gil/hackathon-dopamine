import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../api.js'
import { estiloTema, itensGanhos, temaPorId } from '../temas.js'
import { montarAtividade, paraServidor } from '../jogos/integracao.js'
import Icone from './Icones.jsx'

// Placeholder: enquanto os jogos não estão integrados, simula uma partida
// e envia um resultado no mesmo formato que os jogos vão enviar.
// Etapas: aviso antes do jogo (DESIGN.md, regra 3) → jogo → comemoração.
export default function Jogo({ usuario }) {
  const { jogoId } = useParams()
  const navegar = useNavigate()
  const [dados, setDados] = useState(null)
  const [etapa, setEtapa] = useState('antes')
  const [confirmarSaida, setConfirmarSaida] = useState(false)
  const [xpNovo, setXpNovo] = useState(null)
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
    if (xp !== null) {
      setXpNovo(xp)
      setEtapa('fim')
    }
  }

  async function sair() {
    if (etapa === 'jogando') await enviar({ status: 'abandoned', attempts: 0, correct: 0, hints: 0 })
    navegar('/crianca')
  }

  if (dados && !jogo) {
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
    <div className="crianca" style={estiloTema(tema)}>
      <header className="crianca-barra">
        <button className="botao-crianca" onClick={() => (etapa === 'jogando' ? setConfirmarSaida(true) : sair())}>
          <Icone nome="sair" /> Sair
        </button>
      </header>

      {erro && <p className="erro crianca-erro" role="alert">{erro}</p>}

      {jogo && etapa === 'antes' && (
        <section className="crianca-secao cartao-centro">
          {tema && <img className="personagem-centro" src={tema.personagem} alt="" />}
          <h1 className="crianca-titulo">Vamos jogar {jogo.nome}!</h1>
          <p className="passo-texto"><Icone nome="info" /> {jogo.descricao}</p>
          <button className="primario grande" onClick={() => setEtapa('jogando')}><Icone nome="jogar" /> Começar</button>
        </section>
      )}

      {jogo && etapa === 'jogando' && (
        <section className="crianca-secao cartao-centro area-jogo">
          {tema && <img className="personagem-centro" src={tema.personagem} alt="" />}
          <h1 className="crianca-titulo">{jogo.nome}</h1>
          <p className="ajuda">O jogo de verdade vai aparecer aqui (atividade “{montarAtividade({ alunoId: usuario.aluno_id, jogo, tema }).gameId}”).</p>
          <button className="primario grande" onClick={terminar}>Terminar partida (simulação)</button>
        </section>
      )}

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
              <button onClick={sair}>Sair</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
