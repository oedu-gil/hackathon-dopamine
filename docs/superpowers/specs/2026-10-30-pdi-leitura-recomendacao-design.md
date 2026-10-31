# Leitura de PDI (PDF) e recomendação de jogos — design

Frente do Pedro (pedro.bianco@enclim.com) no hackathon de educação (TEA). Branch: `codex/pedro/pdi-jogos`.

## Contexto

O projeto já tem um MVP de jogos funcionando em `app/` (React + Vite + Phaser, ver `JOGOS_EMOCOES.md`). Hoje o PDI é preenchido manualmente em `app/src/telas/Pdi.jsx` como uma lista `itens: [{ habilidade, nivel }]`, consumida por uma função pura local `recomendar(pdi.itens, JOGOS)` em `app/src/recomendacao.js`. As habilidades válidas vêm de `app/src/data/habilidades.js` (`HABILIDADES`), hoje com 4 entradas: `reconhecer-emocoes`, `resposta-social`, `empatia`, `causa-efeito-social`. `nivel` vai de 1 (iniciante) a 3 (avançado).

Esta frente substitui o preenchimento manual por leitura automática: o professor sobe o PDI em PDF, e o sistema preenche `pdi.itens` sozinho (mantendo a edição manual como revisão/ajuste depois — bate com a etapa de "aprovação da escola" do fluxo oficial em `IDEIA.md`).

O app hoje é só frontend, sem backend nenhum. Esta frente introduz o primeiro backend do projeto.

**Prazo: até 31/10/2026** (`IDEIA.md`). Isso restringe as decisões abaixo ao mínimo que funciona para a demo, não a versão completa da visão do produto.

### Corte de escopo: PDF só digital

`IDEIA.md` descreve o PDI podendo chegar "em qualquer formato (PDF, Word, foto, scan)". Dado o prazo, o MVP desta frente **só suporta PDF digital com texto selecionável** — sem OCR, sem Word, sem foto/scan. Isso é um corte de escopo deliberado pelo prazo (o próprio `IDEIA.md` prevê isso em "fora do escopo... o que não cabe no prazo"), não um esquecimento, e deve ficar registrado como próximo passo pós-hackathon.

## Diferencial do produto

Existe uma startup, jade.autism, que gera o PDI a partir de jogos jogados (caminho inverso). Este projeto vai de PDI → jogos: a escola sobe o PDI já pronto, a IA lê e recomenda.

## Arquitetura

Novo serviço isolado, `pdi-service/` (Node + Express), separado de `app/`. Um único endpoint:

```
POST /pdi   (multipart/form-data, campo "pdf")
→ { itens: [{ habilidade, nivel }], resumoPais: string }
```

Fluxo:
1. Frontend (`Pdi.jsx`) ganha um botão "Enviar PDI em PDF" que chama esse endpoint.
2. `pdi-service` extrai o texto do PDF (`pdf-parse` — PDIs são sempre digitais, texto selecionável; sem OCR no MVP).
3. Monta um prompt listando as habilidades permitidas (cópia local da lista de `HABILIDADES`, a manter sincronizada manualmente com `app/src/data/habilidades.js` até os dois lados compartilharem um pacote comum) e pede à Featherless (modelo DeepSeek) uma saída em JSON estrito com as habilidades do PDI que batem com a lista.
4. Valida a resposta: descarta qualquer habilidade fora da lista permitida. Nível sempre fixado em `1` (decisão do grupo: mais simples e já alinhado com o viés do próprio motor de recomendação de priorizar níveis baixos).
5. Gera `resumoPais`: um texto **template, determinístico, sem chamada extra à LLM**, listando os nomes legíveis das habilidades identificadas (reaproveitando `nomeHabilidade()` de `habilidades.js`) e convidando os pais a pesquisar formas de apoiar essas áreas em casa. **Nunca sugere uma ação específica** — restrição explícita de `IDEIA.md` ("não sugere ações, só incentiva que os pais pesquisem"). Usar template em vez de LLM aqui é deliberado: elimina o risco de a IA inventar uma sugestão de ação por conta própria.
6. Devolve `{ itens, resumoPais }`. O frontend seta `itens` em `pdi.itens` (o professor revisa/ajusta os checkboxes manualmente depois, como rede de segurança — e como a etapa de "aprovação da escola" do fluxo oficial) e exibe `resumoPais` em algum ponto do fluxo voltado aos pais (tela exata fica a definir com quem cuida do frontend dessa parte).

Sem contrato de rede com o colega da base de jogos — a integração é local, via o mesmo formato de dados que o motor de recomendação já consome.

## Segurança

A chave da API da Featherless vive só no `.env` do `pdi-service` (gitignorado, com `.env.example` sem valor real versionado). Nunca é enviada ao frontend/bundle. CORS do `pdi-service` libera apenas a origem exata do frontend publicado (GitHub Pages), não `*`.

## Deploy

- **Backend (`pdi-service`)**: Render, plano free. HTTPS automático (compatível com o frontend em HTTPS, evita mixed content), variáveis de ambiente fáceis para a chave.
  - Risco conhecido: serviços free do Render dormem após ~15 min sem tráfego; a primeira chamada depois disso pode levar 30-50s+, o que é um risco real numa demo ao vivo pra banca.
  - Mitigação decidida: endpoint de health check (`GET /health`) + pinger externo gratuito (UptimeRobot ou cron-job.org) batendo nele a cada poucos minutos, pra manter o serviço sempre acordado.
- **Frontend (`app/`)**: GitHub Pages, estático. Precisa do `base` certo em `vite.config.js` para o caminho do GitHub Pages — fora do escopo desta frente, mas a documentar pro grupo.

## Erros

- PDF sem texto extraível → erro claro (ex.: 422 "PDF sem texto legível").
- Featherless fora do ar, resposta malformada, ou nenhuma habilidade reconhecida → devolve `{ itens: [] }` com aviso, sem travar o fluxo (cai no preenchimento manual que já existe).
- Nunca logar a chave de API em mensagens de erro.

## Testes

- Unitário de `classificarPdi` com resposta da LLM mockada (sem gastar chamada real), garantindo que habilidade inválida é filtrada e que o formato de saída bate com o que `recomendar()` espera.
- Teste manual ponta a ponta com um PDI de exemplo pequeno (poucas habilidades), compatível com a base de jogos reduzida do MVP.

## Pontos em aberto / primeira tarefa

- **Estudar a estrutura real de um PDI** (formato, seções, linguagem típica) antes de desenhar o prompt de classificação em detalhe — ainda não há um exemplo real em mãos.
- A lista de `HABILIDADES` pode crescer conforme mais jogos forem adicionados; o prompt deve ler essa lista de um lugar configurável, não hardcoded como string fixa espalhada no código.
- Duas cópias da lista de habilidades (frontend e `pdi-service`) é uma dívida técnica aceita para o MVP; unificar depois se o projeto continuar.
- Onde exatamente `resumoPais` aparece na interface (tela dos pais/responsáveis) depende de quem estiver cuidando dessa parte do frontend — fora do escopo desta frente, só a geração do texto.
- Pós-hackathon (fora do prazo atual): suportar Word, foto e scan do PDI (OCR), conforme a visão completa em `IDEIA.md`.
