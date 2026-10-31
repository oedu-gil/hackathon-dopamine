import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api.js'
import { TEMAS, temaPorId } from '../temas.js'

const XP_POR_ITEM = 20 // igual a site/server/src/regras.js

// Aplica as cores do tema como tokens; a estrutura da tela não muda.
export function estiloTema(tema) {
  return tema ? { '--tema': tema.cor, '--tema-fundo': tema.fundo } : undefined
}

function EscolherTema({ escolher }) {
  return (
    <section className="crianca-bloco">
      <h1>Do que você mais gosta?</h1>
      <div className="grade-temas">
        {TEMAS.map((t) => (
          <button key={t.id} className="tema" style={estiloTema(t)} onClick={() => escolher(t.id)}>
            <span className="emoji" aria-hidden="true">{t.personagem}</span>
            {t.nome}
          </button>
        ))}
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
    const aluno = await api(`/alunos/${usuario.aluno_id}/hiperfoco`, { metodo: 'PATCH', corpo: { hiperfoco } })
    setDados((d) => ({ ...d, aluno }))
    setTrocando(false)
  }

  const tema = temaPorId(dados?.aluno.hiperfoco)
  const desbloqueados = tema ? Math.min(Math.floor((dados.xp ?? 0) / XP_POR_ITEM), tema.itens.length) : 0
  const progresso = ((dados?.xp ?? 0) % XP_POR_ITEM) / XP_POR_ITEM

  return (
    <div className="crianca" style={estiloTema(tema)}>
      <header className="crianca-topo">
        <button onClick={sair}>Sair</button>
        {tema && !trocando && <button onClick={() => setTrocando(true)}>Trocar tema</button>}
      </header>

      {erro && <p className="erro" role="alert">{erro}</p>}

      {dados && (!tema || trocando) && <EscolherTema escolher={escolher} />}

      {dados && tema && !trocando && (
        <>
          <section className="crianca-bloco avatar">
            <span className="emoji grande" aria-hidden="true">{tema.personagem}</span>
            <div>
              <h1>Oi, {dados.aluno.nome}!</h1>
              <div className="xp" role="progressbar" aria-valuemin={0} aria-valuemax={XP_POR_ITEM} aria-valuenow={dados.xp % XP_POR_ITEM} aria-label="XP até o próximo item">
                <span style={{ width: `${progresso * 100}%` }} />
              </div>
              <p>⭐ {dados.xp} XP</p>
            </div>
          </section>

          <section className="crianca-bloco">
            <h2>🎮 Seus jogos</h2>
            {dados.jogos.length ? (
              <div className="grade-jogos">
                {dados.jogos.map((j) => (
                  <button key={j.id} className="cartao-jogo" onClick={() => navegar(`/crianca/jogo/${j.id}`)}>
                    <span className="emoji" aria-hidden="true">▶️</span>
                    {j.nome}
                  </button>
                ))}
              </div>
            ) : (
              <p>Logo seus jogos vão aparecer aqui. 🙂</p>
            )}
          </section>

          <section className="crianca-bloco">
            <h2>🏆 Sua coleção</h2>
            <ul className="colecao">
              {tema.itens.map((item, i) => (
                <li key={item} className={i < desbloqueados ? 'ganho' : 'bloqueado'} aria-label={i < desbloqueados ? 'Item ganho' : 'Item ainda não ganho'}>
                  {i < desbloqueados ? item : '?'}
                </li>
              ))}
            </ul>
          </section>
        </>
      )}
    </div>
  )
}
