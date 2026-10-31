// Capas dos jogos no estilo "papel recortado", com o personagem e os itens do tema.
// Cada capa mostra a mecânica do jogo e faz um gesto curto quando a criança aponta
// para o cartão (CSS em estilo.css, "Capas dos jogos"). Jogo sem capa aqui usa a arte padrão.
import { useId } from 'react'
import { urlDoQuadro } from '@hub/compartilhado/arte/index.js'

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

// Arte do hub que aparece nas capas (rostos e amigo), calculada uma vez só.
const ARTE_CAPA = {
  feliz: urlDoQuadro('rosto_feliz'),
  triste: urlDoQuadro('rosto_triste'),
  surpreso: urlDoQuadro('rosto_surpreso'),
  amigo: urlDoQuadro('amigo_coelho'),
}
const CORACAO = 'M50 88 C10 60 6 30 26 22 C40 17 48 26 50 32 C52 26 60 17 74 22 C94 30 90 60 50 88Z'

// id seguro para clipPath (o useId traz caracteres que não servem em url(#...))
const useIdSvg = () => `capa${useId().replace(/[^a-zA-Z0-9]/g, '')}`

// Quebra-cabeça: o personagem num tabuleiro com uma peça fora, que encaixa no buraco.
function CapaQuebraCabeca({ tema }) {
  const id = useIdSvg()
  // peça de baixo à direita, com um encaixe redondo para cima
  const peca = 'M100 86 H117 C110 70 145 70 138 86 H155 V141 H100 Z'
  return (
    <svg className="capa-svg capa-quebra" viewBox="0 0 260 170" aria-hidden="true">
      <defs>
        <clipPath id={id}><path d={peca} /></clipPath>
      </defs>
      <g transform="rotate(-3 100 86)">
        <rect x="45" y="31" width="114" height="114" rx="10" fill="var(--contorno)" />
        <rect x="41" y="27" width="118" height="118" rx="10" fill="var(--papel-creme)" stroke="var(--contorno)" strokeWidth="3" />
        <image href={tema.personagem} x="45" y="31" width="110" height="110" />
        <path d="M100 31 V141 M45 86 H155" stroke="var(--contorno)" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.45" />
        <path d={peca} fill="var(--ceu)" stroke="var(--contorno)" strokeWidth="2" strokeDasharray="5 4" />
        <g className="capa-peca">
          <path d={peca} fill="var(--contorno)" transform="translate(3 3)" />
          <path d={peca} fill="var(--papel-creme)" />
          <image href={tema.personagem} x="45" y="31" width="110" height="110" clipPath={`url(#${id})`} />
          <path d={peca} fill="none" stroke="var(--contorno)" strokeWidth="3" strokeLinejoin="round" />
        </g>
      </g>
    </svg>
  )
}

// Chuva de emoções: rostos caem da nuvem e um deles cai no balde, com o personagem torcendo.
function CapaChuva({ tema }) {
  return (
    <svg className="capa-svg capa-chuva" viewBox="0 0 260 170" aria-hidden="true">
      <path d="M38 44 C20 44 20 22 38 22 C40 6 66 4 72 18 C84 8 104 16 100 30 C114 32 112 46 98 46 Z" fill="var(--contorno)" transform="translate(4 4)" />
      <path d="M38 44 C20 44 20 22 38 22 C40 6 66 4 72 18 C84 8 104 16 100 30 C114 32 112 46 98 46 Z" fill="#fff" stroke="var(--contorno)" strokeWidth="3" strokeLinejoin="round" />
      <image href={ARTE_CAPA.triste} x="34" y="66" width="34" height="34" transform="rotate(-10 51 83)" />
      <image href={ARTE_CAPA.surpreso} x="150" y="34" width="30" height="30" transform="rotate(12 165 49)" />
      <g className="capa-rosto-cai">
        <image href={ARTE_CAPA.feliz} x="94" y="58" width="40" height="40" />
      </g>
      {/* balde na frente, para o rosto "entrar" nele */}
      <path d="M84 116 H144 L136 156 H92 Z" fill="var(--contorno)" transform="translate(4 4)" />
      <path d="M84 116 H144 L136 156 H92 Z" fill="var(--tema)" stroke="var(--contorno)" strokeWidth="3" strokeLinejoin="round" />
      <rect x="80" y="110" width="68" height="10" rx="5" fill="var(--papel-creme)" stroke="var(--contorno)" strokeWidth="3" />
      <g transform="translate(206 108) rotate(4)">
        <Figura src={tema.personagem} tamanho={84} />
      </g>
    </svg>
  )
}

// Cuidar do amigo: o personagem manda um coração e o amigo dá um pulinho de alegria.
function CapaCuidar({ tema }) {
  return (
    <svg className="capa-svg capa-cuidar" viewBox="0 0 260 170" aria-hidden="true">
      <ellipse cx="130" cy="146" rx="112" ry="10" fill="var(--contorno)" opacity="0.12" />
      <g transform="translate(64 100) rotate(-4)">
        <Figura src={tema.personagem} tamanho={92} />
      </g>
      <g className="capa-amigo">
        <image href={ARTE_CAPA.amigo} x="156" y="56" width="86" height="86" />
      </g>
      <g className="capa-coracao">
        <g transform="translate(104 40) scale(0.36)">
          <path d={CORACAO} fill="var(--contorno)" transform="translate(8 8)" />
          <path d={CORACAO} fill="#f28b9b" stroke="var(--contorno)" strokeWidth="8" strokeLinejoin="round" />
        </g>
      </g>
    </svg>
  )
}

// Plataforma do amigo: o personagem pula para o primeiro degrau, rumo à estrela.
function CapaPlataforma({ tema }) {
  const degrau = (x, y, w) => (
    <>
      <rect x={x + 4} y={y + 4} width={w} height="14" rx="6" fill="var(--contorno)" />
      <rect x={x} y={y} width={w} height="14" rx="6" fill="var(--papel-creme)" stroke="var(--contorno)" strokeWidth="3" />
    </>
  )
  return (
    <svg className="capa-svg capa-plataforma" viewBox="0 0 260 170" aria-hidden="true">
      <path d="M-200 190 V146 Q-60 128 0 142 T140 144 T280 140 T460 142 V190 Z" fill="var(--chao)" stroke="var(--contorno)" strokeWidth="3" />
      {degrau(104, 108, 58)}
      {degrau(176, 70, 58)}
      <path d="M205 18 L210 31 L224 31 L213 39 L217 52 L205 44 L193 52 L197 39 L186 31 L200 31 Z" fill="#ffd23f" stroke="var(--contorno)" strokeWidth="3" strokeLinejoin="round" />
      <g className="capa-pulo-x">
        <g className="capa-pulo-y">
          <image href={tema.personagem} x="22" y="78" width="70" height="70" />
        </g>
      </g>
    </svg>
  )
}

const CAPAS = {
  memoria: CapaMemoria,
  sequencia: CapaSequencia,
  'quebra-cabeca': CapaQuebraCabeca,
  'chuva-emocoes': CapaChuva,
  'cuidar-amigo': CapaCuidar,
  'plataforma-amigo': CapaPlataforma,
}

export const temCapa = (jogoId) => Boolean(CAPAS[jogoId])

export default function CapaJogo({ jogoId, tema }) {
  const Capa = CAPAS[jogoId]
  return Capa ? <Capa tema={tema} /> : null
}
