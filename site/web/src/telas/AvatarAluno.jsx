// Avatar do aluno nas áreas de adulto: o personagem do hiperfoco ou, sem tema, a inicial.
export default function AvatarAluno({ aluno, tema }) {
  return (
    <span className="aluno-avatar" style={tema ? { background: tema.ceu, boxShadow: `0 0 0 3px ${tema.cor}` } : undefined} aria-hidden="true">
      {tema ? <img src={tema.personagem} alt="" /> : aluno.nome[0]}
    </span>
  )
}
