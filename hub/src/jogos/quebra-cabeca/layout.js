// Geometria em pixels lógicos de 960 x 600 (REGRAS-E-INTERACOES.md §6). O jogo inteiro é ampliado ou reduzido para caber.
import { COLS, N } from './regras.js'

export const LARGURA = 960
export const ALTURA = 600

export const casaXY = (c) => [362 + (c % COLS) * 96, 94 + Math.floor(c / COLS) * 96]

export function lugarXY(s) {
  const linha = Math.floor(s / 10)
  const coluna = s % 10
  const quantos = linha === 0 ? 10 : N - 10
  const largura = quantos * 72 + (quantos - 1) * 12
  return [24 + (912 - largura) / 2 + coluna * 84, 418 + linha * 84]
}

// Inclinação das peças na bandeja, só para enfeitar.
export const INCLINACOES = [-3, 2, -1.5, 2.5, -2.5, 1, -3, 2, -1, 2.5, -2, 1.5, -3, 2, -1.5]

// Escala FIT: o maior tamanho que cabe sem distorcer, centralizado.
export function encaixar(largura, altura) {
  const escala = Math.min(largura / LARGURA, altura / ALTURA)
  return { escala, x: (largura - LARGURA * escala) / 2, y: (altura - ALTURA * escala) / 2 }
}

// Tablet em retrato: o jogo pede para girar e não conta nada.
export const emRetrato = (largura, altura) => altura > largura
