import { useEffect, useState } from 'react'
import { api } from '../api.js'
import { itensGanhos, temaPorId } from '../temas.js'
import AvatarAluno from './AvatarAluno.jsx'
import Cabecalho from './Cabecalho.jsx'
import { PainelDesempenho } from './Desempenho.jsx'
import Icone, { ICONE_HABILIDADE, ICONE_JOGO } from './Icones.jsx'

const CORES = ['verde', 'rubi', 'pessego']

// Um tópico do resumo: pontos para observar, atividades gerais e links curados.
// Tudo vem pronto de pdi/src/processarPdi.js; aqui só mostramos (nada de sugerir ações).
function Topico({ item, nome, cor }) {
  return (
    <li className={`topico-pais cor-${cor}`}>
      <div className="topico-pais-titulo">
        <span className="topico-icone"><Icone nome={ICONE_HABILIDADE[item.habilidade] ?? 'ia'} tamanho={28} /></span>
        <h3>{nome}</h3>
      </div>
      {item.atencao && (
        <div className="topico-parte">
          <h4><Icone nome="lupa" tamanho={18} /> Para observar</h4>
          <p>{item.atencao}</p>
        </div>
      )}
      {item.atividades?.length > 0 && (
        <div className="topico-parte">
          <h4><Icone nome="folha" tamanho={18} /> Atividades de estímulo</h4>
          <ul>{item.atividades.map((a) => <li key={a}>{a}</li>)}</ul>
        </div>
      )}
      {item.recursos?.length > 0 && (
        <div className="topico-parte">
          <h4><Icone nome="link" tamanho={18} /> Para pesquisar</h4>
          <ul className="links">
            {item.recursos.map((r) => (
              <li key={r.url}><a href={r.url} target="_blank" rel="noopener noreferrer">{r.nome}</a></li>
            ))}
          </ul>
        </div>
      )}
    </li>
  )
}

export default function Pais({ usuario, sair }) {
  const [dados, setDados] = useState(null)
  const [desempenho, setDesempenho] = useState(null)
  const [erro, setErro] = useState('')

  useEffect(() => {
    Promise.all([api(`/alunos/${usuario.aluno_id}`), api(`/alunos/${usuario.aluno_id}/desempenho`)])
      .then(([d, des]) => {
        setDados(d)
        setDesempenho(des)
      })
      .catch((e) => setErro(e.message))
  }, [usuario.aluno_id])

  const nome = dados?.aluno.nome ?? 'a criança'
  const resumo = dados?.resumo
  const tema = temaPorId(dados?.aluno.hiperfoco)
  const porHabilidade = resumo?.porHabilidade ?? []

  return (
    <div className="adulto">
      <Cabecalho usuario={usuario} sair={sair} titulo="Família" />
      <main className="conteudo">
        {erro && <p className="erro" role="alert">{erro}</p>}

        {dados && (
          <section className="aluno-topo">
            <AvatarAluno aluno={dados.aluno} tema={tema} />
            <div>
              <h1>Plano de {nome}</h1>
              <p className="ajuda">{tema ? `Tema favorito: ${tema.nome}` : `${nome} ainda não escolheu o tema favorito`}</p>
            </div>
            <ul className="fichas">
              <li><Icone nome="estrela" tamanho={20} /><strong>{dados.xp}</strong> XP</li>
              <li><Icone nome="trofeu" tamanho={20} /><strong>{itensGanhos(tema, dados.xp)}</strong> itens</li>
              <li><Icone nome="jogar" tamanho={20} /><strong>{dados.jogos.length}</strong> jogos</li>
            </ul>
          </section>
        )}

        <section className="bloco">
          <div className="bloco-titulo">
            <h2>O que a escola identificou</h2>
            <span className="nota-ia"><Icone nome="info" tamanho={18} /> Não é diagnóstico</span>
          </div>
          {resumo?.topicos?.length ? (
            <>
              <p>A escola identificou no PDI estes tópicos para trabalhar com {nome}. Pesquise sobre eles e converse com a escola e com os profissionais que acompanham {nome}.</p>
              {porHabilidade.length ? (
                <ul className="grade-topicos-pais">
                  {porHabilidade.map((item, i) => (
                    <Topico key={item.habilidade} item={item} nome={resumo.topicos[i] ?? item.habilidade} cor={CORES[i % CORES.length]} />
                  ))}
                </ul>
              ) : (
                <ul className="etiquetas">{resumo.topicos.map((t) => <li key={t}>{t}</li>)}</ul>
              )}
              {resumo.tempoRevisao && (
                <p className="aviso-calmo"><Icone nome="calendario" /> {resumo.tempoRevisao}</p>
              )}
              {resumo.aviso && <p className="ajuda">{resumo.aviso}</p>}
            </>
          ) : (
            <p className="vazio">A escola ainda não enviou o PDI.</p>
          )}
        </section>

        <section className="bloco">
          <h2>Jogos aprovados pela escola</h2>
          {dados?.jogos.length ? (
            <ul className="lista-jogos">
              {dados.jogos.map((j, i) => (
                <li key={j.id}>
                  <span className={`lista-jogos-icone cor-${CORES[i % CORES.length]}`}><Icone nome={ICONE_JOGO[j.id] ?? 'memoria'} tamanho={28} /></span>
                  <div>
                    <strong>{j.nome}</strong>
                    <p className="ajuda">{j.descricao}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="vazio">Nenhum jogo aprovado ainda.</p>
          )}
          <p className="ajuda">Incentive {nome} a jogar um pouco por dia, sem pressa.</p>
        </section>

        <section className="bloco">
          <h2>Como {nome} está indo</h2>
          {desempenho && <PainelDesempenho desempenho={desempenho} />}
        </section>
      </main>
    </div>
  )
}
