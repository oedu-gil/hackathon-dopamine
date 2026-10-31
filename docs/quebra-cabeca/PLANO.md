# Quebra-cabeça — plano de execução

Etapa 4 de `docs/DELEGACAO-CLAUDE.md`. **Plano e protótipo aprovados pelo grupo em 30/10/2026.** Decisões: peça errada fica no tabuleiro, sem imagem-guia, cor da cartolina entra, faixa de 4 a 10 anos. O protótipo está em `estudos/prototipo.html`.

Base: branch `codex/miguel/quebra-cabeca`, criada a partir de `9d0de9c`, com Phaser 4.2.1 e Vite 8.3.5. A versão do Phaser não muda e nenhuma dependência nova entra.

## 0. Mudança de destino: o jogo entrou no hub (31/10/2026)

O jogo foi implementado em `hub/src/jogos/quebra-cabeca/` (branch `codex/miguel/quebra-cabeca-hub`), seguindo `hub/src/jogos/contrato.js`, e não em `src/games/puzzle/`. As seções 1 a 4 abaixo são o plano original; esta seção diz o que mudou. Decisões do grupo para a versão no hub:

1. **Som:** começa sempre desligado. Se o hub mandar `sons: false`, o botão Som não aparece.
2. **Cor da cartolina:** pêssego fixo. A lista das 4 cores fica pronta em `layout.js`.
3. **Imagens:** ficam as do protótipo (trem, baleia e foguete) e entram aranha, avião e dinossauro, uma por tema do hub.
4. **Fontes:** a Atkinson Hyperlegible foi copiada para a pasta do jogo, e a Baloo 2 (peso 800) foi baixada uma vez como arquivo `woff2`. As duas têm licença OFL e não entram como dependência no npm.
5. **Saída:** vale a confirmação do hub ("Quer sair do jogo?"), igual em todos os jogos.

| Plano original | No hub |
|---|---|
| `src/games/puzzle/` | `hub/src/jogos/quebra-cabeca/`: `rules.js`, `layout.js`, `composeImage.js`, `PuzzleScene.js`, `demo.js`, `som.js`, `index.js`, `manifesto.js`, `quebra-cabeca.css` e `assets/` |
| `main.js` + `puzzle.html` | `index.js` com `montar(elemento, params)` → `desmontar()`. A entrada individual é `hub/jogo.html?id=quebra-cabeca&tema=trem`. |
| `public/assets/demo/puzzle/` | `quebra-cabeca/assets/` (SVGs importados) |
| `tests/puzzle-rules.test.js` | `hub/tests/quebra-cabeca.test.js` |
| `?img=baleia` | `jogo.html?id=quebra-cabeca&img=baleia` (ou `foguete`, 1:1). Sem `img`, a imagem é a do tema. |

Os ajustes da seção 4 deixaram de depender do Codex:

1. **Página no build:** o `vite.config.js` do hub já gera `jogo.html`. O pacote do quebra-cabeça só importa Phaser e `BaseGameScene`, conferido no build.
2. **Falha de imagem:** o `index.js` mostra a própria tela, com "Tentar de novo" (`scene.restart`) e "Sair" (`aoSair`). A `BaseGameScene` não foi alterada.
3. **Montar de novo:** o contrato do hub prevê `aoTerminar` uma vez por partida e não usa `activityId`, então uma partida nova envia um resultado novo.
4. **`settings.puzzle`:** o hub não passa `settings`. A atividade de demonstração monta `settings.puzzle.cardColor = 'pessego'` dentro do próprio jogo.

Diferenças em relação ao protótipo:

- O botão Sair saiu da barra e das telas de carregamento e de início, porque o Sair é do hub. A confirmação do hub não tem a frase "As peças desta partida não ficam guardadas" e aparece também no início e no fim. Os botões Sair das telas de erro e de conclusão chamam `aoSair` direto.
- Sem o Sair, a instrução fica centralizada no espaço à esquerda de Ajuda e Som.
- A legenda "Tema: …" sai num peso só, sem o "Tema:" em negrito.
- As imagens dentro das peças têm cantos retos (no protótipo eram levemente arredondados).
- As telas de carregamento, de erro e "Gire o tablet" são HTML por cima do canvas. Um leitor de tela ouve a instrução da barra por uma região `aria-live`.
- A baleia ganhou uma nuvem e uma gaivota, e o foguete ganhou um planeta, um cometa e uma estrela: no protótipo, dois recortes de cada um ficavam quase iguais.
- O desfoque da sobra (imagens fora de 5:3) usa redução de 10×, para manter as formas reconhecíveis como no protótipo.

**Habilidade no manifesto:** `relacao-parte-todo`. O hub não confere a lista de habilidades; combinar com quem cuida do PDI continua pendente.

## 1. Módulos

Tudo fica em `src/games/puzzle/`, menos a página de entrada.

| Arquivo | Função | Novo ou alterado |
|---|---|---|
| `puzzleRules.js` | Regras sem Phaser: estado da partida, selecionar, colocar, trocar, devolver, ajuda e contagem. Funções puras, testáveis com `node --test`. | Novo |
| `layout.js` | Geometria de 960 × 600 (barra, modelo, tabuleiro, bandeja, casas e lugares) e a paleta da direção B. | Novo |
| `composeImage.js` | Recebe a imagem carregada e devolve um canvas 5:3 (1000 × 600): a imagem inteira no centro e a sobra preenchida com ela mesma ampliada e desfocada. O desfoque é feito reduzindo e ampliando a imagem, o que funciona em todos os navegadores. Daí saem os 15 recortes como frames da textura. | Novo |
| `PuzzleScene.js` | Estende `BaseGameScene`. Desenha estados, peças, dica e textos; liga toque e clique às regras; faz animações (duração 0 com `reducedMotion`); chama `finish`. | Alterado (hoje é só o esqueleto) |
| `main.js` | Entrada individual: cria o `Phaser.Game` só com `PuzzleScene` e a atividade de demonstração. Ouve `activity-result` e, ao sair, mostra a tela "Você saiu" com "Abrir de novo". | Novo |
| `demo.js` | Atividade de demonstração do quebra-cabeça: tema "trem a vapor no campo" e as imagens locais de exemplo. Pode trocar a imagem por parâmetro na URL (`?img=baleia`), para testar outros formatos. | Novo |
| `puzzle.html` (raiz) | Página que abre só o quebra-cabeça. | Novo |
| `public/assets/demo/puzzle/` | `trem.svg`, `baleia.svg` (5:3) e `foguete.svg` (1:1), os mesmos desenhos do protótipo, feitos por nós. | Novo |
| `tests/puzzle-rules.test.js` | Testes das regras e da contagem. | Novo |

Não entram nesta etapa: menu, plataforma `app/`, XP, coleção, persistência, arrastar peças e chamada à Featherless.

## 2. Entrada individual e comandos

```sh
npm install
npm run dev            # depois abrir http://127.0.0.1:5173/puzzle.html
npm run build          # gera dist/ com index.html e puzzle.html
npm run preview        # depois abrir http://127.0.0.1:4173/puzzle.html
npm test               # contratos + regras do quebra-cabeça
```

A página `puzzle.html` não importa o menu nem os outros jogos. Para provar essa independência na entrega, o build vai ser conferido: o pacote de `puzzle.html` não pode conter código de `memory/` nem de `sequence/`.

## 3. Contrato de dados

**Entrada** (sem mudar o contrato atual):

```js
{
  activityId: 'demo-puzzle-001',
  gameId: 'puzzle',
  theme: 'trem a vapor no campo',      // palavra ou frase curta
  images: [{ id: 'puzzle-1', url: '/assets/demo/puzzle/trem.svg', description: 'Trem colorido…' }],
  settings: {
    sound: false,
    reducedMotion: false,
    puzzle: {                           // extensão proposta (ver seção 4)
      cardColor: 'pessego'              // 'pessego' | 'menta' | 'ceu' | 'lavanda'
    }
  }
}
```

Se `settings.puzzle` faltar ou tiver valor desconhecido, o jogo usa o padrão e não falha.

**Saída** (sem mudanças): `{ activityId, gameId, status, attempts, correct, hints }`, enviada uma única vez por partida. A contagem segue `REGRAS-E-INTERACOES.md` §2 e §3.

## 4. Ajustes na base (combinar com o Codex antes)

São arquivos comuns, então nada disso é alterado sem acordo:

1. **Página de entrada no build.** O `vite build` hoje só gera `index.html`. É preciso declarar `puzzle.html` como entrada extra num `vite.config.js`, que ainda não existe. A alternativa sem mexer na base é uma configuração só do quebra-cabeça, com um script `build:puzzle`.
2. **Falha de imagem.** `BaseGameScene.create()` emite `activity-error` com o texto "Volte ao menu". O quebra-cabeça precisa mostrar a própria tela, com "Tentar de novo" e "Sair". A proposta é a cena sobrescrever esse tratamento, mantendo o fluxo `init` → `preload` → `create`, e "Tentar de novo" chamar `scene.restart(activity)`.
3. **Montar de novo.** O mesmo `scene.restart(activity)` zera métricas e `finished`. Isso significa que uma segunda partida envia outro resultado com o mesmo `activityId`. Falta combinar se a plataforma aceita isso ou se precisa de um identificador por partida.
4. **`settings.puzzle`.** É uma extensão nova de `settings`, que precisa ser registrada no contrato.

## 5. Responsáveis

| Parte | Responsável |
|---|---|
| Quebra-cabeça (`src/games/puzzle/`, `puzzle.html`, testes e assets de demonstração) | Miguel, com Claude |
| Base comum (`src/core/`, `vite.config.js`, `package.json`) | Codex. Os ajustes da seção 4 precisam ser combinados com ele. |
| Habilidade do PDI (`relacao-parte-todo`) e os apoios | Quem cuida do PDI e da recomendação |
| Imagens geradas em 5:3, seguindo as regras do estudo, e a cor da cartolina | Quem cuida da geração das imagens |

## 6. Critérios de aceite

Regras (verificadas com `node --test`):

- [ ] Os recortes são 15 e únicos, e cada peça tem uma única casa certa.
- [ ] A partida só termina com as 15 peças nos lugares certos.
- [ ] Cada colocação conta +1 tentativa, e cada colocação certa conta +1 acerto. Selecionar, devolver ou tocar numa peça já certa não conta.
- [ ] Cada dica nova conta +1 ajuda, e repetir a mesma dica não conta.
- [ ] Toque duplo ou repetido durante o encaixe não duplica peça nem tentativa.
- [ ] `finish` é chamado uma vez só. Sair depois de terminar não envia outro resultado.
- [ ] A peça errada fica na casa, sem ✓, e pode ser trocada ou devolvida sem contar tentativa extra.

No navegador (conferido de verdade, não só pelo build):

- [ ] `puzzle.html` abre sozinho, sem o menu, com os dados de demonstração.
- [ ] Funciona com mouse e com toque (emulação de toque e, se possível, um tablet real).
- [ ] Imagens de 5:3 e de 1:1 aparecem sem distorção e sem peças iguais.
- [ ] Falha de imagem mostra "Tentar de novo", e a nova tentativa funciona.
- [ ] Sair no meio pede confirmação e envia `abandoned`. "Montar de novo" começa sem nada da partida anterior.
- [ ] Com `reducedMotion`, nada anima e as peças ficam retas. O som começa desligado.
- [ ] Tablet em retrato mostra "Gire o tablet" e não conta nada.
- [ ] Fica igual ao protótipo aprovado, e as diferenças ficam documentadas.
- [ ] Ao fechar a cena, não sobram timers nem listeners.

O build passar não comprova interação, acessibilidade nem efeito educacional; isso fica registrado nas limitações.

### Conferência de 31/10/2026 (versão no hub)

Feita com `npm test` (50 testes, 18 deles do quebra-cabeça), `npm run build` e Playwright no Chromium:

- [x] Regras: os 7 critérios acima, em `hub/tests/quebra-cabeca.test.js`.
- [x] `jogo.html?id=quebra-cabeca` abre sozinho; o pacote do build só importa Phaser e `BaseGameScene`.
- [x] Mouse e toque emulado (tablet 1024 × 768 com densidade 2). O canvas usa a resolução do aparelho.
- [x] Partida completa: com 1 erro e ajudas, o resultado foi `{ completed, attempts: 16, correct: 15, hints: 16 }`. A ajuda repetida não contou, e o toque duplo na casa não duplicou nada.
- [x] Sair depois da conclusão não envia outro resultado. "Montar de novo" começa do zero (`attempts: 1` na partida seguinte).
- [x] No hub (janela de 1280 × 650): o Sair do hub pede confirmação, envia `abandoned` com a contagem da partida e desmonta o jogo.
- [x] Falha de imagem mostra a tela de erro; "Tentar de novo" carrega a imagem; "Sair" envia `abandoned`.
- [x] Tablet em retrato mostra "Gire o tablet"; ao deitar, o aviso some.
- [x] Movimento reduzido: sem inclinação, e o encaixe libera na hora. Sem `sons`, o botão Som some.
- [x] Imagens 5:3 e 1:1 sem distorção. Uma comparação dos 15 recortes de cada imagem não encontrou pares quase iguais.

Limitações que continuam: no navegador de teste o Phaser roda a cerca de 2 quadros por segundo (renderização por software; a sequência fica igual), então a suavidade das animações e o som de papel ainda precisam ser conferidos num aparelho de verdade, de preferência um tablet. As peças ficam no canvas, então ainda não dá para jogar só com o teclado.

## 7. Ordem de trabalho depois da aprovação

1. `puzzleRules.js` e os testes.
2. `layout.js`, `composeImage.js` e as imagens de demonstração.
3. `PuzzleScene.js` com os estados e a entrada `puzzle.html` e `main.js`.
4. Os ajustes da seção 4 que o Codex aceitar.
5. Conferência no navegador em tablet pequeno e em tela grande, e o registro das limitações.

## 8. Decisões que faltam

1. ~~Aprovar o protótipo e este plano~~ — aprovados em 30/10/2026.
2. ~~Apoios~~ — decidido em 30/10/2026: peça errada fica, sem imagem-guia, com cor da cartolina.
3. ~~Faixa etária~~ — decidido: 4 a 10 anos.
4. Ajustes da seção 4, combinados com o Codex.
5. A nova habilidade do PDI, combinada com quem cuida dele.
