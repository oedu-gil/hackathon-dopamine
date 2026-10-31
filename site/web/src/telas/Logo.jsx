// Logo do Gump: beija-flor (public/gump-beija-flor.svg) + nome em Fredoka.
export default function Logo({ tamanho = 48 }) {
  return (
    <span className="logo" style={{ fontSize: tamanho }}>
      <img src={`${import.meta.env.BASE_URL}gump-beija-flor.svg`} alt="" aria-hidden="true" />
      <span>gump</span>
    </span>
  )
}
