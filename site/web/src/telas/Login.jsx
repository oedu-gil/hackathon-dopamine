import { useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api.js'
import { TEMAS } from '../temas.js'
import Cenario from './Cenario.jsx'
import Logo from './Logo.jsx'
import Icone from './Icones.jsx'
import TurmaAnimada from './TurmaAnimada.jsx'

// Cartão de login sobre o cenário, com os personagens dos temas no chão.
// As abas de perfil só mudam o texto e a conta de demonstração: quem decide a área
// é o perfil salvo no servidor.
const PERFIS = [
  { id: 'escola', rotulo: 'Escola', frase: 'Envie o PDI e aprove os jogos', icone: 'escola', cor: 'verde', email: 'escola@demo.com' },
  { id: 'familia', rotulo: 'Família', frase: 'Acompanhe o plano e o progresso', icone: 'familia', cor: 'rubi', email: 'familia@demo.com' },
  { id: 'crianca', rotulo: 'Criança', frase: 'Jogue e ganhe itens', icone: 'crianca', cor: 'pessego', email: 'ana@demo.com' },
]

export default function Login({ entrar }) {
  const [perfil, setPerfil] = useState(PERFIS[0])
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [pausado, setPausado] = useState(false)

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

  function trocarPerfil(p) {
    setPerfil(p)
    setErro('')
  }

  return (
    <main className={`login ${pausado ? 'pausado' : ''}`}>
      <Cenario />
      <Link className="login-voltar" to="/"><Icone nome="voltar" tamanho={20} /> Início</Link>
      <button type="button" className="login-pausa" onClick={() => setPausado(!pausado)} aria-pressed={pausado}>
        <Icone nome={pausado ? 'jogar' : 'pausar'} tamanho={20} /> {pausado ? 'Continuar' : 'Pausar'}
      </button>

      <form className={`login-cartao ${perfil.id === 'crianca' ? 'login-crianca' : ''}`} onSubmit={enviar}>
        <Logo tamanho={52} />
        <p className="login-frase">Do PDI ao jogo, no ritmo de cada criança.</p>

        <div className="abas-perfil" role="radiogroup" aria-label="Quem está entrando?">
          {PERFIS.map((p) => (
            <button
              key={p.id}
              type="button"
              role="radio"
              aria-checked={perfil.id === p.id}
              className={`aba-perfil perfil-${p.cor}`}
              onClick={() => trocarPerfil(p)}
            >
              <Icone nome={p.icone} tamanho={22} /> {p.rotulo}
            </button>
          ))}
        </div>
        <p className="ajuda login-perfil-frase">{perfil.id === 'crianca' ? 'Peça ajuda a um adulto para entrar.' : perfil.frase}.</p>

        <label>
          E-mail
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="username" />
        </label>
        <label>
          Senha
          <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} required autoComplete="current-password" />
        </label>
        {erro && <p className="erro" role="alert">{erro}</p>}
        <button className="primario" disabled={enviando}>{enviando ? 'Entrando…' : `Entrar como ${perfil.rotulo.toLowerCase()}`}</button>

        <div className="demo">
          <p>Para testar, use a conta de demonstração (senha <code>demo</code>).</p>
          <button type="button" className={`demo-${perfil.cor}`} onClick={() => { setEmail(perfil.email); setSenha('demo') }}>
            Preencher conta de {perfil.rotulo.toLowerCase()}
          </button>
        </div>
      </form>

      <TurmaAnimada temas={TEMAS} />
    </main>
  )
}
