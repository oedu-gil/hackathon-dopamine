import Phaser from 'phaser';
import { createResult, RESULT_EVENT, validateActivity } from './contracts.js';

export class BaseGameScene extends Phaser.Scene {
  init(activity) {
    this.activity = validateActivity(activity);
    this.metrics = { attempts: 0, correct: 0, hints: 0 };
    this.finished = false;
    this.failedImages = [];
  }
  preload() {
    this.load.on('loaderror', file => this.failedImages.push(file.key));
    for (const image of this.activity.images) this.load.image(image.id, image.url);
  }
  create() {
    if (this.failedImages.length) {
      this.game.events.emit('activity-error', 'Não foi possível carregar as imagens. Volte ao menu e tente novamente.');
      return;
    }
    this.buildBoard();
  }
  buildBoard() {
    this.add.text(480, 90, 'Atividade em preparação', { fontSize: '30px', color: '#183b39' }).setOrigin(0.5);
    this.add.text(480, 145, 'As imagens já estão prontas para o jogo.', { fontSize: '22px', color: '#183b39' }).setOrigin(0.5);
    this.activity.images.forEach((image, i) => this.add.image(480 + (i - (this.activity.images.length - 1) / 2) * 220, 330, image.id).setDisplaySize(180, 180));
  }
  finish(status) {
    if (this.finished) return;
    this.finished = true;
    this.game.events.emit(RESULT_EVENT, createResult(this.activity, { status, ...this.metrics }));
  }
}
