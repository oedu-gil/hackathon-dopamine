# Jogos Dopamine

Base compartilhada em Phaser 4.2.1 e Vite 8.3.5 (Node 20.19+ ou 22.12+).

## Executar

```sh
npm ci
npm run dev
npm test
npm run build
```

Abra http://127.0.0.1:5173 . Cada botão abre uma cena com imagens de demonstração, ainda sem a mecânica do jogo. A porta pode ser alterada em outra worktree com `npm run dev -- --port 5174`.

## Organização

- `src/core/`, `src/main.js`, `package.json`, `index.html`, estilo global: Codex.
- `src/games/memory/`: Codex, 3 pares / 6 cartas.
- `src/games/puzzle/`: Claude, 15 peças / grade 5 x 3.
- `src/games/sequence/`: Claude, ABAB + lacuna / 2 alternativas.
- `public/assets/demo/`: ilustrações SVG locais, sem dependência de API.
- `docs/DELEGACAO-CLAUDE.md`: instruções e critérios de aceite.

A geração de imagens pela Featherless depende de confirmação de modelo e endpoint. Nenhuma chamada externa foi implementada. `.env` é ignorado; a chave deve ser usada apenas por um futuro servidor, nunca no cliente Vite. Não publique transcrições que contenham credenciais ativas; revogue a chave compartilhada no chat antes de publicar o histórico.
