import Phaser from 'phaser';
import { MemoryRound, cardLayout } from './model.js';

export const MISMATCH_DELAY_MS = 1200;
export const FLIP_DURATION_MS = 420;

export class MemoryScene extends Phaser.Scene {
  constructor(activity, ui) {
    super({ key: 'memory' });
    this.activity = activity;
    this.ui = ui;
  }
  preload() {
    for (const image of this.activity.images) this.load.image(`front:${image.id}`, image.url);
    this.load.image('card-back', this.activity.backImage.url);
  }
  create() {
    if (!this.textures.exists('card-back') || this.activity.images.some(image => !this.textures.exists(`front:${image.id}`))) {
      this.ui.fail('Não foi possível abrir todas as imagens. Confira os arquivos da atividade e tente novamente.');
      return;
    }
    this.animating = false;
    this.round = new MemoryRound(this.activity.images);
    this.views = this.round.cards.map(card => this.createCard(card));
    this.scale.on('resize', this.renderBoard, this);
    this.events.once('shutdown', () => {
      this.scale.off('resize', this.renderBoard, this);
      this.mismatchTimer?.remove(false);
      this.mismatchTimer = null;
    });
    this.renderBoard();
  }
  createCard(card) {
    const root = this.add.container();
    const shadow = this.add.graphics();
    const body = this.add.container();
    const edge = this.add.graphics();
    const back = this.add.container();
    const backPaper = this.add.graphics();
    const backIcon = this.add.image(0, 0, 'card-back');
    back.add([backPaper, backIcon]);
    const front = this.add.container();
    const paper = this.add.graphics();
    const image = this.add.image(0, 0, `front:${card.id}`);
    const label = this.add.text(0, 0, card.description, {
      fontFamily: 'Arial Rounded MT Bold, Trebuchet MS, Arial, sans-serif', fontSize: '17px', color: '#273f50', align: 'center'
    }).setOrigin(.5);
    const check = this.add.graphics();
    const shade = this.add.graphics();
    front.add([paper, image, label, check]);
    body.add([edge, back, front, shade]);
    root.add([shadow, body]);
    front.setVisible(false);
    return { root, shadow, body, edge, back, backPaper, backIcon, front, paper, image, label, check, shade,
      open: false, matched: false, progress: 1, fromOpen: false, toOpen: false };
  }
  select(index) {
    if (this.animating || !this.round?.select(index)) return;
    this.flipCards([index], true, () => {
      this.syncMatches();
      // Give the child 1.2 seconds with BOTH pictures fully visible before closing.
      if (this.round.state.phase === 'mismatch') {
        this.mismatchTimer = this.time.delayedCall(MISMATCH_DELAY_MS, () => {
          this.mismatchTimer = null;
          const indices = this.round.state.selected;
          this.flipCards(indices, false, () => {
            this.round.closeMismatch();
            this.syncUI();
          });
        });
      }
    });
  }
  flipCards(indices, open, onComplete) {
    this.animating = true;
    this.syncUI();
    let remaining = indices.length;
    for (const index of indices) {
      const view = this.views[index];
      view.fromOpen = view.open;
      view.toOpen = open;
      view.progress = 0;
      let finished = false;
      view.finish = () => {
        if (finished) return;
        finished = true;
        view.progress = 1;
        view.open = open;
        view.finish = null;
        view.tween = null;
        this.poseCard(view);
        if (--remaining === 0) {
          this.animating = false;
          onComplete();
          this.syncUI();
        }
      };
      if (this.ui.reducedMotion()) view.finish();
      else {
        this.poseCard(view);
        view.tween = this.tweens.add({
          targets: view, progress: 1, duration: FLIP_DURATION_MS, ease: 'Sine.easeInOut',
          onUpdate: () => this.poseCard(view), onComplete: () => view.finish?.()
        });
      }
    }
  }
  finishMotion() {
    // Changing the preference during a flip immediately settles its current target face.
    for (const view of this.views || []) {
      if (!view.finish) continue;
      view.tween?.stop();
      view.finish();
    }
  }
  poseCard(view) {
    const t = view.progress;
    const lift = Math.sin(Math.PI * t);
    view.body.setScale(Math.max(.025, Math.abs(Math.cos(Math.PI * t))), 1 + .025 * lift);
    view.body.y = -7 * lift;
    view.shadow.setScale(1 - .55 * lift, 1 + .04 * lift);
    view.shadow.y = 4 + 5 * lift;
    view.shade.alpha = .12 * lift;
    const face = t < .5 ? view.fromOpen : view.toOpen;
    view.front.setVisible(face);
    view.back.setVisible(!face);
  }
  syncMatches() {
    const matched = this.round.state.matched;
    this.views.forEach((view, index) => { view.matched = matched.includes(index); });
    this.renderBoard();
  }
  act() {
    if (!this.round || this.animating) return;
    if (this.round.state.phase === 'completed') {
      this.round = new MemoryRound(this.activity.images);
      this.round.start();
      this.views.forEach((view, index) => {
        view.image.setTexture(`front:${this.round.cards[index].id}`);
        view.label.setText(this.round.cards[index].description);
        view.open = view.fromOpen = view.toOpen = view.matched = false;
        view.progress = 1;
      });
    } else if (this.round.state.phase === 'ready') this.round.start();
    else return;
    this.renderBoard();
  }
  renderBoard() {
    if (!this.round) return;
    this.layout = cardLayout(this.scale.width, this.scale.height);
    this.views.forEach((view, index) => {
      const { x, y, width: w, height: h } = this.layout[index];
      const left = -w / 2, top = -h / 2;
      view.root.setPosition(x + w / 2, y + h / 2);
      view.shadow.clear().fillStyle(0x273f50, .12).fillRoundedRect(left + 1, top + 2, w - 2, h - 1, 18);
      view.edge.clear().fillStyle(0xa85440).fillRoundedRect(left, top + 3, w, h, 19);
      view.backPaper.clear().fillStyle(0xc97055).lineStyle(2, 0xa85440);
      view.backPaper.fillRoundedRect(left, top, w, h, 19).strokeRoundedRect(left, top, w, h, 19);
      view.backPaper.lineStyle(1.5, 0xfff0d0, .6).strokeRoundedRect(left + 10, top + 10, w - 20, h - 20, 12);
      const iconSize = Math.min(w, h) * .76;
      view.backIcon.setScale(Math.min(iconSize / view.backIcon.width, iconSize / view.backIcon.height));
      view.paper.clear().fillStyle(0xfffefa).lineStyle(2, view.matched ? 0x355e4e : 0x9ab1c0);
      view.paper.fillRoundedRect(left, top, w, h, 19).strokeRoundedRect(left, top, w, h, 19);
      view.image.setPosition(0, -h * .08);
      view.image.setScale(Math.min(w * .72 / view.image.width, h * .66 / view.image.height));
      view.label.setPosition(0, h * .36).setFontSize(w < 145 ? 15 : 17).setWordWrapWidth(w * .86);
      view.check.clear();
      if (view.matched) {
        const cx = w / 2 - 18, cy = -h / 2 + 18;
        view.check.lineStyle(2, 0x355e4e).strokeCircle(cx, cy, 9);
        view.check.beginPath();view.check.moveTo(cx - 4, cy);view.check.lineTo(cx - 1, cy + 3);
        view.check.lineTo(cx + 4, cy - 3);view.check.strokePath();
      }
      view.shade.clear().fillStyle(0x273f50).fillRoundedRect(left, top, w, h, 19);
      this.poseCard(view);
    });
    this.syncUI();
  }
  syncUI() {
    this.ui.update({ ...this.round.state, interactionLocked: this.animating }, this.layout, this.scale.width, this.scale.height);
  }
}
