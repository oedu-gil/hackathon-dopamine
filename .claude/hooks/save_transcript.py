#!/usr/bin/env python3
"""Copia a conversa atual do Claude Code para prompts/ e publica no GitHub
(hooks Stop e SessionEnd).

Um arquivo por sessão: prompts/<data>_<session_id>.jsonl, sobrescrito a cada
resposta (Stop) para ficar sempre igual à conversa real. No fim da sessão
(SessionEnd, inclusive /clear), um processo em segundo plano faz commit só de
prompts/ e push. Assim há um commit por sessão, não um por resposta.
Não imprime nada; erros do git vão para .git/prompts-sync.log.
"""
import datetime
import fcntl
import json
import os
import shutil
import subprocess
import sys
from pathlib import Path


def git(project_dir, *args):
    return subprocess.run(["git", "-C", str(project_dir), *args],
                          stdin=subprocess.DEVNULL)


def sync(project_dir):
    """Commit de prompts/ e push. Roda desacoplado da sessão."""
    lock_path = project_dir / ".git" / "prompts-sync.lock"
    with open(lock_path, "w") as lock:
        # Stop e SessionEnd podem disparar juntos: um sync por vez
        fcntl.flock(lock, fcntl.LOCK_EX)

        git(project_dir, "add", "prompts")
        if git(project_dir, "diff", "--cached", "--quiet", "--", "prompts").returncode != 0:
            # Pathspec garante que só prompts/ entra no commit, mesmo com outras
            # mudanças já preparadas pelo grupo
            git(project_dir, "commit", "-q", "-m", "Atualiza transcrições em prompts/",
                "--", "prompts")

        if git(project_dir, "push", "-q").returncode != 0:
            # Alguém do grupo publicou antes: traz as mudanças e tenta de novo
            if git(project_dir, "pull", "-q", "--rebase", "--autostash").returncode != 0:
                git(project_dir, "rebase", "--abort")
                return
            git(project_dir, "push", "-q")


def start_sync(project_dir):
    if not (project_dir / ".git").is_dir():
        return
    log = open(project_dir / ".git" / "prompts-sync.log", "a")
    subprocess.Popen([sys.executable, __file__, "--sync", str(project_dir)],
                     stdin=subprocess.DEVNULL, stdout=log, stderr=log,
                     start_new_session=True)


def main():
    data = json.load(sys.stdin)
    transcript = Path(data["transcript_path"]).expanduser()
    session_id = data["session_id"]

    project_dir = Path(os.environ.get("CLAUDE_PROJECT_DIR", data.get("cwd", ".")))
    prompts_dir = project_dir / "prompts"
    prompts_dir.mkdir(exist_ok=True)

    # Reaproveita o arquivo da sessão se já existir (mesmo que a data tenha mudado)
    existing = sorted(prompts_dir.glob(f"*_{session_id}.jsonl"))
    if existing:
        dest = existing[0]
    else:
        today = datetime.date.today().isoformat()
        dest = prompts_dir / f"{today}_{session_id}.jsonl"

    if transcript.exists():
        shutil.copyfile(transcript, dest)

    # Publica tudo que estiver pendente em prompts/, inclusive sessões
    # anteriores que terminaram sem disparar SessionEnd
    if data.get("hook_event_name") == "SessionEnd":
        start_sync(project_dir)


if __name__ == "__main__":
    try:
        if len(sys.argv) == 3 and sys.argv[1] == "--sync":
            sync(Path(sys.argv[2]))
        else:
            main()
    except Exception:
        # Nunca atrapalhar a sessão por causa do registro
        sys.exit(0)
