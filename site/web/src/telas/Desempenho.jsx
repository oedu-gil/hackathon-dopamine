import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api } from '../api.js'
import Cabecalho from './Cabecalho.jsx'

// Relatório simplificado: uma barra de taxa de acerto por jogo.
export function TabelaDesempenho({ desempenho }) {
  if (!desempenho.totalPartidas) return <p className="ajuda">Ainda não há partidas registradas.</p>
  return (
    <table className="tabela">
      <thead>
        <tr><th>Jogo</th><th>Partidas</th><th>Concluídas</th><th>Dicas</th><th>Taxa de acerto</th></tr>
      </thead>
      <tbody>
        {desempenho.porJogo.filter((j) => j.partidas > 0).map((j) => (
          <tr key={j.jogoId}>
            <td>{j.nome}</td>
            <td>{j.partidas}</td>
            <td>{j.concluidas}</td>
            <td>{j.dicas}</td>
            <td>
              {j.taxaAcerto === null ? '—' : (
                <span className="barra" aria-label={`${j.taxaAcerto}%`}>
                  <span style={{ width: `${j.taxaAcerto}%` }} />
                  <em>{j.taxaAcerto}%</em>
                </span>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default function Desempenho({ usuario, sair }) {
  const { alunoId } = useParams()
  const [dados, setDados] = useState(null)
  const [aluno, setAluno] = useState(null)
  const [erro, setErro] = useState('')

  useEffect(() => {
    Promise.all([api(`/alunos/${alunoId}/desempenho`), api(`/alunos/${alunoId}`)])
      .then(([d, a]) => {
        setDados(d)
        setAluno(a.aluno)
      })
      .catch((e) => setErro(e.message))
  }, [alunoId])

  return (
    <div className="adulto">
      <Cabecalho usuario={usuario} sair={sair} titulo={`Desempenho${aluno ? ` de ${aluno.nome}` : ''}`} />
      <main className="conteudo">
        <Link to="/escola">← Voltar</Link>
        {erro && <p className="erro" role="alert">{erro}</p>}
        {dados && (
          <section className="cartao">
            <p>Partidas registradas: <strong>{dados.totalPartidas}</strong> · XP: <strong>{dados.xp}</strong></p>
            <TabelaDesempenho desempenho={dados} />
          </section>
        )}
      </main>
    </div>
  )
}
