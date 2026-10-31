import Moldura from './Moldura.jsx'

// Avisa antes de trocar de tela (DESIGN.md, regra 3): mostra qual jogo vai abrir.
export default function AntesDoJogo({ tema, jogo, comecar, voltar }) {
  return (
    <Moldura tema={tema} titulo={jogo.nome} botao={<button onClick={voltar}>Voltar</button>}>
      <section className="aviso">
        <img src={jogo.icone} alt="" width="160" height="160" />
        <p>{jogo.descricao}</p>
        <button className="principal" onClick={comecar} autoFocus>
          Começar
        </button>
      </section>
    </Moldura>
  )
}
