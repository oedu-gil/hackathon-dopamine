import Phaser from 'phaser'
import { SITUACOES } from '../data/situacoes.js'
import { FONTE, botao, criarHud, telaFinal, embaralhar } from './ui.js'

const RODADAS = 6
const XS = [230, 400, 570]
const BASE = { x: 110, y: 350 }

// O personagem encontra um amigo numa situação social e pula na plataforma da atitude certa.
export default class PlataformaAmigo extends Phaser.Scene {
  constructor() {
    super('PlataformaAmigo')
  }

  init() {
    this.ctx = this.registry.get('ctx')
  }

  create() {
    const { hiperfoco, nivel } = this.ctx
    this.cameras.main.setBackgroundColor(hiperfoco.cor)
    this.add.rectangle(400, 425, 800, 50, 0x000000, 0.35)

    this.situacoes = embaralhar(SITUACOES.filter((s) => s.nivel <= nivel)).slice(0, RODADAS)
    this.rodada = 0
    this.travado = false
    this.botoes = []

    this.hud = criarHud(this, this.ctx)
    this.balao = this.add
      .text(400, 105, '', {
        fontFamily: FONTE, fontSize: '26px',
        color: '#ffffff',
        align: 'center',
        backgroundColor: '#00000066',
        padding: { x: 14, y: 8 },
        wordWrap: { width: 620 },
      })
      .setOrigin(0.5)
    this.jogador = this.add.text(BASE.x, BASE.y, hiperfoco.personagem, { fontFamily: FONTE, fontSize: '56px' }).setOrigin(0.5)
    this.amigo = this.add.text(700, BASE.y, '🙂', { fontFamily: FONTE, fontSize: '56px' }).setOrigin(0.5)

    ;['ONE', 'TWO', 'THREE'].forEach((tecla, i) =>
      this.input.keyboard.on(`keydown-${tecla}`, () => this.pular(i)),
    )
    this.mostrarSituacao()
  }

  duracao(ms) {
    return this.ctx.efeitos ? ms / this.ctx.velocidade : 1
  }

  mostrarSituacao() {
    const sit = this.situacoes[this.rodada]
    this.opcoes = embaralhar(sit.opcoes)
    this.amigo.setText('🙂')
    this.balao.setText(`${sit.texto}\nO que ${this.ctx.hiperfoco.personagemNome} faz?`)
    this.botoes.forEach((b) => b.destruir())
    this.botoes = this.opcoes.map((op, i) =>
      botao(this, XS[i], 250, 160, 90, `${i + 1}. ${op.texto}`, () => this.pular(i)),
    )
    this.travado = false
  }

  pular(i) {
    if (this.travado || !this.opcoes?.[i] || this.botoes[i].r.input?.enabled === false) return
    this.travado = true
    const op = this.opcoes[i]
    this.tweens.add({
      targets: this.jogador,
      x: XS[i],
      y: 175,
      duration: this.duracao(500),
      ease: 'Sine.Out',
      onComplete: () => (op.certo ? this.acertou(op) : this.errou(i, op)),
    })
  }

  acertou(op) {
    this.amigo.setText('😊')
    this.balao.setText(`Isso! ${op.feedback}`)
    this.hud.acerto()
    this.time.delayedCall(1800, () => {
      this.jogador.setPosition(BASE.x, BASE.y)
      this.rodada++
      if (this.rodada >= this.situacoes.length) {
        telaFinal(this, this.ctx, 'Muito bem! 🎉\nVocê ajudou todos os amigos!')
      } else {
        this.mostrarSituacao()
      }
    })
  }

  errou(i, op) {
    this.amigo.setText('😕')
    this.balao.setText(`Hmm... ${op.feedback}\nTente outra plataforma.`)
    this.botoes[i].desativar()
    this.tweens.add({
      targets: this.jogador,
      x: BASE.x,
      y: BASE.y,
      duration: this.duracao(500),
      ease: 'Sine.In',
      onComplete: () => (this.travado = false),
    })
  }
}
