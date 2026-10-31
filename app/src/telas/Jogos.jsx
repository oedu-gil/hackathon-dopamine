import { useMemo } from 'react'
import { JOGOS } from '../data/jogos.js'
import { recomendar } from '../recomendacao.js'
import { estado } from '../progresso.js'

const VELOCIDADES = [
  { valor: 0.7, nome: 'Lenta' },
  { valor: 1, nome: 'Normal' },
  { valor: 1.4, nome: 'Rápida' },
]

export default function Jogos({
  pdi,
  hiperfoco,
  opcoes,
  setOpcoes,
  jogar,
  verColecao,
  verDesempenho,
  trocar,
}) {
  const recomendados = useMemo(() => recomendar(pdi.itens, JOGOS), [pdi])
  const e = estado(hiperfoco)

  return (
    <section className="tela">
      <h2>
        {hiperfoco.emoji} Jogos para {pdi.nome || 'a criança'}
      </h2>
      <p>
        Hiperfoco: <strong>{hiperfoco.nome}</strong> · {e.total} acertos ·{' '}
        {e.desbloqueados.length}/{hiperfoco.itens.length} itens
      </p>

      <div className="opcoes">
        <label>
          Velocidade{' '}
          <select
            value={opcoes.velocidade}
            onChange={(ev) => setOpcoes({ ...opcoes, velocidade: Number(ev.target.value) })}
          >
            {VELOCIDADES.map((v) => (
              <option key={v.valor} value={v.valor}>
                {v.nome}
              </option>
            ))}
          </select>
        </label>
        <label>
          <input
            type="checkbox"
            checked={!opcoes.efeitos}
            onChange={(ev) => setOpcoes({ ...opcoes, efeitos: !ev.target.checked })}
          />{' '}
          Reduzir efeitos
        </label>
      </div>

      <ul className="lista">
        {recomendados.map((r, i) => (
          <li key={r.jogo.id} className="cartao">
            <div>
              <h3>
                {r.jogo.emoji} {r.jogo.nome} {i === 0 && <span className="selo">Mais indicado</span>}
              </h3>
              <p>{r.jogo.descricao}</p>
              <small>
                Ritmo {r.jogo.ritmo} · Trabalha: {r.motivo}
              </small>
            </div>
            <button onClick={() => jogar(r)}>Jogar</button>
          </li>
        ))}
      </ul>

      <div className="acoes">
        <button className="secundario" onClick={verColecao}>
          Minha coleção
        </button>
        <button className="secundario" onClick={verDesempenho}>
          📊 Desempenho (educador)
        </button>
        <button className="secundario" onClick={trocar}>
          Trocar hiperfoco
        </button>
      </div>
    </section>
  )
}
