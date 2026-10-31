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

  // ---- nível 1 ----
  {
    nivel: 1,
    texto: 'Um amigo derrubou o lanche no chão e ficou chateado.',
    cara: '😞',
    opcoes: [
      { texto: 'Oferecer um pedaço do seu lanche', certo: true, feedback: 'Dividir ajuda o amigo a se sentir melhor.' },
      { texto: 'Dizer que a culpa é dele', feedback: 'Culpar só deixa o amigo pior.' },
      { texto: 'Ir embora comendo o seu lanche', feedback: 'Ele ficaria sozinho e ainda mais triste.' },
    ],
  },
  {
    nivel: 1,
    texto: 'Um amigo está com medo do trovão.',
    cara: '😨',
    opcoes: [
      { texto: 'Ficar perto e dizer: estou aqui com você', certo: true, feedback: 'Companhia faz o medo diminuir.' },
      { texto: 'Dizer que ele é bobo por ter medo', feedback: 'Todo mundo sente medo às vezes.' },
      { texto: 'Sair correndo e deixá-lo sozinho', feedback: 'Ele precisava de alguém por perto.' },
    ],
  },
  {
    nivel: 1,
    texto: 'Um amigo emprestou um lápis para você.',
    cara: '🙂',
    opcoes: [
      { texto: 'Dizer obrigado e devolver depois', certo: true, feedback: 'Agradecer e devolver mostra respeito.' },
      { texto: 'Guardar na mochila sem falar nada', feedback: 'O lápis é dele, então é preciso devolver.' },
      { texto: 'Quebrar a ponta de propósito', feedback: 'Cuidar das coisas dos outros é importante.' },
    ],
  },
  {
    nivel: 1,
    texto: 'Você chegou à sala e um amigo disse bom dia.',
    cara: '😄',
    opcoes: [
      { texto: 'Responder: bom dia!', certo: true, feedback: 'Cumprimentar faz o amigo se sentir bem-vindo.' },
      { texto: 'Olhar para o chão e não responder', feedback: 'Ele pode achar que você não quer conversar.' },
      { texto: 'Dizer: me deixa em paz', feedback: 'Palavras gentis ajudam mais.' },
    ],
  },

  // ---- nível 2 ----
  {
    nivel: 2,
    texto: 'Um amigo não foi escolhido para o time e ficou triste.',
    cara: '😢',
    opcoes: [
      { texto: 'Convidar o amigo para o seu time', certo: true, feedback: 'Incluir faz a pessoa se sentir importante.' },
      { texto: 'Rir dele', feedback: 'Rir de quem está triste machuca.' },
      { texto: 'Fingir que não viu', feedback: 'Ele precisava de um gesto de amizade.' },
    ],
  },
  {
    nivel: 2,
    texto: 'Um amigo está falando e você quer contar uma novidade.',
    cara: '🗣️',
    opcoes: [
      { texto: 'Esperar ele terminar e depois contar', certo: true, feedback: 'Esperar a vez de falar mostra respeito.' },
      { texto: 'Interromper gritando', feedback: 'Interromper atrapalha a conversa.' },
      { texto: 'Ir embora sem dizer nada', feedback: 'Dá para esperar só um pouquinho.' },
    ],
  },
  {
    nivel: 2,
    texto: 'Um amigo derrubou os seus blocos sem querer.',
    cara: '😬',
    opcoes: [
      { texto: 'Respirar fundo e dizer: tudo bem, vamos montar de novo', certo: true, feedback: 'Calma ajuda a resolver o problema juntos.' },
      { texto: 'Derrubar os blocos dele também', feedback: 'Revidar só cria outro problema.' },
      { texto: 'Chorar e gritar com ele', feedback: 'Foi sem querer, e gritar não conserta.' },
    ],
  },
  {
    nivel: 2,
    texto: 'Um amigo não entendeu a regra do jogo.',
    cara: '🤔',
    opcoes: [
      { texto: 'Explicar de novo com calma', certo: true, feedback: 'Explicar com paciência ajuda todo mundo a brincar.' },
      { texto: 'Dizer que ele é lento', feedback: 'Isso o deixaria envergonhado.' },
      { texto: 'Jogar sem ele', feedback: 'Ele ficaria de fora da brincadeira.' },
    ],
  },

  // ---- nível 3 ----
  {
    nivel: 3,
    texto: 'Um amigo contou uma mentira para não ficar encrencado.',
    cara: '😬',
    opcoes: [
      { texto: 'Conversar e incentivá-lo a falar a verdade', certo: true, feedback: 'Ajudar o amigo a ser honesto é cuidar dele.' },
      { texto: 'Espalhar a mentira para a turma', feedback: 'Isso só aumenta o problema.' },
      { texto: 'Rir e ajudar a mentir', feedback: 'A mentira pode deixar tudo pior depois.' },
    ],
  },
  {
    nivel: 3,
    texto: 'Um grupo está deixando um colega de fora da brincadeira.',
    cara: '😔',
    opcoes: [
      { texto: 'Chamar o colega e incluí-lo', certo: true, feedback: 'Incluir faz o colega se sentir parte do grupo.' },
      { texto: 'Entrar na brincadeira e ignorar o colega', feedback: 'Ele continuaria sozinho e triste.' },
      { texto: 'Rir junto com o grupo', feedback: 'Isso machuca quem está de fora.' },
    ],
  },
  {
    nivel: 3,
    texto: 'Um amigo ganhou o jogo e você perdeu.',
    cara: '😎',
    opcoes: [
      { texto: 'Parabenizar o amigo e pedir uma revanche', certo: true, feedback: 'Saber perder também é uma habilidade.' },
      { texto: 'Dizer que ele trapaceou, sem provas', feedback: 'Acusar sem provas magoa o amigo.' },
      { texto: 'Jogar o tabuleiro no chão', feedback: 'Isso estraga o jogo para todos.' },
    ],
  },
  {
    nivel: 3,
    texto: 'Um amigo diz que está bem, mas parece chateado.',
    cara: '😶',
    opcoes: [
      { texto: 'Perguntar com carinho se ele quer conversar', certo: true, feedback: 'Perceber os sinais ajuda a cuidar do amigo.' },
      { texto: 'Acreditar e nunca mais perguntar', feedback: 'Ele pode precisar de ajuda mesmo assim.' },
      { texto: 'Fazer piadas até ele rir', feedback: 'Respeite o tempo dele em vez de forçar.' },
    ],
  },
]
