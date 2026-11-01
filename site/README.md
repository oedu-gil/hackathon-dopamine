# Site Dopamine

O site que integra a escola, a família e a criança. Os jogos ficam em `hub/` e a leitura do PDI fica em `pdi/`. O site usa os dois.

- `site/web`: React + Vite (porta 5180). Áreas: página inicial (vitrine dos jogos), login, escola (novo PDI e histórico), família e criança.
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

## Histórico de exemplo

Para os filtros de bimestre, semestre e ano terem o que mostrar, rode `cd site/server && npm run dados-demo`. O script apaga os PDIs, as aprovações e as partidas da Ana e cria 4 PDIs (2025 e 2026) e partidas semanais com acerto subindo aos poucos. Os outros dados não mudam.

## Fluxo da demo

1. **Escola:** envia um PDI em PDF (por exemplo `pdi/test/fixtures/pdi-pequeno.pdf`), vê os tópicos de lacunas e aprova ou recusa os jogos sugeridos.
2. **Família:** vê os tópicos e o incentivo para pesquisar (sem sugestões de ação), os jogos aprovados e o desempenho.
3. **Criança:** escolhe o tema de hiperfoco, joga só os jogos aprovados, ganha XP e desbloqueia itens da coleção.
4. **Escola > Histórico e desempenho:** PDIs e partidas por bimestre, semestre ou ano, com a evolução da taxa de acerto. A família vê o mesmo, só do filho.

## Jogos e tags do PDI

Os jogos moram em `hub/src/jogos/` (cada um com `manifesto.js` e `index.js`, contrato em `hub/src/jogos/contrato.js`). O site importa direto de lá pelo alias `@hub` (`site/web/vite.config.js`) e abre o jogo com `montar()` em `site/web/src/jogos/integracao.js`. O Phaser vem do `site/web`, o `hub/` não precisa de `npm install` para o site funcionar.

Como as tags do PDI viram jogos:

1. A IA lê o PDI e devolve os tópicos (tags de habilidade, em `pdi/src/habilidades.js`).
2. O manifesto de cada jogo declara quais habilidades ele treina (`habilidades`).
3. O servidor sugere os jogos que treinam pelo menos uma tag do PDI, com os que cobrem mais tags primeiro (`sugerirJogos` em `site/server/src/regras.js`). Na tela da escola, as tags do jogo que vieram do PDI aparecem em destaque.
4. A escola aprova. A criança só vê os aprovados, e o jogo abre com o tema dela e o nível do PDI.
5. Ao terminar (ou sair), o jogo envia `{ status, attempts, correct, hints }` para `/alunos/:id/resultados`.

**Catálogo automático:** ao subir, o servidor copia os manifestos do hub para a tabela `jogos` do Supabase e acrescenta, como "sugerido", os jogos novos para quem já tem PDI (decisões da escola não mudam). Também dá para rodar à mão com `cd site/server && npm run sincronizar-jogos`.

Os temas de hiperfoco (trem, aranha, avião, dinossauro) vêm do hub (`hub/src/compartilhado/temas.js`), junto com o personagem e os itens da coleção, para o site e os jogos ficarem iguais.

## Identidade visual (Gump)

- Nome do produto: **Gump**. Mascote: beija-flor (`site/web/public/gump-beija-flor.svg`); ícone da aba: `site/web/public/favicon.svg`. No código, use o componente `site/web/src/telas/Logo.jsx`.
- Paleta (tokens em `site/web/src/estilo.css`): verde esmeralda `#2E9E6B`, verde forte `#1F7A50` (botões e texto), rosa rubi `#D9406E`, pêssego `#FF9F6B`, texto `#1E3B2F`, fundo creme rosado `#FFF6F0`.
- Fontes: Fredoka (logo e títulos) e Atkinson Hyperlegible (texto).
- Referência de interface: PBS Kids (pbskids.org), adaptada ao `DESIGN.md`: sem carrossel, sem cores saturadas e sem animação além de feedback curto.
- **Área da criança:** um cenário do tema no topo, com o personagem, o XP e o próximo item; depois, cartões grandes de jogo e a estante da coleção (itens bloqueados aparecem como silhueta). Antes de cada jogo aparece um aviso com o botão Começar. No fim, a comemoração mostra o item novo.
- **Temas e arte:** vêm do hub de jogos (`hub/src/compartilhado/temas.js` e `arte/`), para o site e os jogos ficarem iguais. O site só acrescenta as cores do cenário em `site/web/src/temas.js`. O cenário de cada tema está em `site/web/src/telas/Cenario.jsx`.
- **Página inicial:** vitrine com uma fileira de capas por tema rolando devagar (com botão de pausar) e o botão Entrar.
- **Login:** cartão sobre o cenário, com abas de perfil (escola, família, criança) e os personagens dos temas no chão.
- **Adultos:** texto maior, escola com menu à esquerda (novo PDI, histórico e desempenho), resumo completo do PDI para a família e histórico por período (bimestres do calendário: jan–fev, mar–abr…).

## Guerra de Tortas no fluxo do site

A habilidade `cooperacao` (Cooperação) é aceita pela leitura do PDI e corresponde ao manifesto da Guerra de Tortas. O jogo já integra o registro do hub e é empacotado no site; ao iniciar, o servidor sincroniza esse catálogo.

Para testar o percurso completo, entre como escola, envie um PDF fictício que descreva explicitamente um objetivo de cooperação em dupla (texto de exemplo em `docs/cooperativo/PDI-COOPERACAO-EXEMPLO.txt`), revise o resultado e aprove Guerra de tortas. Depois entre como criança para abrir o jogo. PDIs antigos não são reclassificados automaticamente e jogos não são liberados sem aprovação da escola. O envio de um novo PDI reinicia as aprovações do aluno, conforme o fluxo existente.

Teste automatizado `site/server/src/cooperacao.test.js` liga o catálogo de habilidades, o prompt, o processamento de resposta simulada da LLM e o manifesto real do jogo. Não usa a API paga nem modifica dados de alunos.
