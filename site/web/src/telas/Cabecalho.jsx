import Logo from './Logo.jsx'
import Icone from './Icones.jsx'

// Cabeçalho das áreas de adulto (escola e pais). `children` entra no meio (ex.: escolha do aluno).
export default function Cabecalho({ usuario, sair, titulo, children }) {
  return (
    <header className="cabecalho">
      <div className="cabecalho-marca">
        <Logo tamanho={28} />
        <span className="cabecalho-titulo">{titulo}</span>
      </div>
      {children && <div className="cabecalho-meio">{children}</div>}
      <div className="cabecalho-acoes">
        <span className="quem"><span className="quem-inicial" aria-hidden="true">{usuario.nome[0]}</span>{usuario.nome}</span>
        <button onClick={sair}><Icone nome="sair" tamanho={20} /> Sair</button>
      </div>
    </header>
  )
}
