// Capas dos jogos no estilo "papel recortado", com o personagem e os itens do tema.
// Cada capa mostra a mecânica do jogo e faz um gesto curto quando a criança aponta
// para o cartão (CSS em estilo.css, "Capas dos jogos"). Jogo sem capa aqui usa a arte padrão.

// Cartão de papel centrado em (0, 0): sombra chapada, papel e contorno.
function Papel({ w, h, cor = 'var(--papel-creme)', raio = 10 }) {
  return (
    <>
      <rect x={-w / 2 + 4} y={-h / 2 + 4} width={w} height={h} rx={raio} fill="var(--contorno)" />
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={raio} fill={cor} stroke="var(--contorno)" strokeWidth="3" />
    </>
  )
}

function Figura({ src, tamanho }) {
  return <image href={src} x={-tamanho / 2} y={-tamanho / 2} width={tamanho} height={tamanho} />
}

// Verso da carta da memória: cor do tema com um brilho de quatro pontas.
function Verso({ w, h }) {
  return (
    <>
      <Papel w={w} h={h} cor="var(--tema)" />
      <path d="M0 -14 Q3 -3 14 0 Q3 3 0 14 Q-3 3 -14 0 Q-3 -3 0 -14Z" fill="#fff" opacity="0.9" />
    </>
  )
}

// Memória: uma carta aberta, uma fechada e uma que vira mostrando o par.
function CapaMemoria({ tema }) {
  const w = 64
  const h = 84
  return (
    <svg className="capa-svg capa-memoria" viewBox="0 0 260 170" aria-hidden="true">
      <g transform="translate(62 86) rotate(-6)">
        <Papel w={w} h={h} />
        <Figura src={tema.personagem} tamanho={52} />
      </g>
      <g transform="translate(130 84) rotate(2)">
        <Verso w={w} h={h} />
      </g>
      <g transform="translate(198 86) rotate(7)">
        <g className="capa-frente">
          <Papel w={w} h={h} />
          <Figura src={tema.personagem} tamanho={52} />
        </g>
        <g className="capa-verso">
          <Verso w={w} h={h} />
        </g>
      </g>
    </svg>
  )
}

// Sequência: personagem, item, personagem e um "?" que vira o item certo.
function CapaSequencia({ tema }) {
  const item = tema.itens[1] ?? tema.itens[0]
  const lado = 48
  const xs = [36, 99, 162, 225]
  const fila = [tema.personagem, item.img, tema.personagem]
  return (
    <svg className="capa-svg capa-sequencia" viewBox="0 0 260 170" aria-hidden="true">
      {fila.map((src, i) => (
        <g key={i} transform={`translate(${xs[i]} 88)`}>
          <Papel w={lado} h={lado} />
          <Figura src={src} tamanho={38} />
        </g>
      ))}
      <g transform={`translate(${xs[3]} 88)`}>
        <g className="capa-resposta">
          <Papel w={lado} h={lado} />
          <Figura src={item.img} tamanho={38} />
        </g>
        <g className="capa-pergunta">
          <Papel w={lado} h={lado} cor="#fff" />
          <rect x={-lado / 2 + 5} y={-lado / 2 + 5} width={lado - 10} height={lado - 10} rx="7" fill="none" stroke="var(--contorno)" strokeWidth="2" strokeDasharray="5 4" />
          <text y="11" textAnchor="middle" fontFamily="var(--titulo)" fontWeight="700" fontSize="30" fill="var(--contorno)">?</text>
        </g>
      </g>
    </svg>
  )
}

const CAPAS = { memoria: CapaMemoria, sequencia: CapaSequencia }

export const temCapa = (jogoId) => Boolean(CAPAS[jogoId])

export default function CapaJogo({ jogoId, tema }) {
  const Capa = CAPAS[jogoId]
  return Capa ? <Capa tema={tema} /> : null
}
