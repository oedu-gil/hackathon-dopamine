import { useCallback, useEffect, useState } from 'react'
import { NavLink, Navigate, Route, Routes } from 'react-router-dom'
import { api } from '../api.js'
import { temaPorId } from '../temas.js'
import AvatarAluno from './AvatarAluno.jsx'
import Cabecalho from './Cabecalho.jsx'
import Historico from './Historico.jsx'
import Icone, { ICONE_HABILIDADE, ICONE_JOGO } from './Icones.jsx'

const ERROS_PDI = {
  'pdf-sem-texto': 'Não encontramos texto neste PDF. Por enquanto só aceitamos PDF digital (não escaneado).',
  'falha-llm': 'A leitura automática falhou. Tente enviar de novo em instantes.',
  'nenhuma-habilidade-reconhecida': 'A IA não encontrou tópicos que temos jogos para trabalhar.',
}

const STATUS = { sugerido: 'Aguardando decisão', aprovado: 'Aprovado', recusado: 'Recusado' }
const CORES = ['verde', 'rubi', 'pessego']

function Passos({ feitos }) {
  const passos = ['Enviar o PDI', 'Tópicos de lacunas', 'Aprovar os jogos']
  return (
    <ol className="passos">
      {passos.map((p, i) => (
        <li key={p} className={feitos[i] ? 'feito' : feitos[i - 1] || i === 0 ? 'atual' : ''}>
          <span className="passo-marca">{feitos[i] ? <Icone nome="ok" tamanho={18} /> : i + 1}</span>
          {p}
        </li>
      ))}
    </ol>
  )
}

const ABAS = [
  { para: '/escola', icone: 'envio', rotulo: 'Novo PDI', frase: 'Enviar e aprovar jogos' },
  { para: '/escola/historico', icone: 'historico', rotulo: 'Histórico e desempenho', frase: 'Evolução por período' },
]

// Área da escola: menu à esquerda (novo PDI ou histórico) e o aluno escolhido vale para as duas abas.
export default function Escola({ usuario, sair }) {
  const [alunos, setAlunos] = useState([])
  const [alunoId, setAlunoId] = useState('')
  const [dados, setDados] = useState(null)
  const [erro, setErro] = useState('')

  useEffect(() => {
    api('/alunos')
      .then((a) => {
        setAlunos(a)
        if (a[0]) setAlunoId(a[0].id)
      })
      .catch((e) => setErro(e.message))
  }, [])

  const carregar = useCallback(() => {
    if (!alunoId) return
    api(`/alunos/${alunoId}`).then(setDados).catch((e) => setErro(e.message))
  }, [alunoId])

  useEffect(carregar, [carregar])

  const tema = temaPorId(dados?.aluno.hiperfoco)
  const pendentes = (dados?.jogos ?? []).filter((j) => j.status === 'sugerido').length

  return (
    <div className="adulto">
      <Cabecalho usuario={usuario} sair={sair} titulo="Escola" />
      <div className="com-menu">
        <nav className="menu-lateral" aria-label="Área da escola">
          <label className="menu-aluno">
            <span>Aluno</span>
            <select value={alunoId} onChange={(e) => setAlunoId(e.target.value)}>
              {alunos.map((a) => <option key={a.id} value={a.id}>{a.nome}</option>)}
            </select>
          </label>
          <ul>
            {ABAS.map((a) => (
              <li key={a.para}>
                <NavLink to={a.para} end className="menu-item">
                  <span className="menu-icone"><Icone nome={a.icone} tamanho={22} /></span>
                  <span className="menu-texto">
                    <strong>{a.rotulo}</strong>
                    <span>{a.frase}</span>
                  </span>
                  {a.para === '/escola' && pendentes > 0 && <span className="menu-contador" aria-label={`${pendentes} jogos aguardam decisão`}>{pendentes}</span>}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <main className="conteudo">
          {erro && <p className="erro" role="alert">{erro}</p>}
          {dados && (
            <section className="aluno-topo">
              <AvatarAluno aluno={dados.aluno} tema={tema} />
              <div>
                <h1>{dados.aluno.nome}</h1>
                <p className="ajuda">{tema ? `Hiperfoco: ${tema.nome}` : 'Ainda não escolheu o tema de hiperfoco'}</p>
              </div>
            </section>
          )}
          <Routes>
            <Route index element={dados && <NovoPdi alunoId={alunoId} dados={dados} recarregar={carregar} />} />
            <Route
              path="historico"
              element={alunoId && (
                <section className="bloco">
                  <h2>Histórico e desempenho</h2>
                  <p>Escolha o período para ver os tópicos do PDI que valiam e como {dados?.aluno.nome ?? 'o aluno'} foi nos jogos.</p>
                  <Historico alunoId={alunoId} nome={dados?.aluno.nome ?? 'O aluno'} />
                </section>
              )}
            />
            <Route path="*" element={<Navigate to="/escola" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

// Aba "Novo PDI": enviar o PDF, ver os tópicos que a IA separou e aprovar os jogos sugeridos.
function NovoPdi({ alunoId, dados, recarregar }) {
  const [habilidades, setHabilidades] = useState([])
  const [arquivo, setArquivo] = useState(null)
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState('')

  useEffect(() => {
    api('/habilidades').then(setHabilidades).catch((e) => setErro(e.message))
  }, [])

  async function enviarPdi(ev) {
    ev.preventDefault()
    if (!arquivo) return
    setErro('')
    setEnviando(true)
    try {
      await api(`/alunos/${alunoId}/pdi`, { metodo: 'POST', arquivo })
      setArquivo(null)
      ev.target.reset()
      recarregar()
    } catch (e) {
      setErro(e.message)
    } finally {
      setEnviando(false)
    }
  }

  async function decidir(jogoId, status) {
    try {
      await api(`/alunos/${alunoId}/jogos/${jogoId}`, { metodo: 'PATCH', corpo: { status } })
      recarregar()
    } catch (e) {
      setErro(e.message)
    }
  }

  const nome = (id) => habilidades.find((h) => h.id === id)?.nome ?? id
  const pdi = dados?.pdi
  const jogos = dados?.jogos ?? []
  const pendentes = jogos.filter((j) => j.status === 'sugerido')
  const dopdi = new Set((pdi?.itens ?? []).map((i) => i.habilidade))
  const atencao = Object.fromEntries((pdi?.resumo_pais?.porHabilidade ?? []).map((h) => [h.habilidade, h.atencao]))
  const feitos = [Boolean(pdi && !pdi.erro), Boolean(pdi?.itens.length), jogos.length > 0 && pendentes.length === 0]

  return (
    <>
      <Passos feitos={feitos} />

      {erro && <p className="erro" role="alert">{erro}</p>}

      {pendentes.length > 0 && (
        <p className="aviso-acao">
          <Icone nome="info" tamanho={20} /> {pendentes.length} {pendentes.length === 1 ? 'jogo aguarda' : 'jogos aguardam'} sua decisão.
        </p>
      )}

      <section className="bloco">
        <h2>Enviar o PDI</h2>
        <form className="envio" onSubmit={enviarPdi}>
          <label className={`soltar ${arquivo ? 'com-arquivo' : ''}`}>
            <span className="soltar-icone"><Icone nome={arquivo ? 'documento' : 'envio'} tamanho={32} /></span>
            <strong>{arquivo ? arquivo.name : 'Escolha o PDF do PDI'}</strong>
            <span className="ajuda">PDF digital do Plano de Desenvolvimento Individual. A IA lê e separa os tópicos de lacunas.</span>
            <input type="file" accept="application/pdf" onChange={(e) => setArquivo(e.target.files[0] ?? null)} />
          </label>
          <button className="primario" disabled={!arquivo || enviando}>{enviando ? 'Lendo o PDI…' : 'Enviar PDI'}</button>
        </form>
        {pdi && (
          <p className="ajuda">
            Último envio: <strong>{pdi.arquivo}</strong> em {new Date(pdi.criado_em).toLocaleString('pt-BR')}
          </p>
        )}
        {pdi?.erro && <p className="erro">{ERROS_PDI[pdi.erro] ?? 'Não foi possível ler o PDI.'}</p>}
      </section>

      <section className="bloco">
        <h2>Tópicos de lacunas</h2>
        {pdi?.itens.length ? (
          <ul className="grade-topicos">
            {pdi.itens.map((i, n) => (
              <li key={i.habilidade} className={`topico cor-${CORES[n % CORES.length]}`}>
                <span className="topico-icone"><Icone nome={ICONE_HABILIDADE[i.habilidade] ?? 'ia'} tamanho={28} /></span>
                <strong>{nome(i.habilidade)}</strong>
                {atencao[i.habilidade] && <p>{atencao[i.habilidade]}</p>}
              </li>
            ))}
          </ul>
        ) : (
          <p className="vazio">Nenhum tópico ainda. Envie o PDI acima.</p>
        )}
      </section>

      <section className="bloco">
        <div className="bloco-titulo">
          <h2>Jogos sugeridos</h2>
          <span className="nota-ia"><Icone nome="ia" tamanho={18} /> A IA só sugere. Quem decide é a escola.</span>
        </div>
        {jogos.length ? (
          <ul className="grade-cartoes-jogo">
            {jogos.map((j, n) => (
              <li key={j.id} className={`cartao-sugestao status-${j.status}`}>
                <div className={`sugestao-capa cor-${CORES[n % CORES.length]}`}>
                  <Icone nome={ICONE_JOGO[j.id] ?? 'memoria'} tamanho={44} />
                  <span className="selo">{STATUS[j.status]}</span>
                </div>
                <div className="sugestao-corpo">
                  <strong>{j.nome}</strong>
                  <p className="ajuda">{j.descricao}</p>
                  <ul className="etiquetas">
                    {j.habilidades.map((h) => (
                      <li key={h} className={dopdi.has(h) ? 'do-pdi' : ''} title={dopdi.has(h) ? 'Tópico identificado no PDI' : undefined}>
                        {dopdi.has(h) && <Icone nome="ok" tamanho={14} />} {nome(h)}
                      </li>
                    ))}
                  </ul>
                  <div className="linha">
                    <button className="primario" disabled={j.status === 'aprovado'} onClick={() => decidir(j.id, 'aprovado')}>
                      <Icone nome="ok" tamanho={18} /> Aprovar
                    </button>
                    <button disabled={j.status === 'recusado'} onClick={() => decidir(j.id, 'recusado')}>
                      <Icone nome="nao" tamanho={18} /> Recusar
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="vazio">As sugestões aparecem depois que o PDI for lido.</p>
        )}
      </section>
    </>
  )
}
