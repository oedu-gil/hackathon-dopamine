import { BaseGameScene } from '../../compartilhado/atividade/BaseGameScene.js';
import { computeLayout } from './layout.js';
import { choose, createRound, createSession, hintText, showHint, unlock, validateSequenceExtras } from './rules.js';
import regularFont from './assets/fonts/atkinson-hyperlegible-400.woff2';
import boldFont from './assets/fonts/atkinson-hyperlegible-700.woff2';

const FONT = 'AtkinsonSeq';
const FONT_BOLD = 'AtkinsonSeqBold';
const C = { paper: 0xf4efe4, card: 0xfffdf8, ink: 0x1f2a2e, gap: 0x7d7262, tray: 0xe8e0cf, ok: 0x2f6b4f, white: 0xffffff };
const CSS = { ink: '#1f2a2e', muted: '#6b6458', gap: '#7d7262', card: '#fffdf8' };
const FLIGHT_MS = 250;

// Eventos extras em game.events, tratados pela entrada individual (main.js).
export const READY_EVENT = 'sequence-ready';
export const EXIT_EVENT = 'activity-exit';

export class SequenceScene extends BaseGameScene {
  init(activity) {
    super.init(validateSequenceExtras(activity));
    this.round = createRound(this.activity.images);
    this.session = createSession(this.metrics);
    this.message = '';
    this.showEnd = false;
    this.ui = null;
  }

  preload() {
    super.preload();
    this.load.font(FONT, regularFont, 'woff2');
    this.load.font(FONT_BOLD, boldFont, 'woff2');
  }

  create() {
    // Falha só da fonte não impede o jogo: cai na fonte do sistema.
    this.failedImages = this.failedImages.filter(key => key !== FONT && key !== FONT_BOLD);
    // Arquivo que chega mas não decodifica não gera 'loaderror' no Phaser; confere a textura.
    for (const { id } of this.activity.images) if (!this.textures.exists(id) && !this.failedImages.includes(id)) this.failedImages.push(id);
    super.create();
  }

  buildBoard() {
    this.pixelRatio = this.game.registry.get('pixelRatio') ?? 1;
    this.cameras.main.setOrigin(0, 0).setZoom(this.pixelRatio).setBackgroundColor(C.paper);
    this.scale.on('resize', this.render, this);
    this.events.once('shutdown', () => this.scale.off('resize', this.render, this));
    this.render();
    this.game.events.emit(READY_EVENT);
  }

  get reducedMotion() {
    return Boolean(this.activity.settings?.reducedMotion);
  }

  // Redesenha tudo a partir do estado: no início, a cada mudança e no resize.
  render() {
    this.tweens.killAll();
    this.ui?.destroy();
    this.ui = this.add.container(0, 0);
    const L = (this.layout = computeLayout(this.scale.gameSize.width / this.pixelRatio, this.scale.gameSize.height / this.pixelRatio));
    const solved = this.session.solved;

    this.hintButton = null;
    this.refreshHintButton();
    this.ui.add(this.text(L.title.x, L.title.y, 'O que vem depois?', L.title.size, { bold: true }));
    if (this.activity.context) this.ui.add(this.text(L.ctx.x, L.ctx.y, this.activity.context, L.ctx.size, { color: CSS.muted, wrap: L.center * 2 - 32 }));

    this.round.pattern.forEach((image, i) => this.ui.add(this.slot(L.slots[i], L.slot, image, i + 1)));
    this.ui.add(this.slot(L.slots[4], L.slot, solved ? this.round.answer : null, 5, { done: solved }));

    // Dica e mensagem sempre existem (vazias se não houver): mudam por setText, sem recriar as opções.
    this.hintLine = this.text(L.center, L.hint.y, this.session.hintShown ? hintText(this.round, solved) : '', 20, { bold: true, wrap: L.center * 2 - 32 });
    this.msgLine = this.text(L.center, L.msg.y, this.message, 19, { bold: true });
    this.ui.add([this.hintLine, this.msgLine]);

    const tray = this.add.graphics().fillStyle(C.tray, 1);
    tray.fillRoundedRect(L.tray.x, L.tray.y, L.tray.w, L.tray.h, { tl: L.tray.radius, tr: 0, bl: 0, br: 0 });
    this.ui.add(tray);
    this.ui.add(this.text(L.trayTitle.x, L.trayTitle.y, this.showEnd ? 'Muito bem' : 'Escolha uma', 18, { bold: true }));

    this.optionViews = [];
    if (this.showEnd) {
      const [again, exit] = L.end;
      this.ui.add(this.button(again, 'Jogar de novo', () => this.replay(), { primary: true }));
      this.ui.add(this.button(exit, 'Sair', () => this.game.events.emit(EXIT_EVENT)));
      return;
    }
    this.optionViews = this.round.options.map((image, i) => {
      const view = this.option(L.options[i], L.opt, image);
      // Durante o voo do acerto, a opção certa já está a caminho da lacuna.
      if (solved && image === this.round.answer) view.setVisible(false);
      this.ui.add(view);
      return view;
    });
  }

  text(x, y, value, size, { bold = false, color = CSS.ink, wrap } = {}) {
    const t = this.add.text(x, y, value, {
      fontFamily: `${bold ? FONT_BOLD : FONT}, system-ui, sans-serif`, fontSize: `${size}px`, color, align: 'center',
      wordWrap: wrap ? { width: wrap } : undefined,
    });
    return t.setOrigin(0.5).setResolution(this.pixelRatio);
  }

  picture(image, size) {
    const img = this.add.image(0, 0, image.id);
    return img.setScale((size * 0.84) / Math.max(img.width, img.height));
  }

  slot({ x, y }, size, image, number, { done = false } = {}) {
    const box = this.add.container(x, y);
    const g = this.add.graphics();
    const half = size / 2;
    if (image) {
      g.fillStyle(C.card, 1).fillRoundedRect(-half, -half, size, size, 12);
      g.lineStyle(done ? 4 : 3, done ? C.ok : C.ink, 1).strokeRoundedRect(-half, -half, size, size, 12);
      box.add([g, this.picture(image, size)]);
    } else {
      dashedRect(g.lineStyle(3, C.gap, 1), -half, -half, size, size, 8, 6);
      box.add([g, this.text(0, 0, '?', Math.round(size * 0.4), { bold: true, color: CSS.gap })]);
    }
    if (done) {
      const badge = this.add.graphics().fillStyle(C.ok, 1).fillCircle(half - 2, -half + 2, 14);
      badge.lineStyle(3, C.white, 1).beginPath();
      badge.moveTo(half - 9, -half + 2).lineTo(half - 4, -half + 7).lineTo(half + 5, -half - 4).strokePath();
      box.add(badge);
    }
    box.add(this.text(0, half + 12, String(number), 14, { color: CSS.muted }));
    return box;
  }

  option({ x, y }, size, image) {
    const box = this.add.container(x, y);
    const face = this.add.container(0, 0);
    const half = size / 2;
    const shadow = this.add.graphics().fillStyle(C.ink, 1).fillRoundedRect(-half, -half + 5, size, size, 16);
    const g = this.add.graphics().fillStyle(C.card, 1).fillRoundedRect(-half, -half, size, size, 16);
    g.lineStyle(3, C.ink, 1).strokeRoundedRect(-half, -half, size, size, 16);
    face.add([g, this.picture(image, size)]);
    const hit = this.add.rectangle(0, 2, size, size + 5, 0x000000, 0).setInteractive({ useHandCursor: true });
    const press = down => face.setY(down ? 3 : 0);
    hit.on('pointerdown', () => press(true));
    hit.on('pointerout', () => press(false));
    hit.on('pointerup', () => { press(false); this.onChoose(image, box); });
    box.add([shadow, face, hit]);
    return box.setData('face', face);
  }

  button({ x, y, w, h }, label, onTap, { primary = false, pressed = false, disabled = false } = {}) {
    const box = this.add.container(x, y);
    const g = this.add.graphics().fillStyle(primary ? C.ink : pressed ? C.tray : C.card, 1).fillRoundedRect(0, 0, w, h, 10);
    g.lineStyle(2, C.ink, 1).strokeRoundedRect(0, 0, w, h, 10);
    box.add([g, this.text(w / 2, h / 2, label, 17, { bold: true, color: primary ? CSS.card : CSS.ink })]);
    if (disabled) return box.setAlpha(0.5);
    const hit = this.add.rectangle(w / 2, h / 2, w, h, 0x000000, 0).setInteractive({ useHandCursor: true });
    hit.on('pointerup', onTap);
    return box.add(hit);
  }

  refreshHintButton() {
    this.hintButton?.destroy();
    this.hintButton = this.button(this.layout.hintBtn, '💡 Dica', () => this.onHint(), { pressed: this.session.hintShown, disabled: this.session.solved });
    this.ui.add(this.hintButton);
  }

  onHint() {
    if (!showHint(this.session)) return;
    this.hintLine.setText(hintText(this.round, false));
    this.refreshHintButton();
  }

  onChoose(image, view) {
    const result = choose(this.session, this.round, image.id);
    if (result === 'wrong') this.onWrong(image);
    else if (result === 'right') this.onRight(view);
  }

  onWrong(image) {
    this.message = 'Quase! Olhe a fila de novo.';
    this.msgLine.setText(this.message);
    const view = this.optionViews[this.round.options.indexOf(image)];
    if (!this.reducedMotion) this.tweens.add({ targets: view.getData('face'), y: -18, duration: 160, yoyo: true, ease: 'Sine.easeOut' });
    this.time.delayedCall(this.reducedMotion ? 150 : 400, () => unlock(this.session));
  }

  onRight(view) {
    this.message = '';
    this.msgLine.setText('');
    this.finish('completed');
    // O avanço depende do relógio, não do tween: um resize no meio do voo não trava o jogo.
    const done = () => {
      this.message = 'Você completou!';
      this.render();
      this.time.delayedCall(700, () => { this.showEnd = true; this.render(); });
    };
    if (this.reducedMotion) return done();
    const target = this.layout.slots[4];
    this.ui.bringToTop(view);
    this.tweens.add({ targets: view, x: target.x, y: target.y, scale: this.layout.slot / this.layout.opt, duration: FLIGHT_MS, ease: 'Cubic.easeOut' });
    this.time.delayedCall(FLIGHT_MS + 10, done);
  }

  replay() {
    this.scene.restart({ ...this.activity, activityId: crypto.randomUUID() });
  }
}

// Graphics não tem traço tracejado: desenha segmentos ao longo do retângulo.
function dashedRect(g, x, y, w, h, dash, space) {
  const edges = [[x, y, x + w, y], [x + w, y, x + w, y + h], [x + w, y + h, x, y + h], [x, y + h, x, y]];
  for (const [x1, y1, x2, y2] of edges) {
    const len = Math.hypot(x2 - x1, y2 - y1);
    for (let d = 0; d < len; d += dash + space) {
      const e = Math.min(d + dash, len);
      g.lineBetween(x1 + ((x2 - x1) * d) / len, y1 + ((y2 - y1) * d) / len, x1 + ((x2 - x1) * e) / len, y1 + ((y2 - y1) * e) / len);
    }
  }
}
