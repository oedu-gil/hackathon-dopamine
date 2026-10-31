import Logo from './Logo.jsx'

// Cabeçalho das áreas de adulto (escola e pais).
export default function Cabecalho({ usuario, sair, titulo }) {
  return (
    <header className="cabecalho">
      <div>
        <Logo tamanho={26} />
        <h1>{titulo}</h1>
      </div>
      <div className="cabecalho-acoes">
        <span className="quem">{usuario.nome}</span>
        <button onClick={sair}>Sair</button>
      </div>
    </header>
  )
}
