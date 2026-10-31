import { montarCena } from '../../compartilhado/kit-phaser/montarCena.js'
import { pintarBordas, prepararFontes } from '../../compartilhado/kit-phaser/papel.js'
import ChuvaEmocoes from './ChuvaEmocoes.js'

export function montar(elemento, parametros) {
  const desfazer = pintarBordas(elemento, parametros.tema?.id)
  const desmontar = montarCena(elemento, ChuvaEmocoes, 'ChuvaEmocoes', parametros, { preparar: prepararFontes })
  return () => {
    desmontar()
    desfazer()
  }
}
