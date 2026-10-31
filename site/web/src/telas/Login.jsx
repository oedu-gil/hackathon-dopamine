import { useState } from 'react'
import { api } from '../api.js'
import { TEMAS } from '../temas.js'
import Logo from './Logo.jsx'
import Icone from './Icones.jsx'

// Primeiro a pessoa diz quem é; depois vem o formulário. O perfil escolhido só muda
// o texto e a conta de demonstração: quem decide a área é o perfil salvo no servidor.
const PERFIS = [
  { id: 'escola', rotulo: 'Escola', frase: 'Envie o PDI e aprove os jogos', icone: 'escola', cor: 'verde', email: 'escola@demo.com' },
  { id: 'familia', rotulo: 'Família', frase: 'Acompanhe o plano e o progresso', icone: 'familia', cor: 'rubi', email: 'familia@demo.com' },
  { id: 'crianca', rotulo: 'Criança', frase: 'Jogue e ganhe itens', icone: 'crianca', cor: 'pessego', email: 'ana@demo.com' },
]

const PASSOS = [
  { icone: 'documento', texto: 'A escola envia o PDI.' },
  { icone: 'ia', texto: 'A IA sugere jogos. A escola decide.' },
  { icone: 'estrela', texto: 'A criança joga no tema que ama.' },
]

export default function Login({ entrar }) {
  const [perfil, setPerfil] = useState(null)
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [enviando, setEnviando] = useState(false)

  async function enviar(ev) {
    ev.preventDefault()
    setErro('')
    setEnviando(true)
    try {
      const { usuario } = await api('/login', { metodo: 'POST', corpo: { email, senha } })
      entrar(usuario)
    } catch (e) {
      setErro(e.message)
    } finally {
      setEnviando(false)
    }
  }

  function trocarPerfil() {
    setPerfil(null)
    setErro('')
  }

  return (
    <main className="login">
      <section className="login-marca">
        <span className="bolha b1" aria-hidden="true" />
        <span className="bolha b2" aria-hidden="true" />
        <span className="bolha b3" aria-hidden="true" />
        <Logo tamanho={72} />
        <p className="login-frase">Do PDI ao jogo, no ritmo de cada criança.</p>
        <ul className="login-passos">
          {PASSOS.map((p) => (
            <li key={p.texto}><span><Icone nome={p.icone} tamanho={20} /></span>{p.texto}</li>
          ))}
        </ul>
        <div className="login-turma" aria-hidden="true">
          {TEMAS.map((t) => <img key={t.id} src={t.personagem} alt="" />)}
        </div>
      </section>

      <section className="login-form">
        {!perfil ? (
          <div className="login-caixa">
            <h1>Quem está entrando?</h1>
            <div className="perfis">
              {PERFIS.map((p) => (
                <button key={p.id} type="button" className={`perfil perfil-${p.cor}`} onClick={() => setPerfil(p)}>
                  <span className="perfil-icone"><Icone nome={p.icone} tamanho={30} /></span>
                  <span className="perfil-texto">
                    <strong>{p.rotulo}</strong>
                    <span>{p.frase}</span>
                  </span>
                  <Icone nome="avancar" />
                </button>
              ))}
            </div>
          </div>
        ) : (
          <form className={`login-caixa ${perfil.id === 'crianca' ? 'login-crianca' : ''}`} onSubmit={enviar}>
            <button type="button" className="link-voltar" onClick={trocarPerfil}><Icone nome="voltar" tamanho={20} /> Trocar perfil</button>
            <div className="login-titulo">
              <span className={`perfil-icone perfil-${perfil.cor}`}><Icone nome={perfil.icone} tamanho={30} /></span>
              <h1>Entrar como {perfil.rotulo.toLowerCase()}</h1>
            </div>
            {perfil.id === 'crianca' && <p className="ajuda">Peça ajuda a um adulto para entrar.</p>}
            <label>
              E-mail
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="username" />
            </label>
            <label>
              Senha
              <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} required autoComplete="current-password" />
            </label>
            {erro && <p className="erro" role="alert">{erro}</p>}
            <button className="primario" disabled={enviando}>{enviando ? 'Entrando…' : 'Entrar'}</button>

            <div className="demo">
              <p>Para testar, use a conta de demonstração (senha <code>demo</code>).</p>
              <button type="button" className={`demo-${perfil.cor}`} onClick={() => { setEmail(perfil.email); setSenha('demo') }}>
                Preencher conta de {perfil.rotulo.toLowerCase()}
              </button>
            </div>
          </form>
        )}
      </section>
    </main>
  )
}
