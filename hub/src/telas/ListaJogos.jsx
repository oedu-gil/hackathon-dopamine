import { JOGOS } from '../jogos/registro.js'
import Moldura from './Moldura.jsx'

export default function ListaJogos({ tema, escolher, trocarTema }) {
  return (
    <Moldura tema={tema} titulo="Escolha um jogo" botao={<button onClick={trocarTema}>Trocar tema</button>}>
      <div className="grade">
        {JOGOS.map((j) => (
          <button key={j.id} className="cartao" onClick={() => escolher(j)}>
            <img src={j.icone} alt="" width="112" height="112" />
            <span className="cartao-nome">{j.nome}</span>
          </button>
        ))}
      </div>
    </Moldura>
  )
}
