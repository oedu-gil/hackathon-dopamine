const { chromium } = require(process.argv[2] || 'playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
(async () => {
 const { spawn } = require('node:child_process');
 const {pathToFileURL}=require('node:url');
 const path=require('node:path');
 const viteUrl=pathToFileURL(path.resolve('hub/node_modules/vite/dist/node/index.js')).href;
 // Dependências existentes via junction: permitir apenas a raiz real delas no servidor de teste.
 const config={root:path.resolve('hub'),server:{host:'127.0.0.1',port:31988,strictPort:true,fs:{allow:[process.cwd(),fs.realpathSync('hub/node_modules')]}}};
 const boot=`import {createServer} from ${JSON.stringify(viteUrl)};const s=await createServer(${JSON.stringify(config)});await s.listen();s.printUrls();`;
 const server = spawn(process.execPath, ['--input-type=module','-e',boot], {stdio:'pipe'});
 server.stderr.on('data',b=>process.stderr.write(b));
 await new Promise((resolve,reject)=>{server.stdout.on('data',b=>{if(b.toString().includes('Local:'))resolve()});server.on('error',reject);server.on('exit',code=>reject(new Error('Vite terminou: '+code)))});
 const browser = await chromium.launch({ channel:'chrome', headless:true });
 try {
  fs.mkdirSync('.playwright-mcp',{recursive:true});
  const p=await browser.newPage({viewport:{width:1200,height:750}}), errors=[];
  p.on('pageerror',e=>errors.push(String(e)));p.on('response',r=>{if(r.status()>=400)errors.push(r.status()+' '+r.url())});
  const wait=fn=>p.waitForFunction(fn,null,{timeout:12000});
  const state=()=>p.evaluate(()=>{const s=window.__phaser.scene.getScene('GuerraTortas');return {estado:s.animadorGuaxinim.estado,quadro:s.animadorGuaxinim.quadro,arte:s.guaxinim.texture.key,protegido:s.guardaErguida,comidas:s.comidas,ultimo:s.ultimoLancamento,zzz:!!s.zzz}});
  await p.goto('http://127.0.0.1:31988/jogo.html?id=guerra-tortas&sons=0');
  await wait(()=>window.__phaser?.scene.getScene('GuerraTortas')?.animadorGuaxinim);
  const c=await p.locator('canvas').boundingBox();
  const click=async(x,y)=>p.mouse.click(c.x+c.width*x/800,c.y+c.height*y/450);
  await click(400,395);await wait(()=>window.__phaser.scene.getScene('GuerraTortas').jogando);
  await p.screenshot({path:'.playwright-mcp/guaxinim-idle.png'});
  await p.keyboard.down('Space');
  await wait(()=>window.__phaser.scene.getScene('GuerraTortas').animadorGuaxinim.estado==='ataque');
  assert.equal((await state()).ultimo,-Infinity);
  await wait(()=>Number.isFinite(window.__phaser.scene.getScene('GuerraTortas').ultimoLancamento));
  await p.screenshot({path:'.playwright-mcp/guaxinim-ataque.png'});
  await wait(()=>window.__phaser.scene.getScene('GuerraTortas').temTorta);
  await p.keyboard.up('Space');
  await wait(()=>window.__phaser.scene.getScene('GuerraTortas').animador.estado==='idle');
  // Entrada real da criança: lançamento, colisão e reação.
  await p.evaluate(()=>{const s=window.__phaser.scene.getScene('GuerraTortas');s.timerGuaxinim?.remove();});
  await click(400,290);
  await wait(()=>window.__phaser.scene.getScene('GuerraTortas').animadorGuaxinim.estado==='reacao');
  assert.equal((await state()).comidas,1);
  await p.screenshot({path:'.playwright-mcp/guaxinim-reacao.png'});
  // Pausa congela o relógio da reação.
  await p.evaluate(()=>window.__phaser.scene.pause('GuerraTortas'));
  const frozen=(await state()).quadro;await p.waitForTimeout(180);assert.equal((await state()).quadro,frozen);
  await p.evaluate(()=>window.__phaser.scene.resume('GuerraTortas'));
  await wait(()=>window.__phaser.scene.getScene('GuerraTortas').animadorGuaxinim.estado==='idle');
  assert.equal(await p.evaluate(()=>!!window.__phaser.scene.getScene('GuerraTortas').respingoGuaxinim),false);
  // Agenda determinística para exercitar guarda e abertura, sem aleatoriedade.
  await p.evaluate(()=>{const s=window.__phaser.scene.getScene('GuerraTortas');s.timerGuaxinim?.remove();s.erguerGuarda()});
  await wait(()=>window.__phaser.scene.getScene('GuerraTortas').guardaErguida);
  await p.screenshot({path:'.playwright-mcp/guaxinim-defesa.png'});
  await p.evaluate(()=>{const s=window.__phaser.scene.getScene('GuerraTortas');s.tortaChegouNoGuaxinim(s.add.image(590,265,'gt_torta#0'));});
  assert.equal((await state()).comidas,1);
  await p.evaluate(()=>window.__phaser.scene.getScene('GuerraTortas').avisarAbertura());
  await wait(()=>!window.__phaser.scene.getScene('GuerraTortas').guardaErguida);
  await wait(()=>window.__phaser.scene.getScene('GuerraTortas').animadorGuaxinim.estado==='idle');
  // Colisão decisiva, sem exigir uma partida aleatória de cinco rodadas no teste.
  await p.evaluate(()=>{const s=window.__phaser.scene.getScene('GuerraTortas');s.timerGuaxinim?.remove();for(let i=s.comidas;i<4;i++)s.hud.progresso(i+1);s.comidas=4;s.tortaChegouNoGuaxinim(s.add.image(590,265,'gt_torta#0'));});
  await wait(()=>window.__phaser.scene.getScene('GuerraTortas').animadorGuaxinim.concluido);
  assert.equal((await state()).quadro,57);assert.equal((await state()).zzz,true);
  await p.screenshot({path:'.playwright-mcp/guaxinim-sono.png'});
  await p.waitForTimeout(1000);assert.equal((await state()).quadro,57);
  // Reiniciar pelo botão real, e conferir referências/estado novos.
  await click(260,317);await wait(()=>!window.__phaser.scene.getScene('GuerraTortas').fim);
  assert.equal((await state()).estado,'idle');assert.equal((await state()).zzz,false);
  await p.goto('http://127.0.0.1:31988/jogo.html?id=guerra-tortas&sons=0&rm=1');
  await wait(()=>window.__phaser?.scene.getScene('GuerraTortas')?.animadorGuaxinim);
  await p.waitForTimeout(200);assert.equal(await p.evaluate(()=>window.__phaser.scene.getScene('GuerraTortas').guaxinim.frame.name),0);
  await p.evaluate(()=>window.__phaser.scene.getScene('GuerraTortas').terminar());await p.waitForTimeout(100);
  assert.equal(await p.evaluate(()=>window.__phaser.scene.getScene('GuerraTortas').guaxinim.frame.name),57);
  assert.equal(await p.evaluate(()=>window.__phaser.scene.getScene('GuerraTortas').ctx.efeitos),false);
  assert.deepEqual(errors,[]);
  console.log('OK: entrada real, ataque/release, defesa/abertura, colisão/reação/limpeza, pausa, final sustentado/Zzz, reinício e movimento reduzido; sem erros de página/rede.');
 } finally {await browser.close();server.kill()}
})().catch(e=>{console.error(e);process.exitCode=1});
