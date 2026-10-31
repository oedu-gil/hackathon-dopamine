# Jogos de habilidades sociais e emoções

Plano aprovado pelo grupo para o MVP de jogos. A implementação está em [app/](app/).

## Ideia
Uma plataforma em que o professor registra o PDI de uma criança neurodivergente e o site recomenda jogos para trabalhar o que ela precisa. Este documento cobre só a parte dos **jogos**. A leitura do PDI (PDF) fica para depois.

## Decisões do grupo
- Foco do MVP: **habilidades sociais e emoções**.
- O PDI chega **já estruturado** (sem leitura de PDF por enquanto).
- **Mini-jogos próprios**, jogáveis no site, feitos em **Phaser**. As telas do site usam **React**.
- Recomendação por **regras com tags**: cada jogo declara as habilidades que treina, e o código cruza com as habilidades do PDI.
- Prioridade da demo: equilíbrio entre diversão/impacto visual e base pedagógica clara.
- **Sem microfone e sem câmera**: só toque, clique ou teclado.
- Os jogos giram em torno do **hiperfoco da criança**, e é **ela quem escolhe** o hiperfoco numa etapa inicial, a partir de um banco de hiperfocos comuns.

## Fluxo
1. O professor preenche o PDI estruturado (habilidades-alvo e nível de cada uma).
2. **A criança escolhe o hiperfoco** (trem, aranha, avião, dinossauro).
3. O site mostra os jogos recomendados, com a justificativa pedagógica.
4. A criança joga com o visual do hiperfoco. Cada acerto a aproxima de **desbloquear um item daquele hiperfoco** (ex.: um vagão, um trem-bala), numa coleção que cresce entre as partidas.

## Os 3 jogos
| # | Jogo | Estilo | Habilidades | Como funciona |
|---|------|--------|-------------|---------------|
| 1 | **Chuva de emoções** | Arcade | Reconhecer emoções | Rostos caem e a criança pega só a emoção pedida. Começa devagar, com poucos rostos, e acelera a cada acerto. Acertos em sequência dão **combo**, e de vez em quando cai uma 🌟 que dá um **super** (pega rostos num raio maior por 6 segundos). |
| 2 | **Plataforma do amigo** | Plataformer (estilo Mario) | Resposta social, empatia | Fase de rolagem lateral com **pulo duplo**, **molas** que lançam para plataformas altas, **lesmas 🐌** para pisar e estrelas. Ao chegar num amigo aparece a situação social, e a criança escolhe a atitude. O **amigo ajudado passa a seguir o personagem** e a pegar estrelas. Ao ajudar todos, chega à bandeira. |
| 3 | **Cuidar do amigo** | Calmo, sem tempo, sem leitura | Empatia, causa e efeito social | Um amigo mostra um sentimento (triste, com medo, bravo, com fome…). A criança **arrasta ou toca** o item que ajuda (abraço, curativo, lanche, luz…) e o amigo reage feliz. Tudo por figuras; o texto é só apoio. |

Descartados: "Corrida das reações", "Respire e acalme" e "História com escolhas" (saiu do jogo a pedido do grupo, para dar lugar ao Cuidar do amigo; o conteúdo das histórias continua em `app/src/data/historias.js`, sem uso por enquanto).

### Níveis
O nível (1 a 3) vem do PDI. Quanto menor o nível da criança numa habilidade, maior a prioridade do jogo. O nível também ajusta o conteúdo:
- **Chuva de emoções**: 3, 5 ou 7 emoções diferentes, e a queda fica um pouco mais rápida.
- **Plataforma do amigo**: situações mais sutis nos níveis altos. Controles: setas/WASD e espaço, ou os botões de toque na tela. Cair no buraco ou esbarrar numa lesma só empurra de volta, e as estrelas são só diversão (não contam para a coleção).
- **Cuidar do amigo**: sentimentos mais sutis e situações mais complexas nos níveis altos.

### Público: crianças de 4 a 10 anos
Um estilo único para toda a faixa. A dificuldade se ajusta pelo nível do PDI, e não há modos separados por idade. O **Cuidar do amigo** é feito para quem ainda não lê, porque usa só figuras. Na Plataforma do amigo, as situações são frases, e uma criança de 4 a 6 anos pode precisar de um adulto para ler com ela (veja os pontos em aberto).

### Animação e sons
Para deixar os jogos mais animados (todos os itens abaixo respeitam as opções do menu):
- **Efeitos de recompensa:** chuva de estrelinhas e confete a cada acerto, "pulinho de alegria" do personagem, celebração maior ao desbloquear um item e confete na tela final.
- **Personagem e cenário vivos:** o personagem respira, quica ao andar e estica ao pular; os amigos balançam chamando; a bandeira acena; as nuvens passam à deriva; os rostos da Chuva de emoções balançam ao cair.
- **Sons e música:** gerados no próprio navegador (Web Audio), sem arquivos de áudio. Há som de acerto, de pulo, de estrela, de item desbloqueado e de fim de jogo, e uma melodia suave de fundo. O som de erro é de duas notas descendo, sem buzina.
- **Controle sensorial:** no menu de jogos, **Reduzir efeitos**, **Sons** e **Música** podem ser desligados separadamente. O volume é baixo por padrão.

### Cuidados com o público
- Velocidade ajustável (lenta, normal, rápida).
- Opção de reduzir efeitos (animações), de desligar sons e de desligar a música.
- Nada pune o erro: a criança recebe uma dica gentil e tenta de novo.
- Um jogo calmo e sem tempo, para quem se sobrecarrega com ação.

## Recomendação (regras por tags)
Para cada jogo, soma-se `4 - nível` das habilidades do PDI que ele treina. Quanto menor o nível da criança, maior a pontuação. Jogos sem nenhuma habilidade em comum não aparecem. O resultado vem ordenado e com o motivo ("Trabalha X, nível Y"). O hiperfoco **não** entra na recomendação, só no visual e na recompensa.

## Análise de desempenho (para o educador)
Cada tentativa nos jogos (acerto ou erro) é registrada com jogo, nível, hiperfoco e hora. O botão **📊 Desempenho (educador)** mostra, por aluno:
- total de tentativas, acertos, erros e taxa de acerto;
- o mesmo por **habilidade do PDI** e por **jogo**, com uma barra de acertos e erros;
- uma **estimativa de aprendizado** por habilidade, e um **CSV** para baixar.

O que conta como tentativa: na Chuva de emoções, cada rosto pego (certo ou errado); na Plataforma do amigo, cada opção escolhida na conversa com o amigo; no Cuidar do amigo, cada item usado no amigo. Rosto que passa sem ser pego, estrelas e lesmas não contam.

A estimativa compara a **primeira e a segunda metade** das tentativas, em ordem de tempo:

| Estado | Regra |
|--------|-------|
| Poucos dados | menos de 10 tentativas |
| Consolidando | acertos recentes de 80% ou mais |
| Evoluindo | a taxa subiu 10 pontos ou mais (e a recente é menor que 80%) |
| Precisa de apoio | acertos recentes abaixo de 50% e sem melhora |
| Estável | os demais casos |

Uma habilidade reúne as tentativas de **todos os jogos que a treinam** (ex.: empatia soma Plataforma do amigo e Cuidar do amigo).

**Limites a ter em mente:** é uma estimativa orientativa, não um diagnóstico, e não substitui a avaliação do educador. Os limiares (10 tentativas, 80%, 50%, 10 pontos) são valores provisórios do MVP que o grupo pode ajustar em `app/src/analise.js`. Na Chuva de emoções, a criança pode acertar por acaso ao mover o personagem. O registro é por nome do aluno e fica só no navegador do aparelho, sem servidor. Dois alunos com o mesmo nome se misturam.

## Hiperfocos do MVP
Cada hiperfoco tem **10 itens** para desbloquear (o último é o troféu do hiperfoco):

| Hiperfoco | Personagem | Itens desbloqueáveis |
|-----------|-----------|----------------------|
| Trem | Tito | Locomotiva a vapor, Vagão, Trem-bala, Metrô, Bonde, Estação, Trilhos, Semáforo, Monotrilho, Trem de montanha |
| Aranha | Teca | Teia, Aranha-saltadora, Aranha-de-jardim, Casulo, Teia de orvalho, Fio de seda, Lupa do cientista, Aranha-pavão, Caranguejeira, Rainha das teias |
| Avião | Avi | Aviãozinho, Jato, Helicóptero, Decolagem, Foguete, Torre de controle, Nuvem, Balão de ar quente, Passaporte, Piloto campeão |
| Dinossauro | Rex | Tiranossauro, Diplodoco, Ovo, Fóssil, Vulcão, Pegadas, Palmeira gigante, Cometa, Museu de fósseis, Rei dos dinossauros |

Os itens são desbloqueados com **5, 12, 22, 35, 50, 68, 88, 110, 135 e 165** acertos acumulados naquele hiperfoco. Os primeiros marcos vêm rápido, para motivar, e os últimos pedem mais prática. O progresso fica salvo no navegador (localStorage).

## Variedade dos jogos
- **Conteúdo:** 21 situações para a Plataforma do amigo (8 de nível 1, 7 de nível 2 e 6 de nível 3) e 12 sentimentos para o Cuidar do amigo (6, 4 e 2 por nível). Cada nível usa o conteúdo dele e o dos níveis abaixo.
- **Sem repetir:** o jogo lembra o que cada aluno já viu e só repete depois de mostrar tudo o que existe naquele nível, começando pelo que foi visto há mais tempo (`app/src/variedade.js`).
- **Plataforma do amigo:** cada partida sorteia 5 situações, a ordem dos amigos e quais animais aparecem. A ordem das opções também é embaralhada.
- **Cuidar do amigo:** cada partida sorteia 5 sentimentos, o animal que é o amigo e quais itens aparecem na bandeja (1 ou 2 certos e o resto errados), em ordem embaralhada.
- **Adicionar conteúdo:** basta incluir itens em `app/src/data/situacoes.js` ou `app/src/data/cuidados.js`. Os testes de conteúdo (`conteudo.test.js`) avisam se algo for escrito errado, como uma situação sem opção certa.

## Pontos em aberto (o grupo pode mudar)
Para o MVP foram usados estes valores provisórios. São fáceis de trocar, porque o conteúdo fica separado do código em `app/src/data/`.
- **Assets**: emojis no lugar de desenhos. Dá para trocar por imagens depois.
- **Hiperfocos**: quatro no banco. Adicionar outro é incluir um objeto em `app/src/data/hiperfocos.js`.
- **Persistência**: só no navegador do aparelho, sem servidor.
- **Formato final do PDI**: ainda a definir. Hoje o PDI é uma lista de habilidades com nível de 1 a 3. A faixa etária já está decidida: 4 a 10 anos.
- **Leitura em voz alta:** não foi implementada. Para crianças de 4 a 6 anos que ainda não leem, o navegador poderia ler as situações e opções em português (síntese de voz, sem microfone). Fica como próxima etapa, se o grupo quiser.

## Como rodar
```sh
cd app
npm install
npm run dev     # abre em http://localhost:5173
npm test        # testes da recomendação e da análise de desempenho
npm run build
```

## Estrutura
```
app/src/
  data/          conteúdo: habilidades, hiperfocos, emoções, situações, cuidados, histórias (sem uso) e catálogo de jogos
  recomendacao.js  motor de recomendação (função pura, com testes)
  progresso.js     coleção e desbloqueio de itens (localStorage)
  desempenho.js    registro de cada tentativa (localStorage)
  analise.js       estimativa de aprendizado (função pura, com testes)
  variedade.js     sorteio que evita repetir situações e sentimentos
  audio.js         sons e música gerados no navegador (Web Audio)
  games/           cenas Phaser dos 3 jogos e componentes comuns (ui.js)
  telas/           telas React (PDI, escolha de hiperfoco, jogos, coleção, desempenho)
  PhaserGame.jsx   ponte React <-> Phaser
```
