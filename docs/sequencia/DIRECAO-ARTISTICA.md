# Sequência — direção artística

## Decisão do grupo (30/10/2026)

- **Direção escolhida: 1 · Quadro estruturado** (ver `DIRECOES-PROPOSTAS.md` e `estudos/direcao-1-quadro.png`). As direções 2 e 3 não foram adotadas.
- **Dispositivos:** tablet e celular.
- **Apoio na primeira versão:** somente uma palavra ou frase curta para contextualizar.
- **Faixa etária:** 4 a 10 anos.

Esta decisão aprova a direção visual. O protótipo (`prototipo/`) e o plano (`PLANO.md`) foram aprovados depois, em 30/10/2026, com o apoio confirmado como frase de contexto + Dica em palavras.

## Direção 1 · Quadro estruturado

Referências: quadros visuais do método TEACCH e cartões de padrão Montessori. Usados como princípio (estrutura previsível, ordem visível), sem copiar material.

### Estilo

- Cartões quadrados de "papel" claro com traço escuro; sem personagem, sem cenário, sem textura.
- Fileira de 5 posições numeradas; a lacuna é tracejada com "?".
- Opções numa bandeja separada embaixo ("Escolha uma"), com sombra sólida para parecerem tocáveis.
- Aparência neutra, sem estética infantilizada: serve de 4 a 10 anos. O que muda com a idade e o hiperfoco são as imagens e a frase.

### Paleta e contraste

| Token | Cor | Uso |
|---|---|---|
| `paper` | `#f4efe4` | fundo |
| `card` | `#fffdf8` | cartões e botões |
| `ink` | `#1f2a2e` | texto, bordas (contraste ~13:1 sobre `paper`) |
| `muted` | `#6b6458` | números das posições |
| `gap` | `#7d7262` | lacuna tracejada e "?" |
| `tray` | `#e8e0cf` | bandeja de escolha |
| `ok` | `#2f6b4f` | moldura de acerto e da dica, sempre acompanhada de forma ou texto (✓, moldura mais grossa) |

Sem vermelho, sem flashes, sem gradientes.

### Tipografia

Atkinson Hyperlegible (700 nos títulos e botões, 400 no restante). Título ~22 px no celular, ~28 px no tablet. Fonte embutida no módulo do jogo na implementação (sem depender da rede).

### Layout

- **Celular retrato:** fileira em 3 + 2, bandeja de opções embaixo, perto do polegar.
- **Celular paisagem:** fileira única à esquerda e opções à direita.
- **Tablet (retrato e paisagem):** fileira única de 5, bandeja embaixo.
- Só as opções e os botões são tocáveis. Opções com no mínimo 120 px de lado (no celular deitado, ~110 px por falta de altura); botões de 48 px; 20 px ou mais entre as opções.

### Movimento, feedback e som

- Acerto: a opção desliza até a lacuna (~250 ms), que ganha moldura verde e "✓".
- Erro: a opção volta à bandeja; mensagem neutra; sem tremor, sem som de erro.
- `reducedMotion`: sem deslizamentos; a lacuna é preenchida direto.
- Som desligado por padrão. Com `settings.sound`, no máximo um som curto e suave no acerto (a definir no protótipo de som; fora deste protótipo).

### Apoio: palavra ou frase

- **Frase de contexto** opcional abaixo do título, ligada ao tema (ex.: "Os dinossauros fizeram uma fila.").
- **Dica** (botão): mostra a sequência em palavras, "dino · ovo · dino · ovo · ?". Não destaca cores nem resolve a lacuna.
- As palavras vêm de um rótulo curto de cada imagem (ver o plano).

### Hiperfoco

Muda só as imagens, as palavras e a frase. Layout, cores, tipografia e regras ficam iguais.

### Regras para imagens personalizadas

- Um objeto único, centralizado, ocupando ~70% do quadro.
- Fundo liso ou transparente, sem texto dentro da imagem.
- A e B com o mesmo enquadramento e escala.
- **Silhuetas diferentes** entre A e B (locomotiva × vagão; dinossauro × ovo). Não aceitar duas imagens que só mudam de cor.
- Proporção quadrada de preferência; outras são encaixadas sem distorção.
