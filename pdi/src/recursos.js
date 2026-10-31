// Links curados manualmente e verificados (não gerados pela LLM — ver spec:
// nunca confiar em link que a LLM sugerir, risco de alucinação). Cada um foi
// checado com WebFetch antes de entrar aqui.
export const RECURSOS_POR_HABILIDADE = {
  'reconhecer-emocoes': [
    {
      nome: 'Genial Care — Emoções no autismo: saiba como ensinar essas habilidades',
      url: 'https://genialcare.com.br/blog/emocoes-no-autismo/',
    },
  ],
  'resposta-social': [
    {
      nome: 'Genial Care — Habilidades sociais no autismo: entenda o que são e conheça métodos para treiná-las',
      url: 'https://genialcare.com.br/blog/habilidades-sociais-autismo/',
    },
  ],
  empatia: [
    {
      nome: 'Genial Care — Como explicar o autismo para crianças: um guia prático para famílias e escolas',
      url: 'https://genialcare.com.br/blog/como-explicar-o-autismo-para-criancas/',
    },
    {
      nome: 'Autismo e Realidade — Dicas de livros infantis sobre inclusão, empatia e respeito ao próximo',
      url: 'https://autismoerealidade.org.br/2024/05/30/dicas-de-livros-infantis-sobre-inclusao-empatia-e-respeito-ao-proximo/',
    },
  ],
  'causa-efeito-social': [
    {
      nome: 'Genial Care — Escala ABC no autismo: como fazer a coleta de dados?',
      url: 'https://genialcare.com.br/blog/escala-abc-no-autismo/',
    },
  ],
}

export function recursosPara(habilidadeId) {
  return RECURSOS_POR_HABILIDADE[habilidadeId] ?? []
}
