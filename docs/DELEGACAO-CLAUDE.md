# Delegação: quebra-cabeça e sequência

Leia CLAUDE.md. Use a mesma base compartilhada e o package-lock.json. Não recrie o projeto nem altere a versão do Phaser. Uma worktree/branch por tarefa independente; não edite a pasta usada pelo Codex. Espere o commit da base ser disponibilizado para criar branches a partir dele; se ainda não estiver em origin/main, combine explicitamente a referência com o responsável.

## Contrato

Cada classe estende BaseGameScene e implementa buildBoard(). init(), preload() e create() herdados validam dados e carregam imagens; se precisar sobrescrever, preserve esse fluxo. Dimensões lógicas: 960 x 600, escala FIT.

Entrada: `{ activityId, gameId, theme, images: [{ id, url, description }], settings: { sound, reducedMotion } }`. Imagens são entregues prontas; não chamar APIs. Chaves de textura são images[].id. settings admite extensões combinadas previamente.

Saída: chamar finish('completed') ao concluir. O menu chama finish('abandoned') ao sair. Não emitir resultado duplicado. Atualize this.metrics: attempts, correct, hints. A base emite activity-result, também encaminhado como CustomEvent no window. Não há persistência ainda.

Contagem: quebra-cabeça registra uma tentativa por colocação de peça e um acerto por colocação correta; repetir clique na peça já correta não conta. Sequência registra uma tentativa por resposta selecionada e um acerto por resposta correta. Ajuda explícita acionada pelo usuário incrementa hints. Não contar animações ou redimensionamento como tentativa.

## Quebra-cabeça

Implementar em src/games/puzzle/. Uma imagem dividida em 15 peças, 5 colunas e 3 linhas. Sem rotação; referência visível. Selecionar uma peça e depois o destino, permitindo corrigir posições. O recorte deve preservar a imagem toda sem distorcer proporções. Definir geometria que comporte referência, peças e tabuleiro em telas pequenas.

Aceite: 15 recortes únicos; resultado completo apenas com todas as posições corretas; ações rápidas não duplicam peças; mouse e toque; cancelamento e nova partida sem estado residual. Testar com imagens em proporções diferentes.

## Sequência

Implementar em src/games/sequence/. Receber exatamente 2 imagens distintas: A e B. Mostrar A-B-A-B-? e duas alternativas A/B em ordem embaralhada. A é a resposta correta. Permitir nova tentativa após erro, sem vidas ou limite de tempo. Ao acertar, preencher a lacuna e concluir uma única vez.

Aceite: padrão e resposta consistentes; alternativas distintas; erro permite nova tentativa; clique duplo não duplica resultado; mouse e toque; saída/reentrada reinicia.

## Limites e entrega

Sem som automático, cronômetro obrigatório ou penalidade. Respeite reducedMotion; evite flashes. Não converter desempenho em diagnóstico. Limpeza de timers/listeners no encerramento da cena. Mudanças em core, inicialização, dependências e estilos globais exigem alinhamento com Codex. Use estilos e recursos dentro do próprio módulo.

Entregar código, verificações observadas no navegador e limitações. Não declarar funcionamento apenas porque o build passou. Publicar branch/PR conforme instruções do projeto e preservar transcrições sem expor credenciais ativas.
