# Integração inicial do gatinho

Atualização para publicação: as quatro folhas finais ficam em `hub/src/jogos/guerra-tortas/assets/gatinho/`, consumidas por URLs analisadas pelo Vite no hub e no site. `tools/preparar-gatinho.cjs` exporta para essa pasta. A implementação atual inclui cenário e tortinha aprovados e UI de piquenique; guaxinim e animação de impacto/escorrimento da torta permanecem pendentes.

Implementação local na main, por orientação do usuário. Código base do coop reutilizado da worktree miguel-jogo-cooperativo; não foram importadas alterações dos demais jogos ou das transcrições.

## Materiais e exportação

Originais preservados em miguel-arte-gatinho/docs/cooperativo/arte/animacoes/gatinho. Seleções: idle-73-v2 (73), ataque-rapido-v1 (43), defesa-sustentada-v1 (40), reacao-original-v2 (73). Metadados preservam timestamps de origem separados dos tempos de reprodução e identificam marcadores ainda candidatos.

`tools/preparar-gatinho.cjs` converte os 229 desenhos em quatro folhas PNG RGBA, células de 384 × 384 e oito colunas. Cada página tem no máximo 3072 × 3840. Redução uniforme com pivô comum, sem recorte/recentralização por quadro, interpolação temporal ou alteração dos tempos. O verde é removido por dominância de canal (15–80) antes da redução, com supressão de verde nas bordas. Originais não são alterados. As folhas somam aproximadamente 34 MB; desempenho em tablet ainda precisa ser medido.

Uso do conversor: `node tools/preparar-gatinho.cjs <originais/animacoes/gatinho> <caminho-do-modulo-playwright>`. Requer Chrome e Playwright já disponíveis, sem instalação automática.

## Comportamento

- Idle: ritmo original em ciclo. Sem tween adicional no corpo.
- Defesa: 420 ms para subir; quadro 21 estático enquanto houver comando; 360 ms para baixar. Soltura antecipada e retomada usam os mapas de quadros da prévia aprovada. A proteção começa na pose de guarda e termina ao soltar. Colisão ainda usa o destino lógico da torta, não a silhueta pixel a pixel.
- Teclado e ponteiros são contados separadamente; soltar fora, cancelar toque ou perder foco libera a guarda. Shutdown remove os listeners externos.
- Ataque: 985 ms, soltura da torta no marcador de 505 ms. Ataque aguarda idle; defesa não interrompe lançamento aceito. A torta voa como objeto separado; coordenadas de mão/soltura são provisórias para revisão visual.
- Reação: aproximadamente 3042 ms, chantili separado e limpo entre os marcadores de 1167 e 2250 ms. Defesa pode interromper a reação.
- Movimento reduzido: idle estático e poses essenciais, com os mesmos tempos e eventos de gameplay. Consulta tanto a opção do jogo quanto a preferência do sistema na montagem.

## Verificação e revisão pendente

Testes automatizados cobrem hold, liberação antecipada, retomada, eventos únicos e retorno. Chrome executou controles reais de começar, segurar/soltar Espaço e lançar, carregamento dos assets, reação/limpeza e opção de movimento reduzido, sem erros de página ou rede. Capturas conferidas em fundo escuro mostram personagem sem o fundo verde.

Aprovação visual do movimento no jogo ainda depende do usuário: emenda da cauda do idle já sinalizada na fonte, continuidade das passagens, escala, bordas finas em fundos claro/escuro e alinhamento da torta/chantili. Cenário e guaxinim continuam provisórios. Testes de estado, capturas e build não comprovam fluidez nem desempenho mobile.

Para abrir: `npm --prefix hub run dev`, então `http://127.0.0.1:5190/jogo.html?id=guerra-tortas&sons=0`.
