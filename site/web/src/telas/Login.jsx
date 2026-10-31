import { useState } from 'react'
import { api } from '../api.js'

const DEMO = [
  { rotulo: 'Escola', email: 'escola@demo.com' },
  { rotulo: 'Responsável', email: 'familia@demo.com' },
  { rotulo: 'Criança', email: 'ana@demo.com' },
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
      <form className="cartao" onSubmit={enviar}>
        <p className="marca">Dopamine</p>
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
              <button type="button" key={d.email} onClick={() => { setEmail(d.email); setSenha('demo') }}>
                {d.rotulo}
              </button>
            ))}
          </div>
        </div>
      </form>
    </main>
  )
}
