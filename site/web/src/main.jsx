import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter, Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import { salvarUsuario, usuarioSalvo } from './api.js'
import Inicio from './telas/Inicio.jsx'
import Login from './telas/Login.jsx'
import Escola from './telas/Escola.jsx'
import Pais from './telas/Pais.jsx'
import Crianca from './telas/Crianca.jsx'
import Jogo from './telas/Jogo.jsx'
import DemoTortas from './telas/DemoTortas.jsx'
import '@fontsource/fredoka/400.css'
import './estilo.css'

const INICIO = { escola: '/escola', responsavel: '/pais', crianca: '/crianca' }

function Protegida({ usuario, perfis, children }) {
  if (!usuario) return <Navigate to="/entrar" replace />
  if (!perfis.includes(usuario.perfil)) return <Navigate to={INICIO[usuario.perfil]} replace />
  return children
}

function App() {
  const [usuario, setUsuario] = useState(usuarioSalvo)
  const navegar = useNavigate()

  const entrar = (u) => {
    salvarUsuario(u)
    setUsuario(u)
    navegar(INICIO[u.perfil])
  }
  const sair = () => {
    salvarUsuario(null)
    setUsuario(null)
    navegar('/')
  }

  const p = { usuario, sair }
  return (
    <Routes>
      <Route path="/" element={<Inicio areaDoUsuario={usuario && INICIO[usuario.perfil]} />} />
      <Route path="/experimentar/guerra-tortas" element={usuario?.perfil === 'crianca' ? <Navigate to="/crianca" replace /> : <DemoTortas />} />
      <Route path="/entrar" element={usuario ? <Navigate to={INICIO[usuario.perfil]} replace /> : <Login entrar={entrar} />} />
      <Route path="/escola/*" element={<Protegida usuario={usuario} perfis={['escola']}><Escola {...p} /></Protegida>} />
      <Route path="/pais" element={<Protegida usuario={usuario} perfis={['responsavel']}><Pais {...p} /></Protegida>} />
      <Route path="/crianca" element={<Protegida usuario={usuario} perfis={['crianca']}><Crianca {...p} /></Protegida>} />
      <Route path="/crianca/jogo/:jogoId" element={<Protegida usuario={usuario} perfis={['crianca']}><Jogo {...p} /></Protegida>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>,
)
