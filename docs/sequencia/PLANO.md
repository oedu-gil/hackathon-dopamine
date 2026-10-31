# Sequência — plano de execução

Etapa 4 de `docs/DELEGACAO-CLAUDE.md`. **Aprovado pelo grupo em 30/10/2026**, junto com o protótipo (`prototipo/`), incluindo as quatro decisões técnicas e o apoio (frase de contexto + Dica em palavras).

## Módulos e responsáveis

Tudo dentro de `src/games/sequence/` (Claude, branch `codex/miguel/sequencia`), sem tocar nos outros jogos:

| Arquivo | Papel |
|---|---|
| `rules.js` | funções puras: montar a fileira A-B-A-B, sortear as opções, avaliar a escolha, atualizar contadores |
| `layout.js` | função pura: dado largura × altura, devolve posição e tamanho de cartões, opções e botões (3 + 2, linha única, opções à direita) |
| `SequenceScene.js` | estende `BaseGameScene` (preserva `init/preload/create`), implementa `buildBoard()`, feedback, Dica, bloqueio e `finish` |
| `demo.js` | atividade de demonstração própria (dinossauro + ovo, frase de contexto) |
| `assets/` | `dino.svg`, `ovo.svg` e a fonte Atkinson Hyperlegible (licença OFL), importados pelo Vite: só entram no build deste jogo |
| `main.js` | entrada individual: cria o `Phaser.Game`, botão Sair com confirmação, tela de falha com Tentar de novo / Voltar, `finish('abandoned')` ao sair |
| `../../../sequencia.html` | página da entrada individual (raiz do projeto) |
| `../../../vite.sequence.config.js` | configuração própria de dev/build deste jogo (entrada `sequencia.html`, saída `dist/sequencia/`, `publicDir: false` para não copiar os assets da base) |
| `tests/sequence.test.js` | testes das funções puras |

Codex: só alinhamento, sem trabalho obrigatório (ver "Ajustes na base").

## Entrada individual e comandos

Sem mudar `package.json` nem `vite.config` comum:

```sh
npm ci
npx vite --config vite.sequence.config.js --port 5175     # abre http://127.0.0.1:5175/sequencia.html
npx vite build --config vite.sequence.config.js           # gera dist/sequencia/
node --test tests/sequence.test.js
```

Se o Codex aprovar, viram atalhos em `package.json`: `dev:sequencia`, `build:sequencia`, `test:sequencia`.

O jogo continua registrado no menu atual (`src/main.js`) sem mudança; o menu só é um exemplo de integração.

## Contrato de dados

Usa o contrato atual sem alterar `contracts.js`, mais dois campos **opcionais** lidos só por este jogo:

```js
{
  activityId, gameId: 'sequence', theme,
  context: 'Os dinossauros e os ovos fizeram uma fila.',      // opcional: frase de contexto
  images: [
    { id, url, description, label: 'dino' },                 // A — label opcional (palavra curta)
    { id, url, description, label: 'ovo' }                   // B
  ],
  settings: { sound, reducedMotion }
}
```

- Sem `label`, a Dica usa `description`. Sem `context`, a frase não aparece.
- `contracts.js` já aceita campos extras; a validação desses dois fica no módulo do jogo.
- Saída: `activity-result` com `attempts`, `correct`, `hints`, emitido uma vez.

## Decisões técnicas a confirmar

1. **Escala:** a entrada individual usa `Phaser.Scale.RESIZE` com `layout.js`, em vez de FIT 960×600. Com FIT, as opções ficariam com ~70 px no celular retrato. No menu atual (FIT), o mesmo `layout.js` funciona com 960×600.
2. **Sair, confirmação e falha** ficam em HTML na entrada individual, como o botão "Voltar ao menu" da base (foco de teclado e leitor de tela). Opções, Dica e fileira ficam em Phaser.
3. **Fonte embutida** no módulo (arquivo baixado do Google Fonts, licença OFL) para funcionar sem internet.
4. **Som:** nenhum na v1 (`settings.sound` ignorado). O som opcional fica para depois.

## Ajustes na base (alinhar com o Codex)

- Nenhuma mudança obrigatória em `src/core/`.
- A mensagem de falha de `BaseGameScene` diz "Volte ao menu"; na entrada individual a tela de falha é própria. Sugestão para o Codex: tornar o texto neutro.
- Se o grupo integrar em `app/` (origin/main), será feito um adaptador depois, fora deste plano.

## Critérios de aceite

1. Abre direto por `sequencia.html`, sem carregar memória, quebra-cabeça, menu ou API. O build em `dist/sequencia/` não contém assets dos outros jogos.
2. Fileira A-B-A-B-?, opções A/B distintas e sorteadas; a certa é sempre A.
3. Erro permite nova tentativa sem limite; acerto preenche a lacuna e chama `finish('completed')` uma vez.
4. Clique duplo ou toques durante o feedback não somam tentativas nem duplicam resultado.
5. Dica conta 1 `hints` por partida; Sair antes de concluir pede confirmação e emite `abandoned`; Jogar de novo e reentrada zeram tudo.
6. Falha de imagem mostra Tentar de novo / Voltar e se recupera.
7. `reducedMotion` remove todos os deslocamentos.
8. Sem rolagem e com os tamanhos de `INTERACOES.md` em 390×844, 844×390, 820×1180 e 1180×820, conferidos no navegador por toque e mouse.
9. Timers e listeners limpos ao encerrar a cena.
10. Visual igual ao protótipo aprovado; divergências documentadas.

Build passando não comprova nenhum desses itens sozinho: cada um será conferido no navegador e listado na entrega.

## Fora deste plano

Integração com `app/`, XP/coleção, persistência, voz, som, outros padrões e geração de imagens pela Featherless.
