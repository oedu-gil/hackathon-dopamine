const CHAVE = 'dopamine-usuario'

export function usuarioSalvo() {
  try {
    return JSON.parse(localStorage.getItem(CHAVE))
  } catch {
    return null
  }
}

export function salvarUsuario(usuario) {
  try {
    if (usuario) localStorage.setItem(CHAVE, JSON.stringify(usuario))
    else localStorage.removeItem(CHAVE)
  } catch {
    // sem localStorage o login vale só até recarregar a página
  }
}

// Chama o site-server. Lança Error com a mensagem do servidor.
export async function api(caminho, { metodo = 'GET', corpo, arquivo } = {}) {
  const headers = {}
  const usuario = usuarioSalvo()
  if (usuario) headers['x-usuario'] = usuario.id

  let body
  if (arquivo) {
    body = new FormData()
    body.append('pdf', arquivo)
  } else if (corpo !== undefined) {
    headers['Content-Type'] = 'application/json'
    body = JSON.stringify(corpo)
  }

  const resposta = await fetch(`/api${caminho}`, { method: metodo, headers, body })
  const dados = await resposta.json().catch(() => ({}))
  if (!resposta.ok && resposta.status !== 422) throw new Error(dados.erro || 'Não foi possível falar com o servidor.')
  return dados
}
