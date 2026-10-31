# Guerra de tortas — briefing

Jogo cooperativo: a criança e um adulto jogam juntos contra o computador. Este documento separa o que já foi decidido, o que é só proposta e o que ainda está em aberto. A pesquisa que embasa o jogo está em `PESQUISA.md`.

## Objetivo de aprendizagem (proposta)

Socialização por meio da cooperação com um adulto. Habilidades exercitadas:

- **dependência mútua:** a criança só ataca se o adulto defender;
- **atenção compartilhada:** olhar para o que o parceiro faz e combinar o momento ("pegou! agora joga!");
- **esperar o momento certo:** a criança precisa esperar o comilão baixar a bandeja antes de lançar;
- **tentar de novo após um erro**, sem punição.

Gancho com o PDI de exemplo: "Participar de jogos de regras simples em duplas com mediação". O jogo não avalia nem diagnostica.

## Contexto de uso

- **Público:** crianças autistas de 4 a 10 anos, jogando com um adulto (pai, mãe ou professor).
- **Dispositivos:** tablet e computador.
- **Preferências sensoriais:** som e movimento precisam poder ser reduzidos ou desligados (`DESIGN.md`).

## Decidido pelo grupo (31/10/2026)

- **Parceiro:** um adulto. A criança **ataca** e o adulto **defende**.
- **Jogam ao mesmo tempo**, numa **tela compartilhada** do mesmo aparelho.
- **Jogo 2D, de frente:** o personagem da criança fica à **esquerda** e o inimigo (comilão) à **direita**. Os dois ficam **parados** o tempo todo.
- **Personagens fixos**, que não mudam com o tema de hiperfoco:
  - **Herói da criança:** um gatinho fofo. O grupo já tem uma imagem dele.
  - **Inimigo:** um **guaxinim guloso, o "ladrão de tortas"**. Ele roubou as tortas da festa, e o gatinho (com a ajuda do adulto) as devolve na guerra de tortas. Ele é um rival brincalhão, nunca assustador.
  - As imagens finais dos dois serão conferidas e geradas com o Codex. Até lá, o protótipo usa formas provisórias.
- **Tema:** guerra de tortas, sem violência.
- **Ciclo do jogo:**
  1. O comilão lança uma torta no personagem.
  2. O adulto defende erguendo a **bandeja do próprio personagem**, que funciona como escudo. A bandeja não é um elemento solto pela tela.
  3. Se a defesa der certo, a criança **ganha uma torta**. Sem torta, ela não pode lançar.
  4. A criança lança a torta quando quiser.
  5. O **comilão também se defende** com a bandeja dele, então a criança precisa escolher o momento em que ele está desprotegido.
- **Versão simples:** sem "super torta" por enquanto.
- **Defender e atacar não acontecem juntos:** enquanto o adulto está com a bandeja erguida, a criança não lança, e vice-versa. O guaxinim continua agindo nesse tempo todo.
- **Uma torta por vez:** cada defesa certa dá uma torta. A criança só ganha outra depois de lançar.
- **"IA" simples do guaxinim:** ele sorteia entre lançar e defender. Só pode lançar de novo depois de um tempo mínimo desde o último lançamento.
- **O guaxinim faz uma coisa por vez:** com a bandeja erguida, ele não lança. Logo depois de lançar, fica desprotegido.
- **Garantia contra espera longa:** se a criança estiver esperando com uma torta, o guaxinim fica desprotegido em até X segundos (menos no nível 1).
- **Sinais antes das ações, sem novos quadros na spritesheet:** cerca de 0,6 s antes de cada ação, aparece um **balãozinho acima do guaxinim** com um ícone (🥧 = vai lançar; bandeja para baixo = vai abrir a guarda), e o sprite dá um **leve balanço** feito pelo próprio Phaser (tween de rotação). Sem piscar, para evitar flashes. Com `reducedMotion`, fica só o balão.
- **Nível do PDI** controla o tempo mínimo entre lançamentos, a velocidade das tortas e a chance de o guaxinim defender.
- **Ensinar os papéis:** uma tela inicial com figuras mostra "você defende" (adulto) e "você lança" (criança), sem depender de leitura.
- **Final:** os dois personagens comemoram, e a partida conta XP e pode desbloquear um item da coleção, como nos outros jogos.

## Propostas aprovadas pelo grupo (31/10/2026)

- **Final:** o comilão vai enchendo a barriga, fica cheio, deita no chão e dorme satisfeito. Sugerimos evitar a palavra "gordo", para não associar corpo grande a algo ruim (crianças autistas costumam levar falas ao pé da letra).
- **Erro sem punição:**
  - se o adulto não defender, o personagem só leva um respingo de chantili e ri;
  - se a torta da criança bater na bandeja do comilão, ela cai no chão e o comilão faz uma careta.

  Nos dois casos não há vidas nem "game over", e a próxima torta do comilão vem logo.
- **Controles:**

  | Aparelho | Adulto (defesa) | Criança (ataque) |
  |---|---|---|
  | Tablet | Botão grande de escudo, fixo perto do personagem | Toque em qualquer outro ponto da tela |
  | Computador | Tecla (por exemplo, espaço) | Clique do mouse |

  São gestos diferentes, para os toques não se confundirem.
- **Nível do PDI** (1 a 3) ajusta:
  - a velocidade das tortas do comilão;
  - a janela de tempo para defender (maior no nível 1);
  - por quanto tempo o comilão fica desprotegido.
- **Métrica social para o desempenho:** defesas certas sobre as tortas recebidas, lançamentos certos sobre as tortas disponíveis e tempo total da partida. Segue o contrato `createResult()` de `src/core/contracts.js` (`attempts`, `correct`, `hints`).

## Em aberto

1. **Arte dos personagens:** a imagem do gatinho e a criação do guaxinim ficam com o Codex. Para o final, o guaxinim precisa de estados de barriga (normal, cheia, deitado dormindo).
2. **Duração:** aprovado que 5 tortas enchem o guaxinim, para a partida ser curta.
3. **Habilidade no PDI e recomendação:** criar uma habilidade (por exemplo, `cooperacao`) na lista compartilhada e no catálogo de jogos do site. Combinar com quem cuida do PDI e do site.
4. **Integração:** pelo ponto único do site, `site/web/src/jogos/integracao.js`.
5. **Prazo:** a entrega é hoje (31/10/2026). Isso limita o protótipo a uma fase só.
