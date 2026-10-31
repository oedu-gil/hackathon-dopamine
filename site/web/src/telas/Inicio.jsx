import { useState } from 'react'
import { Link } from 'react-router-dom'
import { JOGOS } from '@hub/jogos/registro.js'
import { TEMAS, estiloTema } from '../temas.js'
import Logo from './Logo.jsx'
import Icone from './Icones.jsx'

// Capa de um jogo num tema: céu e chão do tema, um item da coleção, o ícone e o nome do jogo.
// Só vitrine: não é clicável.
function Capa({ jogo, tema, n }) {
  const item = tema.itens[(n * 3 + 1) % tema.itens.length]
  return (
    <div className="capa" style={estiloTema(tema)}>
      <span className="capa-chao" />
      <img className="capa-item" src={item.img} alt="" />
      <img className="capa-personagem" src={tema.personagem} alt="" />
      <span className="capa-rodape">
        <img src={jogo.icone} alt="" />
        <span>
          <strong>{jogo.nome}</strong>
          <small>Tema {tema.nome.toLowerCase()}</small>
        </span>
      </span>
    </div>
  )
}

// Página inicial (raiz): a marca no centro e, atrás, uma fileira de capas por tema rolando devagar.
// Exceção da regra 2 do DESIGN.md, só aqui: a página é para adultos, tem botão de pausar
// e fica parada com prefers-reduced-motion.
export default function Inicio({ areaDoUsuario }) {
  const [pausado, setPausado] = useState(false)

  return (
    <div className={`inicio ${pausado ? 'pausado' : ''}`}>
      <header className="inicio-topo">
        <Logo tamanho={40} />
        {areaDoUsuario ? (
          <Link className="botao primario" to={areaDoUsuario}>Ir para minha área <Icone nome="avancar" tamanho={20} /></Link>
        ) : (
          <Link className="botao primario" to="/entrar">Entrar <Icone nome="avancar" tamanho={20} /></Link>
        )}
      </header>

      <main className="vitrine">
        <div className="fileiras" aria-hidden="true">
          {TEMAS.map((tema, f) => (
            // a primeira fileira vai para a direita, a segunda para a esquerda, e assim por diante
            <div key={tema.id} className={`fileira ${f % 2 ? 'para-esquerda' : 'para-direita'}`}>
              {/* duas cópias seguidas: a animação anda metade da largura e recomeça sem salto */}
              <div className="fileira-trilho">
                {[...JOGOS, ...JOGOS].map((jogo, n) => <Capa key={`${jogo.id}-${n}`} jogo={jogo} tema={tema} n={n + f} />)}
              </div>
            </div>
          ))}
        </div>

        <h1 className="vitrine-marca"><Logo tamanho={140} /></h1>

        <button type="button" className="vitrine-pausa" onClick={() => setPausado(!pausado)} aria-pressed={pausado}>
          <Icone nome={pausado ? 'jogar' : 'pausar'} tamanho={20} /> {pausado ? 'Continuar' : 'Pausar'}
        </button>
      </main>
    </div>
  )
}
