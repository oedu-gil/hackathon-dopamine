# pdi

Leitura de PDI (PDF) e classificação nas habilidades usadas pelo motor de
recomendação de jogos (`app/src/recomendacao.js`). Ver spec completo em
`docs/superpowers/specs/2026-10-30-pdi-leitura-recomendacao-design.md`.

**Isto não é um serviço implantável por si só** — é um pacote de funções
puras (sem framework HTTP), pronto para ser importado por uma rota do
backend compartilhado do projeto quando ele existir.

## Módulos (`src/`)

- `extrairTexto.js` — extrai o texto de um PDF digital (`pdfjs-dist`).
- `habilidades.js` — lista fixa de habilidades permitidas (cópia
  sincronizada manualmente de `app/src/data/habilidades.js`).
- `prompt.js` — monta o prompt enviado à LLM.
- `featherlessClient.js` — chamada HTTP à API da Featherless.
- `processarPdi.js` — orquestra tudo: extrai, chama a LLM, valida e
  devolve `{ itens, resumoPais }` no formato que `recomendar()` já espera.

## Rodar os testes

```bash
npm install
npm test
```

## Gerar os PDFs de exemplo

```bash
npm run fixtures
```

Gera `test/fixtures/pdi-pequeno.pdf` e `test/fixtures/pdi-realista.pdf`.
Já estão versionados; só precisa rodar de novo se o texto de exemplo mudar.

## Rodar manualmente (ponta a ponta, com a Featherless de verdade)

```bash
cp .env.example .env
# edite .env e cole sua FEATHERLESS_API_KEY
node --env-file=.env cli.js test/fixtures/pdi-pequeno.pdf
node --env-file=.env cli.js test/fixtures/pdi-realista.pdf
```

Nunca cole a chave de API em commit, chat ou log.
