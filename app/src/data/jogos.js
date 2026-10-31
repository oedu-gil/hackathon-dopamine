// Catálogo: cada jogo declara as habilidades que treina (as "tags" da recomendação).
// `cena` é a chave da cena Phaser registrada em PhaserGame.jsx.
export const JOGOS = [
  {
    id: 'chuva-emocoes',
    nome: 'Chuva de emoções',
    emoji: '🌧️',
    cena: 'ChuvaEmocoes',
    ritmo: 'dinâmico',
    habilidades: ['reconhecer-emocoes'],
    descricao: 'Rostos caem do céu. Pegue só a emoção pedida!',
  },
  {
    id: 'plataforma-amigo',
    nome: 'Plataforma do amigo',
    emoji: '🏃',
    cena: 'PlataformaAmigo',
    ritmo: 'dinâmico',
    habilidades: ['resposta-social', 'empatia'],
    descricao: 'Corra, pule e ajude os amigos que encontrar pelo caminho. Eles vão com você!',
  },
  {
    id: 'cuidar-amigo',
    nome: 'Cuidar do amigo',
    emoji: '🤗',
    cena: 'CuidarAmigo',
    ritmo: 'calmo',
    habilidades: ['empatia', 'causa-efeito-social'],
    descricao: 'Um amigo está com um sentimento. Arraste o que ajuda e veja ele ficar feliz!',
  },
]
