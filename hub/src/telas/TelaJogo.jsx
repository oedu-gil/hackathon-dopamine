import { useEffect, useRef, useState } from 'react'
import Moldura from './Moldura.jsx'

// Monta o jogo pelo contrato (jogos/contrato.js) e desmonta ao sair.
export default function TelaJogo({ tema, jogo, opcoes, aoTerminar, voltar }) {
  const palco = useRef(null)
  const [confirmar, setConfirmar] = useState(false)
  const [erro, setErro] = useState(false)
  // o jogo guarda a função da primeira renderização; a ref sempre aponta para a atual
  const aoTerminarRef = useRef(aoTerminar)
  const voltarRef = useRef(voltar)
  useEffect(() => {
    aoTerminarRef.current = aoTerminar
    voltarRef.current = voltar
  })

  useEffect(() => {
    let desmontar = null
    let cancelado = false
    jogo
      .carregar()
      .then(({ montar }) => {
        if (cancelado) return
        desmontar = montar(palco.current, {
          tema,
          nivel: 1,
          opcoes,
          aoTerminar: (resultado) => aoTerminarRef.current(resultado),
          aoSair: () => voltarRef.current(),
        })
      })
      .catch(() => !cancelado && setErro(true))
    return () => {
      cancelado = true
      desmontar?.()
    }
  }, [jogo, tema, opcoes])

  return (
    <Moldura
      tema={tema}
      titulo={jogo.nome}
      className="moldura-jogo"
      botao={<button onClick={() => setConfirmar(true)}>Sair</button>}
    >
      <div className="palco" ref={palco} />
      {erro && (
        <section className="aviso sobre" role="alert">
          <p>Não conseguimos abrir o jogo.</p>
          <button className="principal" onClick={voltar}>
            Voltar
          </button>
        </section>
      )}
      {confirmar && (
        <div className="escurecer">
          <div className="dialogo" role="dialog" aria-modal="true" aria-labelledby="sair-texto">
            <p id="sair-texto">Quer sair do jogo?</p>
            <div className="acoes">
              <button className="principal" onClick={() => setConfirmar(false)} autoFocus>
                Continuar
              </button>
              <button onClick={voltar}>Sair</button>
            </div>
          </div>
        </div>
      )}
    </Moldura>
  )
}
