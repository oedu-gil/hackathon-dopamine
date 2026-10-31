// Logo do Gump: beija-flor (public/gump-beija-flor.svg) + nome em Fredoka.
// Com `animado`, o beija-flor é desenhado inline, em partes, para bater as asas e mexer o bico
// (só na capa da página inicial; para com o botão Pausar e com prefers-reduced-motion).
export default function Logo({ tamanho = 48, animado = false }) {
  return (
    <span className="logo" style={{ fontSize: tamanho }}>
      {animado ? <BeijaFlor /> : <img src="/gump-beija-flor.svg" alt="" aria-hidden="true" />}
      <span>gump</span>
    </span>
  )
}

// Mesmo desenho de public/gump-beija-flor.svg, separado em grupos que o estilo.css anima:
// corpo (flutua), asas (batem rápido, com rastros parados), bico em duas metades (abre e fecha), cauda.
function BeijaFlor() {
  const asaTras = 'M96 104 C82 56 56 30 30 30 C36 64 60 98 96 116 Z'
  const asaFrente = 'M108 106 C102 60 80 34 54 30 C58 64 76 98 108 122 Z'
  return (
    <svg className="beija-flor" viewBox="-6 20 224 172" aria-hidden="true">
      <g className="bf-rastros" fill="none" stroke="#FF9F6B" strokeWidth="4" strokeLinecap="round">
        <path d="M20 70 Q 12 80 18 92" />
        <path d="M8 60 Q -2 78 8 98" opacity="0.6" />
      </g>
      <g className="bf-corpo" stroke="#1E3B2F" strokeWidth="4" strokeLinejoin="round" strokeLinecap="round">
        <path className="bf-cauda" d="M70 140 L22 168 L50 146 L32 186 L86 150 Z" fill="#2E9E6B" />
        {/* rastros das asas: cópias claras nas pontas do movimento, como borrão de foto */}
        <path className="bf-borrao bf-borrao-cima" d={asaFrente} fill="#FF9F6B" stroke="none" />
        <path className="bf-borrao bf-borrao-baixo" d={asaFrente} fill="#FF9F6B" stroke="none" />
        <path className="bf-asa bf-asa-tras" d={asaTras} fill="#F08A55" />
        <ellipse cx="100" cy="122" rx="46" ry="34" transform="rotate(-24 100 122)" fill="#2E9E6B" />
        <path d="M72 146 C92 160 126 154 142 126 C122 136 96 140 72 146 Z" fill="#FFF6F0" opacity="0.9" stroke="none" />
        <g className="bf-cabeca">
          <g className="bf-bico" fill="#1E3B2F">
            <path className="bf-bico-baixo" d="M165 83 L207 69 L165 89 Z" />
            <path className="bf-bico-cima" d="M164 76 L212 64 L165 83 Z" />
          </g>
          <circle cx="140" cy="82" r="28" fill="#2E9E6B" />
          <path d="M118 100 C126 118 152 118 162 96 C148 104 132 104 118 100 Z" fill="#D9406E" />
          <circle cx="148" cy="77" r="9.5" fill="#FFFFFF" />
          <g stroke="none">
            <circle cx="150" cy="77" r="5.5" fill="#1E3B2F" />
            <circle cx="152.5" cy="74.5" r="2" fill="#FFFFFF" />
            <circle cx="135" cy="93" r="4.5" fill="#D9406E" opacity="0.75" />
          </g>
        </g>
        <path className="bf-asa bf-asa-frente" d={asaFrente} fill="#FF9F6B" />
      </g>
    </svg>
  )
}
