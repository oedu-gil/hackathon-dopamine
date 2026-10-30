#!/usr/bin/env python3
"""Copia a conversa atual do Claude Code para prompts/ (hooks Stop e SessionEnd).

Um arquivo por sessão: prompts/<data>_<session_id>.jsonl, sobrescrito a cada
resposta para ficar sempre igual à conversa real. Não imprime nada.
"""
import datetime
import json
import os
import shutil
import sys
from pathlib import Path


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


if __name__ == "__main__":
    try:
        main()
    except Exception:
        # Nunca atrapalhar a sessão por causa do registro
        sys.exit(0)
