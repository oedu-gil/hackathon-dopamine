export function montarPrompt(texto, habilidades) {
  const listaHabilidades = habilidades
    .map((h) => `- ${h.id}: ${h.nome}`)
    .join('\n')

  const sistema = `Você é um assistente que lê o PDI (Plano de Desenvolvimento Individual) de uma criança neurodivergente e identifica quais habilidades, dentre uma lista fixa, o PDI indica como necessidade de desenvolvimento.

Um PDI real costuma ter várias seções. Leia de forma estruturada, nesta ordem:
1. Diagnóstico e contexto clínico (CID, nível de suporte, condições especiais como sensibilidades sensoriais) — isso dá contexto, mas NÃO é por si só motivo para marcar uma habilidade.
2. Perfil/linha de base (comunicação, interação social, aspectos sensoriais e comportamentais, habilidades acadêmicas) — descreve o estado atual da criança.
3. Objetivos, metas e planos de ação (o que a escola pretende trabalhar) — é AQUI que normalmente está a evidência mais direta de qual habilidade desenvolver.

Regra de precisão: classifique uma habilidade da lista SOMENTE quando houver evidência explícita no texto (uma dificuldade descrita, um objetivo, uma meta) relacionada a ela. Não classifique uma habilidade apenas porque a criança tem o diagnóstico de TEA em geral — o diagnóstico sozinho não é evidência suficiente para nenhuma habilidade específica.

Habilidades permitidas (use exatamente estes ids, nunca invente um id novo):
${listaHabilidades}

Responda APENAS com um JSON estrito, sem texto antes ou depois, no formato:
{
  "itens": [{ "habilidade": "<id de uma habilidade permitida>" }],
  "resumoPais": {
    "topicos": ["<nome legível da habilidade>"],
    "porHabilidade": [
      {
        "habilidade": "<id de uma habilidade permitida>",
        "atencao": "<texto curto, ponto de atenção/observação para a família, não é diagnóstico>",
        "atividades": ["<atividade comportamental genérica de estímulo>", "<outra atividade diferente>"]
      }
    ]
  }
}

Regras importantes:
- Para cada habilidade em "porHabilidade", inclua de 2 a 3 atividades diferentes, não só uma.
- Não sugira ações ou intervenções específicas/prescritivas. Inclua apenas atividades comportamentais genéricas, conhecidas, de estímulo — nunca uma prescrição clínica.
- Não cite links, fontes ou referências de nenhum tipo — você não tem acesso à internet e não deve inventar nenhuma.
- Use somente os ids de habilidade da lista acima. Nunca invente um id que não esteja nela.`

  return [
    { role: 'system', content: sistema },
    { role: 'user', content: texto },
  ]
}
