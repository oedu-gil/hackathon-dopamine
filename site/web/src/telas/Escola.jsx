import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api.js'
import Cabecalho from './Cabecalho.jsx'

const ERROS_PDI = {
  'pdf-sem-texto': 'Não encontramos texto neste PDF. Por enquanto só aceitamos PDF digital (não escaneado).',
  'falha-llm': 'A leitura automática falhou. Tente enviar de novo em instantes.',
  'nenhuma-habilidade-reconhecida': 'A IA não encontrou tópicos que temos jogos para trabalhar.',
}

const STATUS = { sugerido: 'Aguardando decisão', aprovado: 'Aprovado', recusado: 'Recusado' }

export default function Escola({ usuario, sair }) {
  const [alunos, setAlunos] = useState([])
  const [alunoId, setAlunoId] = useState('')
  const [dados, setDados] = useState(null)
  const [habilidades, setHabilidades] = useState([])
  const [arquivo, setArquivo] = useState(null)
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState('')

  useEffect(() => {
    Promise.all([api('/alunos'), api('/habilidades')])
      .then(([a, h]) => {
        setAlunos(a)
        setHabilidades(h)
        if (a[0]) setAlunoId(a[0].id)
      })
      .catch((e) => setErro(e.message))
  }, [])

  const carregar = useCallback(() => {
    if (!alunoId) return
    api(`/alunos/${alunoId}`).then(setDados).catch((e) => setErro(e.message))
  }, [alunoId])

  useEffect(carregar, [carregar])

  async function enviarPdi(ev) {
    ev.preventDefault()
    if (!arquivo) return
    setErro('')
    setEnviando(true)
    try {
      await api(`/alunos/${alunoId}/pdi`, { metodo: 'POST', arquivo })
      setArquivo(null)
      ev.target.reset()
      carregar()
    } catch (e) {
      setErro(e.message)
    } finally {
      setEnviando(false)
    }
  }

  async function decidir(jogoId, status) {
    try {
      await api(`/alunos/${alunoId}/jogos/${jogoId}`, { metodo: 'PATCH', corpo: { status } })
      carregar()
    } catch (e) {
      setErro(e.message)
    }
  }

  const nome = (id) => habilidades.find((h) => h.id === id)?.nome ?? id
  const pdi = dados?.pdi
  const pendentes = dados?.jogos.filter((j) => j.status === 'sugerido') ?? []

  return (
    <div className="adulto">
      <Cabecalho usuario={usuario} sair={sair} titulo="Área da escola" />
      <main className="conteudo">
        <div className="linha">
          <label>
            Aluno{' '}
            <select value={alunoId} onChange={(e) => setAlunoId(e.target.value)}>
              {alunos.map((a) => <option key={a.id} value={a.id}>{a.nome}</option>)}
            </select>
          </label>
          {alunoId && <Link className="botao" to={`/escola/desempenho/${alunoId}`}>Ver desempenho</Link>}
        </div>

        {erro && <p className="erro" role="alert">{erro}</p>}

        {pendentes.length > 0 && (
          <p className="aviso-acao">
            {pendentes.length} {pendentes.length === 1 ? 'jogo aguarda' : 'jogos aguardam'} sua decisão.
          </p>
        )}

        <section className="cartao">
          <h2>1. Enviar o PDI</h2>
          <p className="ajuda">PDF digital do Plano de Desenvolvimento Individual. A IA lê o documento e separa os tópicos de lacunas.</p>
          <form className="linha" onSubmit={enviarPdi}>
            <input type="file" accept="application/pdf" onChange={(e) => setArquivo(e.target.files[0] ?? null)} />
            <button className="primario" disabled={!arquivo || enviando}>{enviando ? 'Lendo o PDI…' : 'Enviar PDI'}</button>
          </form>
          {pdi && (
            <p className="ajuda">
              Último envio: <strong>{pdi.arquivo}</strong> em {new Date(pdi.criado_em).toLocaleString('pt-BR')}
            </p>
          )}
          {pdi?.erro && <p className="erro">{ERROS_PDI[pdi.erro] ?? 'Não foi possível ler o PDI.'}</p>}
        </section>

        <section className="cartao">
          <h2>2. Tópicos de lacunas</h2>
          {pdi?.itens.length ? (
            <ul className="etiquetas">
              {pdi.itens.map((i) => <li key={i.habilidade}>{nome(i.habilidade)}</li>)}
            </ul>
          ) : (
            <p className="ajuda">Nenhum tópico ainda. Envie o PDI acima.</p>
          )}
        </section>

        <section className="cartao">
          <h2>3. Jogos sugeridos</h2>
          <p className="ajuda">A IA só sugere. Quem decide quais jogos a criança vai jogar é a escola.</p>
          {dados?.jogos.length ? (
            <ul className="lista-jogos">
              {dados.jogos.map((j) => (
                <li key={j.id} className={`jogo-linha status-${j.status}`}>
                  <div>
                    <strong>{j.nome}</strong>
                    <p className="ajuda">{j.descricao} Trabalha: {j.habilidades.map(nome).join(', ')}.</p>
                  </div>
                  <span className="selo">{STATUS[j.status]}</span>
                  <div className="linha">
                    <button className="primario" disabled={j.status === 'aprovado'} onClick={() => decidir(j.id, 'aprovado')}>Aprovar</button>
                    <button disabled={j.status === 'recusado'} onClick={() => decidir(j.id, 'recusado')}>Recusar</button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="ajuda">As sugestões aparecem depois que o PDI for lido.</p>
          )}
        </section>
      </main>
    </div>
  )
}
