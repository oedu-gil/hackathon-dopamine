import { urlDoQuadro } from '../compartilhado/arte/index.js'

// Estrutura igual em todas as telas: botão à esquerda, título no meio, personagem do tema
// à direita (DESIGN.md, regra 3). O tema só troca a cor e o personagem (regra 8).
export default function Moldura({ tema, botao, titulo, children, className = '' }) {
  return (
    <div className={`moldura ${className}`} style={tema ? { '--tema': tema.cor } : undefined}>
      <header className="topo">
        <div className="topo-botao">{botao}</div>
        <h1 className="topo-titulo">{titulo}</h1>
        <div className="topo-tema" aria-hidden="true">
          {tema && <img src={urlDoQuadro(tema.arte)} alt="" width="56" height="56" />}
        </div>
      </header>
      <main className="conteudo">{children}</main>
    </div>
  )
}
