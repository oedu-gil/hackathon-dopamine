export const HABILIDADES = [
  { id: 'reconhecer-emocoes', nome: 'Reconhecer emoções' },
  { id: 'resposta-social', nome: 'Resposta social' },
  { id: 'empatia', nome: 'Empatia' },
  { id: 'causa-efeito-social', nome: 'Causa e efeito social' },
  { id: 'relacao-parte-todo', nome: 'Relação entre parte e todo' },
  { id: 'cooperacao', nome: 'Cooperação' },
]

export const idsPermitidos = () => HABILIDADES.map((h) => h.id)

export const nomeHabilidade = (id) => HABILIDADES.find((h) => h.id === id)?.nome ?? id
