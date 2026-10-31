// Contrato entre o hub e os jogos. O hub só conhece o que está aqui.
//
// Cada jogo fica em jogos/<id>/ com dois arquivos de entrada:
//   manifesto.js  export default { id, nome, descricao, habilidades, icone }
//                 Leve: o hub carrega todos os manifestos para montar a lista.
//   index.js      export function montar(elemento, parametros) → desmontar()
//                 Pesado: o hub só importa quando a criança abre o jogo.
//
// parametros = {
//   tema,        hiperfoco escolhido (compartilhado/temas.js)
//   nivel,       1 a 3, vem do PDI; o hub usa 1 por enquanto
//   opcoes,      { sons, musica, reduzirMovimento }
//   aoTerminar,  (resultado) => void, uma vez por partida
//   aoSair,      () => void, quando o próprio jogo pede para voltar ao hub
// }
// resultado = { status: 'completed' | 'abandoned', attempts, correct, hints },
// o mesmo formato que site/web/src/jogos/integracao.js envia ao servidor.
//
// desmontar() libera tudo (Phaser, eventos, DOM) e, se a partida não terminou,
// chama aoTerminar com status 'abandoned'.
//
// Um jogo só importa da própria pasta e de compartilhado/, nunca do hub nem de
// outro jogo. tests/hub.test.js confere isso.

export const STATUS = ['completed', 'abandoned']

export function validarManifesto(m) {
  if (!m || typeof m.id !== 'string' || !/^[a-z0-9-]+$/.test(m.id)) throw new Error('Manifesto sem id válido.')
  for (const campo of ['nome', 'descricao', 'icone']) {
    if (typeof m[campo] !== 'string' || !m[campo].trim()) throw new Error(`Manifesto "${m.id}" sem ${campo}.`)
  }
  if (!Array.isArray(m.habilidades) || !m.habilidades.length) throw new Error(`Manifesto "${m.id}" sem habilidades.`)
  return m
}

export function criarResultado({ status, attempts = 0, correct = 0, hints = 0 }) {
  if (!STATUS.includes(status)) throw new Error('Estado inválido.')
  if (![attempts, correct, hints].every((n) => Number.isSafeInteger(n) && n >= 0) || correct > attempts) {
    throw new Error('Contadores inválidos.')
  }
  return { status, attempts, correct, hints }
}
