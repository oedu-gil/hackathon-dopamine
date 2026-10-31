# hackathon-dopamine

Projeto de um grupo para um hackathon sobre **educação**. A ideia e o escopo do protótipo estão em `IDEIA.md`:

@IDEIA.md

O padrão de design do site e dos jogos está em `DESIGN.md` (skill de projeto `design-tea`). Siga-o ao criar ou ajustar qualquer tela ou jogo.

**Público-alvo: crianças neurodivergentes de 4 a 10 anos**, com um estilo único para toda a faixa (a dificuldade se ajusta pelo nível do PDI, não por modos por idade). Considere isso em textos, visual, sons e ritmo dos jogos.

## Regras de trabalho com a IA

- **A autonomia do grupo conta na avaliação.** Não tome decisões de ideia, design, tecnologia ou ferramentas sem perguntar. Apresente opções com prós e contras e deixe o grupo escolher.
- Na dúvida, pergunte em vez de supor.
- Os integrantes estão aprendendo Claude Code. Quando uma etapa puder ser automatizada (skills, hooks, comandos), sugira e explique, mas só implemente depois que o grupo aprovar.
- Avise quando valer a pena rodar `/compact` (conversa longa, mesma tarefa) ou `/clear` (vai começar outra tarefa). O histórico não se perde porque fica salvo em `prompts/`.
- Responda em português.

## Conversas avaliadas (`prompts/`)

Todas as conversas com a IA serão avaliadas. O hook `.claude/hooks/save_transcript.py` (configurado em `.claude/settings.json`):

1. a cada resposta, copia a conversa para `prompts/<data>_<session_id>.jsonl`;
2. no fim da sessão (sair do Claude Code ou `/clear`), faz em segundo plano o commit **só** de `prompts/` e o push para o GitHub.

Se uma sessão terminar de forma abrupta, a conversa fica salva localmente e é publicada no fim da próxima sessão.

Não edite nem apague arquivos de `prompts/`. Erros de sincronização ficam em `.git/prompts-sync.log`.

## Configuração para cada integrante

1. Ser colaborador do repositório https://github.com/oedu-gil/hackathon-dopamine
2. Instalar o GitHub CLI (`gh`) e rodar `gh auth login` e depois `gh auth setup-git`. Sem isso, o hook não consegue publicar as conversas.
3. Configurar o próprio nome e e-mail no git (`git config user.name` / `git config user.email`), usando um e-mail cadastrado no GitHub.

## Trabalho em paralelo com worktrees

- Use **uma worktree e uma branch por tarefa independente**, com uma conversa da IA aberta na pasta dessa worktree. Não mantenha sessões editando simultaneamente a mesma pasta.
- Nomeie branches como `codex/<integrante>/<tarefa>`, usando nomes curtos em minúsculas e hífens, por exemplo `codex/miguel/autenticacao`. O prefixo é o mesmo para todos, inclusive no Claude Code.
- Crie as worktrees fora da pasta do repositório, em uma pasta irmã chamada `hackathon-dopamine-worktrees`, com subpastas `<integrante>-<tarefa>`. Mantenha o checkout principal disponível para integração e verificação do conjunto.
- Antes de começar, confira `git status` e `git worktree list`, atualize as referências com `git fetch origin` e parta de `origin/main`. Não mova, descarte ou sobrescreva alterações de outra tarefa. Se a tarefa depender de uma mudança ainda não integrada, combine a base com o responsável.
- Combine o escopo e os responsáveis por arquivos compartilhados, componentes e contratos de API. Worktrees isolam arquivos locais, mas conflitos ainda podem aparecer no merge.
- Configure dependências e variáveis de ambiente em cada worktree conforme o projeto exigir. Ao rodar frentes ao mesmo tempo, use portas distintas e separe bancos/dados de teste quando houver interferência; worktrees não isolam serviços externos.
- Faça commits pequenos, publique a branch e abra um pull request para `main`. Integre com frequência, após revisão e verificações pertinentes; confira também o funcionamento do conjunto após o merge.
- Depois da integração, remova a worktree com `git worktree remove <caminho>` apenas quando estiver limpa e todo trabalho estiver preservado. Não use remoção forçada para contornar alterações pendentes.

Exemplo, executado na raiz do checkout principal (substitua `miguel` e `autenticacao`):

```sh
git fetch origin
git worktree add -b codex/miguel/autenticacao ../hackathon-dopamine-worktrees/miguel-autenticacao origin/main
cd ../hackathon-dopamine-worktrees/miguel-autenticacao
```

No primeiro push da tarefa, use `git push -u origin codex/miguel/autenticacao` para configurar o acompanhamento da branch remota.

**Registro das conversas:** preserve `prompts/` em cada worktree. O hook funciona também em worktrees vinculadas: ao fim da sessão ele faz o commit só de `prompts/` e publica a **branch atual** da worktree (`git push -u origin HEAD`), não a `main`. Confira se o push foi feito (erros em `prompts-sync.log`, dentro da pasta do git da worktree) antes de remover a worktree, sem editar nem apagar as transcrições.
