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
    descricao: 'Ajude os amigos pulando na atitude certa em cada situação.',
  },
  {
    id: 'historia-escolhas',
    nome: 'História com escolhas',
    emoji: '📖',
    cena: 'HistoriaEscolhas',
    ritmo: 'calmo',
    habilidades: ['causa-efeito-social', 'empatia'],
    descricao: 'Uma história sem pressa: escolha o que fazer e veja o que acontece.',
  },
]
