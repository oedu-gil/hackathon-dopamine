# Sequência — direções artísticas propostas

Etapa 2 de `docs/DELEGACAO-CLAUDE.md`. **Nenhuma direção foi escolhida.** Depois da escolha do grupo, a decisão será registrada em `DIRECAO-ARTISTICA.md`.

Estudos visuais: `estudos/direcoes.html` (abrir por um servidor local) e as capturas `estudos/direcao-1-quadro.png`, `estudos/direcao-2-trilha.png`, `estudos/direcao-3-prancha.png`. Cada estudo mostra o estado principal em celular retrato (360×720) e tela ampla (960×600), mais dica, erro, acerto e troca de hiperfoco.

## O que vale para as três

- Só as opções são tocáveis; a fileira é só para olhar. Opções com no mínimo 120 px no celular e 150 px na tela ampla, bem acima dos 48 px mínimos. Sair e Dica com 48 px.
- A e B se diferenciam pela **forma** da imagem, não só pela cor. A dica usa moldura/posição, não só cor.
- Som desligado por padrão. Com `reducedMotion`, nada se move: a lacuna é preenchida sem deslocamento e o destaque é estático.
- Erro: a opção volta ao lugar, mensagem neutra, sem som de erro, sem vermelho, sem tremer.
- Regras para imagens personalizadas: objeto único e centralizado, fundo liso ou transparente, mesmo enquadramento e escala nas duas, silhuetas diferentes entre A e B (ex.: locomotiva × vagão, não duas locomotivas de cores diferentes), sem texto dentro da imagem.

## 1 · Quadro estruturado

**Referências:** quadros visuais do método TEACCH; cartões de padrão Montessori.

- **Ilustração e peças:** cartões quadrados de papel claro com traço escuro de 3 px; posições numeradas 1 a 5; lacuna tracejada com "?". Sem personagem nem cenário.
- **Paleta e tipo:** papel `#f4efe4`, tinta `#1f2a2e`, bandeja `#e8e0cf`, verde `#2f6b4f` só para destaque. Atkinson Hyperlegible (feita para legibilidade).
- **Layout:** celular quebra a fileira em 3 + 2 e coloca a bandeja "Escolha uma" embaixo, perto do polegar. Tela ampla: fileira única de 5.
- **Movimento/feedback:** opção desliza até a lacuna (~200 ms) ou aparece direto. Dica: posições 1, 3 e 5 ganham a mesma moldura.
- **Hiperfoco:** só as imagens mudam.
- **Vantagens:** a mais previsível e calma; menor carga visual; fácil de implementar no prazo; numeração ajuda a ler a ordem.
- **Limites:** pode parecer "tarefa" e pouco atraente para quem precisa de mais motivação; o hiperfoco aparece só nas imagens.

## 2 · Trilha temática

**Referências:** livros-cartão ilustrados e apps de pré-escola com cenário (ex.: Khan Academy Kids), sem copiar personagens ou estilo.

- **Ilustração e peças:** a fileira vira um caminho do tema: pegadas (dinossauro), trilho (trem), rota pontilhada (avião). Céu e chão em dois tons, balão de fala com a instrução.
- **Paleta e tipo:** céu `#dfeee9`, chão `#c9dcc3`, cartões creme com borda `#2d5a4f`, laranja `#d9822b` para destaque. Lexend (fonte pensada para leitura fluente).
- **Layout:** no celular a trilha faz uma curva em "U" (3 + 2) e as opções ficam no chão; na tela ampla, trilha reta.
- **Movimento/feedback:** ao acertar, a fileira "dá um passo" para frente (desligável). Dica: os "A" ganham moldura e, se o movimento estiver ligado, pulsam uma vez.
- **Hiperfoco:** muda as imagens **e** o caminho; o resto do layout é igual.
- **Vantagens:** mais acolhedora e motivadora; o hiperfoco aparece também no cenário; o "caminho" reforça a ideia de ordem.
- **Limites:** mais elementos na tela; precisa de um caminho desenhado por tema (mais trabalho de arte); a curva no celular inverte a direção de leitura da segunda linha, o que pode confundir.

## 3 · Prancha com legenda (CAA)

**Referências:** pranchas de Comunicação Alternativa e Aumentativa (símbolos ARASAAC, PECS).

- **Ilustração e peças:** prancha branca com células de borda preta 3 px, palavra embaixo de cada imagem; lacuna amarela clara tracejada.
- **Paleta e tipo:** fundo `#1f4e79`, prancha branca, texto preto, amarelo `#ffd34d` para a lacuna. Andika (fonte para leitores iniciantes).
- **Layout:** celular em grade 3 + 2; opções grandes com legenda embaixo. Tela ampla: prancha de 5 colunas.
- **Movimento/feedback:** mínimo; a lacuna recebe a imagem. Dica: as legendas aparecem em ordem ("dino · ovo · dino · ovo · ?"), com leitura em voz opcional.
- **Hiperfoco:** imagens e palavras mudam (a palavra vem de `images[].description` ou de um rótulo curto).
- **Vantagens:** maior contraste; familiar para crianças que já usam CAA; apoia vocabulário e leitura; a legenda é uma segunda pista além da imagem.
- **Limites:** mais texto; aparência menos de jogo; exige rótulos curtos e bons para cada imagem personalizada (o contrato atual só tem `description`, que pode ser longa).

## Comparação rápida

| Critério | 1 Quadro | 2 Trilha | 3 Prancha |
|---|---|---|---|
| Carga visual | baixa | média | baixa/média |
| Atratividade lúdica | baixa/média | alta | baixa |
| Presença do hiperfoco | imagens | imagens + cenário | imagens + palavras |
| Apoio à linguagem | numeração | instrução em balão | legenda em cada item |
| Esforço no prazo | baixo | médio/alto | baixo/médio |
| Mudança no contrato | nenhuma | arte de caminho por tema | rótulo curto por imagem (recomendado) |

Também dá para combinar, por exemplo a estrutura do 1 com legendas opcionais do 3 ativadas pelo PDI.
