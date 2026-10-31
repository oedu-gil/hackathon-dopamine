// Cenário do topo da área da criança. A estrutura é a mesma em todos os temas;
// só as cores (tokens do tema) e um detalhe de fundo mudam. Parado: sem animação.
const DETALHE = {
  trem: (
    <g className="c-detalhe">
      <path d="M0 212 H1200" strokeWidth="5" />
      <path d="M0 226 H1200" strokeWidth="5" />
      {Array.from({ length: 30 }, (_, i) => <rect key={i} x={i * 42 + 6} y="206" width="12" height="26" rx="3" />)}
    </g>
  ),
  aviao: (
    <g className="c-detalhe-claro">
      <path d="M180 170 C 380 60, 640 60, 860 120 S 1100 150, 1180 70" strokeWidth="5" strokeDasharray="4 18" fill="none" />
    </g>
  ),
  dinossauro: (
    <g className="c-detalhe">
      <path d="M880 190 L960 92 Q975 80 990 92 L1070 190 Z" />
      <path d="M948 100 Q975 116 1002 100" fill="none" strokeWidth="6" className="c-lava" />
      <path d="M160 205 Q164 160 150 128" fill="none" strokeWidth="8" />
      <path d="M150 128 q-40 -6 -58 18 M150 128 q36 -16 62 4 M150 128 q-14 -30 -46 -34 M150 128 q16 -32 50 -30" fill="none" strokeWidth="9" />
    </g>
  ),
  aranha: (
    <g className="c-detalhe-claro" fill="none" strokeWidth="3">
      {[0, 18, 36, 54, 72, 90].map((a) => (
        <path key={a} d={`M1200 0 L${1200 - Math.cos((a * Math.PI) / 180) * 260} ${Math.sin((a * Math.PI) / 180) * 260}`} />
      ))}
      {[70, 130, 190, 245].map((r) => (
        <path key={r} d={[0, 18, 36, 54, 72, 90].map((a, i) => `${i ? 'L' : 'M'}${1200 - Math.cos((a * Math.PI) / 180) * r} ${Math.sin((a * Math.PI) / 180) * r}`).join(' ')} />
      ))}
    </g>
  ),
}

export default function Cenario({ tema }) {
  return (
    <svg className="cenario" viewBox="0 0 1200 280" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
      <rect className="c-ceu" width="1200" height="280" />
      <circle cx="1040" cy="64" r="44" className="c-sol" />
      <g className="c-nuvem">
        <ellipse cx="300" cy="62" rx="54" ry="20" />
        <ellipse cx="336" cy="50" rx="34" ry="22" />
        <ellipse cx="690" cy="96" rx="44" ry="15" />
        <ellipse cx="716" cy="86" rx="26" ry="17" />
      </g>
      <path className="c-chao-longe" d="M0 170 Q150 120 320 150 T640 140 T960 130 T1200 150 V280 H0 Z" />
      <path className="c-chao" d="M0 200 Q200 170 420 192 T820 186 T1200 196 V280 H0 Z" />
      {DETALHE[tema?.id]}
      <path className="c-onda" d="M0 252 Q150 232 300 250 T600 250 T900 248 T1200 246 V280 H0 Z" />
    </svg>
  )
}
