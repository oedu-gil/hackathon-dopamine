# Álbum de descobertas — memória

Jogo independente em Phaser 4.2.1 e Vite 8.3.5. Não usa a entrada, os contratos ou as credenciais da plataforma. A base existente permanece intacta.

## Executar

Na pasta `memory-game`, com Node 20.19+ ou 22.12+:

```sh
npm ci
npm run dev
```

Abra http://127.0.0.1:5181 . A porta é exclusiva desta frente. Para verificar e servir a entrega:

```sh
npm test
npm run build
npm run preview
```

O preview fica em http://127.0.0.1:4181 . Publique o conteúdo de `dist/` em um servidor HTTP; não abra pelo protocolo `file:`. A configuração de caminhos relativos permite hospedar em uma subpasta.

## Personalizar antes de jogar

1. Coloque três imagens distintas em `public/assets/` (PNG, JPEG, WebP ou SVG confiável).
2. Edite `public/activity.json`: `theme` é o interesse; cada imagem possui `id` único, `url` relativa ao arquivo da atividade e `description` curta (idealmente até três palavras).
3. Execute novamente o build para atualizar uma entrega já gerada.

Não inclua nome, foto ou outros dados pessoais se não forem necessários. O jogo não transmite resultados nem salva informações da criança. Não há API de geração de imagens ou tela de upload nesta versão. Os SVGs de transportes foram desenhados como demonstração local e podem ser substituídos. Cada arquivo é usado duas vezes, sem cortes ou distorção; IDs e caminhos repetidos são rejeitados. Não é feita análise visual do conteúdo para identificar arquivos distintos com a mesma imagem.

## Interações

- Começar deixa as cartas disponíveis; toque/clique ou Tab e Enter/Espaço escolhem uma carta.
- Apenas duas cartas diferentes podem ser comparadas. Toques extras, cartas abertas e pares concluídos não alteram o resultado.
- Imagens diferentes permanecem abertas por **1,2 segundo** e fecham automaticamente. Todas as cartas ficam bloqueadas nesse intervalo, inclusive para teclado e toques repetidos. O tempo pode ser ajustado em `MISMATCH_DELAY_MS`, em `src/MemoryScene.js`.
- Os pares ficam abertos na mesma posição, com marca de confirmação além da cor.
- Ao concluir os três pares, **Jogar novamente** embaralha uma nova partida. Um embaralhamento pode por acaso repetir posições.
- Sem som, cronômetro, pontuação por erros, flashes ou comemoração automática. **Reduzir movimento** respeita inicialmente a preferência do sistema e pode ser ajustado durante a sessão.
- Layout de 3 × 2 em telas maiores e 2 × 3 em telas estreitas. A comparação usa uma regra pura; a cena Phaser renderiza o tabuleiro e anima brevemente a imagem. Botões HTML alinhados às cartas oferecem nomes acessíveis e foco nativo, sem capturar atalhos globais.

## Verificações

`npm test` verifica os contratos locais, a comparação, o bloqueio de entradas extras, o bloqueio durante a comparação, conclusão, reinício por nova rodada e geometria responsiva. Build não comprova gameplay: a inspeção no navegador deve exercitar partida completa, reinício, teclado, toque emulado, redução de movimento, fechamento automático, resize e falha de imagem. Dispositivo móvel físico e avaliação com crianças/responsáveis são verificações posteriores.

## Escopo

A pasta possui pacote, lockfile, assets, testes e build próprios. Dependências já presentes no diretório pai podem ser resolvidas durante desenvolvimento, mas `npm ci` nesta pasta é suficiente para um checkout independente. Integração com a plataforma e persistência de resultados não fazem parte desta entrega.
