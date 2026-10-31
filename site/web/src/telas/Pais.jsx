import { useEffect, useState } from 'react'
import { api } from '../api.js'
import Cabecalho from './Cabecalho.jsx'
import { TabelaDesempenho } from './Desempenho.jsx'

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

  return (
    <div className="adulto">
      <Cabecalho usuario={usuario} sair={sair} titulo="Área da família" />
      <main className="conteudo">
        {erro && <p className="erro" role="alert">{erro}</p>}

        <section className="cartao">
          <h2>Plano de {nome}</h2>
          {dados?.resumo?.topicos?.length ? (
            <>
              <p>A escola identificou no PDI estes tópicos para trabalhar com {nome}:</p>
              <ul className="etiquetas">
                {dados.resumo.topicos.map((t) => <li key={t}>{t}</li>)}
              </ul>
              <p>
                Recomendamos que vocês <strong>pesquisem</strong> formas de apoiar esses tópicos também fora da plataforma,
                e conversem com a escola e com os profissionais que acompanham {nome}.
              </p>
              {dados.resumo.aviso && <p className="ajuda">{dados.resumo.aviso}</p>}
            </>
          ) : (
            <p className="ajuda">A escola ainda não enviou o PDI.</p>
          )}
        </section>

        <section className="cartao">
          <h2>Jogos aprovados</h2>
          {dados?.jogos.length ? (
            <ul className="etiquetas">{dados.jogos.map((j) => <li key={j.id}>{j.nome}</li>)}</ul>
          ) : (
            <p className="ajuda">Nenhum jogo aprovado ainda.</p>
          )}
          <p className="ajuda">Incentive {nome} a jogar um pouco por dia.</p>
        </section>

        <section className="cartao">
          <h2>Como {nome} está indo</h2>
          {desempenho && <TabelaDesempenho desempenho={desempenho} />}
        </section>
      </main>
    </div>
  )
}
