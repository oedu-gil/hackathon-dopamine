# Quebra-cabeça — plano de execução

Etapa 4 de `docs/DELEGACAO-CLAUDE.md`. **Plano e protótipo aprovados pelo grupo em 30/10/2026.** Decisões: peça errada fica no tabuleiro, sem imagem-guia, cor da cartolina entra, faixa de 4 a 10 anos. O protótipo está em `estudos/prototipo.html`.

Base: branch `codex/miguel/quebra-cabeca`, criada a partir de `9d0de9c`, com Phaser 4.2.1 e Vite 8.3.5. A versão do Phaser não muda e nenhuma dependência nova entra.

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
