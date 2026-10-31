// Cada hiperfoco troca só o visual e a recompensa; a mecânica dos jogos é a mesma.
export const HIPERFOCOS = [
  {
    id: 'trem',
    nome: 'Trem',
    emoji: '🚂',
    cor: '#2b6e4f',
    personagem: '🚂',
    personagemNome: 'o trem Tito',
    itens: [
      { nome: 'Locomotiva a vapor', emoji: '🚂' },
      { nome: 'Vagão', emoji: '🚃' },
      { nome: 'Trem-bala', emoji: '🚄' },
      { nome: 'Metrô', emoji: '🚇' },
      { nome: 'Bonde', emoji: '🚋' },
    ],
  },
  {
    id: 'aranha',
    nome: 'Aranha',
    emoji: '🕷️',
    cor: '#4a2c6b',
    personagem: '🕷️',
    personagemNome: 'a aranha Teca',
    itens: [
      { nome: 'Teia', emoji: '🕸️' },
      { nome: 'Aranha-saltadora', emoji: '🕷️' },
      { nome: 'Aranha-de-jardim', emoji: '🌿' },
      { nome: 'Casulo', emoji: '🥚' },
      { nome: 'Teia de orvalho', emoji: '💧' },
    ],
  },
  {
    id: 'aviao',
    nome: 'Avião',
    emoji: '✈️',
    cor: '#2a6f97',
    personagem: '✈️',
    personagemNome: 'o avião Avi',
    itens: [
      { nome: 'Aviãozinho', emoji: '🛩️' },
      { nome: 'Jato', emoji: '✈️' },
      { nome: 'Helicóptero', emoji: '🚁' },
      { nome: 'Decolagem', emoji: '🛫' },
      { nome: 'Foguete', emoji: '🚀' },
    ],
  },
  {
    id: 'dinossauro',
    nome: 'Dinossauro',
    emoji: '🦖',
    cor: '#8a5a1f',
    personagem: '🦖',
    personagemNome: 'o dinossauro Rex',
    itens: [
      { nome: 'Tiranossauro', emoji: '🦖' },
      { nome: 'Diplodoco', emoji: '🦕' },
      { nome: 'Ovo', emoji: '🥚' },
      { nome: 'Fóssil', emoji: '🦴' },
      { nome: 'Vulcão', emoji: '🌋' },
    ],
  },
]

export const hiperfocoPorId = (id) => HIPERFOCOS.find((h) => h.id === id)
