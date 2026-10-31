# Cenário de piquenique — integração

Fundo aprovado pelo usuário nesta conversa. Caminho atual para publicação: `hub/src/jogos/guerra-tortas/assets/cenario-piquenique.png`. As artes passaram de `hub/public` para a pasta do jogo, com URLs analisadas pelo Vite, para funcionar tanto no hub quanto no site. Os caminhos abaixo documentam a integração inicial.

Implementado em 31/10/2026, retomando a escolha de piquenique em quintal caseiro registrada em `miguel-arte-gatinho/docs/cooperativo/arte/RETOMADA.md` e o pedido de implementar nesta conversa.

O fundo fixo fica em `hub/public/guerra-tortas/cenario-piquenique.png`. A cena carrega pelo `BASE_URL` do Vite e exibe no canvas 800 × 450, atrás dos personagens e da interface. O cenário não muda com o hiperfoco; XP e coleção continuam usando o tema existente. O fundo é estático também no modo de movimento reduzido. Há sombras de contato e uma faixa escura sob o controle de defesa para preservar a leitura no gramado. Se a textura não carregar, a câmera mantém uma cor suave de reserva.

Arte gerada pela ferramenta integrada `image_gen`; não foi usada a API/CLI. Original preservado no diretório de imagens geradas do Codex. O guaxinim e os objetos continuam na arte SVG provisória: não há arte final aprovada desses elementos neste registro. As animações aprovadas do gatinho são preservadas.

## Verificação

- `npm --prefix hub test`: 61 testes aprovados.
- `npm --prefix hub run build`: aprovado; aviso de tamanho do bundle Phaser existente.
- `tools/verificar-cenario.cjs`: Chrome local, defesa de uma torta da agenda com Espaço, soltura e lançamento por clique, textura no fundo e opção de movimento reduzido. Sem erros de página ou requests HTTP >= 400.
- Captura da partida revisada; legenda recebeu fundo limitado ao texto para não cobrir as patas do gatinho. Desempenho e toque em tablet físico não foram medidos.

## Prompt utilizado

### Ajuste de composição solicitado

Canga e cesto movidos para o centro inferior, entre os personagens, para ocupar melhor a clareira. Edição pela ferramenta integrada `image_gen`, aplicada ao mesmo arquivo de cenário. Original preservado no diretório de imagens geradas do Codex.

Prompt da edição: Use case: precise-object-edit. Edit this existing game background only by relocating the picnic blanket and wicker basket from the far lower-right edge to the lower center of the grassy clearing. The dusty rose checkered blanket should now span roughly x=36%–65% of image width and y=70%–88% of image height; basket sitting on its upper-right part, centered roughly x=57%, y=73%. Both fully visible, approximately same scale as original, giving the center a welcoming picnic focal point. Remove their old placement on the right and naturally restore grass there. Preserve everything else: same backyard composition, trees, fence, flowers, sky, hand-painted children's book style, muted palette, lighting, camera, landscape aspect ratio and image dimensions. Keep the upper-middle flight area quiet and empty, as this is a background for a game with characters at x=24% and x=76%. No new props, no characters, no animals, no text or UI.

### Geração inicial

### Ajuste de distância solicitado

Canga e cesto levemente menores e mais acima no gramado, mantendo o conjunto centralizado para parecer um pouco mais distante da câmera. Edição visual conferida e aplicada ao mesmo PNG com `image_gen` integrado. Prompt: Use case: precise-object-edit. Edit the provided game background with one subtle change: move the picnic blanket and wicker basket together a LITTLE farther away from the camera into the grassy clearing. Keep the picnic centered horizontally. Reduce the whole picnic group to approximately 85% of its current size, and move it upward by approximately 5% of the full image height. It should still be clearly visible in the lower-middle of the image, just modestly farther back, not near the fence. Preserve the basket sitting on the upper-right area of the same dusty rose checkered blanket. Restore the exposed grass naturally. Preserve absolutely everything else: trees, fence, flowers, sky, lighting, palette, painted children's storybook style, image dimensions and framing. Do not zoom or move the camera; only reposition and slightly scale the two picnic objects. No new props, no characters, no text.

### Prompt original

Use case: illustration-story. Create a production background asset for a calm children's 2D game Guerra de Tortas. Landscape 16:9, ideally 1600x900. Only scenery, absolutely no characters, animals, text, UI or watermarks. Cozy picnic in a home backyard, painted children's storybook style with soft hand-painted gouache texture and rounded forms, matching a warmly illustrated orange kitten in a blue toy-soldier coat. Muted sage grass, pale warm cream sky, dusty blue and warm beige accents. Front-facing 2D stage composition for logical canvas 800x450: ground/feet line approximately y=350–372. Broad flat quiet grassy playing area. Keep central flight corridor x=260–540, y=150–330 very simple, pale and low contrast. Trees and wooden garden fence in distant background along edges, a small wicker picnic basket and folded dusty-rose picnic cloth at far right bottom edge only, behind gameplay. Upper left 270x56 and upper right 250x56 must have no prominent details; lower left 160x110 clear for blue defense button. No large foreground objects or central picnic table; no shadows painted for missing characters. Soft diffused daylight, low saturation, no neon. Flat playable stage, no dramatic perspective, no animation. Full bleed, opaque.
