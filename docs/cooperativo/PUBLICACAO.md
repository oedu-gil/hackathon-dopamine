# Publicação da Guerra de Tortas

Branch de revisão: codex/miguel/guerra-tortas. Worktree: miguel-guerra-tortas, a partir de origin/main. A pasta principal tinha um conflito de outra integração em DESIGN.md; não foi alterada por esta publicação. A branch preserva as duas seções de exceção de movimento.

## Entrega

Jogo cooperativo jogável no hub, com gatinho animado, fundo de piquenique e tortinha aprovados, controles de ataque à esquerda e defesa à direita, UI de piquenique e demonstrações interativas na entrada. As seis artes PNG são empacotadas pelo Vite tanto no hub quanto no site. O ícone do manifesto usa a tortinha nova.

## Validação

- 64 testes do hub aprovados na worktree de publicação.
- Builds do hub e do site aprovados. Aviso de tamanho do bundle Phaser permanece.
- Chrome: prévias, defesa por tecla e ponteiro, ataque pelo prato, final, reinício e movimento reduzido. Sem erros de página/rede. Prévia não altera a partida e remove listeners ao sair.
- Dependências existentes reutilizadas por junctions locais ignoradas pelo Git, sem instalação de pacotes.

## Pendências

- cooperacao ainda não faz parte das habilidades permitidas em pdi/src/habilidades.js. Combinar a inclusão com a frente do PDI antes de considerar pronta a recomendação automática. O catálogo do servidor já lê os manifestos ao iniciar; não foi alterado o banco nesta tarefa.
- Guaxinim e bandejas ainda usam arte provisória. O efeito independente de impacto/escorrimento da torta foi discutido, mas não foi entregue/integrado.
- Tablet físico, desempenho mobile e fluxo completo de PDI/autenticação/resultados do site não foram exercitados.
- As quatro folhas do gatinho somam cerca de 34 MB; otimização futura deve preservar os quadros e tempos aprovados.

O snapshot nativo desta conversa é preservado separadamente em prompts/, conforme CLAUDE.md. Capturas temporárias e arquivos de outras frentes não fazem parte da publicação.
