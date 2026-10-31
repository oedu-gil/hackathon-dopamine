import { HIPERFOCOS } from '../data/hiperfocos.js'
import Arte from './Arte'

export default function EscolhaHiperfoco({ nome, escolher }) {
  return (
    <section className="tela">
      <h2>{nome ? `${nome}, do que` : 'Do que'} você mais gosta?</h2>
      <div className="grade">
        {HIPERFOCOS.map((h) => (
          <button
            key={h.id}
            className="cartao-grande"
            style={{ background: h.cor }}
            onClick={() => escolher(h)}
          >
            <Arte id={h.arte} tamanho={96} className="balanca" />
            {h.nome}
          </button>
        ))}
      </div>
    </section>
  )
}
