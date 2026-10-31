import Phaser from 'phaser'
import { EMOCOES } from '../data/emocoes.js'
import { sons } from '../audio.js'
import { FONTE, caixaTexto, criarHud, telaFinal, embaralhar } from './ui.js'
import { balancar, confete, estourar, nuvens, respirar } from './efeitos.js'

const ACERTOS_POR_ALVO = 4
const META = 12
const RAIO_NORMAL = 40
const RAIO_SUPER = 85
const DURACAO_SUPER = 6000
const INTERVALO_BONUS = 14000

// Rostos caem e a criança pega só a emoção pedida. Começa devagar, com poucos rostos, e vai
// acelerando conforme ela acerta. Errar não tira pontos. De vez em quando cai uma 🌟 que dá
// um "super" por alguns segundos (a criança pega rostos num raio maior).
export default class ChuvaEmocoes extends Phaser.Scene {
  constructor() {
    super('ChuvaEmocoes')
  }

  init() {
    this.ctx = this.registry.get('ctx')
  }

  create() {
    const { hiperfoco, nivel } = this.ctx
    this.cameras.main.setBackgroundColor(hiperfoco.cor)

    this.emocoes = EMOCOES.slice(0, [3, 5, 7][nivel - 1] ?? 3)
    this.acertos = 0
    this.combo = 0
    this.fim = false
    this.itens = []
    this.alvo = null
    this.superAte = 0
    this.proximoBonus = this.time.now + INTERVALO_BONUS

    nuvens(this)
    this.hud = criarHud(this, this.ctx)
    this.titulo = caixaTexto(this, 400, 90, '', { fontSize: '28px', color: '#ffffff' }, { alpha: 0.4 })
    this.dica = caixaTexto(
      this,
      400,
      138,
      '',
      { fontSize: '20px', color: '#ffe9a8' },
      { px: 12, py: 5, alpha: 0.35 },
    )
    this.aura = this.add.circle(400, 410, RAIO_SUPER, 0xffd447, 0.25).setVisible(false)
    this.jogador = this.add.text(400, 410, hiperfoco.personagem, { fontFamily: FONTE, fontSize: '56px' }).setOrigin(0.5)
    respirar(this, this.jogador)

    this.setas = this.input.keyboard.createCursorKeys()
    const seguir = (p) => {
      this.jogador.x = Phaser.Math.Clamp(p.x, 30, 770)
    }
    this.input.on('pointermove', seguir)
    this.input.on('pointerdown', seguir)

    this.novoAlvo()
    this.agendarQueda()
  }

  // ---------- ritmo: começa calmo e acelera a cada acerto ----------

  intervalo() {
    const base = 2300 - Math.min(1200, this.acertos * 100) // 2,3 s no início, 1,1 s no fim
    return base / this.ctx.velocidade
  }

  velocidadeQueda() {
    const { velocidade, nivel } = this.ctx
    return 80 * velocidade * (1 + nivel * 0.1) * (1 + Math.min(1, this.acertos * 0.08))
  }

  agendarQueda() {
    this.time.delayedCall(this.intervalo(), () => {
      if (this.fim) return
      this.soltar()
      this.agendarQueda()
    })
  }

  novoAlvo() {
    const outras = this.emocoes.filter((e) => e !== this.alvo)
    this.alvo = embaralhar(outras)[0]
    this.titulo.setText(`Pegue: ${this.alvo.emoji} ${this.alvo.nome}`)
  }

  soltar() {
    const x = Phaser.Math.Between(40, 760)
    let emocao = Math.random() < 0.5 ? this.alvo : embaralhar(this.emocoes)[0]
    let emoji = emocao.emoji
    let bonus = false
    if (this.time.now > this.proximoBonus) {
      bonus = true
      emoji = '🌟'
      emocao = null
      this.proximoBonus = this.time.now + INTERVALO_BONUS
    }
    const obj = this.add.text(x, -30, emoji, { fontFamily: FONTE, fontSize: '44px' }).setOrigin(0.5)
    this.itens.push({ obj, emocao, bonus, fase: Math.random() * 6.28 })
  }

  update(_, dt) {
    if (this.fim) return
    const passo = dt / 1000

    if (this.setas.left.isDown) this.jogador.x -= 420 * passo
    if (this.setas.right.isDown) this.jogador.x += 420 * passo
    this.jogador.x = Phaser.Math.Clamp(this.jogador.x, 30, 770)

    const emSuper = this.time.now < this.superAte
    this.aura.setVisible(emSuper).setPosition(this.jogador.x, this.jogador.y)
    const raio = emSuper ? RAIO_SUPER : RAIO_NORMAL

    const queda = this.velocidadeQueda()
    for (const item of [...this.itens]) {
      item.obj.y += queda * passo
      // os rostos balançam enquanto caem
      if (this.ctx.efeitos) item.obj.setAngle(Math.sin(this.time.now / 220 + item.fase) * 14)
      const perto =
        Math.abs(item.obj.x - this.jogador.x) < raio && Math.abs(item.obj.y - this.jogador.y) < raio
      if (perto) this.pegar(item)
      else if (item.obj.y > 480) this.remover(item)
    }
  }

  remover(item) {
    item.obj.destroy()
    this.itens = this.itens.filter((i) => i !== item)
  }

  pegar(item) {
    const { x, y } = item.obj
    this.remover(item)

    if (item.bonus) {
      this.superAte = this.time.now + DURACAO_SUPER
      sons.desbloqueio()
      confete(this, x, y, { quantidade: 14 })
      this.mostrarDica('🌟 SUPER! Pegue tudo!')
      return
    }

    if (item.emocao === this.alvo) {
      this.acertos++
      this.combo++
      this.hud.acerto(this.jogador)
      estourar(this, this.jogador)
      if (this.combo >= 3) {
        confete(this, this.jogador.x, this.jogador.y - 20, { quantidade: 10 })
        this.mostrarDica(`🔥 Combo x${this.combo}!`)
      } else {
        this.mostrarDica('✨ Isso!')
      }
      if (this.acertos >= META) return this.terminar()
      if (this.acertos % ACERTOS_POR_ALVO === 0) this.novoAlvo()
    } else {
      this.combo = 0
      this.hud.erro()
      balancar(this, this.jogador, 8)
      this.mostrarDica(`Quase! Procure: ${this.alvo.emoji} ${this.alvo.nome}`)
    }
  }

  mostrarDica(texto) {
    this.dica.setText(texto)
    this.dicaVersao = (this.dicaVersao ?? 0) + 1
    const versao = this.dicaVersao
    this.time.delayedCall(1200, () => {
      if (versao === this.dicaVersao) this.dica.setText('')
    })
  }

  terminar() {
    this.fim = true
    telaFinal(this, this.ctx, 'Muito bem! 🎉\nVocê reconheceu as emoções!')
  }
}
