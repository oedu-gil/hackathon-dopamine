// Uso: node tools/verificar-gatinho.cjs <modulo playwright>
const { chromium } = require(process.argv[2] || 'playwright');
const assert = require('node:assert/strict');
(async () => {
 const { spawn } = require('node:child_process');
 const server = spawn(process.execPath, ['hub/node_modules/vite/bin/vite.js','hub','--host','127.0.0.1','--port','5197','--strictPort'], {stdio:'pipe'});
 await new Promise((resolve,reject)=>{server.stdout.on('data',b=>{if(b.toString().includes('Local:'))resolve()});server.on('error',reject);server.on('exit',code=>reject(new Error('Vite terminou: '+code)))});
 const browser = await chromium.launch({ channel:'chrome', headless:true });
 try {
  const page = await browser.newPage({viewport:{width:1200,height:750}});
  const errors=[]; page.on('pageerror', e=>errors.push(String(e)));
  page.on('response', r=>{if(r.status()>=400) errors.push(r.status()+' '+r.url())});
  await page.goto('http://127.0.0.1:5197/jogo.html?id=guerra-tortas&sons=0');
  await page.waitForFunction(()=>window.__phaser?.scene.getScene('GuerraTortas')?.animador);
  await page.screenshot({path:'.playwright-mcp/gatinho-intro.png'});
  // Começar pelo controle real do canvas.
  const c = await page.locator('canvas').boundingBox();
  await page.mouse.click(c.x+c.width*.5,c.y+c.height*395/450);
  await page.waitForFunction(()=>window.__phaser.scene.getScene('GuerraTortas').jogando);
  await page.keyboard.down('Space');
  await page.waitForTimeout(550);
  const state=()=>page.evaluate(()=>{const s=window.__phaser.scene.getScene('GuerraTortas');return {estado:s.animador.estado,quadro:s.animador.quadro,protegido:s.animador.protegido}});
  assert.equal((await state()).estado,'hold');
  await page.screenshot({path:'.playwright-mcp/gatinho-defesa.png'});
  await page.waitForTimeout(600);
  assert.equal((await state()).quadro,21);
  await page.keyboard.up('Space'); await page.waitForTimeout(420);
  assert.equal((await state()).estado,'idle');
  await page.mouse.move(c.x+c.width*543/800,c.y+c.height*392/450);
  await page.mouse.down(); await page.keyboard.down('Space');
  await page.waitForTimeout(450); await page.mouse.up();
  assert.equal((await state()).estado,'hold');
  await page.keyboard.up('Space'); await page.waitForTimeout(400);
  assert.equal((await state()).estado,'idle');
  // Isolar ataque/reação da agenda aleatória para conferir seus eventos no runtime.
  await page.evaluate(()=>{const s=window.__phaser.scene.getScene('GuerraTortas');s.timerGuaxinim?.remove();s.temTorta=true;});
  await page.mouse.click(c.x+c.width*.5,c.y+c.height*.65);
  await page.waitForTimeout(250);
  assert.equal((await state()).estado,'ataque');
  await page.screenshot({path:'.playwright-mcp/gatinho-ataque.png'});
  await page.waitForTimeout(950);
  await page.evaluate(()=>{const s=window.__phaser.scene.getScene('GuerraTortas');s.tortaChegouNoGato(s.add.image(0,0,'gt_torta#0'))});
  await page.waitForTimeout(500);
  assert.equal((await state()).estado,'reacao');
  await page.screenshot({path:'.playwright-mcp/gatinho-reacao.png'});
  await page.waitForTimeout(2000);
  assert.equal(await page.evaluate(()=>!!window.__phaser.scene.getScene('GuerraTortas').respingo),false);
  await page.goto('http://127.0.0.1:5197/jogo.html?id=guerra-tortas&sons=0&rm=1');
  await page.waitForFunction(()=>window.__phaser?.scene.getScene('GuerraTortas')?.animador);
  assert.equal(await page.evaluate(()=>window.__phaser.scene.getScene('GuerraTortas').movimentoGato),false);
  assert.deepEqual(errors,[]);
  console.log('OK: assets, defesa mantida/solta, ataque, limpeza, movimento reduzido; sem erros de console/rede.');
 } finally {await browser.close();server.kill()}
})().catch(e=>{console.error(e);process.exitCode=1});
