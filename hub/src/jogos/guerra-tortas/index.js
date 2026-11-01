import { montarCena } from '../../compartilhado/kit-phaser/montarCena.js'
import GuerraTortas from './GuerraTortas.js'

export function montar(elemento, parametros) {
  return montarCena(elemento, GuerraTortas, 'GuerraTortas', parametros)
}
