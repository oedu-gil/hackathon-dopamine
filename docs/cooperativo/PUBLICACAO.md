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

## Fechamento com animações do guaxinim

Integração solicitada pelo usuário em 31/10/2026: idle, ataque com release sincronizado, defesa com hold controlado pela IA, reação com limpeza e final sentado dormindo com Zzz separados. A bandeja do guaxinim faz parte do sprite. O corpo normal permanece nas ações comuns; corpo cheio aparece na finalização. A textura provisória não é mais usada para renderizar o personagem. Detalhes, seleções e limitações herdadas em INTEGRACAO-GUAXINIM.md.

Versão combinada com origin/main sem conflitos. Verificação repetida: 67 testes do hub, 6 regras do servidor, builds do hub e site; Chrome com input real, pausa, guarda/abertura, reação/limpeza, final, reinício e movimento reduzido. Aviso existente do bundle Phaser permanece. A integração não altera o fluxo de PDI: cooperacao ainda depende da frente responsável. Tablet físico e fluxo autenticado completo continuam não exercitados.

Conversa de arte preservada sem edição: snapshot JSONL nativo comprimido sem perda, dividido em três partes binárias em prompts/2026-10-31_01a19049-a12a-72a3-b4a5-53251f5f74f7-arquivo/, com SHA256 e instruções de restauração no manifest.json. Divisão necessária pelo limite por arquivo do GitHub. Vídeos originais, tentativas, pastas temporárias e cópia JSONL de trabalho ficam locais.
