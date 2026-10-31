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

**Mudança importante:** não existe mais "o backend do Pedro" isolado. Vai existir **um único servidor rodando todo o backend do projeto** (outro integrante está construindo isso; ainda não está no repositório). Por isso, esta frente é construída como **módulos JS puros, sem framework amarrado** (sem Express próprio, sem rota própria definitiva): funções que recebem/devolvem dados simples, prontas para serem importadas e expostas como rota por quem estruturar o backend compartilhado. Localmente, um script/servidor mínimo descartável serve só para testar ponta a ponta antes da integração real.

Módulos:
- `extrairTexto(bufferPdf) → string` — texto do PDF (`pdf-parse`; PDIs são sempre digitais, texto selecionável; sem OCR no MVP).
- `processarPdi(texto) → { itens, resumoPais }` — **uma única chamada** à Featherless (modelo DeepSeek) que já devolve classificação e resumo juntos (economiza custo/tempo/latência: 1 chamada em vez de 2). O prompt lista as habilidades permitidas (cópia local de `HABILIDADES`, a manter sincronizada manualmente com `app/src/data/habilidades.js` até os dois lados compartilharem um pacote comum) e pede JSON estrito:
  ```
  {
    "itens": [{ "habilidade": "reconhecer-emocoes" }, ...],
    "resumoPais": {
      "topicos": ["Reconhecer emoções", "Resposta social"],
      "porHabilidade": [
        { "habilidade": "reconhecer-emocoes", "atencao": "texto curto", "atividades": ["atividade genérica 1", "atividade genérica 2"] }
      ]
    }
  }
  ```
- Validação (código, não LLM): descarta qualquer `habilidade` fora da lista permitida, tanto em `itens` quanto em `porHabilidade`. Nível sempre fixado em `1` (decisão do grupo: mais simples e já alinhado com o viés do próprio motor de recomendação de priorizar níveis baixos). Acrescenta `resumoPais.aviso` fixo no código (não gerado pela IA): "Estas sugestões são orientações gerais e não substituem acompanhamento profissional."

Fluxo de uso (quando integrado ao backend compartilhado e ao frontend):
1. Alguém expõe `processarPdi` numa rota (ex.: `POST /pdi`) do backend compartilhado.
2. Frontend (`Pdi.jsx`) ganha um botão "Enviar PDI em PDF" que chama essa rota.
3. Resultado: `itens` vai para `pdi.itens` (o professor revisa/ajusta os checkboxes manualmente depois — rede de segurança, e também a etapa de "aprovação da escola" do fluxo oficial); `resumoPais` aparece na aba dos pais (tela exata e momento de exibir ficam com quem cuida dessa parte do frontend — IDEIA.md coloca isso "mais à frente", junto com diagnóstico de desempenho).

Sem contrato de rede com o colega da base de jogos — a integração de `itens` é local, via o mesmo formato de dados que o motor de recomendação já consome.

### Resumo para os pais — regras de conteúdo (atualizado, ver `IDEIA.md`)

- Pode incluir: tópicos identificados, pontos de atenção/observação para a família (não é diagnóstico), e **atividades comportamentais genéricas de estímulo** por habilidade (práticas conhecidas, não prescrições clínicas).
- **Não pode incluir**: ações/intervenções específicas prescritas, nem links/fontes/citações geradas pela IA (risco real de alucinar URL ou referência que não existe — pior do que não citar nada).
- Sempre acompanhado do aviso fixo de que não substitui acompanhamento profissional.

## Segurança

A chave da API da Featherless nunca entra no frontend/bundle. Vive em variável de ambiente do backend compartilhado (`.env` local, gitignorado, com `.env.example` sem valor real versionado; variável de ambiente real no provedor de deploy quando existir). Nunca logar a chave em mensagens de erro.

## Deploy

Decisão de infraestrutura é de quem está montando o backend compartilhado (Render, plano free, é a direção combinada no grupo). Esta frente não assume nenhum deploy próprio — só precisa que o código não dependa de nada que quebre nesse ambiente (ex.: nada de caminho de arquivo local fixo, ler porta de variável de ambiente se algum dia expuser servidor HTTP próprio). Riscos já conhecidos e combinados para quem for cuidar do deploy final:
- Render free dorme após ~15 min sem tráfego — primeira chamada após isso pode levar 30-50s+, risco real numa demo ao vivo. Mitigação combinada: health check + pinger externo gratuito (UptimeRobot/cron-job.org).
- CORS deve liberar só a origem exata do frontend publicado, não `*`.

## Erros

- PDF sem texto extraível → erro claro (ex.: "PDF sem texto legível").
- Featherless fora do ar, resposta malformada, ou nenhuma habilidade reconhecida → devolve `{ itens: [], resumoPais: null }` com aviso, sem travar o fluxo (cai no preenchimento manual que já existe).
- Nunca logar a chave de API em mensagens de erro.

## Testes

- Unitário de `processarPdi` com resposta da LLM mockada (sem gastar chamada real), garantindo que habilidade inválida é filtrada (em `itens` e em `resumoPais.porHabilidade`) e que o formato de saída bate com o que `recomendar()` espera.
- Teste manual ponta a ponta com PDI de exemplo pequeno (poucas habilidades, compatível com a base de jogos reduzida do MVP) **e** validação mental contra o exemplo realista maior (PDI do "Lucas", ver histórico da conversa) para garantir que o prompt generaliza.

## Pontos em aberto / primeira tarefa

- Exemplo realista de PDI já obtido e validado manualmente contra a lista atual de `HABILIDADES` (ver conversa) — confirmado que partes de um PDI real (ex.: alfabetização, regulação sensorial) não têm jogo correspondente hoje, e isso é esperado/aceito para o MVP.
- A lista de `HABILIDADES` pode crescer conforme mais jogos forem adicionados; o prompt deve ler essa lista de um lugar configurável, não hardcoded como string fixa espalhada no código.
- Duas cópias da lista de habilidades (frontend e esta frente) é uma dívida técnica aceita para o MVP; unificar depois se o projeto continuar.
- Onde exatamente `resumoPais` aparece na interface (aba dos pais) depende de quem estiver cuidando dessa parte do frontend — IDEIA.md coloca isso junto com diagnóstico de desempenho e relatório atitudinal, ambos fora do escopo desta frente.
- Integração final com a rota HTTP real só acontece quando o backend compartilhado for publicado por quem está construindo essa parte.
- Pós-hackathon (fora do prazo atual): suportar Word, foto e scan do PDI (OCR), conforme a visão completa em `IDEIA.md`.
