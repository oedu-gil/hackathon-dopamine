// "{p}" é trocado pelo nome do personagem do hiperfoco escolhido.
// A primeira escolha de cada passo é a certa; o jogo embaralha a ordem.
export const HISTORIAS = [
  {
    nivel: 1,
    titulo: 'O novo amigo',
    passos: [
      {
        texto: '{p} chegou à escola e viu um colega novo sozinho.',
        escolhas: [
          { texto: 'Dizer oi e se apresentar', certo: true, consequencia: 'O colega sorriu. Ele estava com vergonha.' },
          { texto: 'Passar direto', consequencia: 'O colega ficou ainda mais sozinho.' },
        ],
      },
      {
        texto: 'O colega mostrou um desenho. {p} achou o desenho bonito.',
        escolhas: [
          { texto: 'Elogiar o desenho', certo: true, consequencia: 'O colega ficou muito feliz!' },
          { texto: 'Dizer que não gostou', consequencia: 'O colega ficou triste. Palavras podem machucar.' },
        ],
      },
      {
        texto: 'Chegou a hora do recreio.',
        escolhas: [
          { texto: 'Convidar o colega para brincar', certo: true, consequencia: 'Agora eles brincam juntos!' },
          { texto: 'Brincar sozinho', consequencia: 'O colega queria companhia. Que tal convidar?' },
        ],
      },
    ],
    final: '{p} fez um novo amigo!',
  },
  {
    nivel: 2,
    titulo: 'A vez de cada um',
    passos: [
      {
        texto: '{p} e um amigo querem o mesmo brinquedo.',
        escolhas: [
          { texto: 'Propor: primeiro você, depois eu', certo: true, consequencia: 'O amigo concordou e os dois ficaram contentes.' },
          { texto: 'Puxar o brinquedo', consequencia: 'O amigo ficou bravo, e o brinquedo quase quebrou.' },
          { texto: 'Gritar para ele largar', consequencia: 'Gritar assustou o amigo.' },
        ],
      },
      {
        texto: 'O amigo está demorando na vez dele. {p} está ficando impaciente.',
        escolhas: [
          { texto: 'Respirar fundo e esperar', certo: true, consequencia: 'Esperar ficou mais fácil. A vez de {p} já vai chegar.' },
          { texto: 'Gritar para ele se apressar', consequencia: 'O amigo ficou nervoso e demorou ainda mais.' },
        ],
      },
      {
        texto: 'Chegou a vez de {p}. O amigo agradeceu a espera.',
        escolhas: [
          { texto: 'Dizer: de nada!', certo: true, consequencia: 'Os dois sorriram.' },
          { texto: 'Fingir que não ouviu', consequencia: 'O amigo ficou sem saber se {p} ouviu.' },
        ],
      },
    ],
    final: '{p} aprendeu que esperar a vez rende boas brincadeiras!',
  },
  {
    nivel: 3,
    titulo: 'O dia ruim',
    passos: [
      {
        texto: 'O amigo de {p} está de cara fechada e não quer falar.',
        escolhas: [
          { texto: 'Perguntar se ele quer conversar ou ficar um pouco sozinho', certo: true, consequencia: 'O amigo disse que queria conversar, mais tarde.' },
          { texto: 'Insistir até ele responder', consequencia: 'O amigo ficou ainda mais irritado.' },
          { texto: 'Rir da cara dele', consequencia: 'O amigo se sentiu mal.' },
        ],
      },
      {
        texto: 'Mais tarde, o amigo contou que tirou uma nota ruim e está triste.',
        escolhas: [
          { texto: 'Dizer que entende que é chato e oferecer ajuda', certo: true, consequencia: 'O amigo se sentiu compreendido.' },
          { texto: 'Dizer que isso não é nada', consequencia: 'O amigo sentiu que não foi levado a sério.' },
        ],
      },
      {
        texto: 'Depois de conversar, o amigo ficou mais calmo.',
        escolhas: [
          { texto: 'Convidar para uma atividade tranquila juntos', certo: true, consequencia: 'Eles desenharam juntos e o dia melhorou.' },
          { texto: 'Contar para a turma toda', consequencia: 'O amigo ficou envergonhado. Era algo particular.' },
        ],
      },
    ],
    final: '{p} foi um ótimo amigo num dia difícil!',
  },
]
