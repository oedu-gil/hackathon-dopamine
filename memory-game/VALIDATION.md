# Verificação da entrega — 30/10/2026 (America/Sao_Paulo)

## Instalação e comandos

- `npm ci --offline --ignore-scripts`: instalação própria pelo lockfile, a partir do cache local; 17 pacotes instalados.
- `npm test`: 8 testes passaram.
- `npm run build`: sucesso. O bundle inclui Phaser: aproximadamente 1,37 MB / 360 KB gzip. Vite informa o aviso de chunk acima de 500 KB; não foi ocultado.
- `npm run dev`: porta 5181.
- `npm run preview`: porta 4181.

## Navegador (Chromium automatizado)

- Renderer WebGL observado; tabuleiro e três SVGs carregados.
- Começar por Enter posiciona o foco na primeira carta; Espaço abre a carta.
- Clique repetido na carta aberta é ignorado. Durante comparação sem par, uma terceira carta não altera o estado.
- Comparações sem par fecham automaticamente após 1,2 segundo; todas as cartas permanecem bloqueadas para cliques, teclado e toque durante a pausa.
- Partida completa: três pares visíveis, mensagem de conclusão e Jogar novamente.
- Reinício: todas as cartas fechadas e contador 0 de 3 pares.
- Larguras 320, 460, 461, 736 e 1280: sem transbordamento horizontal, alvos maiores que 44 px e layout de duas/três colunas alinhado ao canvas.
- Contexto móvel emulado, 390 × 844, toque real do driver: abertura da carta confirmada.
- Preferência de movimento reduzido do sistema refletida no controle; alteração manual disponível.
- Falha de um SVG: partida bloqueada, aviso visível e recuperação após tentar carregar novamente.
- Configuração com zero imagens: mensagem de validação e recuperação confirmadas.
- Build servido: uma partida completa, um canvas, nenhuma exceção de página e nenhuma resposta HTTP de erro. Assets solicitados somente ao servidor local.

As falhas de recurso foram simuladas apenas por interceptação no navegador, sem alterar os arquivos de demonstração. Os testes de navegador desta entrega foram executados pelo driver disponível na sessão; não são parte de `npm test` e não instalam Playwright no pacote. Não houve verificação em aparelho móvel físico, leitor de tela ou com crianças/responsáveis.

## Atualização: fechamento automático

- Duração: `MISMATCH_DELAY_MS = 1200`, no relógio da cena Phaser. O timer é criado uma vez por erro e removido no shutdown da cena.
- Botão Tentar de novo removido; ação manual não encerra mais a comparação.
- Desenvolvimento: fechamento observado em aproximadamente 1218 ms; cliques repetidos e Enter não alteraram as cartas bloqueadas. Redimensionamento durante a pausa não reiniciou o timer. Nova escolha aceita após fechar.
- Build servido: comparações fecharam automaticamente, três pares concluídos e reinício verificado. Toque emulado durante a pausa não abriu outra carta; desbloqueio automático confirmado.
- Oito testes Node e build passaram após a alteração. A mensagem anterior de fechamento manual foi substituída pelo estado automático.
