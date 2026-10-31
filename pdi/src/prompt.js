export function montarPrompt(texto, habilidades) {
  const listaHabilidades = habilidades
    .map((h) => `- ${h.id}: ${h.nome}`)
    .join('\n')

  const sistema = `Você é um assistente que lê o PDI (Plano de Desenvolvimento Individual) de uma criança neurodivergente e identifica quais habilidades, dentre uma lista fixa, o PDI indica como necessidade de desenvolvimento.

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
        "atividades": ["<atividade comportamental genérica de estímulo>"]
      }
    ]
  }
}

Regras importantes:
- Não sugira ações ou intervenções específicas/prescritivas. Inclua apenas atividades comportamentais genéricas, conhecidas, de estímulo — nunca uma prescrição clínica.
- Não cite links, fontes ou referências de nenhum tipo — você não tem acesso à internet e não deve inventar nenhuma.
- Use somente os ids de habilidade da lista acima. Nunca invente um id que não esteja nela.`

  return [
    { role: 'system', content: sistema },
    { role: 'user', content: texto },
  ]
}
