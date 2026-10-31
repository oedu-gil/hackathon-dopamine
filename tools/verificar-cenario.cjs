// Uso: node tools/verificar-cenario.cjs <modulo-playwright> [url-do-jogo]
const { chromium } = require(process.argv[2] || 'playwright');
const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');

(async () => {
  let server;
  if (!process.argv[3]) {
    server = spawn(process.execPath, ['hub/node_modules/vite/bin/vite.js', 'hub', '--host', '127.0.0.1', '--port', '5215', '--strictPort'], { stdio: 'pipe', windowsHide: true });
    await new Promise((resolve, reject) => {
      server.stdout.on('data', data => { if (data.toString().includes('Local:')) resolve(); });
      server.on('error', reject);
      server.on('exit', code => reject(new Error(`Vite terminou: ${code}`)));
    });
  }
  let browser;
  try {
    browser = await chromium.launch({ channel: 'chrome', headless: true });
    const page = await browser.newPage({ viewport: { width: 1200, height: 750 } });
    const errors = [];
    page.on('pageerror', error => errors.push(String(error)));
    page.on('response', response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
    const url = process.argv[3] || 'http://127.0.0.1:5215/jogo.html?id=guerra-tortas&sons=0';
    await page.goto(url);
    await page.waitForFunction(() => window.__phaser?.scene.getScene('GuerraTortas')?.animador);
    await page.screenshot({ path: '.playwright-mcp/piquenique-inicio.png' });
    const background = await page.evaluate(() => {
      const s = window.__phaser.scene.getScene('GuerraTortas');
      const image = s.children.list.find(o => o.texture?.key === 'gt_cenario_piquenique');
      return { width: image?.displayWidth, height: image?.displayHeight, depth: image?.depth };
    });
    assert.deepEqual(background, { width: 800, height: 450, depth: -10 });
    const canvas = await page.locator('canvas').boundingBox();
    const click = (x, y) => page.mouse.click(canvas.x + canvas.width * x / 800, canvas.y + canvas.height * y / 450);
    // Prévia por toque: animações isoladas, sem iniciar ou alterar a partida.
    await click(242, 185);
    await page.waitForFunction(() => {
      const s = window.__phaser.scene.getScene('GuerraTortas');
      const itens = s.children.list.flatMap(o => o.list || []);
      return itens.find(o => o.name === 'demo-torta-ataque')?.visible && itens.some(o => o.text === 'Lançando a tortinha…');
    });
    await page.screenshot({ path: '.playwright-mcp/piquenique-demo-ataque.png' });
    await page.waitForFunction(() => window.__phaser.scene.getScene('GuerraTortas').children.list.some(o => o.list?.some(t => t.text === 'Toque para rever')));
    await click(558, 185);
    await page.waitForFunction(() => {
      const s = window.__phaser.scene.getScene('GuerraTortas');
      const itens = s.children.list.flatMap(o => o.list || []);
      return itens.find(o => o.name === 'demo-defesa')?.frame.name === 21 && itens.some(o => o.text === 'Segurando a bandeja…');
    });
    await page.screenshot({ path: '.playwright-mcp/piquenique-demo-defesa.png' });
    assert.deepEqual(await page.evaluate(() => {
      const s = window.__phaser.scene.getScene('GuerraTortas');
      return { jogando: s.jogando, torta: s.temTorta, comidas: s.comidas, animador: s.animador.estado };
    }), { jogando: false, torta: false, comidas: 0, animador: 'idle' });
    const updatesAntes = await page.evaluate(() => window.__phaser.scene.getScene('GuerraTortas').events.listenerCount('update'));
    await click(400, 395);
    await page.waitForFunction(() => window.__phaser.scene.getScene('GuerraTortas').jogando);
    assert.equal(await page.evaluate(() => window.__phaser.scene.getScene('GuerraTortas').events.listenerCount('update')), updatesAntes - 2);
    // Entradas reais: defender uma torta da agenda, soltar a guarda e lançar.
    await page.keyboard.down('Space');
    await page.waitForFunction(() => window.__phaser.scene.getScene('GuerraTortas').temTorta);
    await page.screenshot({ path: '.playwright-mcp/piquenique-defesa.png' });
    await page.keyboard.up('Space');
    await page.waitForFunction(() => {
      const s = window.__phaser.scene.getScene('GuerraTortas');
      return s.animador.estado === 'idle' && !s.guardaErguida;
    });
    // Pressionar o botão da defesa com uma torta disponível não pode lançar.
    await page.mouse.move(canvas.x + canvas.width * 543 / 800, canvas.y + canvas.height * 392 / 450);
    await page.mouse.down();
    await page.waitForFunction(() => window.__phaser.scene.getScene('GuerraTortas').animador.protegido);
    assert.equal(await page.evaluate(() => window.__phaser.scene.getScene('GuerraTortas').tortaDaCriancaVoando), false);
    await page.mouse.up();
    await page.waitForFunction(() => window.__phaser.scene.getScene('GuerraTortas').animador.estado === 'idle');
    await page.screenshot({ path: '.playwright-mcp/piquenique-pronta.png' });
    // Novo prato é um alvo de lançamento, além do cenário.
    await click(167, 404);
    await page.waitForFunction(() => window.__phaser.scene.getScene('GuerraTortas').animador.estado === 'ataque');
    await page.waitForFunction(() => !window.__phaser.scene.getScene('GuerraTortas').tortaDaCriancaVoando);
    await page.screenshot({ path: '.playwright-mcp/piquenique-partida.png' });
    // Fixture da última torta: exercita fim e reinício sem depender de várias rodadas aleatórias.
    await page.waitForFunction(() => window.__phaser.scene.getScene('GuerraTortas').animador.estado === 'idle');
    await page.evaluate(() => {
      const s = window.__phaser.scene.getScene('GuerraTortas');
      s.timerGuaxinim?.remove(); s.guardaErguida = false; s.estadoGuaxinim = 'aberto';
      s.comidas = 4; s.temTorta = true;
      for (let i = 1; i <= 4; i++) s.hud.progresso(i);
    });
    await click(167, 404);
    await page.waitForFunction(() => window.__phaser.scene.getScene('GuerraTortas').fim);
    await page.waitForFunction(() => {
      const s = window.__phaser.scene.getScene('GuerraTortas');
      return s.children.list.some(o => o.list?.some(t => t.text === 'O guaxinim comeu e foi descansar.'));
    });
    await page.screenshot({ path: '.playwright-mcp/piquenique-final.png' });
    await click(260, 317);
    await page.waitForFunction(() => {
      const s = window.__phaser.scene.getScene('GuerraTortas');
      return !s.fim && !s.jogando && s.comidas === 0;
    });
    assert.equal(await page.evaluate(() => window.__phaser.scene.getScene('GuerraTortas').input.listenerCount('pointerdown')), 1);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(url + '&rm=1');
    await page.waitForFunction(() => window.__phaser?.scene.getScene('GuerraTortas')?.animador);
    assert.equal(await page.evaluate(() => window.__phaser.scene.getScene('GuerraTortas').movimentoGato), false);
    assert.equal(await page.evaluate(() => window.__phaser.scene.getScene('GuerraTortas').ctx.efeitos), false);
    assert.equal(await page.evaluate(() => window.__phaser.scene.getScene('GuerraTortas').tweens.getTweens().length), 0);
    await click(242, 185);
    assert.equal(await page.evaluate(() => window.__phaser.scene.getScene('GuerraTortas').tweens.getTweens().length), 0);
    assert.equal(await page.evaluate(() => window.__phaser.scene.getScene('GuerraTortas').textures.exists('gt_cenario_piquenique')), true);
    assert.deepEqual(errors, []);
    console.log('OK: cenário, início, defesa por tecla e ponteiro, lançamento pelo prato, final e reinício sem listener duplicado; movimento reduzido sem tweens; sem erros de página/rede.');
  } finally { await browser?.close(); server?.kill(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
