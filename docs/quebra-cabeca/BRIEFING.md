# Quebra-cabeça — briefing

Etapa 1 de `docs/DELEGACAO-CLAUDE.md`. Este documento separa o que já foi decidido, o que é só proposta e o que ainda está em aberto. Nada aqui aprova direção artística, protótipo ou plano.

## Objetivo de aprendizagem (proposta)

Montar uma imagem inteira a partir das partes. As habilidades exercitadas são:

- relação parte-todo e percepção visoespacial (posição, borda, continuidade de formas);
- comparação com um modelo visível (olhar a referência e o tabuleiro);
- atenção sustentada e planejamento em passos curtos;
- persistência após um erro, sem punição.

O jogo não avalia nem diagnostica. Os números registrados (tentativas, acertos e ajudas) servem só para o educador acompanhar a evolução.

## Contexto de uso

- **Público (decidido):** crianças autistas de **4 a 10 anos**, alinhado com `IDEIA.md` na main (commit f176f66).
- **Quem define o objetivo:** o PDI orienta objetivos e apoios. A idade não decide sozinha a dificuldade.
- **Personalização:** a imagem do quebra-cabeça vem do hiperfoco da criança, mas a habilidade e a regra continuam as mesmas. Os temas que já existem em `app/src/data/hiperfocos.js` são trem, aranha, avião e dinossauro.
- **Preferências sensoriais:** não presumimos que todas as crianças autistas tenham a mesma. Som e movimento precisam poder ser reduzidos ou desligados.
- **Dispositivos (decidido):** tablet (toque), **só na horizontal**, e computador (mouse). Celular fica fora do escopo por enquanto.
- **Tema (decidido):** um único tema por partida, em aberto. O tema é **uma palavra ou uma frase curta** que dá contexto à geração da imagem (por exemplo "trem" ou "trem a vapor na montanha"). A direção artística precisa funcionar com qualquer imagem gerada a partir desse texto.
- **Referências visuais (decidido):** o grupo não tinha estilo definido. Entre as três direções propostas, escolheu a **B, Papel recortado** (ver `DIRECAO-ARTISTICA.md`).

## Escopo

### Decidido (pelo grupo / documento de delegação)

- Uma imagem dividida em **15 peças, grade de 5 colunas × 3 linhas**. Mudar essa quantidade exige nova decisão do grupo.
- Sem som automático, sem cronômetro obrigatório e sem penalidade. Respeitar `reducedMotion` e evitar flashes.
- Contagem: uma tentativa por peça colocada e um acerto por colocação correta. Clicar de novo numa peça já correta não conta. A ajuda pedida pela criança conta como `hints`.
- Execução individual: o jogo abre direto, com os próprios comandos e dados de demonstração, sem depender do menu nem dos outros jogos.
- Imagens entregues prontas. O jogo não chama API, e a geração pela Featherless continua pendente.
- O visual da base (cores e dinossauros SVG) é só uma demonstração técnica, sem aprovação artística.

### Proposta inicial de interação (será revista na etapa 3)

- Peças sem rotação.
- Imagem de referência sempre visível.
- Primeiro seleciona a peça, depois o destino, e dá para corrigir posições.
- O recorte preserva a imagem inteira, sem distorcer a proporção.

### Fora do escopo agora

Integração com a plataforma, XP e coleção, persistência dos resultados, variação de número de peças e menu coletivo.

## Estado do código

- Branch `codex/miguel/quebra-cabeca`, criada a partir de `9d0de9c` ("Prepara base Phaser e contratos para os tres jogos"). Esse commit ainda não está em `origin/main`.
- `src/games/puzzle/PuzzleScene.js` só tem o esqueleto: herda a tela provisória da `BaseGameScene`. O código existente vai ser preservado.
- `origin/main` tem outro app, `app/` (React + Vite + Phaser 4), com hiperfocos, recomendação por habilidades do PDI, coleção e desempenho. Essa é uma base separada desta.

## Pendências

1. ~~Orientação do tablet~~ — decidido: só horizontal.
2. ~~Direção artística~~ — decidido: B, Papel recortado.
3. ~~Apoios~~ — decidido: dica, som e movimento ajustáveis, peça errada fica no tabuleiro, cor da cartolina; sem imagem-guia (ver `REGRAS-E-INTERACOES.md`).
4. ~~Faixa etária~~ — decidido: 4 a 10 anos.
5. **Habilidade no PDI:** as habilidades de `app/src/data/habilidades.js` são só sociais e emocionais. O quebra-cabeça precisaria de uma nova (por exemplo, `relacao-parte-todo`). Combinar com quem cuida do PDI e da recomendação.
6. **Integração:** decidir se o jogo vai entrar em `app/` (main) ou continuar na base `9d0de9c`. Combinar com o Codex e com o grupo. Isso não bloqueia a direção artística.
7. **Prazo:** `IDEIA.md` fixa a entrega em 31/10/2026, o que limita o tamanho do protótipo e do plano.
