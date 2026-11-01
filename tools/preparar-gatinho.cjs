// Conversão técnica dos quadros aprovados; não gera nem redesenha arte.
// Uso: node tools/preparar-gatinho.cjs <pasta animacoes/gatinho> <modulo playwright>
const fs = require('node:fs/promises');
const path = require('node:path');
const { chromium } = require(process.argv[3]);
const fontes = {
  idle: 'idle/tentativa-02/RESULTADO/idle-73-v2/animation.json',
  ataque: 'ataque/tentativa-01/RESULTADO/ataque-rapido-v1/animation.json',
  defesa: 'defesa/tentativa-01/RESULTADO/defesa-sustentada-v1/defesa.json',
  reacao: 'reacao-acerto/tentativa-01/RESULTADO/reacao-original-v2/animation.json',
};
(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  try {
    const page = await browser.newPage();
    const out = path.resolve('hub/src/jogos/guerra-tortas/assets/gatinho');
    await fs.mkdir(out, { recursive: true });
    const dados = {};
    for (const [nome, rel] of Object.entries(fontes)) {
      const arquivo = path.join(process.argv[2], rel);
      const meta = JSON.parse(await fs.readFile(arquivo, 'utf8'));
      const imagens = [];
      for (const f of meta.frames) {
        let p = path.join(path.dirname(arquivo), f.file);
        try { await fs.access(p); } catch { p = path.join(path.dirname(arquivo), 'frames', f.file); }
        imagens.push('data:image/png;base64,' + (await fs.readFile(p)).toString('base64'));
      }
      const png = await page.evaluate(async (imgs) => {
        const size = 384, cols = 8;
        const atlas = document.createElement('canvas');
        atlas.width = size * cols; atlas.height = size * Math.ceil(imgs.length / cols);
        const dest = atlas.getContext('2d');
        for (let n = 0; n < imgs.length; n++) {
          const img = new Image(); img.src = imgs[n]; await img.decode();
          const c = document.createElement('canvas'); c.width = img.width; c.height = img.height;
          const ctx = c.getContext('2d'); ctx.drawImage(img, 0, 0);
          const data = ctx.getImageData(0, 0, c.width, c.height), p = data.data;
          for (let i = 0; i < p.length; i += 4) {
            const r = p[i], g = p[i+1], b = p[i+2];
            const excesso = g - Math.max(r, b);
            const alpha = 1 - Math.max(0, Math.min(1, (excesso - 15) / 65));
            p[i+3] = Math.round(p[i+3] * alpha);
            if (excesso > 15) p[i+1] = Math.min(g, Math.max(r,b) + 15);
          }
          ctx.putImageData(data, 0, 0);
          dest.drawImage(c, (n % cols)*size, Math.floor(n/cols)*size, size, size);
        }
        return atlas.toDataURL('image/png').split(',')[1];
      }, imagens);
      await fs.writeFile(path.join(out, nome + '.png'), Buffer.from(png, 'base64'));
      dados[nome] = { ...meta, frame_width: 384, frame_height: 384, columns: 8 };
      console.log(nome, imagens.length);
    }
    await fs.writeFile('hub/src/jogos/guerra-tortas/gatinho-dados.json', JSON.stringify(dados, null, 2) + '\n');
  } finally { await browser.close(); }
})().catch(e => { console.error(e); process.exitCode = 1; });
