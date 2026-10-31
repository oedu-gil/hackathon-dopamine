# Interface de piquenique

Direção proposta e aprovada nesta conversa em 31/10/2026: interface lúdica com controles de bandeja, prato da tortinha, cinco espaços de progresso, instruções ilustradas, XP compacto e final no estilo do piquenique. Implementação local em `hub/src/jogos/guerra-tortas/interface.js`, com Phaser 4.2.1 e assets existentes. O cenário e a tortinha aprovados são preservados.

## Comportamento

- Por solicitação do usuário, ataque fica à esquerda e defesa à direita; os cartões de instrução seguem a mesma ordem. Bandeja em x=543, y=392, com área circular de 92 px. O painel de defesa também aceita pressionar e segurar. Ambos usam o mesmo conjunto de comandos, junto do Espaço; soltar fora, cancelar toque e perder foco continuam liberando a defesa. O metal afunda em 110 ms, a legenda e a cor indicam a proteção efetiva após a subida da animação.
- Prato inferior esquerdo informa espera, torta na mão, prontidão, voo e fim. Receber a torta dá um pequeno salto de escala de 220 ms; o prato permite lançar, assim como o cenário. O lançamento continua condicionado ao estado do gatinho. Pressionar defesa ou tocar nos painéis de XP/progresso não lança tortas.
- Cinco pratos recebem as tortinhas comidas, com texto de contagem e feedback de 220 ms. XP, coleção, tentativas e acertos mantêm o contrato compartilhado via `ligarHud`. Desbloqueio usa aviso temporário, sem cobrir controles ou suspender a partida.
- Entrada e final usam cartões creme, borda de madeira e detalhe xadrez. Entrada mantém botão de início na mesma posição. Final conclui o resultado e oferece reinício e volta ao menu. Celebração curta sem confete longo ou movimento decorativo em loop.
- Animações de interface são limitadas a 220 ms, sem piscadas. Preferência de movimento reduzido do jogo ou do sistema desativa os tweens e mantém todos os textos, ícones e estados funcionais.

## Observação de integração

### Demonstrações na entrada

Os bonecos genéricos foram substituídos pelos sprites aprovados do gatinho: ataque à esquerda e defesa à direita. Cada cartão reproduz sua ação ao toque, sem loop automático, com tortinha separada e os tempos originais dos quadros. Defesa sobe, sustenta brevemente a pose e baixa; ataque solta a torta no marcador `release`. As prévias usam animadores próprios e não alteram os comandos, o inventário, o XP ou os projéteis da partida. Ao começar ou encerrar a cena, removem seus listeners e tweens. Movimento reduzido mantém poses essenciais estáticas. Chrome verificou as duas ações por clique, isolamento da partida, remoção dos dois listeners e modo reduzido sem tweens; build e 63 testes aprovados.

A cena tinha duas definições de `update`: a segunda ocultava a checagem de abertura da guarda. As duas rotinas agora compartilham um único `update`, preservando a garantia de espera máxima documentada no briefing.

## Verificação

`npm --prefix hub test` passou com 63 testes. Build aprovado. Chrome local exercita início, defesa por Espaço e ponteiro, lançamento pelo prato, final em fixture da quinta torta e reinício. A verificação usa o hook DEV existente; não adiciona globais de produção. Capturas da entrada e da partida revisadas. Desempenho e toque simultâneo em tablet físico não medidos.
