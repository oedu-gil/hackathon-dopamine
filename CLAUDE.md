# hackathon-dopamine

Projeto de um grupo para um hackathon sobre **educação**. A ideia ainda está em definição.

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
