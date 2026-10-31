import { TRACO, svg, circulo, elipse, cam, ret, grupo, gira } from './primitivas.js'

// Ferramentas do "Cuidar do amigo" e as cenas que mostram o motivo do sentimento.
const C = 'stroke="#3b2a1a" stroke-width="2.5"'
const PELE = '#ffd9a8'

export const FERRAMENTAS_ARTE = {
  abraco: svg(
    cam('M50 88 C10 62 8 30 28 24 C40 20 48 28 50 34 C52 28 60 20 72 24 C92 30 90 62 50 88Z', '#ff5d73', TRACO, 3) +
      cam('M10 70 Q34 56 56 78', 'none', PELE, 12) +
      cam('M10 70 Q34 56 56 78', 'none', TRACO, 2) +
      cam('M90 70 Q66 56 44 78', 'none', '#f2c08a', 12) +
      cam('M90 70 Q66 56 44 78', 'none', TRACO, 2) +
      circulo(30, 44, 4, '#fff', 'opacity="0.6"'),
  ),
  agua: svg(
    cam('M50 8 C50 8 18 46 18 64 C18 82 32 92 50 92 C68 92 82 82 82 64 C82 46 50 8 50 8Z', '#4fb3ff', '#1f79c2', 3.5) +
      cam('M34 66 Q36 78 46 82', 'none', '#fff', 5, 'opacity="0.8"'),
  ),
  sorvete: svg(
    cam('M30 52 L50 94 L70 52 Z', '#e9b872', TRACO, 3) +
      cam('M38 60 L56 76 M46 56 L60 68 M42 70 L52 84', 'none', '#c98a40', 2) +
      circulo(50, 42, 22, '#ff9ec7', C) +
      circulo(50, 24, 16, '#fff3d6', C) +
      circulo(50, 8, 5, '#e8302b', C),
  ),
  curativo: svg(
    gira(
      ret(8, 34, 84, 32, '#f2c98e', 9, 'stroke="#b8864a" stroke-width="3"') +
        ret(34, 34, 32, 32, '#fbe6c2', 3, 'stroke="#b8864a" stroke-width="2"') +
        circulo(18, 44, 2, '#b8864a') + circulo(18, 56, 2, '#b8864a') +
        circulo(82, 44, 2, '#b8864a') + circulo(82, 56, 2, '#b8864a'),
      -30,
    ),
  ),
  luz: svg(
    cam('M50 10 C28 10 20 28 22 40 C24 52 34 56 36 68 H64 C66 56 76 52 78 40 C80 28 72 10 50 10Z', '#ffe566', '#d99a14', 3) +
      ret(36, 70, 28, 8, '#9aa7b0', 3, C) +
      ret(40, 80, 20, 8, '#78909c', 3, C) +
      cam('M50 2 V0 M14 18 L8 14 M86 18 L92 14 M6 44 H2 M94 44 H98', 'none', '#ffb400', 3) +
      cam('M38 26 Q40 20 46 18', 'none', '#fff', 4, 'opacity="0.8"'),
  ),
  lanche: svg(
    cam('M50 28 C30 18 12 30 14 56 C16 80 34 94 50 88 C66 94 84 80 86 56 C88 30 70 18 50 28Z', '#e8302b', '#a31d1a', 3) +
      cam('M50 28 Q50 16 54 8', 'none', '#6b4a2b', 4) +
      cam('M54 14 Q70 4 78 16 Q64 24 54 14Z', '#5cb85c', '#3a8a3a', 2.5) +
      cam('M28 44 Q30 36 38 34', 'none', '#fff', 4, 'opacity="0.6"'),
  ),
  bola: svg(
    circulo(50, 50, 40, '#fff', 'stroke="#3b2a1a" stroke-width="3"') +
      cam('M50 30 L66 42 L60 62 L40 62 L34 42 Z', '#2b2b2b', TRACO, 2) +
      cam('M50 30 V14 M66 42 L82 36 M60 62 L72 78 M40 62 L28 78 M34 42 L18 36', 'none', TRACO, 2.5),
  ),
  ursinho: svg(
    circulo(26, 26, 13, '#b9835a', C) + circulo(74, 26, 13, '#b9835a', C) +
      circulo(26, 26, 6, '#e8c9a0') + circulo(74, 26, 6, '#e8c9a0') +
      elipse(50, 76, 24, 20, '#b9835a', C) +
      elipse(50, 80, 14, 12, '#e8c9a0') +
      circulo(50, 46, 28, '#b9835a', C) +
      elipse(50, 56, 13, 10, '#e8c9a0') +
      circulo(40, 42, 3.5, TRACO) + circulo(60, 42, 3.5, TRACO) +
      elipse(50, 53, 4.5, 3.5, TRACO) +
      cam('M50 56 V60 M44 62 Q50 67 56 62', 'none', TRACO, 2) +
      cam('M44 22 L56 22 L50 28 Z', '#e8554e', TRACO, 1.5),
  ),
  respirar: svg(
    cam('M8 34 Q28 14 48 34 T84 30 Q94 28 92 40', 'none', '#6fb7e8', 6) +
      cam('M8 54 Q32 36 56 54 T90 52', 'none', '#8fcaf0', 6) +
      cam('M14 74 Q34 58 52 74 T80 72', 'none', '#b3ddf6', 6) +
      circulo(92, 40, 3, '#6fb7e8') + circulo(90, 52, 3, '#8fcaf0'),
  ),
  desculpa: svg(
    cam('M50 88 C14 64 12 38 30 30 C40 26 48 32 50 38 C52 32 60 26 70 30 C88 38 86 64 50 88Z', '#ffd0dc', '#e86a92', 3) +
      cam('M34 78 C26 64 30 44 44 38 L50 62 Z', PELE, TRACO, 2.5) +
      cam('M66 78 C74 64 70 44 56 38 L50 62 Z', '#f2c08a', TRACO, 2.5) +
      cam('M50 14 V4 M74 20 L82 12 M26 20 L18 12', 'none', '#ffb400', 3),
  ),
  aplauso: svg(
    gira(elipse(34, 56, 14, 26, PELE, C) + cam('M26 40 V60 M34 36 V58 M42 40 V60', 'none', '#e0b080', 1.8), -35, 34, 56) +
      gira(elipse(66, 56, 14, 26, '#f2c08a', C) + cam('M58 40 V60 M66 36 V58 M74 40 V60', 'none', '#d09a60', 1.8), 35, 66, 56) +
      cam('M50 12 V26 M24 18 L32 28 M76 18 L68 28 M10 34 L22 38 M90 34 L78 38', 'none', '#ffb400', 4),
  ),
  ajuda: svg(
    cam('M4 50 L34 38 L56 50', 'none', '#4f7ebd', 18) +
      cam('M96 50 L66 38 L44 50', 'none', '#e8a24a', 18) +
      elipse(50, 54, 22, 14, PELE, C) +
      cam('M38 50 L62 50 M40 58 L60 58', 'none', '#e0b080', 2.5) +
      cam('M50 26 V14 M32 28 L26 18 M68 28 L74 18', 'none', '#ffb400', 3),
  ),
  desenho: svg(
    cam('M50 12 C20 12 6 34 12 58 C18 84 40 92 56 88 C68 84 62 72 72 68 C90 62 96 40 80 26 C72 16 62 12 50 12Z', '#f3d9a8', TRACO, 3) +
      circulo(32, 36, 7, '#e8554e', C) + circulo(54, 28, 7, '#ffd23f', C) +
      circulo(74, 40, 7, '#3f8fd9', C) + circulo(30, 62, 7, '#5cb85c', C) +
      grupo(ret(60, 56, 36, 7, '#b8864a', 3, C) + ret(88, 56, 14, 7, '#e8554e', 3, C), 'rotate(-35 70 60)'),
  ),
}

export const CENAS_ARTE = {
  sorvete: svg(
    ret(0, 82, 100, 18, '#9be08a', 0) +
      elipse(48, 84, 30, 9, '#ff9ec7', C) +
      circulo(34, 78, 11, '#ff9ec7', C) +
      cam('M70 70 L96 90 L84 96 Z', '#e9b872', TRACO, 3) +
      cam('M30 20 Q40 6 50 20', 'none', '#6fb7e8', 4, 'opacity="0.7"'),
  ),
  arvore: svg(
    ret(42, 56, 16, 40, '#9a6b3f', 3, C) +
      circulo(50, 34, 30, '#5cb85c', C) + circulo(30, 50, 20, '#4aa84a', C) + circulo(70, 50, 20, '#4aa84a', C) +
      circulo(40, 30, 3, '#e8302b') + circulo(62, 40, 3, '#e8302b'),
  ),
  lua: svg(
    cam('M62 10 C34 14 20 38 28 62 C36 86 66 94 88 78 C60 78 48 52 62 10Z', '#ffe58f', '#d9a514', 3) +
      cam('M80 16 L82 24 L90 26 L82 28 L80 36 L78 28 L70 26 L78 24Z', '#ffe58f', '#d9a514', 2) +
      circulo(20, 22, 3, '#ffe58f') + circulo(14, 54, 2.5, '#ffe58f'),
  ),
  prato: svg(
    circulo(50, 54, 34, '#fff', 'stroke="#9aa7b0" stroke-width="3"') +
      circulo(50, 54, 22, '#f4f7f9', 'stroke="#cfd8dc" stroke-width="2"') +
      cam('M10 20 V50 M6 20 V34 M14 20 V34', 'none', '#78909c', 3) +
      cam('M90 20 C84 28 84 40 90 50 V84', 'none', '#78909c', 3),
  ),
  presente: svg(
    ret(14, 40, 72, 50, '#e8554e', 5, C) + ret(8, 28, 84, 18, '#ff7a73', 5, C) +
      ret(44, 28, 12, 62, '#ffd23f', 0, C) +
      cam('M50 28 C34 4 14 16 32 28 Z', '#ffd23f', TRACO, 2.5) +
      cam('M50 28 C66 4 86 16 68 28 Z', '#ffd23f', TRACO, 2.5),
  ),
  dado: svg(
    gira(ret(18, 18, 64, 64, '#fff', 12, 'stroke="#3b2a1a" stroke-width="3"') +
      circulo(34, 34, 5, TRACO) + circulo(66, 34, 5, TRACO) + circulo(50, 50, 5, TRACO) +
      circulo(34, 66, 5, TRACO) + circulo(66, 66, 5, TRACO), -12),
  ),
  escola: svg(
    ret(10, 40, 80, 50, '#e8554e', 3, C) +
      cam('M4 42 L50 12 L96 42 Z', '#c4443d', TRACO, 3) +
      ret(40, 62, 20, 28, '#8a5a2b', 3, C) +
      ret(18, 52, 16, 16, '#bfe3ff', 2, C) + ret(66, 52, 16, 16, '#bfe3ff', 2, C) +
      circulo(50, 36, 7, '#fff', C) +
      cam('M50 12 V2 M50 2 L62 6 L50 10', '#ffd23f', TRACO, 2),
  ),
  quebra: svg(
    cam('M12 30 H40 C36 18 54 18 50 30 H80 V54 C92 50 92 70 80 66 V90 H12 Z', '#6fb7e8', TRACO, 3) +
      cam('M12 54 C24 50 24 70 12 66', 'none', TRACO, 2.5) +
      circulo(34, 66, 6, '#fff', 'opacity="0.5"'),
  ),
  caminhao: svg(
    ret(6, 30, 54, 44, '#3f8fd9', 4, C) +
      cam('M60 44 H80 L94 60 V74 H60 Z', '#ffd23f', TRACO, 3) +
      ret(68, 50, 14, 12, '#bfe3ff', 2, C) +
      circulo(26, 78, 10, '#37474f', C) + circulo(26, 78, 4, '#cfd8dc') +
      circulo(78, 78, 10, '#37474f', C) + circulo(78, 78, 4, '#cfd8dc') +
      ret(14, 40, 36, 8, '#fff', 3, 'opacity="0.35"'),
  ),
}
