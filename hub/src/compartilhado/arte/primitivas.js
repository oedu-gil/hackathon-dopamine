// Peças para desenhar em SVG (viewBox 100x100). Tudo é código: nenhum arquivo de imagem.
export const TRACO = '#3b2a1a'

export const svg = (interno) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">${interno}</svg>`

const attrs = (extra) => (extra ? ` ${extra}` : '')

export const circulo = (cx, cy, r, fill, extra = '') =>
  `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}"${attrs(extra)}/>`

export const elipse = (cx, cy, rx, ry, fill, extra = '') =>
  `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${fill}"${attrs(extra)}/>`

export const ret = (x, y, w, h, fill, rx = 0, extra = '') =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}"${attrs(extra)}/>`

// Caminho com contorno; sem `fill` vira só um traço.
// `stroke` pode ser uma cor ou já um trecho pronto de atributos (ex.: 'stroke="#3b2a1a" ...').
export const cam = (d, fill = 'none', stroke = TRACO, largura = 3, extra = '') => {
  const contorno = stroke.startsWith('stroke=') ? stroke : `stroke="${stroke}" stroke-width="${largura}"`
  return `<path d="${d}" fill="${fill}" ${contorno} stroke-linecap="round" stroke-linejoin="round"${attrs(extra)}/>`
}

export const grupo = (interno, transform) => `<g transform="${transform}">${interno}</g>`

export const gira = (interno, graus, cx = 50, cy = 50) => grupo(interno, `rotate(${graus} ${cx} ${cy})`)

// Cores do conjunto
export const COR = {
  amarelo: '#ffd23f',
  amareloBorda: '#d99a14',
  vermelho: '#e8554e',
  azul: '#3f8fd9',
  azulClaro: '#bfe3ff',
  verde: '#5cb85c',
  verdeEscuro: '#3a8a3a',
  roxo: '#7b4bb8',
  laranja: '#f39a3d',
  marrom: '#9a6b3f',
  cinza: '#78909c',
  cinzaClaro: '#cfd8dc',
  branco: '#ffffff',
  rosa: '#ff8fb1',
}
