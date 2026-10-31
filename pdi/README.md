# pdi

Leitura de PDI (PDF) e classificação nas habilidades usadas pelo motor de
recomendação de jogos (`app/src/recomendacao.js`). Ver spec completo em
`docs/superpowers/specs/2026-10-30-pdi-leitura-recomendacao-design.md`.

A lógica em si (`src/`) é um pacote de funções puras, sem framework
amarrado — fácil de mover pro backend compartilhado do projeto quando ele
existir. `server.js` é um servidor HTTP mínimo (Express) em cima dessas
funções, pra ter algo rodando e testável já, sem depender do backend
compartilhado estar pronto.

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

Gera `test/fixtures/pdi-pequeno.pdf`, `pdi-realista.pdf` e `pdi-em-branco.pdf`.
Já estão versionados; só precisa rodar de novo se o texto de exemplo mudar.

## Rodar o servidor localmente

```bash
cp .env.example .env
# edite .env e cole sua FEATHERLESS_API_KEY
npm run dev
```

Sobe em `http://localhost:3000`. Rotas:

- `GET /health` — health check (usado pelo pinger que evita o servidor
  dormir no Render, ver spec).
- `POST /pdi` — multipart/form-data, campo `pdf`. Devolve
  `{ itens, resumoPais }`.

Testar com `curl`:

```bash
curl -F "pdf=@test/fixtures/pdi-pequeno.pdf" http://localhost:3000/pdi
```

## Rodar o `cli.js` (ponta a ponta, sem servidor)

```bash
node --env-file=.env cli.js test/fixtures/pdi-pequeno.pdf
```

## Deploy no Render

1. Criar conta no render.com (dá pra logar com GitHub).
2. "New +" → "Web Service" → conectar o repositório `oedu-gil/hackathon-dopamine`.
3. **Root Directory:** `pdi`
4. **Build Command:** `npm install`
5. **Start Command:** `npm run start` (usa `node server.js` puro — a chave
   vem da variável de ambiente do Render, não de um arquivo `.env`).
6. Em "Environment Variables", adicionar `FEATHERLESS_API_KEY` com o valor
   real da chave — só ali no painel, nunca em arquivo commitado.
7. Depois de publicado, configurar um pinger gratuito (UptimeRobot ou
   cron-job.org) batendo em `GET /<url-do-render>/health` a cada poucos
   minutos, pra evitar o servidor dormir antes de uma demo ao vivo (plano
   free do Render dorme após ~15 min sem tráfego).

Nunca cole a chave de API em commit, chat ou log.
