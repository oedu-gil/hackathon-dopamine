import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { abrirJogo, jogoDoHub, opcoesDosJogos, temaDoHub } from '../jogos/integracao.js'
import Icone from './Icones.jsx'

// Demonstração na área pública/adulta. Não usa dados, aprovação ou XP de um aluno.
export default function DemoTortas() {
  const navegar = useNavigate()
  const palco = useRef(null)
  const [iniciado, setIniciado] = useState(false)
  const [erro, setErro] = useState(false)
  const [confirmar, setConfirmar] = useState(false)
  const opcoes = useMemo(opcoesDosJogos, [])
  const jogo = jogoDoHub('guerra-tortas')

  useEffect(() => {
    if (!iniciado) return
    let cancelado = false
    let desmontar
    abrirJogo(palco.current, {
      jogo, tema: temaDoHub('trem'), nivel: 1, opcoes,
      aoTerminar: () => {},
      aoSair: () => navegar('/'),
    }).then(d => { if (cancelado) d(); else desmontar = d })
      .catch(() => { if (!cancelado) setErro(true) })
    return () => { cancelado = true; desmontar?.() }
  }, [iniciado, jogo, opcoes, navegar])

  return (
    <main className={iniciado ? 'crianca crianca-jogo' : 'crianca'}>
      <header className="crianca-barra">
        <button className="botao-crianca" onClick={() => iniciado ? setConfirmar(true) : navegar('/')}>
          <Icone nome="voltar" /> Voltar ao site
        </button>
        <strong className="crianca-barra-titulo">Guerra de tortas · Demonstração</strong>
      </header>
      {!iniciado && (
        <section className="crianca-secao cartao-centro">
          <img src={jogo.icone} alt="" width="112" height="112" />
          <h1 className="crianca-titulo">Experimentem a Guerra de Tortas!</h1>
          <p>Uma brincadeira em dupla: o adulto defende com a bandeja, e a criança lança as tortas.</p>
          <p className="ajuda">Demonstração para conhecer o jogo, sem registrar XP ou progresso de alunos.</p>
          <button className="primario grande" onClick={() => setIniciado(true)}><Icone nome="jogar" /> Começar demonstração</button>
        </section>
      )}
      {iniciado && !erro && <div className="palco-jogo" ref={palco} />}
      {erro && <section className="crianca-secao cartao-centro" role="alert"><p>Não conseguimos abrir o jogo. Atualize a página para tentar novamente.</p></section>}
      {confirmar && (
        <div className="fundo-dialogo"><div className="dialogo" role="dialog" aria-modal="true" aria-labelledby="sair-demo">
          <p id="sair-demo">Voltar ao site?</p>
          <div className="linha centro">
            <button className="primario" onClick={() => setConfirmar(false)} autoFocus>Continuar jogando</button>
            <button onClick={() => navegar('/')}>Voltar ao início</button>
          </div>
        </div></div>
      )}
    </main>
  )
}
