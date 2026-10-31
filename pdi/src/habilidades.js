export const HABILIDADES = [
  { id: 'reconhecer-emocoes', nome: 'Reconhecer emoções' },
  { id: 'resposta-social', nome: 'Resposta social' },
  { id: 'empatia', nome: 'Empatia' },
  { id: 'causa-efeito-social', nome: 'Causa e efeito social' },
]

export const idsPermitidos = () => HABILIDADES.map((h) => h.id)

export const nomeHabilidade = (id) => HABILIDADES.find((h) => h.id === id)?.nome ?? id
