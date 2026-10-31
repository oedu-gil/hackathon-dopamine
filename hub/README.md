# Hub de jogos

Plataforma independente que reúne os jogos. A criança escolhe o tema de hiperfoco, escolhe um jogo e o jogo abre sozinho dentro do hub. React 19 + Vite 8 + Phaser 4.2.1 (Node 20.19+ ou 22.12+).

```sh
cd hub
npm install
npm run dev     # http://127.0.0.1:5190
npm test
npm run build
```

## Organização

```
hub/src/
  App.jsx, telas/        o hub: tema -> lista -> aviso -> jogo
  jogos/
    contrato.js          o que o hub espera de um jogo (leia antes de criar um)
    registro.js          catálogo: fonte única dos jogos do hub
    memoria/  sequencia/  chuva-emocoes/  cuidar-amigo/  plataforma-amigo/  quebra-cabeca/
  compartilhado/
    temas.js             hiperfocos (trem, aranha, avião, dinossauro)
    arte/                desenhos SVG feitos em código (personagens, rostos, itens)
    kit-phaser/          HUD, efeitos, sons, XP e montarCena() dos jogos do antigo app/
    atividade/           contrato antigo de atividade (usado pela sequência e pelo quebra-cabeça)
```

Regra: **um jogo só importa da própria pasta e de `compartilhado/`**, nunca do hub nem de outro jogo. `tests/hub.test.js` confere isso, e também confere se toda pasta de jogo tem `manifesto.js` e `index.js` e está no registro.

## Como adicionar um jogo

1. Crie `src/jogos/<id>/` (id em minúsculas com hífen).
2. `manifesto.js`: `export default { id, nome, descricao, habilidades, icone }`. Deve ser leve, porque o hub carrega todos para montar a lista.
3. `index.js`: `export function montar(elemento, { tema, nivel, opcoes, aoTerminar, aoSair })`, que desenha o jogo dentro de `elemento` e devolve uma função `desmontar()`. Detalhes em `src/jogos/contrato.js`.
4. Acrescente uma linha em `src/jogos/registro.js`.
5. Para desenvolver sem passar pelo hub: `http://127.0.0.1:5190/jogo.html?id=<id>&tema=trem`. O resultado aparece no console.

O botão **Sair** e a confirmação de saída são do hub, iguais em todos os jogos. O jogo não precisa ter o próprio botão de sair.

## Origem dos jogos

As pastas antigas (`app/`, `memory-game/`, `src/` e `sequencia.html` na raiz) continuam no repositório. Os jogos foram **copiados** para cá. A partir de agora, mudanças nos jogos devem ser feitas aqui.

| Jogo | Veio de |
|---|---|
| memoria | `memory-game/` |
| sequencia | `src/games/sequence/` |
| chuva-emocoes, cuidar-amigo, plataforma-amigo | `app/src/games/` |
| quebra-cabeca | feito direto no hub, a partir de `docs/quebra-cabeca/` (protótipo aprovado em `estudos/prototipo.html`) |

## Limitações conhecidas

- A memória tem um único conjunto de figuras (Transportes) para todos os temas. A sequência tem figuras de trem e dinossauro, e os outros temas usam dinossauro.
- O quebra-cabeça tem uma imagem por tema e começa sempre com o som desligado. Para testar outra imagem: `jogo.html?id=quebra-cabeca&img=baleia` (ou `foguete`, quadrada).
- O nível é sempre 1 (ainda não há PDI no hub).
- O resultado de cada partida só aparece no console. O ponto para enviar ao servidor é `aoTerminar` em `App.jsx`.
- O XP e a coleção dos jogos do antigo `app/` ficam salvos no navegador (`kit-phaser/progresso.js`).
