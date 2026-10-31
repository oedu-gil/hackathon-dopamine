import { HABILIDADES, NIVEIS } from '../data/habilidades.js'

const EXEMPLO = [
  { habilidade: 'reconhecer-emocoes', nivel: 1 },
  { habilidade: 'resposta-social', nivel: 2 },
  { habilidade: 'causa-efeito-social', nivel: 1 },
]

export default function Pdi({ pdi, setPdi, avancar }) {
  const itemDe = (id) => pdi.itens.find((i) => i.habilidade === id)

  function alternar(id) {
    const itens = itemDe(id)
      ? pdi.itens.filter((i) => i.habilidade !== id)
      : [...pdi.itens, { habilidade: id, nivel: 1 }]
    setPdi({ ...pdi, itens })
  }

  function mudarNivel(id, nivel) {
    setPdi({
      ...pdi,
      itens: pdi.itens.map((i) => (i.habilidade === id ? { ...i, nivel: Number(nivel) } : i)),
    })
  }

  return (
    <section className="tela">
      <h2>PDI da criança</h2>
      <p>Marque as habilidades a desenvolver e o nível atual da criança em cada uma.</p>
      <label className="campo">
        Nome da criança (opcional)
        <input value={pdi.nome} onChange={(e) => setPdi({ ...pdi, nome: e.target.value })} />
      </label>

      <ul className="lista">
        {HABILIDADES.map((h) => {
          const item = itemDe(h.id)
          return (
            <li key={h.id} className="linha">
              <label>
                <input type="checkbox" checked={!!item} onChange={() => alternar(h.id)} /> {h.nome}
              </label>
              {item && (
                <select value={item.nivel} onChange={(e) => mudarNivel(h.id, e.target.value)}>
                  {NIVEIS.map((n) => (
                    <option key={n.valor} value={n.valor}>
                      Nível {n.valor} – {n.nome}
                    </option>
                  ))}
                </select>
              )}
            </li>
          )
        })}
      </ul>

      <div className="acoes">
        <button className="secundario" onClick={() => setPdi({ ...pdi, itens: EXEMPLO })}>
          Preencher exemplo
        </button>
        <button disabled={pdi.itens.length === 0} onClick={avancar}>
          Continuar
        </button>
      </div>
    </section>
  )
}
