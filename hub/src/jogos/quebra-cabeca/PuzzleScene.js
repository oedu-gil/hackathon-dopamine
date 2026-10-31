import { BaseGameScene } from '../../compartilhado/atividade/BaseGameScene.js';
import { composeImage } from './composeImage.js';
import { BOARD, C, CELL, CSS, MODEL, PROGRESS, SLOT, TILTS, TRAY, TRAY_SCALE, W, H, barLayout, cardColor, cellXY, fitView, pieceFrame, slotXY } from './layout.js';
import { createGame, giveBack, help, isPlaced, N, placedCount, start, tapCell, tapPiece, unlock } from './rules.js';
import regularFont from './assets/fonts/atkinson-hyperlegible-400.woff2';
import boldFont from './assets/fonts/atkinson-hyperlegible-700.woff2';
import titleFont from './assets/fonts/baloo2-800.woff2';

const FONT = 'QcAtkinson';
const FONT_BOLD = 'QcAtkinsonBold';
const FONT_TITLE = 'QcBaloo';
const FONTS = [FONT, FONT_BOLD, FONT_TITLE];
const COMPOSED_KEY = 'qc-composta';
const MOVE_MS = 200;
const LIFT_MS = 150;
const deg = d => (d * Math.PI) / 180;

// Eventos extras em game.events, tratados pelo index.js.
export const READY_EVENT = 'puzzle-ready';
export const EXIT_EVENT = 'activity-exit';
export const MESSAGE_EVENT = 'puzzle-message';

export class PuzzleScene extends BaseGameScene {
  init(activity) {
    super.init(activity);
    this.state = createGame(this.metrics);
    this.cardHex = cardColor(this.activity.settings?.puzzle?.cardColor);
    this.texts = [];
  }

  preload() {
    super.preload();
    this.load.font(FONT, regularFont, 'woff2');
    this.load.font(FONT_BOLD, boldFont, 'woff2');
    this.load.font(FONT_TITLE, titleFont, 'woff2');
  }

  create() {
    // Falha só da fonte não impede o jogo: cai na fonte do sistema.
    this.failedImages = this.failedImages.filter(key => !FONTS.includes(key));
    // Arquivo que chega mas não decodifica não gera 'loaderror' no Phaser; confere a textura.
    for (const { id } of this.activity.images) if (!this.textures.exists(id) && !this.failedImages.includes(id)) this.failedImages.push(id);
    super.create();
  }

  get reducedMotion() {
    return Boolean(this.activity.settings?.reducedMotion);
  }

  dur(ms) {
    return this.reducedMotion ? 0 : ms;
  }

  buildBoard() {
    this.pixelRatio = this.game.registry.get('pixelRatio') ?? 1;
    this.soundAvailable = this.game.registry.get('soundAvailable') ?? true;
    this.buildTexture();
    this.cameras.main.setOrigin(0, 0).setBackgroundColor(this.cardHex);
    this.fit();
    this.scale.on('resize', this.fit, this);
    this.events.once('shutdown', () => this.scale.off('resize', this.fit, this));

    this.buildModel();
    this.buildBoardArea();
    this.buildTray();
    this.buildBar();
    this.pieces = Array.from({ length: N }, (_, p) => this.pieceView(p));
    this.buildHint();
    this.buildBack();
    this.buildDone();
    this.buildStart();
    this.sync({ instant: true });
    this.game.events.emit(READY_EVENT);
  }

  // ---- Imagem e escala ----

  buildTexture() {
    if (this.textures.exists(COMPOSED_KEY)) this.textures.remove(COMPOSED_KEY);
    const source = this.textures.get(this.activity.images[0].id).getSourceImage();
    const texture = this.textures.addCanvas(COMPOSED_KEY, composeImage(source));
    for (let p = 0; p < N; p++) {
      const f = pieceFrame(p);
      texture.add(`p${p}`, 0, f.x, f.y, f.w, f.h);
    }
  }

  // Escala FIT do jogo de 960 × 600 dentro do canvas, que tem a resolução do aparelho.
  fit() {
    const r = this.pixelRatio;
    const { width, height } = this.scale.gameSize;
    const view = fitView(width / r, height / r);
    const zoom = view.zoom * r;
    this.cameras.main.setZoom(zoom).setScroll(-view.x / view.zoom, -view.y / view.zoom);
    const resolution = Math.min(4, Math.max(1, zoom));
    if (resolution !== this.textResolution) {
      this.textResolution = resolution;
      for (const t of this.texts) if (t.active) t.setResolution(resolution);
    }
  }

  text(x, y, value, size, { font = FONT, color = CSS.ink, origin = 0, wrap, align = 'left' } = {}) {
    const t = this.add.text(x, y, value, {
      fontFamily: `${font}, system-ui, sans-serif`, fontSize: `${size}px`, color, align,
      wordWrap: wrap ? { width: wrap, useAdvancedWrap: true } : undefined,
    });
    t.setOrigin(...[origin].flat()).setResolution(this.textResolution ?? 1);
    this.texts.push(t);
    return t;
  }

  // Até duas linhas, com reticências se passar disso (tema em frase curta).
  clampLines(t, value, lines = 2) {
    t.setText(value);
    if (t.getWrappedText(value).length <= lines) return;
    const words = value.split(' ');
    while (words.length > 1) {
      words.pop();
      const candidate = `${words.join(' ')}…`;
      if (t.getWrappedText(candidate).length <= lines) { t.setText(candidate); return; }
    }
  }

  // ---- Áreas fixas ----

  buildModel() {
    this.text(MODEL.x, 86, 'Modelo', 17, { font: FONT_BOLD });
    const pic = this.add.container(MODEL.x + MODEL.w / 2, MODEL.y + MODEL.h / 2);
    const g = this.add.graphics();
    g.fillStyle(C.ink, 1).fillRoundedRect(-MODEL.w / 2 + 4, -MODEL.h / 2 + 4, MODEL.w, MODEL.h, 12);
    g.fillStyle(C.white, 1).fillRoundedRect(-MODEL.w / 2, -MODEL.h / 2, MODEL.w, MODEL.h, 12);
    const img = this.add.image(0, 0, COMPOSED_KEY, '__BASE').setDisplaySize(MODEL.w - 12, MODEL.h - 12);
    pic.add([g, img]).setRotation(this.reducedMotion ? 0 : deg(-2));
    const cap = this.text(MODEL.x, MODEL.y + MODEL.h + 8, '', 15, { wrap: MODEL.w });
    this.clampLines(cap, `Tema: ${this.activity.theme}`);
  }

  buildBoardArea() {
    const g = this.add.graphics();
    g.fillStyle(C.ink, 1).fillRoundedRect(BOARD.x + 8, BOARD.y + 8, BOARD.w, BOARD.h, 22);
    g.fillStyle(C.paper, 1).fillRoundedRect(BOARD.x, BOARD.y, BOARD.w, BOARD.h, 22);
    g.lineStyle(3, C.ink, 1).strokeRoundedRect(BOARD.x + 1.5, BOARD.y + 1.5, BOARD.w - 3, BOARD.h - 3, 20.5);
    g.lineStyle(1, C.grid, 1);
    for (let c = 0; c < N; c++) {
      const [x, y] = cellXY(c);
      g.strokeRect(x + 0.5, y + 0.5, CELL - 1, CELL - 1);
      this.add.zone(x + CELL / 2, y + CELL / 2, CELL, CELL).setInteractive({ useHandCursor: true })
        .on('pointerdown', () => this.handle(tapCell(this.state, c)));
    }
    this.progressLabel = this.text(PROGRESS.x, PROGRESS.y, '', 17, { font: FONT_BOLD });
    this.dots = this.add.graphics();
  }

  buildTray() {
    const g = this.add.graphics();
    g.fillStyle(C.tray, 1).fillRoundedRect(TRAY.x, TRAY.y, TRAY.w, TRAY.h, 22);
    g.lineStyle(3, C.ink, 1).strokeRoundedRect(TRAY.x + 1.5, TRAY.y + 1.5, TRAY.w - 3, TRAY.h - 3, 20.5);
    g.lineStyle(3, C.ink, 0.32);
    for (let s = 0; s < N; s++) {
      const [x, y] = slotXY(s);
      dashedRect(g, x + 1.5, y + 1.5, SLOT - 3, SLOT - 3);
    }
  }

  buildBar() {
    const bar = barLayout({ sound: this.soundAvailable });
    this.instrX = bar.instr.x + bar.instr.w / 2;
    this.instrMain = this.text(this.instrX, 36, '', 27, { font: FONT_TITLE, origin: 0.5, align: 'center' });
    this.instrSub = this.text(this.instrX, 56, '', 16, { color: CSS.inkSoft, origin: 0.5, align: 'center' });
    this.helpButton = this.button(bar.ajuda, 'Ajuda', () => this.handle(help(this.state)), { icon: drawHint });
    if (bar.som) {
      this.soundButton = this.button(bar.som, 'Som', () => this.toggleSound(), { icon: (g, color) => drawSound(g, color, this.soundOn) });
      this.soundButton.toggled = this.soundOn;
      this.soundButton.draw();
    }
  }

  // Botão de 56 px: contorno de 3 px, cantos de 22 px, sombra chapada e (opcional) ícone.
  button({ x, y, w, h }, label, onTap, { primary = false, icon = null, size = 20 } = {}) {
    const box = this.add.container(x, y);
    const g = this.add.graphics();
    const ic = icon ? this.add.graphics() : null;
    const textX = icon ? (46 + w - 16) / 2 : w / 2;
    const t = this.text(textX, h / 2, label, size, { font: FONT_BOLD, origin: 0.5 });
    const zone = this.add.zone(w / 2, h / 2, w, h).setInteractive({ useHandCursor: true });
    box.add([g, ic, t, zone].filter(Boolean));
    const b = { box, enabled: true, pressed: false, toggled: false };
    b.draw = () => {
      const filled = b.toggled || primary;
      const off = b.pressed ? 2 : 0;
      g.clear();
      if (b.enabled) g.fillStyle(C.ink, 1).fillRoundedRect(3, 3, w, h, 22);
      g.fillStyle(b.toggled ? C.ink : primary ? C.sel : C.white, 1).fillRoundedRect(off, off, w, h, 22);
      g.lineStyle(3, C.ink, 1).strokeRoundedRect(off + 1.5, off + 1.5, w - 3, h - 3, 20.5);
      const color = filled ? C.white : C.ink;
      t.setColor(filled ? CSS.white : CSS.ink).setPosition(textX + off, h / 2 + off);
      if (ic) { ic.clear().setPosition(16 + off, (h - 24) / 2 + off); icon(ic, color); }
      box.setAlpha(b.enabled ? 1 : 0.45);
    };
    const release = () => { if (b.pressed) { b.pressed = false; b.draw(); } };
    zone.on('pointerdown', () => { if (!b.enabled) return; b.pressed = true; b.draw(); onTap(); });
    zone.on('pointerup', release).on('pointerout', release);
    b.setEnabled = on => { if (b.enabled !== on) { b.enabled = on; b.pressed = false; b.draw(); } };
    b.draw();
    return b;
  }

  // ---- Peças ----

  pieceView(p) {
    const box = this.add.container(0, 0);
    const inner = this.add.container(0, 0);
    const g = this.add.graphics();
    const img = this.add.image(0, 0, COMPOSED_KEY, `p${p}`).setDisplaySize(CELL, CELL);
    const badge = this.add.graphics();
    badge.fillStyle(C.white, 1).fillCircle(29, 29, 13).lineStyle(2, C.ink, 1).strokeCircle(29, 29, 14);
    badge.lineStyle(3.5, C.ink, 1).beginPath().moveTo(23, 29.5).lineTo(27, 33.5).lineTo(35, 25).strokePath();
    inner.add([g, img, badge]);
    const tag = this.add.container(0, -82);
    const tagText = this.text(0, 0, 'Esta peça', 18, { font: FONT_BOLD, color: CSS.white, origin: 0.5 });
    const tagBg = this.add.graphics().fillStyle(C.sel, 1).fillRoundedRect(-52, -14, 104, 28, 8);
    tag.add([tagBg, tagText]);
    const zone = this.add.zone(0, 0, CELL, CELL).setInteractive({ useHandCursor: true })
      .on('pointerdown', () => this.handle(tapPiece(this.state, p)));
    box.add([inner, tag, zone]);
    return { box, inner, g, badge, tag, look: null, at: null };
  }

  // Aparência de uma peça: 'tray'/'wrong' (adesivo inclinado), 'sel' (descolada) ou 'ok' (reta, com ✓).
  drawPiece(view, look) {
    const { g } = view;
    g.clear();
    if (look === 'sel') {
      g.fillStyle(C.ink, 0.35).fillRoundedRect(-55 + 6, -55 + 12, 110, 110, 13);
      g.fillStyle(C.sel, 1).fillRoundedRect(-55, -55, 110, 110, 13);
    } else if (look !== 'ok') {
      g.fillStyle(C.ink, 1).fillRoundedRect(-53 + 4, -53 + 4, 106, 106, 11);
      g.fillStyle(C.white, 1).fillRoundedRect(-53, -53, 106, 106, 11);
    }
  }

  syncPiece(p, instant) {
    const s = this.state, view = this.pieces[p];
    const cell = s.cellOf[p];
    const ok = isPlaced(s, p), sel = s.sel === p, inTray = cell === null;
    const look = ok ? 'ok' : sel ? 'sel' : 'loose';
    if (view.look !== look) { this.drawPiece(view, look); view.look = look; }
    view.badge.setVisible(ok && s.phase !== 'done');
    view.tag.setVisible(sel && inTray);
    view.box.setDepth(ok ? 1 : sel ? 5 : 2);

    const [x, y] = inTray ? slotXY(s.slotOf[p]) : cellXY(cell);
    const half = inTray ? SLOT / 2 : CELL / 2;
    const target = { x: x + half, y: y + half, scale: inTray ? TRAY_SCALE : 1 };
    const key = `${target.x},${target.y}`;
    if (view.at !== key) {
      view.at = key;
      this.tweens.killTweensOf(view.box);
      const d = instant ? 0 : this.dur(MOVE_MS);
      if (d) {
        view.box.setDepth(6);
        this.tweens.add({ targets: view.box, ...target, duration: d, ease: 'Cubic.easeOut', onComplete: () => this.syncPiece(p, true) });
      } else view.box.setPosition(target.x, target.y).setScale(target.scale);
    }

    const tilt = ok || sel || this.reducedMotion ? 0 : deg(TILTS[s.slotOf[p]]);
    const lift = sel ? { y: -10, scale: 1.08, rotation: 0 } : { y: 0, scale: 1, rotation: tilt };
    const inner = view.inner;
    if (inner.y !== lift.y || inner.scale !== lift.scale || inner.rotation !== lift.rotation) {
      this.tweens.killTweensOf(inner);
      const d = instant ? 0 : this.dur(LIFT_MS);
      if (d) this.tweens.add({ targets: inner, ...lift, duration: d, ease: 'Quad.easeOut' });
      else inner.setPosition(0, lift.y).setScale(lift.scale).setRotation(lift.rotation);
    }
  }

  // Leve achatamento quando a peça certa termina de encaixar.
  glue(p) {
    if (this.reducedMotion) return;
    const inner = this.pieces[p].inner;
    this.tweens.killTweensOf(inner);
    inner.setScale(1.06, 0.9);
    this.tweens.add({ targets: inner, scaleX: 1, scaleY: 1, duration: 180, ease: 'Quad.easeOut' });
  }

  // ---- Dica e "Devolver aqui" ----

  buildHint() {
    this.hintBox = this.add.container(0, 0).setDepth(4);
    const g = this.add.graphics().lineStyle(4, C.sel, 1);
    dashedRect(g, 7, 7, CELL - 14, CELL - 14, 10, 7);
    const bg = this.add.graphics().fillStyle(C.sel, 1).fillRoundedRect(CELL - 8 - 48, CELL - 8 - 22, 48, 22, 6);
    const t = this.text(CELL - 8 - 24, CELL - 8 - 11, 'Dica', 14, { font: FONT_BOLD, color: CSS.white, origin: 0.5 });
    this.hintBox.add([g, bg, t]);
  }

  buildBack() {
    this.backButton = this.add.container(0, 0).setDepth(3);
    const g = this.add.graphics().fillStyle(C.white, 0.85).fillRoundedRect(0, 0, SLOT, SLOT, 8).lineStyle(3, C.sel, 1);
    dashedRect(g, 1.5, 1.5, SLOT - 3, SLOT - 3);
    const t = this.text(SLOT / 2, SLOT / 2, 'Devolver\naqui', 13, { font: FONT_BOLD, color: CSS.sel, origin: 0.5, align: 'center' });
    const zone = this.add.zone(SLOT / 2, SLOT / 2, SLOT, SLOT).setInteractive({ useHandCursor: true })
      .on('pointerdown', () => this.handle(giveBack(this.state)));
    this.backButton.add([g, t, zone]);
  }

  // ---- Conclusão e início ----

  buildDone() {
    this.doneBox = this.add.container(0, 0).setDepth(7);
    const g = this.add.graphics().fillStyle(C.white, 1).fillRoundedRect(TRAY.x, TRAY.y, TRAY.w, TRAY.h, 22);
    g.lineStyle(3, C.ink, 1).strokeRoundedRect(TRAY.x + 1.5, TRAY.y + 1.5, TRAY.w - 3, TRAY.h - 3, 20.5);
    const midY = TRAY.y + TRAY.h / 2;
    const title = this.text(TRAY.x + 32, midY - 6, 'Você montou a imagem!', 36, { font: FONT_TITLE, origin: [0, 1] });
    const sub = this.text(TRAY.x + 32, midY + 6, 'As 15 peças estão no lugar.', 17, { color: CSS.inkSoft });
    const exit = { x: TRAY.x + TRAY.w - 32 - 120, y: midY - 32, w: 120, h: 64 };
    const again = { x: exit.x - 14 - 240, y: exit.y, w: 240, h: 64 };
    this.againButton = this.button(again, 'Montar de novo', () => this.scene.restart(this.activity), { primary: true, size: 24 });
    this.exitButton = this.button(exit, 'Sair', () => this.game.events.emit(EXIT_EVENT), { size: 24 });
    this.doneBox.add([g, title, sub, this.againButton.box, this.exitButton.box]);

    this.sticker = this.add.container(770 + 70, 62 + 24).setDepth(7).setRotation(this.reducedMotion ? 0 : deg(8));
    const sg = this.add.graphics();
    sg.fillStyle(C.ink, 1).fillRoundedRect(-70 + 4, -24 + 4, 140, 48, 16);
    sg.fillStyle(C.sticker, 1).fillRoundedRect(-70, -24, 140, 48, 16);
    sg.lineStyle(3, C.ink, 1).strokeRoundedRect(-68.5, -22.5, 137, 45, 14.5);
    this.sticker.add([sg, this.text(0, 2, 'Pronto!', 30, { font: FONT_TITLE, origin: 0.5 })]);
  }

  buildStart() {
    this.startLayer = this.add.container(0, 0).setDepth(10);
    const bg = this.add.rectangle(0, 0, W, H, hexToNumber(this.cardHex)).setOrigin(0).setInteractive();
    const pic = this.add.container(W / 2, 88 + 108).setRotation(this.reducedMotion ? 0 : deg(-2));
    const g = this.add.graphics();
    g.fillStyle(C.ink, 1).fillRoundedRect(-180 + 6, -108 + 6, 360, 216, 16);
    g.fillStyle(C.white, 1).fillRoundedRect(-180, -108, 360, 216, 16);
    pic.add([g, this.add.image(0, 0, COMPOSED_KEY, '__BASE').setDisplaySize(344, 200)]);
    const title = this.text(W / 2, 342, 'Vamos montar esta imagem', 38, { font: FONT_TITLE, origin: 0.5 });
    const cap = this.text(W / 2, 372, '', 17, { origin: [0.5, 0], align: 'center', wrap: 420 });
    this.clampLines(cap, `Tema: ${this.activity.theme}`);
    const go = this.button({ x: W / 2 - 100, y: 432, w: 200, h: 64 }, 'Começar', () => this.handle(start(this.state)), { primary: true, size: 24 });
    this.startLayer.add([bg, pic, title, cap, go.box]);
  }

  // ---- Estado → tela ----

  handle(outcome) {
    if (outcome.type === 'ignored') return;
    if (outcome.type === 'select' || outcome.type === 'place') this.playSound();
    if (outcome.type === 'place' || outcome.type === 'move') {
      if (outcome.completed) this.finish('completed');
      const d = this.dur(MOVE_MS);
      const done = () => {
        unlock(this.state);
        if (outcome.right) this.glue(outcome.piece);
        this.sync();
      };
      if (d) this.time.delayedCall(d, done);
      else unlock(this.state);
    }
    this.sync();
  }

  sync({ instant = false } = {}) {
    const s = this.state;
    const [main, sub] = s.msg;
    this.instrMain.setText(main).setY(sub ? 26 : 36);
    this.instrSub.setText(sub);
    this.game.events.emit(MESSAGE_EVENT, sub ? `${main}. ${sub}` : main);
    this.helpButton.setEnabled(s.phase === 'play');

    const ok = placedCount(s);
    this.progressLabel.setText(`${ok} de ${N} encaixadas`);
    this.dots.clear();
    for (let i = 0; i < N; i++) {
      const x = PROGRESS.x + (i % 5) * 23, y = PROGRESS.y + 31 + Math.floor(i / 5) * 23;
      this.dots.fillStyle(i < ok ? C.ink : C.white, i < ok ? 1 : 0.5).fillRoundedRect(x, y, 18, 18, 4);
      this.dots.lineStyle(2, C.ink, 1).strokeRoundedRect(x + 1, y + 1, 16, 16, 3);
    }

    for (let p = 0; p < N; p++) this.syncPiece(p, instant);

    const playing = s.phase === 'play';
    this.hintBox.setVisible(playing && s.hint !== null);
    if (s.hint !== null) this.hintBox.setPosition(...cellXY(s.hint));
    const backable = playing && s.sel !== null && s.cellOf[s.sel] !== null;
    this.backButton.setVisible(backable);
    if (backable) this.backButton.setPosition(...slotXY(s.slotOf[s.sel]));

    this.doneBox.setVisible(s.phase === 'done');
    this.sticker.setVisible(s.phase === 'done');
    this.startLayer.setVisible(s.phase === 'start');
  }

  // ---- Som ----

  get soundOn() {
    return Boolean(this.game.registry.get('soundOn'));
  }

  toggleSound() {
    this.game.registry.set('soundOn', !this.soundOn);
    this.soundButton.toggled = this.soundOn;
    this.soundButton.draw();
    this.playSound();
  }

  playSound() {
    if (this.soundAvailable && this.soundOn) this.game.registry.get('paperSound')?.play();
  }
}

// Cor CSS '#rrggbb' para número, como o Phaser espera nas formas.
function hexToNumber(hex) {
  return parseInt(hex.slice(1), 16);
}

function dashedRect(g, x, y, w, h, dash = 8, gap = 6) {
  const side = (x1, y1, x2, y2) => {
    const len = Math.hypot(x2 - x1, y2 - y1), dx = (x2 - x1) / len, dy = (y2 - y1) / len;
    for (let d = 0; d < len; d += dash + gap) {
      const e = Math.min(d + dash, len);
      g.lineBetween(x1 + dx * d, y1 + dy * d, x1 + dx * e, y1 + dy * e);
    }
  };
  side(x, y, x + w, y);
  side(x + w, y, x + w, y + h);
  side(x + w, y + h, x, y + h);
  side(x, y + h, x, y);
}

// Ícones de 24 × 24 desenhados com traço, na cor do texto do botão.
function drawHint(g, color) {
  g.lineStyle(2.4, color, 1);
  g.strokeCircle(12, 9.5, 6.5);
  g.lineBetween(9, 18, 15, 18);
  g.lineBetween(10, 21, 14, 21);
}

function drawSound(g, color, on) {
  g.lineStyle(2.4, color, 1);
  g.strokePoints([{ x: 4, y: 9 }, { x: 8, y: 9 }, { x: 13, y: 5 }, { x: 13, y: 19 }, { x: 8, y: 15 }, { x: 4, y: 15 }], true);
  if (on) {
    g.beginPath().arc(13, 12, 5, -0.8, 0.8).strokePath();
    g.beginPath().arc(13, 12, 8.5, -0.85, 0.85).strokePath();
  } else {
    g.lineBetween(17, 9, 21, 15);
    g.lineBetween(21, 9, 17, 15);
  }
}
