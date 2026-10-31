# Evidência e limites

## Caso real que motivou a skill

Ratinho Rei, vídeo de 124 quadros, 768×768, 24fps, ação de arremesso sem objeto gerada pelo usuário no Leonardo. Usuário aprovou a fonte.

Primeira seleção: 16 desenhos em aproximadamente 5.17s, poses sustentadas entre 83 e 1000ms. Usuário relatou travamento no jogo. Testes de regras e captura de soltura haviam passado: isso não validou fluidez.

Segunda seleção: mesmo vídeo e 16 desenhos; ação de 1280ms, tempos de 50–100ms, recuperação com mais etapas, evento aos 600ms. Usuário relatou “ficou bem melhor”. A melhoria envolve seleção e retiming simultaneamente; não atribuir causa somente à distribuição dos desenhos. Não universalizar esses números.

Artefatos ficam no projeto de origem, em `experimentos/video-sprites/ratinho-arremesso-001`; não dependem de existir para usar esta skill em outro projeto.

## Casos de transferência

Gatinho, tentativa 003: usuário relatou resultado melhor ao combinar turnaround, primeiro quadro e estilo 2D explícito, mas solicitou reforçar ausência de objeto na mão. O prompt curto já dizia “empty-handed” e “No objects”; esse relato mostra que formulação genérica não garante obediência. Próxima variante deve explicitar mãos vazias em todas as fases e mímica sem objeto visível. Evidência aqui é relato do usuário, não inspeção independente do novo vídeo. Múltiplas mudanças impedem atribuir a melhora a uma única instrução.

| Pedido | Resultado esperado e falha a detectar | Estado |
|---|---|---|
| Selecionar arremesso de vídeo aprovado | seleção e ritmo distinguem origem de gameplay; evento e retorno sincronizados | uso real observado na conversa de autoria, sem avaliação independente |
| Criar idle de outro personagem | apoio e identidade constantes; emenda sem hold duplicado; amplitude adequada | orientação definida; geração e resultado ainda não testados |
| Preparar corrida | contatos por pé, deslocamento no lugar/mundo definido, emenda e velocidade coerentes | orientação definida; geração e resultado ainda não testados |
| Animar objeto/efeito | pivô/origem e trajetória preservados sem regra de pés/mãos | orientação definida; resultado ainda não testado |
| Refinar transição de botão web | fora do escopo; usar fluxo de movimento de interface | limite descrito; descoberta automática ainda não testada |

Validação estrutural e testes do exportador cobrem formato, preservação e rejeição de entradas inválidas. Não medem qualidade artística, sucesso de geração nem seleção automática da skill pelo host. Novos casos reais devem atualizar a evidência no respectivo projeto e motivar apenas orientações reutilizáveis.

## Instalação e escopo

Pacote completo em `.claude/skills/animacao-para-jogos` neste repositório; entrada de compatibilidade Codex em `.agents/skills/animacao-para-jogos`. Instalação local por projeto, sem cópia pessoal. O instalador do repositório copia os dois diretórios. Os caminhos do ratinho citados como evidência pertencem ao projeto de origem, não são dependências e não são distribuídos.

## Verificação executada — 2026-10-30

Autoavaliação na mesma conversa de autoria, Codex desktop; não houve avaliação independente ou geração paga.

- `quick_validate.py`: pacote e ponto de entrada local aprovados estruturalmente.
- `python scripts/test_exportar.py`: três testes aprovados, com imagens sintéticas RGBA; preservação de pixels e alpha, layout e evento, entradas inválidas, proteção contra sobrescrita e canvases incompatíveis.
- Caso real no exportador geral: seleção aprovada do ratinho produziu folha pixel a pixel igual à versão v2, 16 desenhos, 1280ms, evento aos 600ms. Artefatos em `experimentos/animacao-skill-qa/ratinho-exportador-geral` no projeto de origem.
- Uso artístico real coberto: arremesso do ratinho e revisão do usuário. Descoberta automática em uma conversa nova e transferência artística a idle/corrida/objetos ainda não observadas.

O teste local usa Pillow já disponível em `ferramentas/python-deps` neste projeto. Em outro ambiente, verificar o interpretador/dependência antes de executar; o pacote não instala bibliotecas automaticamente.


## Transferência para skills-hackaton

Pacote adaptado para Claude Code e Codex, sem dependência de caminhos locais do jogo. Não houve execução artística em uma sessão nova de Claude Code; reconhecimento automático e disponibilidade de ferramentas nesse host permanecem pendentes. Os testes locais do exportador verificam formato e preservação de imagens, não fluidez nem integração em engine.

Verificação local desta transferência: pacote e entrada Codex passaram em quick_validate; três testes do exportador passaram no repositório de destino e na cópia instalada. O instalador foi executado em um projeto isolado e os links relativos foram conferidos sem dependência de caminhos pessoais. Esses testes usam Pillow já disponível no ambiente de desenvolvimento; nenhuma dependência foi instalada no repositório de destino. Ativação em sessão nova do Claude Code ainda não observada.
