import { useState } from 'react'
import { api } from '../api.js'
import Logo from './Logo.jsx'

const DEMO = [
  { rotulo: 'Escola', email: 'escola@demo.com', cor: 'verde' },
  { rotulo: 'Família', email: 'familia@demo.com', cor: 'rubi' },
  { rotulo: 'Criança', email: 'ana@demo.com', cor: 'pessego' },
]

export default function Login({ entrar }) {
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

  return (
    <main className="login">
      <section className="login-marca">
        <span className="bolha b1" aria-hidden="true" />
        <span className="bolha b2" aria-hidden="true" />
        <span className="bolha b3" aria-hidden="true" />
        <Logo tamanho={72} />
        <p className="login-frase">Do PDI ao jogo, no ritmo de cada criança.</p>
      </section>

      <section className="login-form">
        <form onSubmit={enviar}>
          <h1>Entrar</h1>
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
            <p>Contas de demonstração (senha <code>demo</code>):</p>
            <div className="demo-botoes">
              {DEMO.map((d) => (
                <button type="button" key={d.email} className={`demo-${d.cor}`} onClick={() => { setEmail(d.email); setSenha('demo') }}>
                  {d.rotulo}
                </button>
              ))}
            </div>
          </div>
        </form>
      </section>
    </main>
  )
}
