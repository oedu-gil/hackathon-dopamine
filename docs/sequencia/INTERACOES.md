# Sequência — regras e interações

Etapa 3 de `docs/DELEGACAO-CLAUDE.md`, na direção aprovada (`DIRECAO-ARTISTICA.md`). É uma proposta para revisão junto com o protótipo (`prototipo/`).

## Regra

Fileira A-B-A-B-? e duas opções (A e B) em ordem sorteada. A resposta certa é A. Sem vidas, sem tempo, sem penalidade.

## Fluxo de estados

| Estado | O que a criança vê | Saídas |
|---|---|---|
| Carregando | "Preparando as imagens…" com ícone parado | atividade ou falha |
| Falha de imagem | "Não conseguimos abrir as imagens." + **Tentar de novo** / **Voltar** | recarrega / sai |
| Atividade | título "O que vem depois?", frase de contexto, fileira 1–5, bandeja "Escolha uma" | toque numa opção, Dica, Sair |
| Erro | "Quase! Olhe a fila de novo." A opção sobe e volta (ou fica parada com `reducedMotion`). As duas opções continuam disponíveis | nova tentativa |
| Acerto | a opção vai para a lacuna, que ganha moldura verde e ✓; "Você completou!" | conclusão |
| Conclusão | bandeja vira "Muito bem" + **Jogar de novo** / **Sair** | reinício / saída |
| Confirmar saída | "Quer sair da atividade?" **Continuar** (padrão) / **Sair** | volta / sai |

Não há tela de instrução separada: o título faz esse papel e a criança já começa jogando.

## Toque, bloqueio e recuperação

- Só as duas opções, Dica e Sair são tocáveis. Um toque escolhe; não há etapa de confirmação.
- Depois de uma escolha, as entradas ficam bloqueadas durante o feedback (erro ~400 ms; acerto até a conclusão). Toques nesse intervalo são ignorados e não contam.
- Feedback de erro sem vermelho, sem tremor e sem som. A mensagem some na próxima escolha.
- Sair durante a atividade pede confirmação (evita saída acidental). Depois de concluída, sai direto.

## Contagem (contrato `metrics`)

- `attempts`: +1 por opção escolhida fora do bloqueio.
- `correct`: +1 no acerto (no máximo 1 por partida).
- `hints`: +1 na primeira vez que a Dica é aberta na partida. Tocar de novo não conta.
- `finish('completed')` no acerto, uma única vez. `finish('abandoned')` ao sair antes de concluir. Animação e redimensionamento não contam.
- **Jogar de novo** e reentrada começam uma partida nova, com contadores zerados e novo sorteio das opções.

## Apoio (palavra ou frase)

- **Frase de contexto**, abaixo do título, ligada ao tema. Pode ser desligada pela atividade.
- **Dica**: escreve a fileira em palavras ("dino · ovo · dino · ovo · ?"). Ao acertar, o "?" vira a palavra certa.
- O PDI escolhe só se a frase de contexto aparece. A Dica fica sempre disponível e é registrada em `hints`.
- Fora da v1: leitura em voz, legendas em cada cartão, destaque visual da alternância.

## Layout e tamanhos (medidos no protótipo)

| Tela | Fileira | Opções | Observação |
|---|---|---|---|
| Celular retrato 390×844 | 3 + 2, cartões de ~108 px | ~140 px, embaixo | sem rolagem |
| Celular deitado 844×390 | 1 linha, ~92 px | ~109 px, à direita | sem rolagem |
| Tablet retrato 820×1180 | 1 linha, ~136 px | ~164 px, embaixo | sem rolagem |
| Tablet deitado 1180×820 | 1 linha, 150 px | ~190 px, embaixo | sem rolagem |

Botões Sair/Dica e da conclusão com 48 px de altura mínima. Distância entre opções ≥ 24 px. A versão em Phaser precisa recalcular o layout pelo tamanho real da tela; a escala FIT de 960×600 deixaria as opções pequenas demais no celular retrato.

## Imagens

- Carregamento com tela própria; em falha, **Tentar de novo** recarrega só as imagens e **Voltar** sai como abandono.
- Imagens não quadradas são encaixadas no cartão sem distorção.
- A e B precisam ter silhuetas diferentes (ver `DIRECAO-ARTISTICA.md`). O jogo não consegue verificar isso sozinho: é responsabilidade de quem gera ou escolhe as imagens.
