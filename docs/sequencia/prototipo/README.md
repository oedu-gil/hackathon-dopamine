# Protótipo navegável — sequência

HTML puro, só para revisão. **Não é o jogo de produção** (que será em Phaser) e não usa a base `src/`.

## Abrir

Na pasta `docs/sequencia`:

```sh
python -m http.server 5191 --bind 127.0.0.1
```

Abra http://127.0.0.1:5191/prototipo/ no navegador do computador (use o modo de dispositivo do navegador para simular celular/tablet) ou, na mesma rede, pelo IP do computador no tablet/celular.

## Parâmetros de revisão

| Parâmetro | Efeito |
|---|---|
| `?tema=trem` | troca as imagens e a frase (hiperfoco trem) |
| `?falha=1` | a primeira carga falha, para ver "Tentar de novo" |
| `?rm=1` | simula movimento reduzido |
| `?contexto=0` | esconde a frase de contexto |
| `?debug=1` | mostra contadores e eventos (`finish`) no rodapé |

Podem ser combinados: `?tema=trem&rm=1&debug=1`.

## Capturas

`telas/`: celular retrato e deitado, tablet retrato e deitado, cada um em atividade, dica + erro e conclusão; mais falha de imagem e confirmação de saída (tema trem).

A fonte Atkinson Hyperlegible vem do Google Fonts neste protótipo; sem internet, cai na fonte do sistema.
