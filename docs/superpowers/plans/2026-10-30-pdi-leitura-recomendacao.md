# Leitura de PDI e recomendação de jogos — Plano de implementação

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construir os módulos JS puros que leem um PDI em PDF, classificam o conteúdo nas habilidades já usadas pelo motor de recomendação de jogos (`app/src/recomendacao.js`), e geram um resumo para os pais com pontos de atenção e atividades comportamentais genéricas — tudo pronto para ser importado por uma rota do backend compartilhado do projeto, ainda não publicado.

**Architecture:** Pacote Node independente (`pdi/`), sem framework HTTP próprio. Funções puras e testáveis, com a chamada à LLM injetada por parâmetro (mesmo padrão de `recomendar(pdi, catalogo)` em `app/src/recomendacao.js`, que recebe suas dependências como argumento). Uma única chamada à Featherless (DeepSeek) já devolve classificação e resumo para os pais juntos. Toda validação de segurança/escopo (lista de habilidades permitida, nível fixo, aviso fixo, nunca repassar links/ações da LLM) acontece em código determinístico, não na IA.

**Tech Stack:** Node.js (ESM), `pdf-parse` (extração de texto), `pdfkit` (gerar PDFs de exemplo para teste, dev-only), `node --test` (test runner nativo, mesmo usado em `app/package.json`), fetch nativo do Node para a Featherless.

**Spec:** `docs/superpowers/specs/2026-10-30-pdi-leitura-recomendacao-design.md`

## Global Constraints

- Habilidades válidas (cópia sincronizada manualmente de `app/src/data/habilidades.js`): `reconhecer-emocoes`, `resposta-social`, `empatia`, `causa-efeito-social`. Qualquer habilidade fora dessa lista, vinda da LLM, é descartada.
- `nivel` é sempre `1` para todo item identificado — nunca inferido pela LLM.
- `resumoPais.aviso` é sempre o texto fixo definido no código: `"Estas sugestões são orientações gerais e não substituem acompanhamento profissional."` — nunca o que a LLM retornar.
- `resumoPais` nunca contém ações/intervenções prescritas nem links/fontes gerados pela LLM — só tópicos, pontos de atenção e atividades comportamentais genéricas (ver spec, seção "Resumo para os pais").
- PDF só digital, com texto selecionável — sem OCR (corte de escopo documentado no spec e no `IDEIA.md`).
- Chave da Featherless só em variável de ambiente (`pdi/.env`, gitignorado); nunca em código, log ou commit.
- Nenhum framework HTTP é escolhido aqui — os módulos são funções puras, importáveis por quem construir o backend compartilhado.

## Review Focus

- PDF digital mas sem texto extraível (página em branco, PDF corrompido) → `extrairTexto` devolve string vazia; `processarPdi` deve reconhecer isso e retornar um erro distinto de "nenhuma habilidade reconhecida", sem chamar a LLM à toa.
- LLM devolve um id de habilidade com variação de caixa/espaço (ex.: `"Reconhecer-Emocoes "`) → deve ser normalizado antes de comparar com a lista permitida, ou será descartado incorretamente.
- LLM devolve a mesma habilidade duplicada (ex.: `reconhecer-emocoes` duas vezes) → `itens` não deve conter duplicatas.
- LLM inclui um campo extra não previsto no schema (ex.: um link, uma "ação sugerida", um texto fora do formato) → o validador só lê os campos definidos no schema; nada extra deve vazar para `resumoPais`.
- LLM devolve `atividades` ausente, nulo, ou não-array para uma habilidade → não pode quebrar o processamento; devolve lista vazia nesse caso.

---

## Task 1: Scaffold do pacote `pdi/`, fixtures de PDI e `extrairTexto`

**Files:**
- Create: `pdi/package.json`
- Create: `pdi/.gitignore`
- Create: `pdi/.env.example`
- Create: `pdi/scripts/gerar-fixtures.js`
- Create: `pdi/src/extrairTexto.js`
- Create: `pdi/test/fixtures/pdi-pequeno.pdf` (gerado pelo script, não escrito à mão)
- Create: `pdi/test/fixtures/pdi-realista.pdf` (gerado pelo script, não escrito à mão)
- Test: `pdi/test/extrairTexto.test.js`

**Interfaces:**
- Produces: `extrairTexto(bufferPdf: Buffer) => Promise<string>` — texto puro extraído do PDF, usado pela Task 4.

- [ ] **Step 1: Criar `pdi/package.json`**

```json
{
  "name": "pdi",
  "private": true,
  "type": "module",
  "scripts": { "test": "node --test", "fixtures": "node scripts/gerar-fixtures.js" },
  "dependencies": { "pdf-parse": "^1.1.1" },
  "devDependencies": { "pdfkit": "^0.15.0" }
}
```

Rodar `npm install` dentro de `pdi/` depois de criar o arquivo.

- [ ] **Step 2: Criar `pdi/.gitignore`**

```
node_modules/
.env
```

- [ ] **Step 3: Criar `pdi/.env.example`**

```
FEATHERLESS_API_KEY=
```

- [ ] **Step 4: Criar `pdi/scripts/gerar-fixtures.js`**

Script Node que usa `pdfkit` para gerar dois arquivos PDF de texto simples em `pdi/test/fixtures/`:

`pdi-pequeno.pdf`, com este texto (um `doc.text(...)` por parágrafo, ou um bloco só — tanto faz, desde que todo o texto abaixo apareça no PDF):

```
PDI - Exemplo pequeno (uso interno, ficticio)

Aluno: L., 7 anos. Diagnostico: TEA (nivel 1 de suporte).

Avaliacao multiprofissional: L. demonstra dificuldade em identificar
expressoes faciais dos colegas e nomear o que sente diante de situacoes
do dia a dia. Em momentos de conflito no recreio, nao associa a propria
atitude a reacao do colega (eu empurrei, por isso ele chorou),
respondendo de forma impulsiva.

Objetivos a trabalhar:
1. Reconhecer e nomear emocoes basicas (alegria, tristeza, raiva, medo)
em si e nos colegas.
2. Praticar respostas sociais adequadas em situacoes de conflito ou
convite para brincar (pedir para entrar na brincadeira, esperar a vez).
3. Compreender a relacao entre uma atitude propria e a reacao do outro
(causa e efeito social).
4. Desenvolver empatia ao perceber como o colega se sente diante de uma
situacao.

Estrategias: apoio visual com cartoes de emocoes, historias sociais,
mediacao do professor em situacoes de conflito.
```

`pdi-realista.pdf`, com o texto completo do PDI do "Lucas Silva Santos" (copiar literalmente do histórico da conversa — 8 seções, de "1. Identificação do Aluno" até "8. Assinaturas e Ciência").

O script roda uma vez via `npm run fixtures` e os PDFs resultantes ficam versionados no repositório (não precisam ser regenerados em CI).

- [ ] **Step 5: Rodar `npm run fixtures` dentro de `pdi/` e confirmar que os dois arquivos PDF foram criados em `pdi/test/fixtures/`**

- [ ] **Step 6: Escrever o teste de `extrairTexto` (deve falhar: módulo ainda não existe)**

```js
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { extrairTexto } from '../src/extrairTexto.js'

test('extrai texto de um PDF digital', async () => {
  const buffer = await readFile(new URL('./fixtures/pdi-pequeno.pdf', import.meta.url))
  const texto = await extrairTexto(buffer)
  assert.match(texto, /reconhecer e nomear emocoes/i)
  assert.match(texto, /causa e efeito social/i)
})

test('PDF sem texto extraivel devolve string vazia', async () => {
  const bufferVazio = Buffer.from('%PDF-1.4\n%%EOF')
  const texto = await extrairTexto(bufferVazio)
  assert.equal(texto.trim(), '')
})
```

- [ ] **Step 7: Rodar `npm test` em `pdi/` e confirmar falha (`extrairTexto` não existe)**

- [ ] **Step 8: Implementar `extrairTexto(bufferPdf)` em `pdi/src/extrairTexto.js`**

Usa `pdf-parse` sobre o buffer e devolve `resultado.text`. Para um PDF que não gera texto (ou que falha o parse), não deve lançar exceção para esse caso de borda — devolve string vazia.

- [ ] **Step 9: Rodar `npm test` e confirmar que os dois testes passam**

- [ ] **Step 10: Commit**

```bash
git add pdi/package.json pdi/.gitignore pdi/.env.example pdi/scripts pdi/src/extrairTexto.js pdi/test
git commit -m "pdi: scaffold do pacote, fixtures de exemplo e extracao de texto do PDF"
```

---

## Task 2: Lista de habilidades e construção do prompt

**Files:**
- Create: `pdi/src/habilidades.js`
- Create: `pdi/src/prompt.js`
- Test: `pdi/test/prompt.test.js`

**Interfaces:**
- Consumes: nenhuma (módulo independente).
- Produces:
  - `HABILIDADES: { id: string, nome: string }[]` — exportado de `habilidades.js`.
  - `idsPermitidos(): string[]`
  - `nomeHabilidade(id: string): string`
  - `montarPrompt(texto: string, habilidades: {id,nome}[]): { role: 'system'|'user', content: string }[]` — usado pela Task 4.

- [ ] **Step 1: Criar `pdi/src/habilidades.js`**

Cópia sincronizada manualmente de `app/src/data/habilidades.js` (mesmo formato, mesmos ids e nomes — ver Global Constraints):

```js
export const HABILIDADES = [
  { id: 'reconhecer-emocoes', nome: 'Reconhecer emoções' },
  { id: 'resposta-social', nome: 'Resposta social' },
  { id: 'empatia', nome: 'Empatia' },
  { id: 'causa-efeito-social', nome: 'Causa e efeito social' },
]

export const idsPermitidos = () => HABILIDADES.map((h) => h.id)

export const nomeHabilidade = (id) => HABILIDADES.find((h) => h.id === id)?.nome ?? id
```

- [ ] **Step 2: Escrever o teste de `montarPrompt` (deve falhar: módulo ainda não existe)**

```js
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { montarPrompt } from '../src/prompt.js'
import { HABILIDADES } from '../src/habilidades.js'

test('prompt lista todas as habilidades permitidas pelo id', () => {
  const mensagens = montarPrompt('texto do pdi', HABILIDADES)
  const sistema = mensagens.find((m) => m.role === 'system').content
  for (const h of HABILIDADES) assert.match(sistema, new RegExp(h.id))
})

test('prompt inclui o texto do pdi na mensagem do usuario', () => {
  const mensagens = montarPrompt('texto exclusivo do pdi XYZ', HABILIDADES)
  const usuario = mensagens.find((m) => m.role === 'user').content
  assert.match(usuario, /texto exclusivo do pdi XYZ/)
})

test('prompt instrui a nao sugerir acoes nem citar fontes/links', () => {
  const mensagens = montarPrompt('texto', HABILIDADES)
  const sistema = mensagens.find((m) => m.role === 'system').content
  assert.match(sistema, /n(ã|a)o (sugira|inclua|cite).*(a(ç|c)(ã|a)o|link|fonte)/i)
})
```

- [ ] **Step 3: Rodar `npm test` em `pdi/` e confirmar falha**

- [ ] **Step 4: Implementar `montarPrompt(texto, habilidades)` em `pdi/src/prompt.js`**

Mensagem `system` deve, em português: listar cada `habilidade.id` com seu `habilidade.nome`; pedir saída em JSON estrito no formato `{ itens: [{ habilidade }], resumoPais: { topicos: [...], porHabilidade: [{ habilidade, atencao, atividades }] } }`; instruir explicitamente para **não sugerir ações/intervenções específicas** e **não citar links, fontes ou referências** (a LLM não tem acesso à internet e não deve inventar nenhuma); instruir que `atividades` deve conter atividades comportamentais genéricas (ex.: práticas de estímulo social/emocional conhecidas), nunca prescrições clínicas. Mensagem `user` contém o texto do PDI.

- [ ] **Step 5: Rodar `npm test` e confirmar que os três testes passam**

- [ ] **Step 6: Commit**

```bash
git add pdi/src/habilidades.js pdi/src/prompt.js pdi/test/prompt.test.js
git commit -m "pdi: lista de habilidades permitidas e construcao do prompt de classificacao"
```

---

## Task 3: Cliente da Featherless

**Files:**
- Create: `pdi/src/featherlessClient.js`
- Test: `pdi/test/featherlessClient.test.js`

**Interfaces:**
- Consumes: nenhuma.
- Produces: `chamarFeatherless(mensagens: {role,content}[], opcoes?: { fetchImpl?, apiKey?, modelo? }): Promise<string>` — devolve o texto bruto da resposta da LLM. Usado pela Task 4 como a função `chamarLLM` injetada em `processarPdi`.

- [ ] **Step 1: Escrever o teste de `chamarFeatherless` (deve falhar: módulo ainda não existe)**

```js
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { chamarFeatherless } from '../src/featherlessClient.js'

test('monta a requisicao com autorizacao e mensagens corretas, devolve o conteudo da resposta', async () => {
  let requisicaoCapturada
  const fetchFalso = async (url, opcoes) => {
    requisicaoCapturada = { url, opcoes }
    return {
      ok: true,
      json: async () => ({ choices: [{ message: { content: '{"ok":true}' } }] }),
    }
  }

  const resultado = await chamarFeatherless([{ role: 'user', content: 'oi' }], {
    fetchImpl: fetchFalso,
    apiKey: 'chave-de-teste',
    modelo: 'modelo-de-teste',
  })

  assert.equal(resultado, '{"ok":true}')
  assert.equal(requisicaoCapturada.url, 'https://api.featherless.ai/v1/chat/completions')
  assert.equal(requisicaoCapturada.opcoes.headers.Authorization, 'Bearer chave-de-teste')
  const corpo = JSON.parse(requisicaoCapturada.opcoes.body)
  assert.equal(corpo.model, 'modelo-de-teste')
  assert.deepEqual(corpo.messages, [{ role: 'user', content: 'oi' }])
})

test('lanca erro claro se a chave de API nao for fornecida', async () => {
  await assert.rejects(
    () => chamarFeatherless([{ role: 'user', content: 'oi' }], { apiKey: undefined, fetchImpl: async () => ({}) }),
    /FEATHERLESS_API_KEY/,
  )
})

test('lanca erro se a resposta HTTP nao for ok', async () => {
  const fetchFalso = async () => ({ ok: false, status: 500, text: async () => 'erro interno' })
  await assert.rejects(
    () => chamarFeatherless([{ role: 'user', content: 'oi' }], { fetchImpl: fetchFalso, apiKey: 'x' }),
    /500/,
  )
})
```

- [ ] **Step 2: Rodar `npm test` em `pdi/` e confirmar falha**

- [ ] **Step 3: Implementar `chamarFeatherless(mensagens, opcoes)` em `pdi/src/featherlessClient.js`**

`apiKey` default `process.env.FEATHERLESS_API_KEY`; `modelo` default `process.env.FEATHERLESS_MODEL` (confirmar o identificador exato do modelo DeepSeek no catálogo da Featherless em https://featherless.ai/models antes de fixar um default — não adivinhar a string); `fetchImpl` default o `fetch` global do Node. POST para `https://api.featherless.ai/v1/chat/completions` (**confirmar esse endpoint na documentação oficial da Featherless antes de implementar — é o endpoint OpenAI-compatível esperado, mas não foi verificado ao vivo; se divergir, ajustar aqui e na constante usada pelo teste do Step 1**) com header `Authorization: Bearer <apiKey>` e corpo `{ model, messages }`. Se `apiKey` ausente, lança erro antes de chamar `fetchImpl`. Se resposta não-ok, lança erro incluindo o status. Em caso de sucesso, devolve `dados.choices[0].message.content`.

- [ ] **Step 4: Rodar `npm test` e confirmar que os três testes passam**

- [ ] **Step 5: Commit**

```bash
git add pdi/src/featherlessClient.js pdi/test/featherlessClient.test.js
git commit -m "pdi: cliente HTTP da Featherless, testavel com fetch injetado"
```

---

## Task 4: `processarPdi` — orquestração e validação

**Files:**
- Create: `pdi/src/processarPdi.js`
- Test: `pdi/test/processarPdi.test.js`

**Interfaces:**
- Consumes: `montarPrompt` e `HABILIDADES`/`nomeHabilidade` (Task 2); formato de `chamarLLM` igual ao de `chamarFeatherless` (Task 3), mas injetado por parâmetro — este módulo nunca importa `featherlessClient.js` diretamente.
- Produces: `processarPdi(texto: string, habilidades: {id,nome}[], chamarLLM: (mensagens) => Promise<string>): Promise<{ itens: {habilidade,nivel}[], resumoPais: { topicos: string[], porHabilidade: {habilidade,atencao,atividades}[], aviso: string } | null }>` — usado pela Task 5 (`cli.js`) e, depois, por quem integrar a rota do backend compartilhado.

- [ ] **Step 1: Escrever os testes de `processarPdi` (devem falhar: módulo ainda não existe)**

```js
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { processarPdi } from '../src/processarPdi.js'
import { HABILIDADES } from '../src/habilidades.js'

const AVISO = 'Estas sugestões são orientações gerais e não substituem acompanhamento profissional.'

function llmQueDevolve(objeto) {
  return async () => JSON.stringify(objeto)
}

test('classifica habilidades validas e sempre usa nivel 1', async () => {
  const chamarLLM = llmQueDevolve({
    itens: [{ habilidade: 'reconhecer-emocoes' }, { habilidade: 'empatia' }],
    resumoPais: {
      topicos: ['ignorado - recalculado pelo codigo'],
      porHabilidade: [
        { habilidade: 'reconhecer-emocoes', atencao: 'observar expressoes', atividades: ['jogo de cartas de emocoes'] },
        { habilidade: 'empatia', atencao: 'observar reacoes', atividades: ['historia social'] },
      ],
    },
  })

  const resultado = await processarPdi('texto do pdi', HABILIDADES, chamarLLM)

  assert.deepEqual(resultado.itens, [
    { habilidade: 'reconhecer-emocoes', nivel: 1 },
    { habilidade: 'empatia', nivel: 1 },
  ])
  assert.deepEqual(resultado.resumoPais.topicos, ['Reconhecer emoções', 'Empatia'])
  assert.equal(resultado.resumoPais.aviso, AVISO)
})

test('descarta habilidade fora da lista permitida, em itens e em porHabilidade', async () => {
  const chamarLLM = llmQueDevolve({
    itens: [{ habilidade: 'reconhecer-emocoes' }, { habilidade: 'alfabetizacao' }],
    resumoPais: { topicos: [], porHabilidade: [
      { habilidade: 'reconhecer-emocoes', atencao: 'x', atividades: [] },
      { habilidade: 'alfabetizacao', atencao: 'y', atividades: [] },
    ] },
  })

  const resultado = await processarPdi('texto', HABILIDADES, chamarLLM)

  assert.deepEqual(resultado.itens, [{ habilidade: 'reconhecer-emocoes', nivel: 1 }])
  assert.equal(resultado.resumoPais.porHabilidade.length, 1)
  assert.equal(resultado.resumoPais.porHabilidade[0].habilidade, 'reconhecer-emocoes')
})

test('normaliza variacao de caixa/espaco no id da habilidade', async () => {
  const chamarLLM = llmQueDevolve({ itens: [{ habilidade: ' Reconhecer-Emocoes ' }], resumoPais: { topicos: [], porHabilidade: [] } })
  const resultado = await processarPdi('texto', HABILIDADES, chamarLLM)
  assert.deepEqual(resultado.itens, [{ habilidade: 'reconhecer-emocoes', nivel: 1 }])
})

test('remove habilidade duplicada', async () => {
  const chamarLLM = llmQueDevolve({
    itens: [{ habilidade: 'empatia' }, { habilidade: 'empatia' }],
    resumoPais: { topicos: [], porHabilidade: [] },
  })
  const resultado = await processarPdi('texto', HABILIDADES, chamarLLM)
  assert.equal(resultado.itens.length, 1)
})

test('nenhuma habilidade reconhecida devolve itens vazio e resumoPais nulo', async () => {
  const chamarLLM = llmQueDevolve({ itens: [], resumoPais: { topicos: [], porHabilidade: [] } })
  const resultado = await processarPdi('texto', HABILIDADES, chamarLLM)
  assert.deepEqual(resultado, { itens: [], resumoPais: null })
})

test('resposta malformada da LLM nao lanca excecao, devolve resultado vazio', async () => {
  const chamarLLM = async () => 'isso nao e um JSON'
  const resultado = await processarPdi('texto', HABILIDADES, chamarLLM)
  assert.deepEqual(resultado, { itens: [], resumoPais: null })
})

test('atividades ausente ou invalida vira lista vazia, sem quebrar', async () => {
  const chamarLLM = llmQueDevolve({
    itens: [{ habilidade: 'empatia' }],
    resumoPais: { topicos: [], porHabilidade: [{ habilidade: 'empatia', atencao: 'x' }] },
  })
  const resultado = await processarPdi('texto', HABILIDADES, chamarLLM)
  assert.deepEqual(resultado.resumoPais.porHabilidade[0].atividades, [])
})

test('campo extra nao previsto no schema (ex.: link) nao aparece no resultado', async () => {
  const chamarLLM = llmQueDevolve({
    itens: [{ habilidade: 'empatia' }],
    resumoPais: {
      topicos: [],
      porHabilidade: [{ habilidade: 'empatia', atencao: 'x', atividades: [], linkFonte: 'https://exemplo-inventado.com' }],
    },
  })
  const resultado = await processarPdi('texto', HABILIDADES, chamarLLM)
  assert.deepEqual(Object.keys(resultado.resumoPais.porHabilidade[0]).sort(), ['atencao', 'atividades', 'habilidade'])
})

test('texto vazio (PDF sem conteudo extraivel) nao chama a LLM e sinaliza erro distinto', async () => {
  let chamou = false
  const chamarLLM = async () => { chamou = true; return '{}' }
  const resultado = await processarPdi('   ', HABILIDADES, chamarLLM)
  assert.equal(chamou, false)
  assert.equal(resultado.erro, 'pdf-sem-texto')
})
```

- [ ] **Step 2: Rodar `npm test` em `pdi/` e confirmar falha**

- [ ] **Step 3: Implementar `processarPdi(texto, habilidades, chamarLLM)` em `pdi/src/processarPdi.js`**

Se `texto.trim()` vazio, devolve `{ itens: [], resumoPais: null, erro: 'pdf-sem-texto' }` sem chamar `chamarLLM`. Senão, monta o prompt com `montarPrompt` (Task 2), chama `chamarLLM(mensagens)`, faz `JSON.parse` do retorno (removendo cercas de markdown tipo ` ```json ` se presentes) dentro de um `try/catch` — qualquer falha de parse cai no mesmo resultado vazio de "nenhuma habilidade reconhecida". Valida cada `habilidade` de `itens` e de `resumoPais.porHabilidade` contra `idsPermitidos()` normalizando (`trim().toLowerCase()`) antes de comparar; remove duplicatas por id; para cada item válido monta `{ habilidade, nivel: 1 }`; monta `resumoPais.porHabilidade` só com os campos `habilidade`, `atencao` (string, default `''`) e `atividades` (array, default `[]`, outros tipos viram `[]`) — nenhum outro campo da LLM é copiado. `resumoPais.topicos` é sempre recalculado a partir dos itens válidos usando `nomeHabilidade`, nunca copiado da LLM. `resumoPais.aviso` é sempre a constante fixa (ver Global Constraints), nunca o que a LLM mandar. Se, depois de validar, `itens` ficar vazio, devolve `{ itens: [], resumoPais: null }`.

- [ ] **Step 4: Rodar `npm test` e confirmar que todos os testes passam**

- [ ] **Step 5: Commit**

```bash
git add pdi/src/processarPdi.js pdi/test/processarPdi.test.js
git commit -m "pdi: orquestracao e validacao da classificacao e do resumo para os pais"
```

---

## Task 5: Harness local (`cli.js`) e teste manual ponta a ponta

**Files:**
- Create: `pdi/cli.js`
- Create: `pdi/README.md`

**Interfaces:**
- Consumes: `extrairTexto` (Task 1), `processarPdi` (Task 4), `chamarFeatherless` (Task 3), `HABILIDADES` (Task 2).
- Produces: nada consumido por outra task — é o ponto de entrada manual, descartável, substituído quando o backend compartilhado existir.

- [ ] **Step 1: Implementar `pdi/cli.js`**

Script executável via `node cli.js <caminho-do-pdf>`: lê o arquivo do caminho passado em `process.argv[2]`, chama `extrairTexto`, depois `processarPdi(texto, HABILIDADES, chamarFeatherless)`, e imprime o resultado com `JSON.stringify(resultado, null, 2)`. Se `FEATHERLESS_API_KEY` não estiver no ambiente, instrui no `console.error` a criar `pdi/.env` a partir de `.env.example` (carregar `.env` com `node --env-file=.env cli.js ...`, sem adicionar dependência de `dotenv`).

- [ ] **Step 2: Escrever `pdi/README.md`**

Curto: o que cada módulo faz, como rodar os testes (`npm test`), como gerar as fixtures (`npm run fixtures`), como rodar o `cli.js` manualmente (`node --env-file=.env cli.js test/fixtures/pdi-pequeno.pdf`), e uma nota de que isso é um pacote de funções puras para ser importado pelo backend compartilhado quando ele existir — não é um serviço implantável por si só.

- [ ] **Step 3: Commit**

```bash
git add pdi/cli.js pdi/README.md
git commit -m "pdi: harness local para teste manual ponta a ponta"
```

- [ ] **Step 4: Teste manual ponta a ponta (requer `FEATHERLESS_API_KEY` real em `pdi/.env`, que o usuário fornece localmente — nunca colar a chave em commit, chat ou log)**

Rodar:
```bash
node --env-file=.env cli.js test/fixtures/pdi-pequeno.pdf
node --env-file=.env cli.js test/fixtures/pdi-realista.pdf
```

Esperado para `pdi-pequeno.pdf`: as 4 habilidades (`reconhecer-emocoes`, `resposta-social`, `empatia`, `causa-efeito-social`) aparecem em `itens`, cada uma com `nivel: 1`; `resumoPais.porHabilidade` tem uma entrada por habilidade, sem links/ações prescritas; `resumoPais.aviso` é o texto fixo.

Esperado para `pdi-realista.pdf`: pelo menos `resposta-social` aparece (seção "Habilidades Sociais e Comunicação" do PDI do Lucas bate com isso); é aceitável e esperado que as necessidades de alfabetização/matemática e de regulação sensorial não apareçam em `itens`, já que não há habilidade correspondente na lista atual — confirma o corte de escopo documentado no spec, não é um bug.

Se o resultado não bater com o esperado, ajustar o texto do prompt (Task 2) e repetir — não ajustar a validação (Task 4) para forçar um resultado específico.

---
