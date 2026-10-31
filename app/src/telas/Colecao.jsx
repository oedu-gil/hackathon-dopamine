import { LIMITES, estado } from '../progresso.js'
import Arte from './Arte'

export default function Colecao({ hiperfoco, voltar }) {
  const e = estado(hiperfoco)

  return (
    <section className="tela">
      <h2 className="titulo-com-arte">
        <Arte id={hiperfoco.arte} tamanho={44} /> Coleção de {hiperfoco.nome}
      </h2>
      <p>{e.total} acertos no total</p>
      <div className="grade">
        {hiperfoco.itens.map((item, i) => {
          const livre = e.total >= LIMITES[i]
          return (
            <div key={item.nome} className={livre ? 'item' : 'item bloqueado'}>
              {/* item ainda bloqueado aparece como uma silhueta, para dar vontade de abrir */}
              <Arte id={item.arte} tamanho={72} animar={livre} className={livre ? '' : 'silhueta'} />
              {livre ? item.nome : `Faltam ${LIMITES[i] - e.total} acertos`}
            </div>
          )
        })}
      </div>
      <div className="acoes">
        <button onClick={voltar}>Voltar</button>
      </div>
    </section>
  )
}
