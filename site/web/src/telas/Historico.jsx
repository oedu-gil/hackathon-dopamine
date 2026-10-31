import { useEffect, useState } from 'react'
import { api } from '../api.js'
import { resumirDesempenho } from '../../../server/src/regras.js'
import { TIPOS, chaveDoPeriodo, nomeCurto, nomeDoPeriodo, pdisDoPeriodo, periodosEntre, taxaDeAcerto } from '../periodos.js'
import Icone from './Icones.jsx'

const dataCurta = (d) => new Date(d).toLocaleDateString('pt-BR')

// Gráfico de colunas: taxa de acerto em cada período. Uma série só, então sem legenda;
// a coluna escolhida fica escura e as outras claras. Clicar numa coluna escolhe o período.
function Evolucao({ serie, tipo, escolhida, escolher }) {
  return (
    <figure className="evolucao">
      <figcaption>Taxa de acerto em cada {TIPOS.find((t) => t.id === tipo).nome.toLowerCase()}</figcaption>
      <div className="evolucao-area">
        <div className="evolucao-grade" aria-hidden="true">
          {[100, 50, 0].map((v) => <span key={v}>{v}%</span>)}
        </div>
        <ol className="evolucao-colunas">
          {serie.map((p) => (
            <li key={p.chave}>
              <button
                type="button"
                className={`coluna ${p.chave === escolhida ? 'escolhida' : ''}`}
                onClick={() => escolher(p.chave)}
                aria-pressed={p.chave === escolhida}
                aria-label={`${nomeDoPeriodo(p.chave, tipo)}: ${p.taxa === null ? 'sem partidas' : `${p.taxa}% de acerto em ${p.partidas} partidas`}`}
              >
                <span className="coluna-barra" style={{ height: `${p.taxa ?? 0}%` }} />
                <span className="coluna-dica" aria-hidden="true">
                  <strong>{p.taxa === null ? '—' : `${p.taxa}%`}</strong> {p.partidas} {p.partidas === 1 ? 'partida' : 'partidas'}
                </span>
                {p.chave === escolhida && p.taxa !== null && <span className="coluna-valor" style={{ bottom: `${p.taxa}%` }}>{p.taxa}%</span>}
              </button>
              <span className="coluna-rotulo">{nomeCurto(p.chave, tipo)}</span>
            </li>
          ))}
        </ol>
      </div>
      <details className="evolucao-tabela">
        <summary>Ver como tabela</summary>
        <table>
          <thead><tr><th>Período</th><th>Partidas</th><th>Acerto</th></tr></thead>
          <tbody>
            {serie.map((p) => (
              <tr key={p.chave}><td>{nomeDoPeriodo(p.chave, tipo)}</td><td>{p.partidas}</td><td>{p.taxa === null ? '—' : `${p.taxa}%`}</td></tr>
            ))}
          </tbody>
        </table>
      </details>
    </figure>
  )
}

// Histórico do aluno por bimestre, semestre ou ano: PDIs que valeram no período,
// números de resumo, evolução da taxa de acerto e desempenho por jogo.
export default function Historico({ alunoId, nome }) {
  const [dados, setDados] = useState(null)
  const [tipo, setTipo] = useState('bimestre')
  const [chave, setChave] = useState(null)
  const [erro, setErro] = useState('')

  useEffect(() => {
    setDados(null)
    setChave(null)
    api(`/alunos/${alunoId}/historico`).then(setDados).catch((e) => setErro(e.message))
  }, [alunoId])

  if (erro) return <p className="erro" role="alert">{erro}</p>
  if (!dados) return <p className="vazio">Carregando o histórico…</p>

  const { jogos, pdis, resultados } = dados
  const periodos = periodosEntre([...resultados, ...pdis].map((r) => r.criado_em), tipo)
  if (!periodos.length) return <p className="vazio">Ainda não há PDIs nem partidas registradas.</p>

  const escolhida = periodos.includes(chave) ? chave : periodos.at(-1)
  const doPeriodo = (k) => resultados.filter((r) => chaveDoPeriodo(r.criado_em, tipo) === k)
  const serie = periodos.map((k) => ({ chave: k, partidas: doPeriodo(k).length, taxa: taxaDeAcerto(doPeriodo(k)) }))
  const indice = periodos.indexOf(escolhida)
  const atual = serie[indice]
  const anterior = serie.slice(0, indice).reverse().find((p) => p.taxa !== null)
  const variacao = atual.taxa !== null && anterior ? atual.taxa - anterior.taxa : null
  const partidas = doPeriodo(escolhida)
  const porJogo = resumirDesempenho(partidas, jogos).filter((j) => j.partidas > 0)
  const vigentes = pdisDoPeriodo(pdis, escolhida, tipo)

  function trocarTipo(novo) {
    setTipo(novo)
    setChave(null)
  }

  return (
    <div className="historico">
      <div className="filtros">
        <div className="segmentado" role="group" aria-label="Agrupar por">
          {TIPOS.map((t) => (
            <button key={t.id} type="button" aria-pressed={tipo === t.id} onClick={() => trocarTipo(t.id)}>{t.nome}</button>
          ))}
        </div>
        <label className="filtro-periodo">
          <span>Período</span>
          <select value={escolhida} onChange={(e) => setChave(e.target.value)}>
            {[...periodos].reverse().map((k) => <option key={k} value={k}>{nomeDoPeriodo(k, tipo)}</option>)}
          </select>
        </label>
      </div>

      <dl className="numeros">
        <div className="numero">
          <dt>Partidas</dt>
          <dd>{partidas.length}</dd>
        </div>
        <div className="numero">
          <dt>Concluídas</dt>
          <dd>{partidas.filter((r) => r.status === 'completed').length}</dd>
        </div>
        <div className="numero">
          <dt>Acerto</dt>
          <dd>{atual.taxa === null ? '—' : `${atual.taxa}%`}</dd>
        </div>
        <div className="numero">
          <dt>Comparado ao anterior</dt>
          <dd className="numero-variacao">
            {variacao === null ? '—' : (
              <><Icone nome={variacao >= 0 ? 'subir' : 'descer'} tamanho={26} /> {variacao > 0 ? '+' : ''}{variacao} pts</>
            )}
          </dd>
          {anterior && variacao !== null && <p className="ajuda">em relação a {nomeCurto(anterior.chave, tipo)}</p>}
        </div>
      </dl>

      <Evolucao serie={serie} tipo={tipo} escolhida={escolhida} escolher={setChave} />

      <div className="historico-colunas">
        <section>
          <h3>PDI no período</h3>
          {vigentes.length ? (
            <ul className="linha-pdis">
              {vigentes.map((p) => (
                <li key={p.id}>
                  <span className="linha-pdis-data"><Icone nome="documento" tamanho={20} /> Enviado em {dataCurta(p.criado_em)}</span>
                  <ul className="etiquetas">{p.topicos.map((t) => <li key={t} className="do-pdi">{t}</li>)}</ul>
                </li>
              ))}
            </ul>
          ) : (
            <p className="vazio">Nenhum PDI valia neste período.</p>
          )}
        </section>

        <section>
          <h3>Acerto por jogo</h3>
          {porJogo.length ? (
            <ul className="barras">
              {porJogo.map((j) => (
                <li key={j.jogoId}>
                  <div className="barras-topo">
                    <strong>{j.nome}</strong>
                    <span>{j.taxaAcerto === null ? '—' : `${j.taxaAcerto}%`}</span>
                  </div>
                  <div className="barra" aria-hidden="true"><span style={{ width: `${j.taxaAcerto ?? 0}%` }} /></div>
                  <p className="ajuda">
                    {j.partidas} {j.partidas === 1 ? 'partida' : 'partidas'} · {j.concluidas} {j.concluidas === 1 ? 'concluída' : 'concluídas'} · {j.dicas} {j.dicas === 1 ? 'dica' : 'dicas'}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="vazio">{nome} não jogou neste período.</p>
          )}
        </section>
      </div>
    </div>
  )
}
