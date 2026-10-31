import Phaser from 'phaser'
import { HISTORIAS } from '../data/historias.js'
import { FONTE, botao, criarHud, telaFinal, embaralhar } from './ui.js'

// Jogo calmo e sem tempo: a criança escolhe o que o personagem faz e vê a consequência.
export default class HistoriaEscolhas extends Phaser.Scene {
  constructor() {
    super('HistoriaEscolhas')
  }

  init() {
    this.ctx = this.registry.get('ctx')
  }

  create() {
    const { hiperfoco, nivel } = this.ctx
    this.cameras.main.setBackgroundColor(hiperfoco.cor)
    this.historia = embaralhar(HISTORIAS.filter((h) => h.nivel <= nivel))[0]
    this.passo = 0
    this.botoes = []

    this.hud = criarHud(this, this.ctx)
    this.add
      .text(400, 66, this.historia.titulo, { fontFamily: FONTE, fontSize: '22px', color: '#ffe9a8' })
      .setOrigin(0.5)
    this.add.text(60, 125, hiperfoco.personagem, { fontFamily: FONTE, fontSize: '64px' }).setOrigin(0.5)
    this.texto = this.add
      .text(130, 100, '', { fontFamily: FONTE, fontSize: '24px', color: '#ffffff', wordWrap: { width: 620 } })
    this.retorno = this.add
      .text(130, 205, '', { fontFamily: FONTE, fontSize: '22px', color: '#ffe9a8', wordWrap: { width: 620 } })

    this.mostrarPasso()
  }

  trocar(texto) {
    const frase = texto.replaceAll('{p}', this.ctx.hiperfoco.personagemNome)
    return frase[0].toUpperCase() + frase.slice(1)
  }

  mostrarPasso() {
    const passo = this.historia.passos[this.passo]
    this.travado = false
    this.retorno.setText('')
    this.texto.setText(this.trocar(passo.texto))
    this.botoes.forEach((b) => b.destruir())
    this.botoes = embaralhar(passo.escolhas).map((escolha, i) => {
      const b = botao(this, 400, 295 + i * 62, 640, 50, escolha.texto, () => this.escolher(b, escolha))
      return b
    })
  }

  escolher(b, escolha) {
    if (this.travado) return
    this.retorno.setText(this.trocar(escolha.consequencia))
    if (!escolha.certo) {
      this.hud.erro()
      return b.desativar()
    }

    this.travado = true
    this.botoes.forEach((x) => x.desativar())
    this.hud.acerto()
    this.time.delayedCall(2200, () => {
      this.passo++
      if (this.passo >= this.historia.passos.length) this.terminar()
      else this.mostrarPasso()
    })
  }

  terminar() {
    telaFinal(this, this.ctx, `${this.trocar(this.historia.final)}\n🎉`)
  }
}
