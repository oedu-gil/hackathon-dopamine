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

  // ---- nível 1 ----
  {
    nivel: 1,
    titulo: 'O dia de chuva',
    passos: [
      {
        texto: '{p} viu que o amigo estava sem guarda-chuva na saída da escola.',
        escolhas: [
          { texto: 'Oferecer para dividir o guarda-chuva', certo: true, consequencia: 'O amigo agradeceu e não se molhou.' },
          { texto: 'Sair correndo sozinho', consequencia: 'O amigo ficou molhado e sozinho.' },
        ],
      },
      {
        texto: 'No caminho, o amigo escorregou e se machucou de leve.',
        escolhas: [
          { texto: 'Parar e ajudar a levantar', certo: true, consequencia: 'O amigo sorriu, agradecido.' },
          { texto: 'Rir da queda', consequencia: 'O amigo ficou envergonhado e triste.' },
        ],
      },
      {
        texto: 'O amigo disse: obrigado por me ajudar!',
        escolhas: [
          { texto: 'Responder: de nada, amigos se ajudam', certo: true, consequencia: 'Os dois seguiram conversando e rindo.' },
          { texto: 'Fingir que não ouviu', consequencia: 'O amigo ficou sem saber se {p} ouviu.' },
        ],
      },
    ],
    final: '{p} e o amigo chegaram em casa felizes!',
  },
  {
    nivel: 1,
    titulo: 'O lanche repartido',
    passos: [
      {
        texto: '{p} abriu o lanche e viu que o colega ao lado não trouxe nada.',
        escolhas: [
          { texto: 'Oferecer um pedaço', certo: true, consequencia: 'O colega ficou muito agradecido.' },
          { texto: 'Esconder o lanche', consequencia: 'O colega ficou com fome e triste.' },
        ],
      },
      {
        texto: 'O colega derrubou um pouco de suco na mesa.',
        escolhas: [
          { texto: 'Ajudar a limpar e dizer: acontece', certo: true, consequencia: 'O colega respirou aliviado.' },
          { texto: 'Brigar com o colega', consequencia: 'O colega ficou assustado e quase chorou.' },
        ],
      },
      {
        texto: 'Na hora de guardar, sobrou lixo na mesa.',
        escolhas: [
          { texto: 'Limpar a mesa juntos', certo: true, consequencia: 'A mesa ficou limpa rapidinho.' },
          { texto: 'Deixar tudo para os outros', consequencia: 'Alguém teve de limpar sozinho.' },
        ],
      },
    ],
    final: '{p} aprendeu que dividir deixa todo mundo feliz!',
  },

  // ---- nível 2 ----
  {
    nivel: 2,
    titulo: 'O trabalho em grupo',
    passos: [
      {
        texto: '{p} está num grupo para fazer um cartaz. Cada um tem uma ideia diferente.',
        escolhas: [
          { texto: 'Ouvir todas as ideias e escolher juntos', certo: true, consequencia: 'Todo mundo se sentiu ouvido.' },
          { texto: 'Impor a sua ideia', consequencia: 'O grupo ficou chateado.' },
          { texto: 'Não falar nada', consequencia: 'A ideia de {p} ficou de fora.' },
        ],
      },
      {
        texto: 'Um colega do grupo não está ajudando.',
        escolhas: [
          { texto: 'Convidar o colega para uma tarefa de que ele goste', certo: true, consequencia: 'O colega aceitou e começou a ajudar.' },
          { texto: 'Fazer tudo sozinho e reclamar', consequencia: 'Ninguém se sentiu parte do trabalho.' },
        ],
      },
      {
        texto: 'O cartaz ficou pronto e a professora elogiou.',
        escolhas: [
          { texto: 'Dividir o elogio com todo o grupo', certo: true, consequencia: 'O grupo inteiro ficou orgulhoso.' },
          { texto: 'Dizer que fez tudo sozinho', consequencia: 'Os colegas ficaram magoados.' },
        ],
      },
    ],
    final: '{p} aprendeu que juntos o trabalho fica melhor!',
  },
  {
    nivel: 2,
    titulo: 'Pedir desculpas',
    passos: [
      {
        texto: '{p} estragou, sem querer, o desenho de um amigo.',
        escolhas: [
          { texto: 'Contar a verdade e pedir desculpas', certo: true, consequencia: 'O amigo ficou triste, mas valorizou a sinceridade.' },
          { texto: 'Esconder e fingir que não foi nada', consequencia: 'O amigo percebeu e ficou ainda mais chateado.' },
        ],
      },
      {
        texto: 'O amigo está bravo e não quer falar agora.',
        escolhas: [
          { texto: 'Dar um tempo e voltar mais tarde', certo: true, consequencia: 'Mais calmo, o amigo aceitou conversar.' },
          { texto: 'Ficar insistindo sem parar', consequencia: 'O amigo ficou ainda mais irritado.' },
        ],
      },
      {
        texto: 'Mais tarde, {p} quer ajudar a resolver o problema.',
        escolhas: [
          { texto: 'Fazer um desenho novo junto com o amigo', certo: true, consequencia: 'Os dois se divertiram e fizeram as pazes.' },
          { texto: 'Dizer: já pedi desculpas, chega', consequencia: 'O amigo sentiu que {p} não se importava.' },
        ],
      },
    ],
    final: '{p} aprendeu que pedir desculpas e ajudar conserta as coisas!',
  },

  // ---- nível 3 ----
  {
    nivel: 3,
    titulo: 'O boato',
    passos: [
      {
        texto: '{p} ouviu um boato sobre um colega.',
        escolhas: [
          { texto: 'Não repetir e perguntar ao colega se é verdade', certo: true, consequencia: 'O colega agradeceu a chance de explicar.' },
          { texto: 'Contar para todo mundo', consequencia: 'O boato cresceu e magoou o colega.' },
          { texto: 'Acreditar e se afastar do colega', consequencia: 'O colega ficou sem entender e se sentiu sozinho.' },
        ],
      },
      {
        texto: 'O colega disse que o boato é mentira e está triste.',
        escolhas: [
          { texto: 'Acreditar nele e dar apoio', certo: true, consequencia: 'O colega se sentiu mais forte.' },
          { texto: 'Dizer: não é problema meu', consequencia: 'O colega ficou ainda mais sozinho.' },
        ],
      },
      {
        texto: 'Alguém continua espalhando o boato.',
        escolhas: [
          { texto: 'Avisar um adulto de confiança', certo: true, consequencia: 'O adulto conversou com a turma e o boato parou.' },
          { texto: 'Espalhar outro boato para se vingar', consequencia: 'Agora havia dois problemas em vez de um.' },
        ],
      },
    ],
    final: '{p} foi um amigo de confiança!',
  },
  {
    nivel: 3,
    titulo: 'Mudança de planos',
    passos: [
      {
        texto: 'O passeio de {p} com os amigos foi cancelado por causa da chuva.',
        escolhas: [
          { texto: 'Respirar fundo e pensar em outra atividade', certo: true, consequencia: 'A frustração diminuiu e surgiram boas ideias.' },
          { texto: 'Gritar que tudo é injusto', consequencia: 'Gritar não trouxe o passeio de volta e deixou todos nervosos.' },
        ],
      },
      {
        texto: 'Um amigo ficou chateado e começou a chorar.',
        escolhas: [
          { texto: 'Dizer que também está chateado, mas que vão achar algo legal', certo: true, consequencia: 'O amigo se sentiu compreendido.' },
          { texto: 'Mandar o amigo parar de chorar', consequencia: 'O amigo sentiu que não podia mostrar o que sentia.' },
        ],
      },
      {
        texto: 'Eles escolhem um jogo de tabuleiro, mas discordam das regras.',
        escolhas: [
          { texto: 'Combinar regras que os dois aceitem', certo: true, consequencia: 'O jogo começou e todos se divertiram.' },
          { texto: 'Desistir e sair da sala', consequencia: 'O amigo ficou sozinho e a brincadeira acabou.' },
        ],
      },
    ],
    final: '{p} aprendeu a lidar com planos que mudam!',
  },
]
