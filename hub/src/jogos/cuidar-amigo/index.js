import { montarCena } from '../../compartilhado/kit-phaser/montarCena.js'
import CuidarAmigo from './CuidarAmigo.js'

export function montar(elemento, parametros) {
  return montarCena(elemento, CuidarAmigo, 'CuidarAmigo', parametros)
}
