# Sequência — briefing

Etapa 1 de `docs/DELEGACAO-CLAUDE.md` (versão atualizada na worktree `miguel-jogos`). Este documento separa o que já foi decidido, o que é só proposta e o que ainda está em aberto. Nada aqui aprova direção artística, protótipo ou plano.

## Objetivo de aprendizagem (proposta)

Reconhecer um padrão de repetição simples (ABAB) e prever o próximo elemento. As habilidades exercitadas são:

- percepção de regularidade e alternância (base do raciocínio lógico-matemático e da noção de "o que vem depois");
- comparação visual entre dois elementos distintos;
- atenção ao conjunto da fileira, não só ao último item;
- tentar de novo após um erro, sem punição.

O jogo não avalia nem diagnostica. Tentativas, acertos e ajudas servem só para o educador acompanhar a evolução.

## Contexto de uso

- **Público:** crianças autistas de 4 a 12 anos (decisão do grupo, como em `IDEIA.md`).
- **Quem define o objetivo:** o PDI orienta objetivos e apoios. A idade não decide sozinha a dificuldade.
- **Personalização:** as duas imagens (A e B) vêm do hiperfoco da criança; a regra ABAB continua a mesma. Os temas que já existem em `app/src/data/hiperfocos.js` (origin/main) são trem, aranha, avião e dinossauro.
- **Preferências sensoriais:** não presumimos que todas as crianças autistas tenham a mesma. Som e movimento precisam poder ser reduzidos ou desligados.
- **Dispositivos:** tablet e celular, com toque.

## Escopo

### Decidido (grupo / documento de delegação)

- Padrão **A-B-A-B-?** com **uma lacuna final** e **duas alternativas** (A e B) em ordem embaralhada. A resposta correta é A. Mudar isso exige nova decisão do grupo.
- Exatamente 2 imagens distintas na entrada.
- Erro permite nova tentativa; sem vidas, sem tempo limite, sem penalidade, sem som automático.
- Ao acertar, a lacuna é preenchida e o resultado é emitido uma única vez.
- Contagem: uma tentativa por resposta selecionada, um acerto por resposta correta, `hints` por ajuda pedida pela criança.
- Respeitar `reducedMotion` e evitar flashes.
- Execução individual: abre direto, com comandos e dados de demonstração próprios, sem menu coletivo nem outros jogos.
- Imagens entregues prontas; o jogo não chama API. Featherless continua pendente.
- O visual da base (cores e dinossauros SVG) é só demonstração técnica, sem aprovação artística.

### Observação importante sobre as imagens de demonstração

Os três dinossauros da base têm **a mesma silhueta e só mudam de cor**. Para a sequência isso é um problema: A e B precisam ser distinguíveis sem depender de cor. Os estudos usam um par com formas diferentes (dinossauro e ovo) e a proposta inclui uma regra para isso nas imagens personalizadas.

### Fora do escopo agora

Integração com a plataforma, XP e coleção, persistência, padrões além de ABAB (ABB, ABC…), mais alternativas e menu coletivo.

## Estado do código

- Branch `codex/miguel/sequencia`, criada a partir de `9d0de9c` ("Prepara base Phaser e contratos para os tres jogos"), a mesma base do quebra-cabeça. Esse commit ainda não está em `origin/main`.
- `src/games/sequence/SequenceScene.js` só tem o esqueleto: herda a tela provisória da `BaseGameScene`. O código existente vai ser preservado.
- `origin/main` tem outro app, `app/` (React + Vite + Phaser 4), com hiperfocos, recomendação por habilidades do PDI, coleção e desempenho. É uma base separada desta.

## Decisões do grupo (30/10/2026)

- Direção artística 1 · Quadro estruturado (`DIRECAO-ARTISTICA.md`).
- Dispositivos: tablet e celular.
- Apoio na primeira versão: somente uma palavra ou frase para contextualizar.
- Faixa etária: 4 a 12 anos.

## Pendências

1. **Habilidade no PDI:** `app/src/data/habilidades.js` só tem habilidades sociais e emocionais. A sequência precisaria de uma nova (ex.: `padroes-sequencia`). Combinar com quem cuida do PDI e da recomendação.
2. **Integração:** entrar em `app/` (main) ou continuar na base `9d0de9c`. Combinar com o Codex e o grupo; não bloqueia a direção artística.
3. **Prazo:** `IDEIA.md` fixa a entrega em 31/10/2026, o que limita o tamanho do protótipo e do plano.
