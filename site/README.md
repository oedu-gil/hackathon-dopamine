# Site Dopamine

O site que integra a escola, a família e a criança. Os jogos ficam na raiz do repo (`src/games/`) e a leitura do PDI fica em `pdi/`. O site usa os dois.

- `site/web`: React + Vite (porta 5180). Áreas: login, escola, desempenho, família e criança.
- `site/server`: Node + Express (porta 3001). Fala com o Supabase e chama `pdi/` para ler o PDI. As chaves ficam só aqui.

## Configurar (uma vez)

1. Crie um projeto em https://supabase.com (plano grátis).
2. No projeto, abra **SQL Editor**, cole o conteúdo de `site/server/supabase/schema.sql` e clique em **Run**. Isso cria as tabelas e os dados de demonstração. Rodar de novo apaga tudo e recomeça.
3. Copie `site/server/.env.example` para `site/server/.env` e preencha:
   - `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY` (em Project Settings > API). A service role key **nunca** vai para o navegador nem para o git.
   - `FEATHERLESS_API_KEY`, para a leitura do PDI.
4. Instale as dependências (Node 20.19+):

```sh
cd pdi && npm ci && cd ..
cd site/server && npm install && cd ../..
cd site/web && npm install && cd ../..
```

## Rodar

Em dois terminais:

```sh
cd site/server && npm run dev   # http://127.0.0.1:3001/health
cd site/web && npm run dev      # http://127.0.0.1:5180
```

Contas de demonstração (senha `demo`): `escola@demo.com`, `familia@demo.com`, `ana@demo.com`. O login é simulado e as senhas ficam em texto puro: **serve só para a demo**.

## Fluxo da demo

1. **Escola:** envia um PDI em PDF (por exemplo `pdi/test/fixtures/pdi-pequeno.pdf`), vê os tópicos de lacunas e aprova ou recusa os jogos sugeridos.
2. **Família:** vê os tópicos e o incentivo para pesquisar (sem sugestões de ação), os jogos aprovados e o desempenho.
3. **Criança:** escolhe o tema de hiperfoco, joga só os jogos aprovados, ganha XP e desbloqueia itens da coleção.
4. **Escola > Ver desempenho:** relatório simplificado por jogo.

## Integração com os jogos (a combinar)

Hoje a tela do jogo (`site/web/src/telas/Jogo.jsx`) é um placeholder que simula uma partida. O ponto único de integração é `site/web/src/jogos/integracao.js`, que segue `src/core/contracts.js`. O site monta uma `activity` (`activityId`, `gameId`, `theme`, `images`) e recebe um resultado como o de `createResult()` (`status`, `attempts`, `correct`, `hints`). Ainda falta combinar com a equipe dos jogos como cada jogo é carregado (importando a cena ou por iframe) e de onde vêm as imagens de cada tema.

O catálogo de jogos e as habilidades que cada um trabalha estão em `schema.sql` (tabela `jogos`). Por enquanto são **provisórios**.

## Identidade visual (Gump)

- Nome do produto: **Gump**. Mascote: beija-flor (`site/web/public/gump-beija-flor.svg`); ícone da aba: `site/web/public/favicon.svg`. No código, use o componente `site/web/src/telas/Logo.jsx`.
- Paleta (tokens em `site/web/src/estilo.css`): verde esmeralda `#2E9E6B`, verde forte `#1F7A50` (botões e texto), rosa rubi `#D9406E`, pêssego `#FF9F6B`, texto `#1E3B2F`, fundo creme rosado `#FFF6F0`.
- Fontes: Fredoka (logo e títulos) e Atkinson Hyperlegible (texto).
- Já redesenhados: login (tela dividida) e área da escola. Faltam família, desempenho e criança.
