import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api.js'
import { cenarioDoTema } from '@hub/compartilhado/arte/cenarios.js'
import { TEMAS, XP_POR_ITEM, estiloTema, itensGanhos, temaPorId } from '../temas.js'
import Icone, { ICONE_JOGO } from './Icones.jsx'

// O mesmo cenário "papel recortado" dos jogos, para o site e o jogo ficarem iguais.
const urlCenario = (temaId) => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(cenarioDoTema(temaId))}`

function EscolherTema({ escolher, voltar }) {
  return (
    <section className="crianca-secao">
      <h1 className="crianca-titulo">Do que você mais gosta?</h1>
      <div className="grade-temas">
        {TEMAS.map((t) => (
          <button key={t.id} className="cartao-tema" style={estiloTema(t)} onClick={() => escolher(t.id)}>
            <span className="cartao-tema-arte"><img src={t.personagem} alt="" /></span>
            <span className="cartao-tema-nome">{t.nome}</span>
          </button>
        ))}
      </div>
      {voltar && (
        <div className="linha centro">
          <button className="botao-crianca" onClick={voltar}><Icone nome="voltar" /> Voltar</button>
        </div>
      )}
    </section>
  )
}

// Topo: o personagem do tema no cenário, com o XP e o próximo item da coleção.
function Palco({ tema, nome, xp }) {
  const proximo = tema.itens[itensGanhos(tema, xp)]
  const resto = xp % XP_POR_ITEM
  return (
    <section className="palco">
      <img className="palco-cenario" src={urlCenario(tema.id)} alt="" />
      <div className="palco-conteudo">
        <img className="palco-personagem" src={tema.personagem} alt="" />
        <div className="palco-balao">
          <h1>Oi, {nome}!</h1>
          <div className="xp-linha">
            <span className="xp-estrela"><Icone nome="estrela" tamanho={28} /></span>
            <div className="xp" role="progressbar" aria-valuemin={0} aria-valuemax={XP_POR_ITEM} aria-valuenow={proximo ? resto : XP_POR_ITEM} aria-label="XP até o próximo item">
              {/* coleção completa: barra cheia, em vez de mostrar o resto da divisão */}
              <span style={{ width: proximo ? `${(resto / XP_POR_ITEM) * 100}%` : '100%' }} />
            </div>
            {proximo && <img className="xp-proximo" src={proximo.img} alt={`Próximo: ${proximo.nome}`} />}
          </div>
          <p className="xp-texto"><strong>{xp} XP</strong>{proximo ? ` · faltam ${XP_POR_ITEM - resto} para ganhar` : ' · coleção completa!'}</p>
        </div>
      </div>
    </section>
  )
}

export default function Crianca({ usuario, sair }) {
  const [dados, setDados] = useState(null)
  const [trocando, setTrocando] = useState(false)
  const [erro, setErro] = useState('')
  const navegar = useNavigate()

  useEffect(() => {
    api(`/alunos/${usuario.aluno_id}`).then(setDados).catch((e) => setErro(e.message))
  }, [usuario.aluno_id])

  async function escolher(hiperfoco) {
    try {
      const aluno = await api(`/alunos/${usuario.aluno_id}/hiperfoco`, { metodo: 'PATCH', corpo: { hiperfoco } })
      setDados((d) => ({ ...d, aluno }))
      setTrocando(false)
    } catch (e) {
      setErro(e.message)
    }
  }

  const tema = temaPorId(dados?.aluno.hiperfoco)
  const xp = dados?.xp ?? 0
  const ganhos = itensGanhos(tema, xp)

  return (
    <div className="crianca" style={estiloTema(tema)}>
      <header className="crianca-barra">
        <button className="botao-crianca" onClick={sair}><Icone nome="sair" /> Sair</button>
        {tema && !trocando && (
          <button className="botao-crianca" onClick={() => setTrocando(true)}>
            <img src={tema.personagem} alt="" width="36" height="36" /> Trocar tema
          </button>
        )}
      </header>

      {erro && <p className="erro crianca-erro" role="alert">{erro}</p>}

      {dados && (!tema || trocando) && <EscolherTema escolher={escolher} voltar={tema ? () => setTrocando(false) : null} />}

      {dados && tema && !trocando && (
        <>
          <Palco tema={tema} nome={dados.aluno.nome} xp={xp} />

          <section className="crianca-secao">
            <h2 className="crianca-titulo"><span className="titulo-icone"><Icone nome="jogar" tamanho={26} /></span> Seus jogos</h2>
            {dados.jogos.length ? (
              <div className="grade-jogos">
                {dados.jogos.map((j, i) => (
                  <button key={j.id} className={`cartao-jogo capa-${i % 3}`} onClick={() => navegar(`/crianca/jogo/${j.id}`)}>
                    <span className="cartao-jogo-capa">
                      <img src={tema.itens[i % tema.itens.length].img} alt="" />
                      <span className="cartao-jogo-tipo"><Icone nome={ICONE_JOGO[j.id] ?? 'memoria'} tamanho={22} /></span>
                    </span>
                    <span className="cartao-jogo-rodape">
                      <span className="cartao-jogo-nome">{j.nome}</span>
                      <span className="cartao-jogo-play" aria-hidden="true"><Icone nome="jogar" tamanho={22} /></span>
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <p className="crianca-vazio"><img src={tema.personagem} alt="" width="72" height="72" /> Logo seus jogos vão aparecer aqui.</p>
            )}
          </section>

          <section className="crianca-secao">
            <h2 className="crianca-titulo">
              <span className="titulo-icone"><Icone nome="trofeu" tamanho={26} /></span> Sua coleção
              <span className="contador">{ganhos} de {tema.itens.length}</span>
            </h2>
            <ul className="estante">
              {tema.itens.map((item, i) => {
                const estado = i < ganhos ? 'ganho' : i === ganhos ? 'proximo' : 'bloqueado'
                return (
                  <li key={item.nome} className={`item-colecao ${estado}`}>
                    <img src={item.img} alt="" />
                    {estado === 'ganho' && <span>{item.nome}</span>}
                    {estado === 'proximo' && <span>Próximo!</span>}
                    {estado === 'bloqueado' && <span><Icone nome="cadeado" tamanho={18} /><span className="sr-only">Ainda não ganho</span></span>}
                  </li>
                )
              })}
            </ul>
          </section>
        </>
      )}
    </div>
  )
}
