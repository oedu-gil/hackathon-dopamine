# Sequência — implementação e validação

Etapa 5 de `docs/DELEGACAO-CLAUDE.md`, seguindo `PLANO.md` e o protótipo aprovados em 30/10/2026.

## Comandos

Na raiz da worktree:

```sh
npm ci
npx vite --config vite.sequence.config.js          # http://127.0.0.1:5175/sequencia.html
npx vite build --config vite.sequence.config.js    # gera dist/sequencia/
node --test tests/sequence.test.js
```

Parâmetros da entrada individual: `?tema=trem`, `?rm=1` (movimento reduzido), `?contexto=0`, `?falha=1` (primeira carga falha), `?debug=1` (mostra os resultados emitidos).

## Verificações feitas

| Item | Como foi verificado | Resultado |
|---|---|---|
| Testes das regras e do layout | `node --test tests/sequence.test.js`; `npm test` (base) | 6/6 e base ok |
| Build individual | `vite build --config vite.sequence.config.js` | `dist/sequencia/` com só os arquivos da sequência (sem `dino-1..3`, sem menu) |
| Fluxo completo com mouse real | Playwright/Chromium em 390×844, 844×390, 820×1180, 1180×820: dica 2×, clique duplo no errado, clique duplo no certo | `attempts 2, correct 1, hints 1`; um único `completed` |
| Jogar de novo | botão no canvas | contadores zerados, novo `activityId` |
| Sair | botão HTML → diálogo | Continuar mantém o jogo; Sair emite `abandoned` uma vez |
| Reentrada | "Entrar de novo" | contadores zerados, um só canvas |
| Falha de imagem | `?falha=1` | tela de falha; Tentar de novo recupera; Voltar emite `abandoned` |
| Movimento reduzido + tema trem | `?rm=1&tema=trem` | lacuna preenchida sem voo |
| Giro de tela no meio do acerto | 390×844 → 844×390 durante o voo | layout lateral, jogo conclui normalmente |
| Toque em tela densa | contexto móvel com toque e densidade 3 | toque funciona; canvas 1170×2532 exibido em 390 px, nítido |
| Rolagem | todos os tamanhos acima | sem rolagem |
| Estresse: dica + erro + acerto com cliques seguidos | 60 rodadas alternando os 4 tamanhos | 60/60 com `attempts 2, correct 1, hints 1` e um único resultado; console sem erros |
| Menu da base | `npx vite` padrão, botão "Complete a sequência" | abre em 960×600; Voltar ao menu emite `abandoned` |

Capturas nesta pasta: `celular-*`, `celular-deitado-*`, `tablet-retrato-*`, `tablet-deitado-*`, `celular-falha-imagem.png`, `celular-confirmar-saida.png`, `celular-trem-concluido.png`, `celular-giro-apos-acerto.png`, `celular-toque-dpr3.png`, `menu-base-960x600.png`.

## Diferenças em relação ao plano e ao protótipo

- **Escala:** em vez de `Scale.RESIZE`, a entrada usa `Scale.NONE` com o canvas na resolução do aparelho e `zoom = 1/densidade`, redimensionado a cada mudança de tela. O comportamento é o mesmo do plano (layout que se adapta), mas imagens e textos ficam nítidos no celular.
- **Conclusão:** a bandeja mantém a altura e os botões "Jogar de novo" / "Sair" ficam logo abaixo de "Muito bem"; no protótipo a bandeja encolhia.
- **Toque perdido (corrigido):** a primeira versão recriava todos os objetos tocáveis ao abrir a Dica ou errar. Um toque no mesmo quadro se perdia (3 em 48 rodadas de teste). Agora Dica e erro só atualizam o texto e o botão; as opções só são recriadas no acerto, na conclusão e ao mudar o tamanho da tela.
- **Detecção de falha:** um arquivo que chega mas não é uma imagem válida não gera `loaderror` no Phaser, e a `BaseGameScene` não o detectava. A cena da sequência confere as texturas antes de montar o jogo. A correção ficou no módulo do jogo, sem alterar `src/core/`.

## Limitações e pendências

- Testado só em Chromium emulando os aparelhos; **falta conferir em celular e tablet reais** (Safari/iPad incluído).
- As opções ficam no canvas: não há navegação por teclado nem leitor de tela para elas. Sair e os diálogos são HTML e acessíveis.
- O ícone 💡 da Dica depende da fonte de emoji do sistema.
- Sem som (decisão do plano). `settings.sound` é ignorado.
- No menu da base, a demonstração usa `dino-1`/`dino-2`, que só mudam de cor. A entrada individual usa dinossauro × ovo.
- Build e testes não comprovam eficácia educacional; isso depende de uso com as crianças e acompanhamento dos educadores.

## Para alinhar com o Codex

1. `BaseGameScene` não percebe imagens que falham na decodificação (ver acima). Sugestão: conferir `this.textures.exists(id)` em `create()` para todos os jogos.
2. A mensagem de falha da base diz "Volte ao menu"; a entrada individual tem tela própria.
3. Opcional: atalhos `dev:sequencia`, `build:sequencia`, `test:sequencia` em `package.json`.
4. Integração com `app/` (origin/main) continua em aberto.
