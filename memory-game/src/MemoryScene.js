import Phaser from 'phaser';
import { MemoryRound, cardLayout } from './model.js';

export const MISMATCH_DELAY_MS = 1200;

export class MemoryScene extends Phaser.Scene {
  constructor(activity, ui) {
    super({ key: 'memory' }); this.activity = activity; this.ui = ui;
  }
  preload() {
    for (const image of this.activity.images) this.load.image(image.id, image.url);
  }
  create() {
    if (this.activity.images.some(image => !this.textures.exists(image.id))) {
      this.ui.fail('Não foi possível abrir todas as imagens. Confira os arquivos da atividade e tente novamente.'); return;
    }
    this.round = new MemoryRound(this.activity.images);
    this.scale.on('resize', this.renderBoard, this);
    this.events.once('shutdown', () => {
      this.scale.off('resize', this.renderBoard, this);
      this.mismatchTimer?.remove(false); this.mismatchTimer = null;
    });
    this.renderBoard();
  }
  select(index) {
    if (!this.round?.select(index)) return;
    this.renderBoard(index);
    // Schedule only on the second selection, never during resize/redraw.
    if (this.round.state.phase === 'mismatch') {
      this.mismatchTimer = this.time.delayedCall(MISMATCH_DELAY_MS, () => {
        this.mismatchTimer = null;
        if (this.round.closeMismatch()) this.renderBoard();
      });
    }
  }
  act() {
    if (!this.round) return;
    if (this.round.state.phase === 'completed') { this.round = new MemoryRound(this.activity.images); this.round.start(); }
    else if (this.round.state.phase === 'ready') this.round.start();
    else return;
    this.renderBoard();
  }
  renderBoard(revealedIndex) {
    if (!this.round) return;
    this.tweens.killAll(); this.children.removeAll(true);
    const state = this.round.state;
    const layout = cardLayout(this.scale.width, this.scale.height);
    const g = this.add.graphics();
    layout.forEach((rect, index) => {
      const { x, y, width: w, height: h } = rect;
      const matched = state.matched.includes(index);
      const open = matched || state.selected.includes(index);
      g.fillStyle(open ? 0xfffefa : 0xe4edf2, 1);
      g.lineStyle(2, matched ? 0x355e4e : open ? 0x476a84 : 0xa5bac7, 1);
      g.fillRoundedRect(x, y, w, h, 19); g.strokeRoundedRect(x, y, w, h, 19);
      if (open) {
        const image = this.add.image(x + w / 2, y + h * .43, state.cards[index].id);
        const scale = Math.min(w * .72 / image.width, h * .66 / image.height);
        image.setScale(scale);
        if (index === revealedIndex && !this.ui.reducedMotion()) this.tweens.add({ targets: image, alpha: { from: .35, to: 1 }, duration: 140 });
      } else {
        const cx = x + w / 2, cy = y + h / 2;
        g.lineStyle(2, 0x476a84, 1);
        g.beginPath();g.moveTo(cx,cy-10);g.lineTo(cx-14,cy-14);g.lineTo(cx-14,cy+9);g.lineTo(cx,cy+13);g.lineTo(cx+14,cy+9);g.lineTo(cx+14,cy-14);g.lineTo(cx,cy-10);g.lineTo(cx,cy+13);g.strokePath();
      }
      if (matched) {
        g.lineStyle(2, 0x355e4e, 1); const cx = x + w - 18, cy = y + 18;
        g.strokeCircle(cx, cy, 9);g.beginPath();g.moveTo(cx-4,cy);g.lineTo(cx-1,cy+3);g.lineTo(cx+4,cy-3);g.strokePath();
      }
    });
    this.ui.update(state, layout, this.scale.width, this.scale.height);
  }
}
