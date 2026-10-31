// URLs analisadas pelo Vite: os dois consumidores (hub e site) empacotam as artes.
export const cenario = new URL('./assets/cenario-piquenique.png', import.meta.url).href
export const tortinha = new URL('./assets/tortinha.png', import.meta.url).href
export const gatinho = {
  idle: new URL('./assets/gatinho/idle.png', import.meta.url).href,
  ataque: new URL('./assets/gatinho/ataque.png', import.meta.url).href,
  defesa: new URL('./assets/gatinho/defesa.png', import.meta.url).href,
  reacao: new URL('./assets/gatinho/reacao.png', import.meta.url).href,
}
