import Phaser from 'phaser'
import { carregarArte, criarAnimacoes } from './arte.js'

// Carrega toda a arte (SVG desenhados em código) e inicia a cena do jogo escolhido.
export default class Boot extends Phaser.Scene {
  constructor() {
    super('Boot')
  }

  preload() {
    this.cameras.main.setBackgroundColor('#1f2a38')
    const texto = this.add
      .text(400, 225, 'Carregando...', { fontFamily: 'Fredoka, sans-serif', fontSize: '28px', color: '#ffffff' })
      .setOrigin(0.5)
    this.load.on('progress', (v) => texto.setText(`Carregando... ${Math.round(v * 100)}%`))
    carregarArte(this)
  }

  create() {
    criarAnimacoes(this)
    this.scene.start(this.registry.get('cena'))
  }
}
