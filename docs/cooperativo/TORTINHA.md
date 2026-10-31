# Tortinha ilustrada

Arte aprovada pelo usuário nesta conversa. Caminho atual para publicação: `hub/src/jogos/guerra-tortas/assets/tortinha.png`. As URLs do Vite empacotam o PNG no hub e no site. Os caminhos abaixo documentam a integração inicial.

Nova proposta aplicada ao jogo em 31/10/2026, a pedido do usuário para melhorar a tortinha. Massa dourada, recheio rosado, chantili e cereja preservam a identidade do objeto anterior com acabamento pintado próximo do gatinho e do piquenique. Aprovação visual final ainda não registrada.

Arquivo: `hub/public/guerra-tortas/tortinha.png`, com fundo transparente gerado pela ferramenta integrada `image_gen`, sem API/CLI. Original preservado no diretório de imagens geradas do Codex. O loader usa a mesma chave `gt_torta#0`: mão, projétil, balão, instruções e medidor recebem a mesma ilustração e mantêm seus tamanhos e tempos. SVG anterior preservado nos dados como referência.

## Prompt utilizado

Verificação: 63 testes passaram e build aprovado. Chrome executou defesa e lançamento reais com a nova textura carregada, sem erros de página/rede; modo de movimento reduzido também conferido. Captura do medidor revisada para leitura em escala pequena.

Use case: illustration-story. Production game sprite: ONE small whole cream tart, isolated on a genuinely transparent background, square canvas 1024x1024. For a calm children's storybook 2D game, hand-painted illustration matching a softly painted orange kitten and watercolor backyard picnic, tactile gentle brush texture, clean readable edges, softly shaded volumes rather than flat vector or photorealism. A low wide golden baked pastry shell with a scalloped rim and a few broad fluted sides, thin muted strawberry-pink filling visible beneath a generous soft ivory whipped-cream topping, ONE small red cherry with short stem centered on top. Side view with very slight view of the top, nearly symmetric silhouette, width approximately 80% of canvas and total height including cherry approximately 60%, centered at (50%,50%). Cream is broad and low with three rounded dollops, NOT a tall cupcake swirl. No plate, foil wrapper, pedestal, hands, characters, faces, sparkles, lettering or extra objects. No cast shadow outside the object. Must read instantly as a cream pie projectile at 64x64 and as an icon at 36x36. Warm caramel edges for contrast on a pale green background, white cream retains opaque ivory highlights. Opaque pastry and cream; transparency only outside silhouette. Gentle muted colors, no neon. No background color or baked checkerboard.
