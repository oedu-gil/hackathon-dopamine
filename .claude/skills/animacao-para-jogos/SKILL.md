---
name: animacao-para-jogos
description: Planeja e prepara animacoes 2D para jogos a partir de referencias, videos ou quadros, incluindo idle, locomocao, acoes e efeitos. Seleciona desenhos, ajusta ritmo, exporta spritesheets e avalia continuidade no jogo. Nao se aplica a transicoes de interface web ou edicao geral de filmes.
---

# Animação para jogos

Produza uma animação legível em movimento, com identidade, trajetória, apoio e ritmo coerentes. Aprovação de uma imagem ou vídeo não aprova automaticamente os quadros reduzidos nem sua integração. Nenhuma contagem, resolução ou duração garante qualidade.

## Retomar e planejar

Localize projeto, referências e tentativa atual antes de gerar arquivos. Reutilize escolhas e aprovações do usuário. Leia [tipos de movimento](references/movimentos.md) somente para o tipo em trabalho.

Feche o contrato necessário: sujeito (personagem, objeto ou efeito), intenção, direção/câmera, ação única ou ciclo, apoios/pivô, deslocamento no mundo ou no lugar, eventos, estado inicial/final e tamanho visual no jogo. Diferencie resolução do arquivo da escala em que ele será visto. Não imponha 128px, 16 desenhos, mãos vazias ou arremesso a outros pedidos.

Definir também a linguagem visual (por exemplo desenho 2D pintado) e preservá-la na referência e no prompt temporal; dizer apenas “ilustrado” pode deixar margem para conversão em render 3D. Turnaround e primeiro quadro podem coexistir: um orienta identidade, o outro composição/pose/fundo. Rotular os papéis e confirmar suporte simultâneo do modelo/interface antes de instruir uploads; não usar o turnaround como primeiro quadro por conveniência.

Quando objetos forem adicionados pelo jogo, exigir explicitamente mãos/patas visivelmente vazias em TODOS os quadros: preparação, gesto de segurar, soltura e recuperação. Descrever a mímica de segurar/soltar um objeto imaginário, sem desenhá-lo; proibir objeto segurado, bola, projétil e aparecimento/desaparecimento de adereços. Conferir também as imagens de entrada e revisar esse critério no vídeo. Não aplicar essa proibição a animações que precisam de objetos desenhados. Ao encurtar prompts por limite de caracteres, preservar esse contrato junto com estilo, movimento, câmera e fundo.

Planeje principais e passagens antes de produzir: o que inicia o movimento, o que o conduz, o que fica apoiado e o que reage com atraso. Use antecipação, arcos, espaçamento, acompanhamento e movimento secundário quando ajudarem a leitura; não amplifique tudo em idle nem aplique deformação indiscriminadamente.

## Produzir ou receber material

O processo aceita vídeos, imagens sequenciais ou arte fornecida. Escolha ferramentas realmente disponíveis; esta skill não gera vídeo por si só. Reutilize material aprovado antes de pedir nova geração. Para imagens novas/edições, use a ferramenta ou skill de imagem realmente disponível no agente. Se não houver geração de imagem, prepare referência e prompt para o usuário gerar externamente; não simule uma capacidade ausente. Processamento de quadros não é autorização para redesenhar o personagem.

Para geração externa, preparar uma pasta por tentativa: `ENVIAR` com referência e prompt, `RECEBER` para originais e `RESULTADO` para variantes. Turnaround é apoio de identidade; primeiro quadro deve mostrar a composição desejada. Guardar instruções e configurações efetivamente usadas, provedor/modelo e custo quando conhecido. O usuário operar o serviço manualmente é um caminho completo; não exigir acesso à conta. Não disparar gastos adicionais sem autorização concreta.

Guardar originais e hashes, parâmetros, hipóteses e avaliações no projeto. Não salvar assets ou histórico de um jogo dentro do pacote da skill. Se houver scripts de organização no projeto, reutilizá-los sem presumir seus padrões como universais.

## Selecionar e dar ritmo

Seguir [seleção e validação](references/selecao.md) antes de exportar ou integrar. Rever movimento em velocidade normal e passagens críticas quadro a quadro; se só houver capturas disponíveis, declarar a limitação temporal.

- Vídeo: conferir identidade, trajetória, contato, câmera e movimento secundário. Fundo/alpha são uma avaliação separada.
- Seleção: delimitar trecho útil; guardar timestamp de origem separado do tempo de reprodução. Remover pausas de geração da ação de gameplay quando apropriado.
- Contagem limitada: distribuir desenhos pela informação do movimento, incluindo recuperação. Não manter toda a duração original com poucos desenhos por padrão. Holds longos precisam de intenção, não apenas distância até o próximo timestamp.
- Prévia: comparar seleção em movimento com fonte, em velocidade e escala de gameplay. Ações precisam de preparação/evento/retorno; ciclos precisam de emenda e contato. Uma pose correta não comprova fluidez.

Não recentralizar pela silhueta ou ajustar escala quadro a quadro: braço, cauda e capa alteram os limites sem mover a câmera. Usar referência corporal/apoio apropriado ao tipo; conservar o deslocamento intencional. Compensação de câmera deve ser registrada e avaliada. Não usar alinhamento ou interpolação para esconder anatomia errada.

## Exportar, integrar e aprender

Preservar resolução nativa quando pedido; usar escala e enquadramento comuns quando reduzir. Entregar PNGs, folha com células/layout declarados, metadados de ordem/tempos/eventos, prévia e limitações. Verificar margens, cortes e alpha em fundos claro/escuro; fundo magenta é uma opção a testar, não padrão obrigatório. Em vídeo com taxa variável, usar timestamps reais; índice/fps só quando a base temporal for confirmada.

O exportador opcional `scripts/exportar.py` recebe imagens já extraídas e uma seleção JSON; executar `--help`. Exige Pillow no interpretador disponível e não instala dependências. Preserva pixels/resolução, não remove fundo, não escolhe poses nem aprova ritmo automaticamente.

No teste autorizado no jogo, conservar a versão anterior e conferir sequência completa, idle/ação/retorno, interrupção/pausa, direção e tamanho no cenário. Sincronizar eventos pelo tempo de reprodução, não timestamp de origem. Locomoção exige comparar velocidade visual e deslocamento. Testes de regras/estrutura são evidência separada da fluidez.

Registrar aprovação por etapa: fonte, seleção/ritmo, estrutura, comportamento no jogo e revisão do usuário. Falha na seleção reabre essa etapa, sem invalidar vídeo aprovado. Reprocessar primeiro; nova geração só para falha da fonte. Atualizar orientações com evidência observada e manter testes não realizados explícitos. Ver [casos e limites](references/casos.md).


## Uso no Claude Code e no Codex

Este pacote é independente do projeto de origem. No Claude Code, a cópia principal fica em `.claude/skills/animacao-para-jogos`: invocar `/animacao-para-jogos` ou pedir uma tarefa compatível com sua descrição. Não há restrição de invocação exclusiva pelo usuário. No Codex, a entrada local em `.agents/skills/animacao-para-jogos` aponta para esta cópia: invocar `$animacao-para-jogos` ou solicitar a tarefa pertinente. A disponibilidade efetiva das ferramentas de imagem/vídeo deve ser verificada em cada ambiente; a skill não fornece acesso ao Leonardo nem credenciais.

Para o fluxo manual, entregar `ENVIAR` com arquivos de nomes claros e instruções de campo: turnaround → referência de identidade; imagem inicial → Start Frame, quando o modelo permitir ambos. O prompt deve descrever linguagem 2D, movimento, tratamento do objeto e fundo, respeitando o limite de caracteres da interface. Não inferir que PNG transparente gera vídeo com alpha. `RECEBER` guarda vídeo original e `RESULTADO` guarda prévias e variantes.

O exportador opcional requer Python e Pillow: verificar disponibilidade antes de executar. Se for preciso instalar, usar ambiente virtual do projeto conforme suas regras. Comandos a partir deste pacote: `python scripts/test_exportar.py` para verificações locais e `python scripts/exportar.py --help` para exportação. Não instalar dependências, MCPs ou outros pacotes automaticamente só por carregar a skill.

## Contexto deste projeto

No hackathon-dopamine, seguir `CLAUDE.md` e `DESIGN.md` antes de propor direção visual ou produzir animações. Reutilizar personagens e decisões aprovados pelo grupo. O público e o ritmo dos jogos definidos pelo projeto prevalecem sobre exemplos do ratinho/gatinho; não iniciar mudanças de design, novas ferramentas ou geração paga só por invocar esta skill.
