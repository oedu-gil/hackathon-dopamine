import Phaser from 'phaser'
import { EMOCOES } from './emocoes.js'
import { sons } from '../../compartilhado/kit-phaser/audio.js'
import { embaralhar } from '../../compartilhado/kit-phaser/ui.js'
import { balancar, confete, estourar } from '../../compartilhado/kit-phaser/efeitos.js'
import {
  FONTES,
  PAPEL,
  adesivo,
  carregarCenario,
  cartao,
  criarHudPapel,
  desenharCenario,
  rotulo,
  telaFinalPapel,
} from '../../compartilhado/kit-phaser/papel.js'

const ACERTOS_POR_ALVO = 4
const META = 12
const RAIO_NORMAL = 40
const RAIO_SUPER = 85
const DURACAO_SUPER = 6000
const INTERVALO_BONUS = 14000
const TAMANHO_ROSTO = 56
const CHAO = 388 // altura do personagem, em pé no chão do cenário

// Rostos caem e a criança pega só a emoção pedida. Começa devagar, com poucos rostos, e vai
// acelerando conforme ela acerta. Errar não tira pontos. De vez em quando cai uma estrela
// dourada que dá um "super" por alguns segundos (a criança pega rostos num raio maior).
// Visual "papel recortado" (kit-phaser/papel.js): cenário do tema e rostos como adesivos.
export default class ChuvaEmocoes extends Phaser.Scene {
  constructor() {
    super('ChuvaEmocoes')
  }

  init() {
    this.ctx = this.registry.get('ctx')
  }

  preload() {
    carregarCenario(this, this.ctx.hiperfoco.id)
  }

  create() {
    const { hiperfoco, nivel } = this.ctx
    desenharCenario(this, hiperfoco.id)

    this.emocoes = EMOCOES.slice(0, [3, 5, 7][nivel - 1] ?? 3)
    this.acertos = 0
    this.combo = 0
    this.fim = false
    this.itens = []
    this.alvo = null
    this.superAte = 0
    this.proximoBonus = this.time.now + INTERVALO_BONUS

    this.hud = criarHudPapel(this, this.ctx)
    this.titulo = this.criarPedido()
    this.dica = rotulo(this, 400, 158, '', { tamanho: 20, cor: '#ffffff', fundo: PAPEL.destaque, py: 6, depth: 30 })
    this.aura = this.add
      .circle(400, CHAO, RAIO_SUPER, PAPEL.amarelo, 0.35)
      .setStrokeStyle(3, PAPEL.tinta, 0.6)
      .setVisible(false)
    this.jogador = adesivo(this, 400, CHAO, hiperfoco.arte, 84, { sombra: 4 }).setDepth(5)

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

  // Cartão do pedido: "Pegue: [rosto] Triste". O rosto é o mesmo adesivo que cai do céu.
  criarPedido() {
    const y = 96
    const tamanho = 50
    const folga = 12
    const fundo = cartao(this, 400, y, 10, 10, { raio: 20, sombra: 5 }).setDepth(30)
    const estilo = { fontFamily: FONTES.titulo, fontSize: '30px', color: PAPEL.tintaCss }
    const antes = this.add.text(0, y + 2, 'Pegue:', estilo).setOrigin(0, 0.5).setDepth(31)
    const depois = this.add.text(0, y + 2, '', estilo).setOrigin(0, 0.5).setDepth(31)
    let rosto = null
    return {
      definir: (emocao) => {
        if (!rosto) rosto = adesivo(this, 0, y, emocao.arte, tamanho, { parado: true }).setDepth(31)
        else rosto.trocar(emocao.arte, { parado: true })
        depois.setText(emocao.nome)
        const total = antes.width + tamanho + depois.width + folga * 2
        let x = 400 - total / 2
        antes.setX(x)
        x += antes.width + folga
        rosto.setX(x + tamanho / 2)
        x += tamanho + folga
        depois.setX(x)
        fundo.desenhar(total + 44, 68)
      },
    }
  }

  novoAlvo() {
    const outras = this.emocoes.filter((e) => e !== this.alvo)
    this.alvo = embaralhar(outras)[0]
    this.titulo.definir(this.alvo)
  }

  soltar() {
    const x = Phaser.Math.Between(40, 760)
    let emocao = Math.random() < 0.5 ? this.alvo : embaralhar(this.emocoes)[0]
    let bonus = false
    if (this.time.now > this.proximoBonus) {
      bonus = true
      emocao = null
      this.proximoBonus = this.time.now + INTERVALO_BONUS
    }
    const obj = adesivo(this, x, -40, bonus ? 'estrela_bonus' : emocao.arte, TAMANHO_ROSTO).setDepth(10)
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
      // os rostos balançam de leve enquanto caem, como papel
      if (this.ctx.efeitos) item.obj.setAngle(Math.sin(this.time.now / 300 + item.fase) * 8)
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
      this.mostrarDica('SUPER! Pegue tudo!')
      return
    }

    if (item.emocao === this.alvo) {
      this.acertos++
      this.combo++
      this.hud.acerto(this.jogador)
      estourar(this, this.jogador)
      if (this.combo >= 3) {
        confete(this, this.jogador.x, this.jogador.y - 20, { quantidade: 10 })
        this.mostrarDica(`Combo x${this.combo}!`)
      } else {
        this.mostrarDica('Isso!')
      }
      if (this.acertos >= META) return this.terminar()
      if (this.acertos % ACERTOS_POR_ALVO === 0) this.novoAlvo()
    } else {
      this.combo = 0
      this.hud.erro()
      balancar(this, this.jogador, 8)
      this.mostrarDica(`Quase! Procure: ${this.alvo.nome}`)
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
    telaFinalPapel(this, this.ctx, 'Muito bem!\nVocê reconheceu as emoções!')
  }
}
