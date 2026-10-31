import Phaser from 'phaser'
import { SITUACOES } from '../data/situacoes.js'
import { FONTE, botao, criarHud, telaFinal, embaralhar } from './ui.js'

const RODADAS = 5
const VEL = 220
const PULO = -540
const TOPO_CHAO = 390
const ANIMAIS = ['🐶', '🐱', '🐰', '🐻', '🦊', '🐼']

// Plataformer de rolagem lateral: o personagem do hiperfoco anda e pula pela fase, e cada
// amigo que encontra no caminho traz uma situação social. Cair no buraco só volta ao último
// ponto, sem punição.
export default class PlataformaAmigo extends Phaser.Scene {
  constructor() {
    super('PlataformaAmigo')
  }

  init() {
    this.ctx = this.registry.get('ctx')
  }

  create() {
    const { hiperfoco, nivel } = this.ctx
    const situacoes = embaralhar(SITUACOES.filter((s) => s.nivel <= nivel)).slice(0, RODADAS)
    const n = situacoes.length

    this.larguraMundo = 500 + n * 1000 + 400
    this.fim = false
    this.dialogo = null
    this.estrelas = 0
    this.solidos = []
    this.zonasEstrela = []
    this.zonasAmigo = []
    this.checkpoints = []
    this.ponto = { x: 260, y: 320 }
    this.toque = { esq: false, dir: false, pulo: false }

    this.cameras.main.setBackgroundColor(hiperfoco.cor)
    this.cameras.main.setBounds(0, 0, this.larguraMundo, 450)
    this.physics.world.setBounds(0, 0, this.larguraMundo, 900)
    this.physics.world.setBoundsCollision(true, true, true, false)

    this.desenharNuvens()
    this.construirFase(situacoes)

    // O corpo físico é um retângulo invisível; o emoji só o acompanha.
    this.corpo = this.add.rectangle(this.ponto.x, this.ponto.y, 40, 56).setVisible(false)
    this.physics.add.existing(this.corpo)
    this.corpo.body.setCollideWorldBounds(true)
    this.jogador = this.add
      .text(this.ponto.x, this.ponto.y, hiperfoco.personagem, { fontFamily: FONTE, fontSize: '56px' })
      .setOrigin(0.5)
      .setDepth(5)
    this.cameras.main.startFollow(this.corpo, true, 0.12, 0.12)

    this.physics.add.collider(this.corpo, this.solidos)
    this.physics.add.overlap(this.corpo, this.zonasEstrela, (_, z) => this.pegarEstrela(z))
    this.physics.add.overlap(this.corpo, this.zonasAmigo, (_, z) => this.encontrar(z.amigo))
    this.physics.add.overlap(this.corpo, this.zonaBandeira, () => this.chegou())

    this.hud = criarHud(this, this.ctx)
    this.contador = this.add
      .text(400, 8, '⭐ 0', { fontFamily: FONTE, fontSize: '20px', color: '#ffe9a8' })
      .setOrigin(0.5, 0)
      .setScrollFactor(0)
      .setDepth(40)
    this.criarControles()
    this.mostrarDica('← → andar · espaço ou ↑ pular\nEncontre os amigos pelo caminho!')
  }

  // ---------- fase ----------

  construirFase(situacoes) {
    const n = situacoes.length
    const animais = embaralhar(ANIMAIS)
    let inicioChao = 0

    for (let i = 0; i < n; i++) {
      const s = 500 + i * 1000 // começo do buraco da seção
      this.chao(inicioChao, s)
      this.plataforma(s + 110, 320, 110)
      this.estrela(s + 110, 265)
      inicioChao = s + 220

      this.checkpoints.push({ x: inicioChao + 40, y: 320 })
      for (let k = 0; k < 3; k++) this.estrela(inicioChao + 220 + k * 50, 340)
      this.criarAmigo(inicioChao + 520, animais[i % animais.length], situacoes[i])
    }

    this.chao(inicioChao, this.larguraMundo)
    const xBandeira = this.larguraMundo - 150
    this.add.text(xBandeira, TOPO_CHAO, '🏁', { fontFamily: FONTE, fontSize: '64px' }).setOrigin(0.5, 1)
    this.zonaBandeira = this.add.rectangle(xBandeira, 200, 60, 500)
    this.physics.add.existing(this.zonaBandeira, true)
  }

  chao(x1, x2) {
    const largura = x2 - x1
    const bloco = this.add.rectangle(x1 + largura / 2, TOPO_CHAO + 30, largura, 60, 0x6b4a2b)
    this.add.rectangle(x1 + largura / 2, TOPO_CHAO + 5, largura, 10, 0x4caf50)
    this.physics.add.existing(bloco, true)
    this.solidos.push(bloco)
  }

  plataforma(x, y, largura) {
    const p = this.add.rectangle(x, y, largura, 20, 0xcaa472).setStrokeStyle(2, 0x8a6a3a)
    this.physics.add.existing(p, true)
    this.solidos.push(p)
  }

  estrela(x, y) {
    const texto = this.add.text(x, y, '⭐', { fontFamily: FONTE, fontSize: '30px' }).setOrigin(0.5)
    const zona = this.add.rectangle(x, y, 36, 36)
    this.physics.add.existing(zona, true)
    zona.texto = texto
    this.zonasEstrela.push(zona)
  }

  pegarEstrela(zona) {
    if (!zona.body.enable) return
    zona.body.enable = false
    zona.texto.destroy()
    this.estrelas++
    this.contador.setText(`⭐ ${this.estrelas}`)
  }

  criarAmigo(x, animal, situacao) {
    const amigo = { x, situacao, resolvido: false }
    amigo.figura = this.add
      .text(x, TOPO_CHAO, animal, { fontFamily: FONTE, fontSize: '56px' })
      .setOrigin(0.5, 1)
    amigo.cara = this.add
      .text(x, TOPO_CHAO - 75, situacao.cara, { fontFamily: FONTE, fontSize: '34px' })
      .setOrigin(0.5, 1)
    if (this.ctx.efeitos) {
      this.tweens.add({
        targets: amigo.cara,
        y: amigo.cara.y - 8,
        duration: 600,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.InOut',
      })
    }
    // zona alta: não dá para pular por cima do amigo sem encontrá-lo
    amigo.zona = this.add.rectangle(x, 200, 70, 500)
    this.physics.add.existing(amigo.zona, true)
    amigo.zona.amigo = amigo
    this.zonasAmigo.push(amigo.zona)
  }

  desenharNuvens() {
    for (let i = 0; i < 10; i++) {
      this.add
        .text(i * 330 + Phaser.Math.Between(0, 120), Phaser.Math.Between(60, 170), '☁️', {
          fontFamily: FONTE,
          fontSize: `${Phaser.Math.Between(40, 70)}px`,
        })
        .setAlpha(0.6)
        .setScrollFactor(0.3)
    }
  }

  // ---------- controles ----------

  criarControles() {
    this.setas = this.input.keyboard.createCursorKeys()
    this.teclas = this.input.keyboard.addKeys('A,D,W')
    ;['ONE', 'TWO', 'THREE'].forEach((tecla, i) =>
      this.input.keyboard.on(`keydown-${tecla}`, () => this.escolherPorTecla(i)),
    )

    // botões de toque, para tablet e celular (aceita dois toques ao mesmo tempo)
    this.input.addPointer(2)
    const botaoToque = (x, texto, chave) => {
      const r = this.add
        .rectangle(x, 405, 90, 70, 0xffffff, 0.25)
        .setScrollFactor(0)
        .setDepth(25)
        .setInteractive()
      this.add
        .text(x, 405, texto, { fontFamily: FONTE, fontSize: '34px', color: '#ffffff' })
        .setOrigin(0.5)
        .setScrollFactor(0)
        .setDepth(26)
      r.on('pointerdown', () => (this.toque[chave] = true))
      for (const ev of ['pointerup', 'pointerout']) r.on(ev, () => (this.toque[chave] = false))
    }
    botaoToque(70, '◀', 'esq')
    botaoToque(170, '▶', 'dir')
    botaoToque(730, '⤒', 'pulo')
  }

  mostrarDica(texto) {
    this.dica?.destroy()
    const dica = (this.dica = this.add
      .text(400, 90, texto, {
        fontFamily: FONTE,
        fontSize: '20px',
        color: '#ffffff',
        align: 'center',
        backgroundColor: '#00000088',
        padding: { x: 12, y: 6 },
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(27))
    this.time.delayedCall(4500, () => dica.destroy())
  }

  update() {
    if (this.fim || this.dialogo) return
    const corpo = this.corpo.body
    const esq = this.setas.left.isDown || this.teclas.A.isDown || this.toque.esq
    const dir = this.setas.right.isDown || this.teclas.D.isDown || this.toque.dir
    const pulo = this.setas.up.isDown || this.setas.space.isDown || this.teclas.W.isDown || this.toque.pulo

    const vel = VEL * this.ctx.velocidade
    corpo.setVelocityX(dir === esq ? 0 : dir ? vel : -vel)
    if (pulo && (corpo.blocked.down || corpo.touching.down)) corpo.setVelocityY(PULO)

    this.jogador.setPosition(this.corpo.x, this.corpo.y)
    if (dir !== esq) this.jogador.setFlipX(dir)

    for (const cp of this.checkpoints) if (this.corpo.x > cp.x) this.ponto = cp
    if (this.corpo.y > 520) this.cair()
  }

  cair() {
    this.corpo.setPosition(this.ponto.x, this.ponto.y)
    this.corpo.body.setVelocity(0, 0)
    this.mostrarDica('Opa! Vamos de novo 💪')
  }

  // ---------- encontro com o amigo ----------

  encontrar(amigo) {
    if (amigo.resolvido || this.dialogo || this.fim) return
    this.physics.pause()
    this.dica?.destroy()
    const { personagemNome } = this.ctx.hiperfoco
    const opcoes = embaralhar(amigo.situacao.opcoes)

    const fundo = this.add.rectangle(400, 225, 800, 450, 0x000000, 0.5).setScrollFactor(0).setDepth(30)
    const balao = this.add
      .text(400, 78, '', {
        fontFamily: FONTE,
        fontSize: '24px',
        color: '#ffffff',
        align: 'center',
        backgroundColor: '#00000099',
        padding: { x: 14, y: 8 },
        wordWrap: { width: 640 },
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(31)
    balao.setText(`${amigo.situacao.cara} ${amigo.situacao.texto}\nO que ${personagemNome} faz?`)

    const botoes = opcoes.map((op, i) => {
      const b = botao(this, 400, 190 + i * 70, 600, 58, `${i + 1}. ${op.texto}`, () => this.escolher(i))
      b.r.setDepth(31)
      b.t.setDepth(32)
      return b
    })
    this.dialogo = { amigo, opcoes, botoes, fundo, balao, travado: false }
  }

  escolherPorTecla(i) {
    if (this.dialogo) this.escolher(i)
  }

  escolher(i) {
    const d = this.dialogo
    if (!d || d.travado || !d.botoes[i]?.r.input?.enabled) return
    const op = d.opcoes[i]

    if (!op.certo) {
      this.hud.erro()
      d.balao.setText(`Hmm... ${op.feedback}\nTente outra opção.`)
      d.botoes[i].desativar()
      return
    }
    d.travado = true
    d.botoes.forEach((b) => b.desativar())
    d.balao.setText(`Isso! ${op.feedback}`)
    this.hud.acerto()
    this.time.delayedCall(1800, () => this.fecharDialogo())
  }

  fecharDialogo() {
    const { amigo, botoes, fundo, balao } = this.dialogo
    botoes.forEach((b) => b.destruir())
    fundo.destroy()
    balao.destroy()
    this.dialogo = null

    amigo.resolvido = true
    amigo.zona.body.enable = false
    amigo.cara.setText('😊')
    if (this.ctx.efeitos) {
      this.tweens.add({ targets: amigo.figura, y: amigo.figura.y - 24, duration: 200, yoyo: true, repeat: 2 })
    }
    this.physics.resume()
  }

  chegou() {
    if (this.fim) return
    this.fim = true
    this.corpo.body.setVelocity(0, 0)
    telaFinal(this, this.ctx, 'Muito bem! 🎉\nVocê ajudou todos os amigos!')
  }
}
