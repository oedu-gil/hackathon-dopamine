// Cada hiperfoco troca só o visual e a recompensa; a mecânica dos jogos é a mesma.
// `arte` é o id do desenho em src/arte (personagem animado e um desenho por item).
const itens = (id, nomes) => nomes.map((nome, i) => ({ nome, arte: `item_${id}_${i}` }))

export const HIPERFOCOS = [
  {
    id: 'trem',
    nome: 'Trem',
    arte: 'hf_trem',
    cor: '#2b6e4f',
    personagemNome: 'o trem Tito',
    itens: itens('trem', [
      'Locomotiva a vapor', 'Vagão', 'Trem-bala', 'Metrô', 'Bonde',
      'Estação', 'Trilhos', 'Semáforo', 'Monotrilho', 'Trem de montanha',
    ]),
  },
  {
    id: 'aranha',
    nome: 'Aranha',
    arte: 'hf_aranha',
    cor: '#4a2c6b',
    personagemNome: 'a aranha Teca',
    itens: itens('aranha', [
      'Teia', 'Aranha-saltadora', 'Aranha-de-jardim', 'Casulo', 'Teia de orvalho',
      'Fio de seda', 'Lupa do cientista', 'Aranha-pavão', 'Caranguejeira', 'Rainha das teias',
    ]),
  },
  {
    id: 'aviao',
    nome: 'Avião',
    arte: 'hf_aviao',
    cor: '#2a6f97',
    personagemNome: 'o avião Avi',
    itens: itens('aviao', [
      'Aviãozinho', 'Jato', 'Helicóptero', 'Decolagem', 'Foguete',
      'Torre de controle', 'Nuvem', 'Balão de ar quente', 'Passaporte', 'Piloto campeão',
    ]),
  },
  {
    id: 'dinossauro',
    nome: 'Dinossauro',
    arte: 'hf_dinossauro',
    cor: '#8a5a1f',
    personagemNome: 'o dinossauro Rex',
    itens: itens('dinossauro', [
      'Tiranossauro', 'Diplodoco', 'Ovo', 'Fóssil', 'Vulcão',
      'Pegadas', 'Palmeira gigante', 'Cometa', 'Museu de fósseis', 'Rei dos dinossauros',
    ]),
  },
]

export const hiperfocoPorId = (id) => HIPERFOCOS.find((h) => h.id === id)
