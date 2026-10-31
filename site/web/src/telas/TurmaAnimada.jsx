import { useEffect, useRef } from 'react'

// Personagens dos temas no chão do login, todos se mexendo juntos e sem parar:
// o trem gira as rodas e solta fumaça, a aranha joga uma
// teia no cartão de login e se pendura, o avião liga a hélice e dá uma volta no ar, o
// dinossauro dá um grito sem som. O estilo.css anima trem, avião e dinossauro; a aranha
// depende de onde está o cartão, então é movida aqui, pelo relógio da animação `turma-relogio`
// (que já para com o botão Pausar e some com prefers-reduced-motion).
// Mesmos desenhos de hub/src/compartilhado/arte/hiperfocos.js (viewBox 100x100), separados
// em partes; se a arte do hub mudar, atualize aqui também.
const C = { stroke: '#3b2a1a', strokeWidth: 2.5 }
const TRACO = '#3b2a1a'

function Olho({ x, y, r = 6 }) {
  return (
    <>
      <circle cx={x} cy={y} r={r} fill="#fff" {...C} />
      <circle cx={x + 1.5} cy={y + 0.5} r={r * 0.5} fill={TRACO} />
    </>
  )
}

// ---------------------------------------------------------------- TREM
function Roda({ cx, cy, r }) {
  return (
    <>
      <circle cx={cx} cy={cy} r={r} fill="#37474f" {...C} />
      <circle cx={cx} cy={cy} r={r * 0.45} fill="#cfd8dc" />
      <path
        className="tr-raios"
        style={{ transformOrigin: `${cx}px ${cy}px` }}
        d={`M${cx - r + 3} ${cy} H${cx + r - 3} M${cx} ${cy - r + 3} V${cy + r - 3}`}
        fill="none" stroke="#cfd8dc" strokeWidth="2.5" strokeLinecap="round"
      />
    </>
  )
}

function Trem() {
  return (
    <svg className="turma-svg" viewBox="0 0 100 100">
      {[0, 1, 2, 3].map((i) => <circle key={i} className={`tr-fumaca tr-fumaca-${i}`} cx="66" cy="16" r="6" fill="#fff" stroke="#b8c6c9" strokeWidth="1.5" />)}
      <g className="tr-corpo">
        <rect x="8" y="26" width="26" height="6" rx="2" fill="#37474f" />
        <rect x="8" y="30" width="24" height="36" rx="4" fill="#3f8fd9" {...C} />
        <rect x="13" y="36" width="14" height="12" rx="2" fill="#bfe3ff" {...C} />
        <rect x="60" y="24" width="12" height="16" rx="2" fill="#37474f" {...C} />
        <rect x="56" y="20" width="20" height="6" rx="3" fill="#37474f" {...C} />
        <rect x="30" y="38" width="52" height="28" rx="12" fill="#e8554e" {...C} />
        <rect x="8" y="62" width="86" height="10" rx="3" fill="#37474f" {...C} />
        <Olho x={62} y={50} /><Olho x={76} y={50} />
        <path d="M62 58 Q69 64 76 58" fill="none" stroke={TRACO} strokeWidth="2.5" strokeLinecap="round" />
        <path d="M88 72 L98 82 L88 82 Z" fill="#ffd23f" stroke={TRACO} strokeWidth="2" strokeLinejoin="round" />
      </g>
      <Roda cx={26} cy={78} r={12} /><Roda cx={50} cy={78} r={12} /><Roda cx={76} cy={80} r={9} />
    </svg>
  )
}

// ---------------------------------------------------------------- ARANHA
function Pernas({ pose }) {
  const p = pose ? 5 : -3
  const linhas = [
    [34, 30, 14, 8 + p, 4, 22 + p],
    [32, 40, 8, 34 + p, 2, 50 + p],
    [32, 50, 8, 60 - p, 4, 76 - p],
    [36, 58, 16, 80 - p, 12, 94 - p],
  ]
  const ds = [-1, 1].flatMap((lado) =>
    linhas.map(([x0, y0, x1, y1, x2, y2]) => {
      const m = (x) => (lado < 0 ? x : 100 - x)
      return `M${m(x0)} ${y0} L${m(x1)} ${y1} L${m(x2)} ${y2}`
    }),
  )
  return (
    <g className={`ar-pernas ar-pernas-${pose}`} fill="none" strokeLinecap="round" strokeLinejoin="round">
      {ds.map((d) => <path key={d + 'c'} d={d} stroke="#26163d" strokeWidth="7.5" />)}
      {ds.map((d) => <path key={d} d={d} stroke="#a07ed6" strokeWidth="4" />)}
    </g>
  )
}

function Aranha() {
  return (
    <svg className="turma-svg" viewBox="0 0 100 100">
      <Pernas pose={0} />
      <Pernas pose={1} />
      <ellipse cx="50" cy="62" rx="22" ry="22" fill="#7b4bb8" {...C} />
      <circle cx="50" cy="38" r="17" fill="#8e5ccc" {...C} />
      <path d="M40 62 H60 M42 70 H58" fill="none" stroke="#b995e8" strokeWidth="3" strokeLinecap="round" />
      <Olho x={43} y={34} r={7} /><Olho x={57} y={34} r={7} />
      <path d="M44 44 Q50 50 56 44" fill="none" stroke={TRACO} strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  )
}

// ---------------------------------------------------------------- AVIÃO
function Aviao() {
  return (
    <svg className="turma-svg" viewBox="0 0 100 100">
      <path d="M60 62 V74 M74 60 V73" fill="none" stroke="#37474f" strokeWidth="3" strokeLinecap="round" />
      <circle cx="60" cy="76" r="5.5" fill="#37474f" {...C} /><circle cx="74" cy="75" r="5.5" fill="#37474f" {...C} />
      <path d="M22 48 L12 26 Q11 22 15 22 L24 22 L38 44 Z" fill="#d94a3d" {...C} strokeLinejoin="round" />
      <ellipse cx="52" cy="50" rx="38" ry="16" fill="#ff6f61" {...C} />
      <path d="M26 42 Q38 36 52 36" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity="0.55" />
      <path d="M28 52 L20 72 Q19 76 23 76 L36 76 L48 54 Z" fill="#e8554e" {...C} strokeLinejoin="round" />
      <circle cx="68" cy="46" r="8" fill="#bfe3ff" {...C} />
      <Olho x={67} y={46} r={4.5} />
      <path d="M62 57 Q68 61 74 57" fill="none" stroke={TRACO} strokeWidth="2.5" strokeLinecap="round" />
      {/* hélice parada e girando (disco claro + pá que pisca) */}
      <ellipse className="av-helice-parada" cx="95" cy="50" rx="3" ry="8" fill="#cfd8dc" opacity="0.8" />
      <g className="av-helice-girando">
        <ellipse cx="95" cy="50" rx="2.5" ry="17" fill="#cfd8dc" opacity="0.35" />
        <ellipse className="av-pa" cx="95" cy="50" rx="3" ry="16" fill="#cfd8dc" opacity="0.85" />
      </g>
      <circle cx="91" cy="50" r="4" fill="#37474f" {...C} />
    </svg>
  )
}

// ---------------------------------------------------------------- DINOSSAURO
function Dinossauro() {
  return (
    <svg className="turma-svg" viewBox="0 0 100 100">
      <g className="di-grito" fill="none" stroke={TRACO} strokeWidth="3" strokeLinecap="round">
        <path className="di-onda di-onda-0" d="M104 38 Q110 46 104 54" />
        <path className="di-onda di-onda-1" d="M112 32 Q120 46 112 60" />
        <path className="di-onda di-onda-2" d="M120 26 Q130 46 120 66" />
      </g>
      <g className="di-corpo">
        <path className="di-rabo" d="M30 60 C14 60 6 46 4 34 C14 42 22 48 32 46 Z" fill="#4aa84a" {...C} strokeLinejoin="round" />
        {[36, 46, 56, 66].map((x, i) => (
          <path key={x} d={`M${x} ${40 - i} L${x + 5} ${28 - i} L${x + 10} ${40 - i} Z`} fill="#ffd23f" stroke={TRACO} strokeWidth="2" strokeLinejoin="round" />
        ))}
        <ellipse cx="48" cy="58" rx="28" ry="22" fill="#5cb85c" {...C} />
        <ellipse cx="48" cy="66" rx="17" ry="12" fill="#c9ec9a" />
        <rect x="34" y="74" width="10" height="18" rx="4" fill="#4aa84a" {...C} />
        <rect x="54" y="74" width="10" height="18" rx="4" fill="#4aa84a" {...C} />
        <g className="di-cabeca">
          <ellipse cx="74" cy="36" rx="17" ry="15" fill="#5cb85c" {...C} />
          {/* mandíbula: fica escondida atrás do focinho e gira para baixo no grito */}
          <g className="di-boca">
            <rect x="81" y="46" width="17" height="8" rx="2" fill="#8a2f3a" />
            <path d="M86 50 L88 46.5 L90 50 M92 50 L94 46.5 L96 50" fill="#fff" />
            <rect x="80" y="50" width="18" height="8" rx="4" fill="#4aa84a" {...C} />
          </g>
          <rect x="80" y="40" width="18" height="14" rx="6" fill="#5cb85c" {...C} />
          <Olho x={72} y={30} r={6} />
          <path className="di-sorriso" d="M82 50 Q90 55 96 50" fill="none" stroke={TRACO} strokeWidth="2.5" strokeLinecap="round" />
          <path d="M86 46 L88 50 L90 46 M92 46 L94 50" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <path d="M66 60 L74 66" fill="none" stroke="#3a8a3a" strokeWidth="4" strokeLinecap="round" />
      </g>
    </svg>
  )
}

const PERSONAGENS = { trem: Trem, aranha: Aranha, aviao: Aviao, dinossauro: Dinossauro }

// Linha do tempo da aranha, em ms dentro do ciclo dela (3,5 s, igual ao turma-relogio).
const AR = { agacha: 300, teia: 700, sobe: 1400, balanca: 2800, desce: 3300 }
const suave = (x) => (x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x))
const fase = (t, de, ate) => suave((t - de) / (ate - de))

// Move a aranha e desenha o fio, a partir da posição do cartão de login.
function useAranha(refs) {
  useEffect(() => {
    let quadro
    function passo() {
      quadro = requestAnimationFrame(passo)
      const { cena, lugar, corpo, fio, linha, gota } = refs
      const relogio = corpo.current?.getAnimations?.().find((a) => a.animationName === 'turma-relogio')
      if (!relogio || !cena.current || !lugar.current) return
      const t = (relogio.currentTime ?? 0) % 3500
      const cartao = cena.current.querySelector('.login-cartao')?.getBoundingClientRect()
      const base = cena.current.getBoundingClientRect()
      const s = lugar.current.getBoundingClientRect()
      if (!cartao) {
        corpo.current.style.transform = ''
        fio.current.style.opacity = 0
        return
      }

      // gancho (alto da cabeça) e ponto onde a teia gruda no cartão
      const H = { x: s.left + s.width / 2, y: s.top + s.height * 0.24 }
      let A
      if (H.x < cartao.left) A = { x: cartao.left + 4, y: Math.max(cartao.top + 60, cartao.bottom - 150) }
      else if (H.x > cartao.right) A = { x: cartao.right - 4, y: Math.max(cartao.top + 60, cartao.bottom - 150) }
      else A = { x: H.x, y: cartao.bottom - 4 }
      const dx = A.x - H.x
      const dy = A.y - H.y
      const D = Math.hypot(dx, dy)
      const sobra = Math.max(Math.min(D * 0.45, 90), Math.min(D, 16)) // fio que fica entre o cartão e a aranha

      // quanto já subiu pelo fio (0 = no chão) e quanto balança em volta do ponto da teia
      const subida = fase(t, AR.teia, AR.sobe) - fase(t, AR.balanca, AR.desce)
      const k = (D - sobra) / D
      const tb = (t - AR.sobe) / (AR.balanca - AR.sobe)
      const giro = t > AR.sobe && t < AR.balanca ? 14 * Math.sin(tb * Math.PI * 3) * (1 - tb) : 0
      const rad = (giro * Math.PI) / 180
      // posição do gancho: sobe pelo fio e depois gira em torno de A
      let px = H.x + dx * k * subida
      let py = H.y + dy * k * subida
      const rx = px - A.x
      const ry = py - A.y
      px = A.x + rx * Math.cos(rad) - ry * Math.sin(rad)
      py = A.y + rx * Math.sin(rad) + ry * Math.cos(rad)
      // a aranha vira a cabeça para o fio enquanto está pendurada
      const inclina = (Math.atan2(A.x - px, py - A.y) * 180) / Math.PI * subida
      const agacha = t < AR.teia ? 1 - 0.08 * Math.sin(Math.min(t / AR.teia, 1) * Math.PI) : 1
      corpo.current.style.transform = `translate(${px - H.x}px, ${py - H.y}px) rotate(${inclina}deg) scale(${2 - agacha}, ${agacha})`
      corpo.current.classList.toggle('andando', subida > 0.02 && subida < 0.98)

      // fio: sai da aranha até o cartão (teia), fica enquanto ela está pendurada, some na descida
      const lanca = fase(t, AR.agacha, AR.teia)
      const pontaX = px + (A.x - px) * lanca
      const pontaY = py + (A.y - py) * lanca
      linha.current.setAttribute('x1', px - base.left)
      linha.current.setAttribute('y1', py - base.top)
      linha.current.setAttribute('x2', pontaX - base.left)
      linha.current.setAttribute('y2', pontaY - base.top)
      gota.current.setAttribute('transform', `translate(${A.x - base.left} ${A.y - base.top}) scale(${lanca >= 1 ? 1 : 0})`)
      fio.current.style.opacity = t < AR.agacha ? 0 : 1 - fase(t, AR.desce - 250, AR.desce + 150)
    }
    quadro = requestAnimationFrame(passo)
    return () => cancelAnimationFrame(quadro)
  }, [refs])
}

export default function TurmaAnimada({ temas }) {
  const refs = useRef({ cena: { current: null }, lugar: { current: null }, corpo: { current: null }, fio: { current: null }, linha: { current: null }, gota: { current: null } }).current
  useAranha(refs)

  return (
    <>
      <div className="login-turma" aria-hidden="true" ref={(el) => (refs.cena.current = el?.parentElement ?? null)}>
        {temas.map((t) => {
          const Personagem = PERSONAGENS[t.id]
          if (!Personagem) return <img key={t.id} src={t.personagem} alt="" />
          const aranha = t.id === 'aranha'
          return (
            <div key={t.id} className={`turma-lugar turma-${t.id}`} ref={aranha ? refs.lugar : undefined}>
              <div className="turma-corpo" ref={aranha ? refs.corpo : undefined}>
                <Personagem />
              </div>
            </div>
          )
        })}
      </div>
      <svg className="turma-fio" aria-hidden="true" ref={refs.fio} style={{ opacity: 0 }}>
        <line ref={refs.linha} stroke="#6f5b93" strokeWidth="2" strokeLinecap="round" />
        <g ref={refs.gota}>
          <g fill="none" stroke="#6f5b93" strokeWidth="1.5" strokeLinecap="round">
            <path d="M-12 0 L12 0 M0 -12 L0 12 M-8 -8 L8 8 M-8 8 L8 -8" />
            <path d="M-6 0 L-4 -4 L0 -6 L4 -4 L6 0 L4 4 L0 6 L-4 4 Z" />
          </g>
        </g>
      </svg>
    </>
  )
}
