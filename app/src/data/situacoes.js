// Situações da "Plataforma do amigo" (cara = expressão do amigo). A primeira opção de cada lista é a certa;
// o jogo embaralha a ordem na hora de mostrar.
export const SITUACOES = [
  {
    nivel: 1,
    texto: 'Um amigo caiu e está chorando.',
    cara: '😢',
    opcoes: [
      { texto: 'Perguntar se ele está bem', certo: true, feedback: 'Perguntar mostra que você se importa.' },
      { texto: 'Continuar correndo', feedback: 'Ele está precisando de ajuda. Que tal parar?' },
      { texto: 'Rir dele', feedback: 'Rir de quem se machucou deixa a pessoa mais triste.' },
    ],
  },
  {
    nivel: 1,
    texto: 'Um amigo quer brincar com você.',
    cara: '😀',
    opcoes: [
      { texto: 'Dizer: vamos brincar!', certo: true, feedback: 'Aceitar o convite deixa o amigo feliz.' },
      { texto: 'Virar as costas', feedback: 'O amigo pode ficar chateado se você ignorar.' },
      { texto: 'Pegar o brinquedo sem pedir', feedback: 'Antes de pegar, a gente pede.' },
    ],
  },
  {
    nivel: 1,
    texto: 'Um amigo ganhou um presente e está feliz.',
    cara: '🥳',
    opcoes: [
      { texto: 'Dizer: que legal, parabéns!', certo: true, feedback: 'Dividir a alegria é muito legal.' },
      { texto: 'Dizer que o presente é feio', feedback: 'Isso poderia magoar o amigo.' },
      { texto: 'Ir embora sem falar nada', feedback: 'O amigo queria dividir a alegria com você.' },
    ],
  },
  {
    nivel: 1,
    texto: 'Alguém esbarrou em você sem querer e pediu desculpa.',
    cara: '😳',
    opcoes: [
      { texto: 'Dizer: tudo bem!', certo: true, feedback: 'Foi sem querer, e aceitar a desculpa ajuda.' },
      { texto: 'Empurrar de volta', feedback: 'Foi sem querer, então não precisa revidar.' },
      { texto: 'Gritar com ele', feedback: 'Gritar não resolve, e foi um acidente.' },
    ],
  },
  {
    nivel: 2,
    texto: 'Um amigo está sozinho no canto e parece triste.',
    cara: '😔',
    opcoes: [
      { texto: 'Chegar perto e convidar para brincar', certo: true, feedback: 'Um convite pode melhorar o dia dele.' },
      { texto: 'Fingir que não viu', feedback: 'Ele pode estar precisando de companhia.' },
      { texto: 'Gritar para ele sair dali', feedback: 'Gritar pode assustar. Um convite gentil é melhor.' },
    ],
  },
  {
    nivel: 2,
    texto: 'Você quer o brinquedo que seu amigo está usando.',
    cara: '😐',
    opcoes: [
      { texto: 'Pedir: posso brincar depois de você?', certo: true, feedback: 'Pedir e esperar a vez funciona bem.' },
      { texto: 'Puxar da mão dele', feedback: 'Puxar pode machucar e deixar o amigo bravo.' },
      { texto: 'Gritar até ele largar', feedback: 'Gritar não ajuda. Dá para pedir com calma.' },
    ],
  },
  {
    nivel: 2,
    texto: 'Um amigo errou no jogo e ficou bravo.',
    cara: '😠',
    opcoes: [
      { texto: 'Dizer: tudo bem, vamos tentar de novo', certo: true, feedback: 'Animar o amigo ajuda ele a se acalmar.' },
      { texto: 'Zombar do erro', feedback: 'Zombar deixa ele ainda mais chateado.' },
      { texto: 'Sair correndo', feedback: 'Ele podia usar uma palavra amiga.' },
    ],
  },
  {
    nivel: 3,
    texto: 'Dois amigos estão discutindo por causa de um jogo.',
    cara: '😤',
    opcoes: [
      { texto: 'Sugerir que cada um jogue uma vez', certo: true, feedback: 'Revezar resolve a briga de um jeito justo.' },
      { texto: 'Escolher um lado e brigar também', feedback: 'Brigar de novo só aumenta o problema.' },
      { texto: 'Pegar o jogo para você', feedback: 'Isso deixa os dois chateados.' },
    ],
  },
  {
    nivel: 3,
    texto: 'Um amigo contou um segredo e pediu para você guardar.',
    cara: '🤫',
    opcoes: [
      { texto: 'Guardar o segredo', certo: true, feedback: 'Guardar segredo mostra que ele pode confiar em você.' },
      { texto: 'Contar para todo mundo', feedback: 'Contar quebra a confiança do amigo.' },
      { texto: 'Dar risada e espalhar', feedback: 'Espalhar pode magoar muito o amigo.' },
    ],
  },
]
