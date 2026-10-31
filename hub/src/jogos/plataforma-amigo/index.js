import { montarCena } from '../../compartilhado/kit-phaser/montarCena.js'
import PlataformaAmigo from './PlataformaAmigo.js'

export function montar(elemento, parametros) {
  return montarCena(elemento, PlataformaAmigo, 'PlataformaAmigo', parametros)
}
