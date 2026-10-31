# Quebra-cabeça — direção artística

**Escolha do grupo (30/10/2026): direção B, Papel recortado.** Foi escolhida entre as três alternativas de `estudos/direcoes.html` (A Bandeja de madeira, B Papel recortado, C Mesa de montagem). A escolha vale só para o quebra-cabeça.

Escolher a direção não aprova o protótipo nem o plano. Os dois serão revisados separadamente, na etapa 4.

## Ideia

As peças parecem adesivos com borda branca sobre uma folha colada numa cartolina colorida. Os contornos são grossos e as sombras são chapadas, sem desfoque.

Referências: as colagens de Eric Carle ("A lagarta comilona"), as cores chapadas da Toca Boca e os livros de adesivos.

## Especificação

| Item | Definição |
|---|---|
| Fundo | Cartolina de uma cor só. A cor sai de uma lista curta (ver "Cor da cartolina"). |
| Tabuleiro | Folha creme `#fffaf2`, contorno de 3 px `#2a1f3d` e sombra chapada de 8 px na mesma cor. As casas vazias têm linhas `#e8d8c4`. |
| Peças | Adesivos com borda branca de 4 px e sombra chapada de 3 px. Na bandeja ficam levemente inclinados (−3° a +2,5°), só para enfeitar. A peça fica reta quando é selecionada ou encaixada. |
| Bandeja | Faixa verde `#7fc8a9` com contorno de 3 px. Cada peça tem um lugar fixo na bandeja, e quem sai deixa a marca do lugar. |
| Tinta e contraste | Tinta `#2a1f3d`, com contraste de texto acima de 12:1 sobre o creme. |
| Destaque | Roxo `#6a3fc8` com texto branco, usado na seleção e na dica. |
| Tipografia | Títulos e instruções em **Baloo 2**, peso 700 a 800. Textos e botões em **Atkinson Hyperlegible**. A instrução principal tem 28 a 30 px lógicos. |
| Botões | 56 px de altura, contorno de 3 px, cantos de 22 px, ícone e texto. |
| Estados sem depender de cor | **Selecionada:** sobe, ganha borda roxa grossa e a etiqueta "Esta peça". **Encaixada:** fica reta e ganha o selo ✓. **Dica:** contorno tracejado na casa e etiqueta "Dica". |
| Movimento | Selecionar faz a peça "descolar" (subir 8 px e crescer 8 %) em 0,15 s. Encaixar leva 0,2 s até a casa, com um leve achatamento no fim. Sem quiques longos e sem piscar. Com movimento reduzido, nada anima, a peça aparece direto no lugar e a inclinação some. |
| Som | Um som curto de papel, opcional e **desligado por padrão**. Não toca nada sozinho, e o botão Som fica sempre visível. |
| Conclusão | A imagem fica inteira, sem as divisões, e aparece um adesivo "Pronto!" parado. Sem confete e sem flash. |

## Cor da cartolina

A direção B tem um risco que já foi apontado no estudo: a cartolina pode brigar com a imagem gerada. Para controlar isso (decidido em 30/10/2026: a cor da cartolina entra):

- uma lista fixa de 4 cores claras: pêssego `#ffd9a8`, menta `#cdeedd`, céu `#cfe3ff` e lavanda `#e6dcff`;
- a cor padrão é pêssego;
- a atividade pode trazer outra cor da lista, escolhida por um adulto ou por regra de contraste com a imagem. Essa escolha precisa ser combinada com quem gera as imagens.

Todas as quatro mantêm o contraste da tinta acima de 11:1.

## Faixa etária

A faixa decidida é de 4 a 10 anos. O estudo mostrou que a direção B combina mais com 4 a 8 anos; se as crianças de 9 e 10 anos acharem o visual infantil, uma variação possível é tirar a inclinação e diminuir as sombras, sem mudar o layout. Isso não entra na primeira versão.

## O que muda com o tema

Mudam só a imagem, a frase do tema e a cor da cartolina. Contornos, peças, layout e textos dos botões continuam iguais, para a criança reencontrar o mesmo ambiente em qualquer tema.
