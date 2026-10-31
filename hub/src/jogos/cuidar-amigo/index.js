import { montarCena } from '../../compartilhado/kit-phaser/montarCena.js'
import { pintarBordas, prepararFontes } from '../../compartilhado/kit-phaser/papel.js'
import CuidarAmigo from './CuidarAmigo.js'

export function montar(elemento, parametros) {
  // embaixo do jogo fica a bandeja verde dos itens
  const desfazer = pintarBordas(elemento, parametros.tema?.id, { chao: '#7fc8a9', horizonte: 344 })
  const desmontar = montarCena(elemento, CuidarAmigo, 'CuidarAmigo', parametros, { preparar: prepararFontes })
  return () => {
    desmontar()
    desfazer()
  }
}
