import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api } from '../api.js'
import { temaPorId } from '../temas.js'
import AvatarAluno from './AvatarAluno.jsx'
import Cabecalho from './Cabecalho.jsx'
import Icone from './Icones.jsx'

// Relatório simplificado: números de resumo e uma barra de taxa de acerto por jogo.
export function PainelDesempenho({ desempenho }) {
  if (!desempenho.totalPartidas) return <p className="vazio">Ainda não há partidas registradas.</p>
  const jogados = desempenho.porJogo.filter((j) => j.partidas > 0)
  const concluidas = jogados.reduce((s, j) => s + j.concluidas, 0)
  const comAcerto = jogados.filter((j) => j.taxaAcerto !== null)
  const acertoMedio = comAcerto.length ? Math.round(comAcerto.reduce((s, j) => s + j.taxaAcerto, 0) / comAcerto.length) : null
  const numeros = [
    { rotulo: 'Partidas', valor: desempenho.totalPartidas },
    { rotulo: 'Concluídas', valor: concluidas },
    { rotulo: 'XP', valor: desempenho.xp },
    { rotulo: 'Acerto médio', valor: acertoMedio === null ? '—' : `${acertoMedio}%` },
  ]
  return (
    <div className="painel">
      <dl className="numeros">
        {numeros.map((n) => (
          <div key={n.rotulo} className="numero">
            <dt>{n.rotulo}</dt>
            <dd>{n.valor}</dd>
          </div>
        ))}
      </dl>
      <h3>Taxa de acerto por jogo</h3>
      <ul className="barras">
        {jogados.map((j) => (
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
    </div>
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

  const tema = temaPorId(aluno?.hiperfoco)

  return (
    <div className="adulto">
      <Cabecalho usuario={usuario} sair={sair} titulo="Escola" />
      <main className="conteudo">
        <Link className="link-voltar" to="/escola"><Icone nome="voltar" tamanho={20} /> Voltar para a escola</Link>
        {erro && <p className="erro" role="alert">{erro}</p>}
        {aluno && (
          <section className="aluno-topo">
            <AvatarAluno aluno={aluno} tema={tema} />
            <div>
              <h1>Desempenho de {aluno.nome}</h1>
              <p className="ajuda">Resumo das partidas nos jogos aprovados.</p>
            </div>
          </section>
        )}
        {dados && (
          <section className="bloco">
            <h2>Visão geral</h2>
            <PainelDesempenho desempenho={dados} />
          </section>
        )}
      </main>
    </div>
  )
}
