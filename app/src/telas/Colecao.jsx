import { LIMITES, estado } from '../progresso.js'

export default function Colecao({ hiperfoco, voltar }) {
  const e = estado(hiperfoco)

  return (
    <section className="tela">
      <h2>
        {hiperfoco.emoji} Coleção de {hiperfoco.nome}
      </h2>
      <p>{e.total} acertos no total</p>
      <div className="grade">
        {hiperfoco.itens.map((item, i) => {
          const livre = e.total >= LIMITES[i]
          return (
            <div key={item.nome} className={livre ? 'item' : 'item bloqueado'}>
              <span className="emoji-grande">{livre ? item.emoji : '❓'}</span>
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
