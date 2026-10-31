import Phaser from 'phaser'
import { CUIDADOS, FERRAMENTAS } from './cuidados.js'
import { ANIMAIS_AMIGOS } from '../../compartilhado/arte/index.js'
import { sortear } from '../../compartilhado/kit-phaser/variedade.js'
import { embaralhar } from '../../compartilhado/kit-phaser/ui.js'
import { chave } from '../../compartilhado/kit-phaser/arte.js'
import { balancar, estourar } from '../../compartilhado/kit-phaser/efeitos.js'
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

const RODADAS = 5
const AGITADOS = ['medo', 'bravo', 'nervoso', 'frustrado'] // tremem
const CHORANDO = ['triste', 'machucado', 'sozinho', 'saudade', 'chateado'] // pingam lágrimas
const AMIGO = { x: 400, y: 245 }
const BALAO = { x: 512, y: 168 } // balão com o sentimento, ao lado da cabeça do amigo
const BANDEJA = 344 // topo da faixa verde onde ficam os itens

// Jogo sem leitura: um amigo mostra um sentimento e a criança arrasta (ou toca) o que ajuda.
// Errar só faz o amigo balançar a cabeça; a criança tenta outro item.
// Visual "papel recortado" (kit-phaser/papel.js): os itens ficam numa bandeja, como as peças
// do quebra-cabeça, e o sentimento aparece num balão.
export default class CuidarAmigo extends Phaser.Scene {
  constructor() {
    super('CuidarAmigo')
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

    this.rodadas = sortear(
      `cuidar:${this.ctx.aluno}`,
      CUIDADOS.filter((c) => c.nivel <= nivel),
      RODADAS,
      (c) => c.texto,
    )
    this.rodada = 0
    this.travado = false
    this.itens = []

    this.hud = criarHudPapel(this, this.ctx)
    this.legenda = rotulo(this, 400, 100, '', { tamanho: 22, largura: 540, depth: 30 })

    // bandeja verde no chão, com contorno em cima, como a do quebra-cabeça
    this.add.rectangle(0, BANDEJA, 800, 450 - BANDEJA, PAPEL.bandeja).setOrigin(0).setDepth(1)
    this.add.rectangle(0, BANDEJA - 1.5, 800, 3, PAPEL.tinta).setOrigin(0).setDepth(1)

    // anel que mostra onde soltar o item enquanto a criança arrasta
    this.anel = this.add
      .circle(AMIGO.x, AMIGO.y, 100, PAPEL.destaque, 0.12)
      .setStrokeStyle(4, PAPEL.destaque, 0.8)
      .setDepth(4)
      .setVisible(false)

    this.amigo = adesivo(this, AMIGO.x, AMIGO.y, ANIMAIS_AMIGOS[0], 150, { sombra: 5 }).setDepth(5)

    // balão de pensamento com o rosto do sentimento
    const balao = this.add.graphics({ x: BALAO.x, y: BALAO.y }).setDepth(6)
    for (const [x, y, r] of [
      [0, 0, 44],
      [-46, 40, 9],
      [-62, 54, 6],
    ]) {
      balao.fillStyle(PAPEL.tinta, 1).fillCircle(x + 4, y + 4, r)
      balao.fillStyle(PAPEL.papel, 1).fillCircle(x, y, r)
      balao.lineStyle(3, PAPEL.tinta, 1).strokeCircle(x, y, r)
    }
    this.cara = adesivo(this, BALAO.x, BALAO.y, 'rosto_neutro', 62, { sombra: 0 }).setDepth(7)

    // o que aconteceu com o amigo, numa foto de papel inclinada
    const foto = this.add.container(660, 236).setAngle(4).setDepth(3)
    foto.add(cartao(this, 0, 0, 124, 124, { raio: 12, sombra: 5 }))
    this.cena = adesivo(this, 0, 0, 'cena_lua', 100, { parado: true, sombra: 0, borda: 0 })
    foto.add(this.cena)

    // o personagem do hiperfoco é quem cuida do amigo
    this.cuidador = adesivo(this, 150, 262, hiperfoco.arte, 124, { sombra: 5 }).setDepth(5)

    this.input.on('dragstart', (_, obj) => {
      if (!this.travado && obj.item) this.anel.setVisible(true)
    })
    this.input.on('drag', (_, obj, x, y) => {
      if (this.travado || !obj.item) return
      if (Math.hypot(x - obj.item.casa.x, y - obj.item.casa.y) > 8) obj.arrastou = true
      obj.setPosition(x, y).setDepth(20)
    })
    this.input.on('dragend', (_, obj) => {
      this.anel.setVisible(false)
      if (!obj.item || !obj.arrastou || this.travado) return
      const perto = Math.hypot(obj.x - AMIGO.x, obj.y - AMIGO.y) < 130
      if (perto) this.usar(obj.item)
      else this.voltar(obj.item)
    })

    this.novaRodada()
  }

  duracao(ms) {
    return this.ctx.efeitos ? ms : 1
  }

  novaRodada() {
    const c = this.rodadas[this.rodada]
    this.situacao = c
    this.travado = false
    this.amigo.trocar(embaralhar(ANIMAIS_AMIGOS)[0])
    this.amigo.setAngle(0)
    this.cara.trocar(`rosto_${c.cara}`)
    this.cena.trocar(`cena_${c.cena}`, { parado: true })
    this.legenda.setText(c.texto)

    // sentimento "vivo": os agitados tremem e os tristes choram
    this.emocao?.remove()
    this.emocao = this.time.addEvent({ delay: 1100, loop: true, callback: () => this.expressar() })

    this.itens.forEach((i) => i.destruir())
    const certos = embaralhar(c.certos).slice(0, Math.random() < 0.5 ? 1 : 2)
    const errados = embaralhar(c.errados).slice(0, 4 - certos.length)
    this.itens = embaralhar([...certos, ...errados]).map((id, i, todos) =>
      this.criarItem(id, 400 + (i - (todos.length - 1) / 2) * 150, 398, i),
    )
  }

  expressar() {
    if (!this.ctx.efeitos || this.travado) return
    const sentimento = this.situacao.cara
    if (AGITADOS.includes(sentimento)) balancar(this, this.amigo, 4)
    if (CHORANDO.includes(sentimento)) {
      const gota = this.add
        .image(this.cara.x + 16, this.cara.y + 12, chave('gota'))
        .setDisplaySize(18, 18)
        .setDepth(8)
      this.tweens.add({
        targets: gota,
        y: gota.y + 80,
        alpha: 0,
        duration: 900,
        onComplete: () => gota.destroy(),
      })
    }
  }

  // Cada item é um cartão de papel na bandeja, levemente inclinado (só enfeite), com o
  // adesivo que a criança arrasta e o nome embaixo.
  criarItem(id, x, y, indice) {
    const f = FERRAMENTAS[id]
    const inclinacao = this.ctx.efeitos ? [-3, 2, -1.5, 2.5][indice % 4] : 0
    const placa = cartao(this, x, y, 124, 96, { raio: 16, sombra: 4 }).setAngle(inclinacao).setDepth(2)
    const nome = this.add
      .text(x, y + 32, f.nome, { fontFamily: FONTES.negrito, fontSize: '16px', color: PAPEL.tintaCss })
      .setOrigin(0.5)
      .setAngle(inclinacao)
      .setDepth(3)
    const figura = adesivo(this, x, y - 10, f.arte, 60, { parado: true, sombra: 2 }).setDepth(4)
    figura.setInteractive({ useHandCursor: true })
    this.input.setDraggable(figura)

    const item = {
      id,
      emoji: figura, // o desenho que a criança arrasta
      casa: { x, y: y - 10 },
      destruir() {
        placa.destroy()
        nome.destroy()
        figura.destroy()
      },
    }
    figura.item = item
    figura.on('pointerdown', () => (figura.arrastou = false))
    // toque simples (sem arrastar): o item vai sozinho até o amigo
    figura.on('pointerup', () => {
      if (!figura.arrastou && !this.travado) this.usar(item)
    })
    return item
  }

  voltar(item) {
    this.tweens.add({
      targets: item.emoji,
      x: item.casa.x,
      y: item.casa.y,
      duration: this.duracao(250),
      ease: 'Back.Out',
      onComplete: () => item.emoji.setDepth(4),
    })
  }

  usar(item) {
    if (this.travado) return
    this.travado = true
    item.emoji.setDepth(20)
    this.tweens.add({
      targets: item.emoji,
      x: AMIGO.x,
      y: AMIGO.y,
      duration: this.duracao(260),
      ease: 'Quad.Out',
      onComplete: () => (this.situacao.certos.includes(item.id) ? this.acertou(item) : this.errou(item)),
    })
  }

  acertou(item) {
    this.cara.trocar('rosto_feliz')
    this.legenda.setText(`Isso! ${FERRAMENTAS[item.id].nome} ajudou o amigo.`)
    item.emoji.setAlpha(0)
    this.emocao.remove()
    this.hud.acerto({ x: AMIGO.x, y: AMIGO.y - 30 })
    estourar(this, this.amigo, 1.25)
    estourar(this, this.cuidador, 1.2)
    this.time.delayedCall(1700, () => {
      this.rodada++
      if (this.rodada >= this.rodadas.length) {
        telaFinalPapel(this, this.ctx, 'Muito bem!\nVocê cuidou de todos os amigos!')
      } else {
        this.novaRodada()
      }
    })
  }

  errou(item) {
    this.hud.erro()
    this.cara.trocar('rosto_confuso')
    this.legenda.setText('Hmm, isso não ajudou. Tente outra coisa!')
    balancar(this, this.amigo, 6)
    this.voltar(item)
    this.time.delayedCall(this.duracao(1000), () => {
      this.cara.trocar(`rosto_${this.situacao.cara}`)
      this.legenda.setText(this.situacao.texto)
      this.travado = false
    })
  }
}
