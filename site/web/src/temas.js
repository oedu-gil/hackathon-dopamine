// Temas de hiperfoco: trocam só cor, personagem e itens da coleção.
// Layout, botões, fluxo e XP são iguais em todos (DESIGN.md, regra 8).
// Os emojis são provisórios até termos as ilustrações.
export const TEMAS = [
  {
    id: 'trem',
    nome: 'Trem',
    personagem: '🚂',
    cor: '#3d6b56',
    fundo: '#e8efe9',
    itens: ['🚂', '🚃', '🚄', '🚇', '🚋', '🚉'],
  },
  {
    id: 'dinossauro',
    nome: 'Dinossauro',
    personagem: '🦕',
    cor: '#5f6b3a',
    fundo: '#eef0e2',
    itens: ['🦕', '🦖', '🥚', '🌋', '🌿', '🦴'],
  },
  {
    id: 'aviao',
    nome: 'Avião',
    personagem: '✈️',
    cor: '#3b5f7a',
    fundo: '#e6edf2',
    itens: ['✈️', '🛩️', '🚁', '🛫', '🪂', '🌤️'],
  },
  {
    id: 'navio',
    nome: 'Navio',
    personagem: '🚢',
    cor: '#2f5d6b',
    fundo: '#e4eef0',
    itens: ['🚢', '⛵', '🛥️', '⚓', '🧭', '🐋'],
  },
]

export const temaPorId = (id) => TEMAS.find((t) => t.id === id) ?? null
