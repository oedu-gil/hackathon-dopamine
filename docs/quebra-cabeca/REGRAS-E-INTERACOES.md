# Quebra-cabeça — regras e interações

Esta é a etapa 3 de `docs/DELEGACAO-CLAUDE.md`, na direção B, Papel recortado (ver `DIRECAO-ARTISTICA.md`). O protótipo `estudos/prototipo.html` mostra estas regras funcionando. O grupo gostou do protótipo e decidiu, em 30/10/2026: **a peça errada fica no tabuleiro**, **a imagem-guia não entra** e **a cor da cartolina entra**. Falta a aprovação explícita do plano (ver `PLANO.md`).

Decisões que já existem e não mudam aqui:

- 15 peças numa grade de 5 × 3;
- uma imagem por partida;
- tablet só na horizontal, e computador;
- sem som automático, sem cronômetro e sem penalidade.

## 1. Fluxo da partida

```
carregando ──falha──▶ erro de imagem ──"Tentar de novo"──▶ carregando
    │                      └──"Sair"──▶ saída (abandoned)
    ▼
início (modelo grande + "Começar")
    ▼
montagem ◀──────────────┐
    │  escolher peça → escolher casa → acerto/erro
    │  Ajuda, Som, Sair (pede confirmação)
    ▼
conclusão (finish('completed') uma vez) ──"Montar de novo"──▶ início
    └──"Sair"──▶ saída (não envia outro resultado)
```

| Estado | O que aparece | Ações |
|---|---|---|
| **Carregando** | Cartolina, o texto "Preparando as peças…" e nada se mexendo. | Sair. |
| **Erro de imagem** | "Não consegui abrir a imagem." e uma frase curta para o adulto. | **Tentar de novo** carrega de novo sem recarregar a página. **Sair** chama `finish('abandoned')`. |
| **Início** | O modelo em tamanho grande (360 × 216), o tema embaixo e a frase "Vamos montar esta imagem". | **Começar**. Nada é contado antes desse toque. |
| **Montagem** | Barra com a instrução, o modelo e o progresso à esquerda, o tabuleiro no centro e a bandeja embaixo. | Ver seções 2 e 3. |
| **Conclusão** | A imagem inteira, sem divisões, com o adesivo "Pronto!" e a frase "Você montou a imagem!". | **Montar de novo** (nova partida, contadores zerados). **Sair**. |
| **Confirmar saída** | "Quer sair? As peças desta partida não ficam guardadas." | **Continuar montando** (botão principal). **Sair**, que chama `finish('abandoned')`. |

**Uma saída, um resultado.** `finish` só é chamado uma vez em cada partida. Uma saída depois da conclusão não envia mais nada. "Montar de novo" abre uma partida nova, que vai ter o próprio resultado. Isso precisa ser combinado com o Codex (ver `PLANO.md`, "Ajustes na base").

## 2. Escolher peça e casa

A interação principal é **tocar na peça e depois tocar na casa**. Mouse e toque funcionam do mesmo jeito.

| Ação | Resultado | Conta? |
|---|---|---|
| Tocar numa peça da bandeja | A peça é selecionada. A instrução muda para "Agora toque na casa dela". | Não |
| Tocar na peça já selecionada | Cancela a seleção. | Não |
| Tocar em outra peça | A seleção passa para a nova peça. | Não |
| Tocar numa casa vazia, com peça selecionada | A peça vai para a casa. | **+1 tentativa**. Se for a casa certa, também **+1 acerto**. |
| Tocar numa casa, sem peça selecionada | Mensagem "Primeiro escolha uma peça". | Não |
| Tocar numa casa já certa (com ✓) | Mensagem "Essa casa já está completa". | Não |
| Tocar numa casa com peça errada, com peça selecionada | A peça nova entra na casa e a outra volta ao lugar dela na bandeja. | **+1 tentativa** (e +1 acerto se a nova estiver certa) |
| Tocar numa peça errada que está no tabuleiro | Seleciona essa peça para mudar de lugar. O lugar dela na bandeja aparece como "Devolver aqui". | Não |
| Tocar em "Devolver aqui" | A peça volta para a bandeja. | Não |
| Tocar numa peça certa (com ✓) | Nada acontece, porque ela fica travada. | Não |

**Peça no lugar errado (decidido: fica):** a peça fica na casa, como adesivo solto (com borda e inclinação), sem ✓ e com a mensagem "Ela fica em outro lugar" / "Pode trocar quando quiser". A criança corrige quando quiser. Não há X vermelho, tremida, som de erro nem perda de pontos. A opção "volta para a bandeja" foi descartada e não vira configuração.

**Bandeja estável.** Cada peça tem um lugar fixo na bandeja, que começa embaralhada. Quando uma peça sai, o lugar fica marcado e as outras não se mexem, para a criança não perder de vista onde estava cada uma.

**Bloqueio durante o encaixe.** Enquanto a peça se move (0,2 s, ou 0 s com movimento reduzido), novos toques em peças e casas são ignorados. Assim um toque duplo não coloca duas peças nem conta duas tentativas. Os botões Sair e Som continuam funcionando.

**Arrastar (escolha do grupo, fora da primeira versão):** muitas crianças tentam arrastar no tablet. A proposta é começar só com toque e toque, que é mais fácil de controlar e de contar, e acrescentar o arrastar depois, se o grupo quiser.

## 3. Ajuda

O botão **Ajuda** fica sempre na barra.

- **Com uma peça selecionada:** a casa certa ganha um contorno tracejado e a etiqueta "Dica".
- **Sem peça selecionada:** o jogo seleciona uma peça que ainda falta (a primeira na ordem de leitura) e mostra a casa dela.
- **Contagem:** cada toque que mostra uma dica nova soma **+1 em `hints`**. Tocar de novo enquanto a mesma dica está na tela não soma.
- A dica some quando a peça é colocada ou quando a seleção muda.

## 4. Apoios e ajustes da atividade (decidido)

Os ajustes vêm em `settings`. O que é novo (`puzzle.cardColor`) precisa ser combinado com o Codex como extensão do contrato. A imagem-guia não entra.

| Apoio | Efeito | Valor padrão | Como fica registrado |
|---|---|---|---|
| `sound` (já existe) | Som curto de papel ao selecionar e ao encaixar. | `false` | Faz parte da atividade enviada |
| `reducedMotion` (já existe) | Sem animações e sem inclinação. | Preferência do sistema | Faz parte da atividade enviada |
| `puzzle.cardColor` | Cor da cartolina: `'pessego'`, `'menta'`, `'ceu'` ou `'lavanda'` (ver `DIRECAO-ARTISTICA.md`). Valor desconhecido usa o padrão. | `'pessego'` | Faz parte da atividade enviada |
| Dica | Sempre disponível. | — | `hints` no resultado |

O resultado de hoje (`attempts`, `correct`, `hints`) não diz quais apoios estavam ligados. Como a atividade de entrada já traz esses `settings`, a proposta é **não mudar o contrato de saída** e relacionar as duas coisas pelo `activityId`. Esses números servem para acompanhar a criança, não para avaliar nem diagnosticar.

## 5. Tema, texto e imagens

- **Tema em uma palavra ou frase curta.** A instrução fixa é "Monte a imagem", e o tema aparece como legenda do modelo, com no máximo 2 linhas e reticências se passar disso. Isso evita problemas de concordância como "Monte **o** baleia" e continua funcionando com frases longas.
- **Descrição da imagem.** `images[0].description` fica disponível para o leitor de tela e para o adulto. No Phaser, vai como texto alternativo do canvas.
- **Imagem fora de 5:3.** A imagem inteira é encaixada no tabuleiro, sem cortar e sem distorcer. Para as bordas não virarem peças iguais, a sobra é preenchida com a **própria imagem ampliada e desfocada**, então cada peça de borda tem uma cor diferente. O protótipo mostra isso com uma imagem quadrada.
- **Falha de imagem.** Ver o estado "Erro de imagem" na seção 1. A mensagem atual da base fala em "Volte ao menu", mas o jogo vai abrir sem menu, então a cena precisa mostrar a própria tela de erro.

## 6. Layout e tamanhos

As medidas são em pixels lógicos de 960 × 600, com a escala FIT do Phaser. A tela não é responsiva no sentido de reorganizar as peças; o jogo inteiro é ampliado ou reduzido.

| Área | Posição e tamanho |
|---|---|
| Barra | y 0 a 72. Botões de 56 px de altura: Sair (120), instrução no centro, Ajuda (136) e Som (120). |
| Modelo | x 24, y 112, com 220 × 132. O rótulo "Modelo" fica acima e o tema embaixo (y 252 a 290). |
| Progresso | x 24, y 300. Mostra "N de 15" e 15 quadradinhos de 18 px, em 3 fileiras de 5. |
| Tabuleiro | x 352, y 84, com 500 × 308. São 15 casas de 96 × 96. |
| Bandeja | x 24, y 404, com 912 × 184. São 2 fileiras de lugares de 72 × 72 (10 + 5), com 12 px entre eles. |

Tamanhos físicos aproximados (a escala FIT, sozinha, não prova que dá para usar; isso tem que ser conferido num aparelho de verdade):

| Aparelho | Área útil (px CSS) | Escala | Casa | Peça da bandeja | Botão (altura) |
|---|---|---|---|---|---|
| Tablet de 8″, horizontal | ≈ 960 × 600 | 1,00 | ≈ 1,7 cm | ≈ 1,3 cm | ≈ 1,0 cm |
| Tablet de 10″ (1024 × 768) | 1024 × 768 | 1,07 | ≈ 2,0 cm | ≈ 1,5 cm | ≈ 1,1 cm |
| Notebook, janela 1280 × 650 | 1280 × 650 | 1,08 | ≈ 2,6 cm | ≈ 2,0 cm | ≈ 1,5 cm |
| Monitor, janela 1440 × 800 | 1440 × 800 | 1,33 | ≈ 3,3 cm | ≈ 2,5 cm | ≈ 1,9 cm |

O alvo mínimo recomendado para toque é cerca de 0,9 cm, e todos os alvos ficam acima disso.

**Tablet em retrato:** aparece um aviso "Gire o tablet para jogar", com um desenho parado. A partida fica pausada, e nada é contado.

## 7. Feedback e textos

Os textos são curtos, no presente e sem julgamento:

| Momento | Texto da barra |
|---|---|
| Começo / sem seleção | "Escolha uma peça" |
| Peça selecionada | "Agora toque na casa dela" |
| Peça certa | "Encaixou!" (fica até a próxima ação) |
| Peça errada (fica) | "Ela fica em outro lugar" + linha menor "Pode trocar quando quiser" |
| Peça errada (volta) | "Ela fica em outro lugar" + linha menor "Tente outra casa" |
| Peça do tabuleiro selecionada | "Agora toque na casa dela" + linha menor "Ou devolva para a bandeja" |
| Dica repetida | "A dica já está na tela" (não conta) |
| Casa sem peça escolhida | "Primeiro escolha uma peça" |
| Casa já completa | "Essa casa já está completa" |
| Dica | "A dica mostra a casa dela" |

Nenhuma mensagem some sozinha por tempo, e nenhuma exige leitura para jogar: a peça que sobe, o contorno tracejado e o ✓ dizem o mesmo sem texto.
