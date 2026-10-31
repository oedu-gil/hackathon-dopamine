import { HIPERFOCOS } from '../compartilhado/temas.js'
import { urlDoQuadro } from '../compartilhado/arte/index.js'
import Moldura from './Moldura.jsx'

export default function EscolhaTema({ escolher }) {
  return (
    <Moldura titulo="Do que você mais gosta?">
      <div className="grade">
        {HIPERFOCOS.map((h) => (
          <button key={h.id} className="cartao" style={{ '--tema': h.cor }} onClick={() => escolher(h)}>
            <img src={urlDoQuadro(h.arte)} alt="" width="112" height="112" />
            <span className="cartao-nome">{h.nome}</span>
          </button>
        ))}
      </div>
    </Moldura>
  )
}
