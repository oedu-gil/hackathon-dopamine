import { useState } from 'react'
import { analisar } from '../analise.js'
import { apagarAluno, tentativasDoAluno } from '../desempenho.js'
import { JOGOS } from '../data/jogos.js'

const pct = (x) => (x == null ? '–' : `${Math.round(x * 100)}%`)

function Barra({ acertos, erros }) {
  const total = acertos + erros
  if (!total) return null
  return (
    <div className="barra" title={`${acertos} acertos, ${erros} erros`}>
      <span className="ok" style={{ width: `${(acertos / total) * 100}%` }} />
      <span className="erro" style={{ width: `${(erros / total) * 100}%` }} />
    </div>
  )
}

function baixarCsv(aluno, tentativas) {
  const nomeJogo = (id) => JOGOS.find((j) => j.id === id)?.nome ?? id
  const linhas = [
    'data_hora,jogo,nivel,hiperfoco,resultado',
    ...tentativas.map(
      (t) =>
        `${new Date(t.t).toISOString()},${nomeJogo(t.jogo)},${t.nivel},${t.hiperfoco},${t.ok ? 'acerto' : 'erro'}`,
    ),
  ]
  const url = URL.createObjectURL(new Blob([linhas.join('\n')], { type: 'text/csv;charset=utf-8' }))
  const a = document.createElement('a')
  a.href = url
  a.download = `desempenho-${aluno}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

export default function Desempenho({ aluno, pdi, voltar }) {
  const [tentativas, setTentativas] = useState(() => tentativasDoAluno(aluno))
  const analise = analisar(tentativas, pdi.itens, JOGOS)

  function apagar() {
    if (!window.confirm(`Apagar todo o desempenho registrado de ${aluno}?`)) return
    apagarAluno(aluno)
    setTentativas([])
  }

  return (
    <section className="tela">
      <h2>📊 Desempenho de {aluno}</h2>
      <p className="aviso">
        Estimativa orientativa, baseada só no que a criança fez nos jogos. Ela não substitui a
        avaliação do educador.
      </p>

      {tentativas.length === 0 ? (
        <p>Ainda não há tentativas registradas. Peça para a criança jogar e volte aqui.</p>
      ) : (
        <>
          <div className="resumo">
            <div><strong>{analise.geral.tentativas}</strong>tentativas</div>
            <div><strong>{analise.geral.acertos}</strong>acertos</div>
            <div><strong>{analise.geral.erros}</strong>erros</div>
            <div><strong>{pct(analise.geral.taxa)}</strong>de acerto</div>
          </div>

          <h3>Por habilidade do PDI</h3>
          <ul className="lista">
            {analise.habilidades.map((h) => (
              <li key={h.habilidade} className="cartao-coluna">
                <div className="linha-topo">
                  <strong>
                    {h.nome} <small>(nível {h.nivelPdi} no PDI)</small>
                  </strong>
                  <span className={`selo-estado ${h.estado}`}>{h.rotulo}</span>
                </div>
                {h.tentativas > 0 && <Barra acertos={h.acertos} erros={h.erros} />}
                <small>
                  {h.acertos} acertos · {h.erros} erros · {pct(h.taxa)} de acerto
                  {h.inicial != null && ` · início ${pct(h.inicial)} → recente ${pct(h.recente)}`}
                </small>
                <small>{h.texto}</small>
              </li>
            ))}
          </ul>

          <h3>Por jogo</h3>
          <ul className="lista">
            {analise.jogos.map((j) => (
              <li key={j.id} className="cartao-coluna">
                <strong>
                  {j.emoji} {j.nome}
                </strong>
                <Barra acertos={j.acertos} erros={j.erros} />
                <small>
                  {j.tentativas} tentativas · {j.acertos} acertos · {j.erros} erros · {pct(j.taxa)} de acerto
                </small>
              </li>
            ))}
          </ul>
        </>
      )}

      <div className="acoes">
        <button onClick={voltar}>Voltar</button>
        {tentativas.length > 0 && (
          <>
            <button className="secundario" onClick={() => baixarCsv(aluno, tentativas)}>
              Baixar CSV
            </button>
            <button className="secundario" onClick={apagar}>
              Apagar dados
            </button>
          </>
        )}
      </div>
    </section>
  )
}
