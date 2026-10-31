const ENDPOINT = 'https://api.featherless.ai/v1/chat/completions'

export async function chamarFeatherless(mensagens, opcoes = {}) {
  const {
    fetchImpl = fetch,
    apiKey = process.env.FEATHERLESS_API_KEY,
    modelo = process.env.FEATHERLESS_MODEL || 'deepseek-ai/DeepSeek-V3-0324',
  } = opcoes

  if (!apiKey) {
    throw new Error('FEATHERLESS_API_KEY não foi fornecida')
  }

  const resposta = await fetchImpl(ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ model: modelo, messages: mensagens }),
  })

  if (!resposta.ok) {
    throw new Error(`Featherless respondeu com status ${resposta.status}`)
  }

  const dados = await resposta.json()
  return dados.choices[0].message.content
}
