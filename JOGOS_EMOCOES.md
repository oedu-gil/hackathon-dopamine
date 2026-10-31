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
| 1 | **Chuva de emoções** | Arcade | Reconhecer emoções | Rostos caem e a criança pega só a emoção pedida. |
| 2 | **Plataforma do amigo** | Plataforma | Resposta social, empatia | O personagem encontra um amigo numa situação social e pula para a plataforma com a atitude certa. |
| 3 | **História com escolhas** | Calmo, sem tempo | Causa e efeito social, empatia | Uma história curta em que a criança escolhe o que o personagem faz e vê a consequência. |

Descartados: "Corrida das reações" e "Respire e acalme".

### Níveis
O nível (1 a 3) vem do PDI. Quanto menor o nível da criança numa habilidade, maior a prioridade do jogo. O nível também ajusta o conteúdo:
- **Chuva de emoções**: 3, 5 ou 7 emoções diferentes, e a queda fica um pouco mais rápida.
- **Plataforma do amigo**: situações mais sutis nos níveis altos.
- **História com escolhas**: histórias mais complexas nos níveis altos.

### Cuidados com o público
- Velocidade ajustável (lenta, normal, rápida).
- Opção de reduzir efeitos (animações).
- Nada pune o erro: a criança recebe uma dica gentil e tenta de novo.
- Um jogo calmo e sem tempo, para quem se sobrecarrega com ação.

## Recomendação (regras por tags)
Para cada jogo, soma-se `4 - nível` das habilidades do PDI que ele treina. Quanto menor o nível da criança, maior a pontuação. Jogos sem nenhuma habilidade em comum não aparecem. O resultado vem ordenado e com o motivo ("Trabalha X, nível Y"). O hiperfoco **não** entra na recomendação, só no visual e na recompensa.

## Hiperfocos do MVP
| Hiperfoco | Personagem | Itens desbloqueáveis |
|-----------|-----------|----------------------|
| Trem | Tito | Locomotiva a vapor, Vagão, Trem-bala, Metrô, Bonde |
| Aranha | Teca | Teia, Aranha-saltadora, Aranha-de-jardim, Casulo, Teia de orvalho |
| Avião | Avi | Aviãozinho, Jato, Helicóptero, Decolagem, Foguete |
| Dinossauro | Rex | Tiranossauro, Diplodoco, Ovo, Fóssil, Vulcão |

Os itens são desbloqueados com 5, 12, 22, 35 e 50 acertos acumulados naquele hiperfoco. O progresso fica salvo no navegador (localStorage).

## Pontos em aberto (o grupo pode mudar)
Para o MVP foram usados estes valores provisórios. São fáceis de trocar, porque o conteúdo fica separado do código em `app/src/data/`.
- **Assets**: emojis no lugar de desenhos. Dá para trocar por imagens depois.
- **Hiperfocos**: quatro no banco. Adicionar outro é incluir um objeto em `app/src/data/hiperfocos.js`.
- **Persistência**: só no navegador do aparelho, sem servidor.
- **Faixa etária** e **formato final do PDI**: ainda a definir. Hoje o PDI é uma lista de habilidades com nível de 1 a 3.

## Como rodar
```sh
cd app
npm install
npm run dev     # abre em http://localhost:5173
npm test        # testes do motor de recomendação
npm run build
```

## Estrutura
```
app/src/
  data/          conteúdo: habilidades, hiperfocos, emoções, situações, histórias e catálogo de jogos
  recomendacao.js  motor de recomendação (função pura, com testes)
  progresso.js     coleção e desbloqueio de itens (localStorage)
  games/           cenas Phaser dos 3 jogos e componentes comuns (ui.js)
  telas/           telas React (PDI, escolha de hiperfoco, jogos, coleção)
  PhaserGame.jsx   ponte React <-> Phaser
```
