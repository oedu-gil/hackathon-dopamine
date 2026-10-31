import { COMPOSED, composeRects } from './layout.js';

// Monta a imagem no formato 5:3 do tabuleiro: inteira no centro, sem cortar nem distorcer.
// A sobra recebe a própria imagem ampliada e desfocada, para as peças da borda não ficarem iguais.
// O desfoque é feito reduzindo e ampliando, o que funciona em todos os navegadores.
export function composeImage(source) {
  const { w, h } = COMPOSED;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  const { contain, cover, fills } = composeRects(source.width, source.height);
  if (!fills) {
    // Fator de redução: mais alto desfoca mais. 10 deixa as formas reconhecíveis, como no protótipo.
    const k = 10;
    const small = document.createElement('canvas');
    small.width = Math.round(w / k);
    small.height = Math.round(h / k);
    const sctx = small.getContext('2d');
    sctx.imageSmoothingQuality = 'high';
    sctx.drawImage(source, cover.x / k, cover.y / k, cover.w / k, cover.h / k);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(small, 0, 0, w, h);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.22)';
    ctx.fillRect(0, 0, w, h);
  }
  ctx.drawImage(source, contain.x, contain.y, contain.w, contain.h);
  return canvas;
}
