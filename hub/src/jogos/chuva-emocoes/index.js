import { montarCena } from '../../compartilhado/kit-phaser/montarCena.js'
import ChuvaEmocoes from './ChuvaEmocoes.js'

export function montar(elemento, parametros) {
  return montarCena(elemento, ChuvaEmocoes, 'ChuvaEmocoes', parametros)
}
