import { HIPERFOCOS } from '../data/hiperfocos.js'

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
            <span className="emoji-grande">{h.emoji}</span>
            {h.nome}
          </button>
        ))}
      </div>
    </section>
  )
}
