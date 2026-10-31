import Phaser from 'phaser'
import { EMOCOES } from '../data/emocoes.js'
import { FONTE, criarHud, telaFinal, embaralhar } from './ui.js'

const ACERTOS_POR_ALVO = 5
const META = 15

// Rostos caem e a criança pega só a emoção pedida. Errar não tira pontos.
export default class ChuvaEmocoes extends Phaser.Scene {
  constructor() {
    super('ChuvaEmocoes')
  }

  init() {
    this.ctx = this.registry.get('ctx')
  }

  create() {
    const { hiperfoco, nivel, velocidade } = this.ctx
    this.cameras.main.setBackgroundColor(hiperfoco.cor)

    this.emocoes = EMOCOES.slice(0, [3, 5, 7][nivel - 1] ?? 3)
    this.acertos = 0
    this.fim = false
    this.itens = []
    this.alvo = null

    this.hud = criarHud(this, this.ctx)
    this.titulo = this.add
      .text(400, 80, '', {
        fontFamily: FONTE, fontSize: '28px',
        color: '#ffffff',
        backgroundColor: '#00000066',
        padding: { x: 12, y: 6 },
      })
      .setOrigin(0.5)
    this.dica = this.add
      .text(400, 125, '', { fontFamily: FONTE, fontSize: '20px', color: '#ffe9a8' })
      .setOrigin(0.5)
    this.jogador = this.add.text(400, 410, hiperfoco.personagem, { fontFamily: FONTE, fontSize: '56px' }).setOrigin(0.5)

    this.setas = this.input.keyboard.createCursorKeys()
    const seguir = (p) => {
      this.jogador.x = Phaser.Math.Clamp(p.x, 30, 770)
    }
    this.input.on('pointermove', seguir)
    this.input.on('pointerdown', seguir)

    this.novoAlvo()
    this.time.addEvent({ delay: 1400 / velocidade, loop: true, callback: () => this.soltar() })
  }

  novoAlvo() {
    const outras = this.emocoes.filter((e) => e !== this.alvo)
    this.alvo = embaralhar(outras)[0]
    this.titulo.setText(`Pegue: ${this.alvo.emoji} ${this.alvo.nome}`)
  }

  soltar() {
    if (this.fim) return
    const emocao = Math.random() < 0.5 ? this.alvo : embaralhar(this.emocoes)[0]
    const obj = this.add
      .text(Phaser.Math.Between(40, 760), -30, emocao.emoji, { fontFamily: FONTE, fontSize: '44px' })
      .setOrigin(0.5)
    this.itens.push({ obj, emocao })
  }

  update(_, dt) {
    if (this.fim) return
    const { velocidade, nivel } = this.ctx
    const passo = dt / 1000

    if (this.setas.left.isDown) this.jogador.x -= 420 * passo
    if (this.setas.right.isDown) this.jogador.x += 420 * passo
    this.jogador.x = Phaser.Math.Clamp(this.jogador.x, 30, 770)

    const queda = 90 * velocidade * (1 + nivel * 0.15)
    for (const item of [...this.itens]) {
      item.obj.y += queda * passo
      const perto =
        Math.abs(item.obj.x - this.jogador.x) < 40 && Math.abs(item.obj.y - this.jogador.y) < 40
      if (perto) this.pegar(item)
      else if (item.obj.y > 480) this.remover(item)
    }
  }

  remover(item) {
    item.obj.destroy()
    this.itens = this.itens.filter((i) => i !== item)
  }

  pegar(item) {
    this.remover(item)
    if (item.emocao === this.alvo) {
      this.acertos++
      this.hud.acerto()
      this.dica.setText('✨ Isso!')
      if (this.acertos >= META) return this.terminar()
      if (this.acertos % ACERTOS_POR_ALVO === 0) this.novoAlvo()
    } else {
      this.dica.setText(`Quase! Procure: ${this.alvo.emoji} ${this.alvo.nome}`)
    }
    this.time.delayedCall(1200, () => this.dica.setText(''))
  }

  terminar() {
    this.fim = true
    telaFinal(this, this.ctx, 'Muito bem! 🎉\nVocê reconheceu as emoções!')
  }
}
