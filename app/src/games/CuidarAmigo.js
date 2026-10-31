import Phaser from 'phaser'
import { CUIDADOS, FERRAMENTAS } from '../data/cuidados.js'
import { ANIMAIS_AMIGOS } from '../arte/index.js'
import { sortear } from '../variedade.js'
import { FONTE, RAIO, caixaTexto, criarHud, telaFinal, embaralhar } from './ui.js'
import { chave, imagem, trocarImagem } from './arte.js'
import { balancar, estourar, nuvens, respirar } from './efeitos.js'

const RODADAS = 5
const AGITADOS = ['medo', 'bravo', 'nervoso', 'frustrado'] // tremem
const CHORANDO = ['triste', 'machucado', 'sozinho', 'saudade', 'chateado'] // pingam lágrimas
const AMIGO = { x: 400, y: 255 }

// Jogo sem leitura: um amigo mostra um sentimento e a criança arrasta (ou toca) o que ajuda.
// Errar só faz o amigo balançar a cabeça; a criança tenta outro item.
export default class CuidarAmigo extends Phaser.Scene {
  constructor() {
    super('CuidarAmigo')
  }

  init() {
    this.ctx = this.registry.get('ctx')
  }

  create() {
    const { hiperfoco, nivel } = this.ctx
    this.cameras.main.setBackgroundColor(hiperfoco.cor)
    nuvens(this)

    this.rodadas = sortear(
      `cuidar:${this.ctx.aluno}`,
      CUIDADOS.filter((c) => c.nivel <= nivel),
      RODADAS,
      (c) => c.texto,
    )
    this.rodada = 0
    this.travado = false
    this.itens = []

    this.hud = criarHud(this, this.ctx)
    this.legenda = caixaTexto(
      this,
      400,
      84,
      '',
      { fontSize: '22px', color: '#ffffff', align: 'center', wordWrap: { width: 560 } },
      { px: 14, py: 6, alpha: 0.4 },
    )
    this.amigo = imagem(this, AMIGO.x, AMIGO.y + 10, ANIMAIS_AMIGOS[0], 150).setDepth(2)
    this.cara = imagem(this, AMIGO.x, 138, 'rosto_neutro', 66).setDepth(3)
    this.cena = imagem(this, 595, 285, 'cena_lua', 96, { parado: true })
    // o personagem do hiperfoco é quem cuida do amigo
    this.cuidador = imagem(this, 150, 285, hiperfoco.arte, 120)
    respirar(this, this.cuidador)

    this.input.on('drag', (_, obj, x, y) => {
      if (this.travado || !obj.item) return
      if (Math.hypot(x - obj.item.casa.x, y - obj.item.casa.y) > 8) obj.arrastou = true
      obj.setPosition(x, y).setDepth(20)
    })
    this.input.on('dragend', (_, obj) => {
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
    trocarImagem(this.amigo, embaralhar(ANIMAIS_AMIGOS)[0])
    this.amigo.setAngle(0)
    trocarImagem(this.cara, `rosto_${c.cara}`)
    trocarImagem(this.cena, `cena_${c.cena}`, { parado: true })
    this.legenda.setText(c.texto)

    // sentimento "vivo": os agitados tremem e os tristes choram
    this.emocao?.remove()
    this.emocao = this.time.addEvent({ delay: 1100, loop: true, callback: () => this.expressar() })

    this.itens.forEach((i) => i.destruir())
    const certos = embaralhar(c.certos).slice(0, Math.random() < 0.5 ? 1 : 2)
    const errados = embaralhar(c.errados).slice(0, 4 - certos.length)
    this.itens = embaralhar([...certos, ...errados]).map((id, i, todos) =>
      this.criarItem(id, 400 + (i - (todos.length - 1) / 2) * 140, 388),
    )
  }

  expressar() {
    if (!this.ctx.efeitos || this.travado) return
    const sentimento = this.situacao.cara
    if (AGITADOS.includes(sentimento)) balancar(this, this.amigo, 4)
    if (CHORANDO.includes(sentimento)) {
      const gota = this.add.image(this.cara.x + 16, this.cara.y + 12, chave('gota')).setDisplaySize(18, 18)
      this.tweens.add({
        targets: gota,
        y: gota.y + 80,
        alpha: 0,
        duration: 900,
        onComplete: () => gota.destroy(),
      })
    }
  }

  criarItem(id, x, y) {
    const f = FERRAMENTAS[id]
    const placa = this.add.rectangle(x, y, 120, 104, 0x000000, 0.3).setRounded(RAIO)
    const rotulo = this.add
      .text(x, y + 38, f.nome, { fontFamily: FONTE, fontSize: '15px', color: '#ffffff' })
      .setOrigin(0.5)
    const figura = imagem(this, x, y - 8, f.arte, 66, { parado: true }).setInteractive({ useHandCursor: true })
    this.input.setDraggable(figura)

    const item = {
      id,
      emoji: figura, // o desenho que a criança arrasta
      casa: { x, y: y - 8 },
      destruir() {
        placa.destroy()
        rotulo.destroy()
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
      onComplete: () => item.emoji.setDepth(0),
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
    trocarImagem(this.cara, 'rosto_feliz')
    this.legenda.setText(`Isso! ${FERRAMENTAS[item.id].nome} ajudou o amigo.`)
    item.emoji.setAlpha(0)
    this.emocao.remove()
    this.hud.acerto({ x: AMIGO.x, y: AMIGO.y - 30 })
    estourar(this, this.amigo, 1.25)
    estourar(this, this.cuidador, 1.2)
    this.time.delayedCall(1700, () => {
      this.rodada++
      if (this.rodada >= this.rodadas.length) {
        telaFinal(this, this.ctx, 'Muito bem!\nVocê cuidou de todos os amigos!')
      } else {
        this.novaRodada()
      }
    })
  }

  errou(item) {
    this.hud.erro()
    trocarImagem(this.cara, 'rosto_confuso')
    this.legenda.setText('Hmm, isso não ajudou. Tente outra coisa!')
    balancar(this, this.amigo, 6)
    this.voltar(item)
    this.time.delayedCall(this.duracao(1000), () => {
      trocarImagem(this.cara, `rosto_${this.situacao.cara}`)
      this.legenda.setText(this.situacao.texto)
      this.travado = false
    })
  }
}
