import Phaser from 'phaser'
import { SITUACOES } from '../data/situacoes.js'
import { FONTE, RAIO, botao, caixaTexto, criarHud, telaFinal, embaralhar } from './ui.js'
import { sortear } from '../variedade.js'
import { sons } from '../audio.js'
import { acenar, balancar, confete, estourar } from './efeitos.js'

const RODADAS = 5
const VEL = 220
const PULO = -540
const PULO_DUPLO = -480
const MOLA = -800
const TOPO_CHAO = 390
const SECAO = 900 // largura de cada trecho da fase (buraco + inimigo + mola + amigo)
const ANIMAIS = ['🐶', '🐱', '🐰', '🐻', '🦊', '🐼']

// Plataformer de rolagem lateral: o personagem do hiperfoco anda e pula pela fase (pulo duplo,
// molas, lesmas para pisar, estrelas) e cada amigo encontrado traz uma situação social. O amigo
// ajudado passa a seguir o personagem e a pegar estrelas. Nada pune: cair no buraco ou esbarrar
// numa lesma só empurra de volta.
export default class PlataformaAmigo extends Phaser.Scene {
  constructor() {
    super('PlataformaAmigo')
  }

  init() {
    this.ctx = this.registry.get('ctx')
  }

  create() {
    const { hiperfoco, nivel } = this.ctx
    const situacoes = sortear(
      `plataforma:${this.ctx.aluno}`,
      SITUACOES.filter((s) => s.nivel <= nivel),
      RODADAS,
      (s) => s.texto,
    )
    const n = situacoes.length

    this.larguraMundo = 500 + n * SECAO + 400
    this.fim = false
    this.dialogo = null
    this.estrelas = 0
    this.solidos = []
    this.zonasEstrela = []
    this.zonasAmigo = []
    this.zonasMola = []
    this.corposInimigo = []
    this.inimigos = []
    this.seguidores = []
    this.rastro = []
    this.checkpoints = []
    this.ponto = { x: 260, y: 320 }
    this.toque = { esq: false, dir: false, pulo: false }
    this.esticar = 0 // "mola" do pulo: estica o personagem e volta
    this.pulosRestantes = 2
    this.seguravaPulo = false
    this.direcao = 1
    this.empurraoAte = 0
    this.imuneAte = 0

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
    this.physics.add.overlap(this.corpo, this.zonasMola, (_, z) => this.quicar(z))
    this.physics.add.overlap(this.corpo, this.corposInimigo, (_, c) => this.esbarrar(c.inimigo))
    this.physics.add.overlap(this.corpo, this.zonaBandeira, () => this.chegou())

    this.hud = criarHud(this, this.ctx)
    this.contador = caixaTexto(
      this,
      400,
      26,
      '⭐ 0',
      { fontSize: '20px', color: '#ffe9a8' },
      { px: 14, py: 5, alpha: 0.4, depth: 40, fixo: true },
    )
    this.criarControles()
    this.mostrarDica('← → andar · espaço pula (duas vezes!)\nPise nas lesmas 🐌 e ajude os amigos!')
  }

  // ---------- fase ----------

  construirFase(situacoes) {
    const n = situacoes.length
    const animais = embaralhar(ANIMAIS)
    let inicioChao = 0

    for (let i = 0; i < n; i++) {
      const s = 500 + i * SECAO // começo do buraco da seção
      this.chao(inicioChao, s)
      this.plataforma(s + 110, 320, 110)
      this.estrela(s + 110, 265)
      const base = s + 220 // onde o chão volta depois do buraco
      inicioChao = base

      this.checkpoints.push({ x: base + 40, y: 320 })
      for (let k = 0; k < 3; k++) this.estrela(base + 60 + k * 50, 340)
      this.inimigo(base + 150, base + 330)
      this.mola(base + 390)
      this.plataforma(base + 500, 235, 140) // plataforma alta, só alcançada pela mola
      for (let k = 0; k < 3; k++) this.estrela(base + 460 + k * 40, 195)
      this.criarAmigo(base + 580, animais[i % animais.length], situacoes[i])
    }

    this.chao(inicioChao, this.larguraMundo)
    const xBandeira = this.larguraMundo - 150
    const bandeira = this.add
      .text(xBandeira, TOPO_CHAO, '🏁', { fontFamily: FONTE, fontSize: '64px' })
      .setOrigin(0.5, 1)
    acenar(this, bandeira, 8, 450)
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
    const p = this.add.rectangle(x, y, largura, 20, 0xcaa472).setRounded(8).setStrokeStyle(2, 0x8a6a3a)
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
    confete(this, zona.x, zona.y, { quantidade: 5, espalhar: 45 })
    zona.texto.destroy()
    sons.estrela()
    this.estrelas++
    this.contador.setText(`⭐ ${this.estrelas}`)
  }

  // Mola: joga o personagem bem alto, para as plataformas e estrelas lá em cima.
  mola(x) {
    const base = this.add.rectangle(x, TOPO_CHAO - 7, 56, 14, 0xff8a3d).setRounded(6).setStrokeStyle(2, 0xffffff)
    this.add.text(x, TOPO_CHAO - 30, '⬆️', { fontFamily: FONTE, fontSize: '22px' }).setOrigin(0.5)
    const zona = this.add.rectangle(x, TOPO_CHAO - 16, 50, 24)
    this.physics.add.existing(zona, true)
    zona.visual = base
    this.zonasMola.push(zona)
  }

  quicar(zona) {
    if (this.corpo.body.velocity.y < -100) return // só quando está caindo ou parado
    this.corpo.body.setVelocityY(MOLA)
    this.esticar = 0.5
    this.pulosRestantes = 1
    sons.pulo()
    if (this.ctx.efeitos) {
      this.tweens.add({ targets: zona.visual, scaleY: 0.4, duration: 90, yoyo: true })
    }
  }

  // Lesma bobinha: anda de um lado para o outro. Pisar em cima vale uma estrela; esbarrar só
  // empurra o personagem de volta.
  inimigo(x1, x2) {
    const figura = this.add
      .text(x1, TOPO_CHAO, '🐌', { fontFamily: FONTE, fontSize: '40px' })
      .setOrigin(0.5, 1)
      .setDepth(4)
    const corpo = this.add.rectangle(x1, TOPO_CHAO - 16, 36, 32).setVisible(false)
    this.physics.add.existing(corpo)
    corpo.body.setAllowGravity(false)
    corpo.body.setImmovable(true)
    corpo.body.setVelocityX(50)
    const inimigo = { figura, corpo, x1, x2, vivo: true }
    corpo.inimigo = inimigo
    this.inimigos.push(inimigo)
    this.corposInimigo.push(corpo)
  }

  esbarrar(inimigo) {
    if (!inimigo.vivo || this.time.now < this.imuneAte) return
    const c = this.corpo.body
    const porCima = c.velocity.y > 60 && this.corpo.y < inimigo.corpo.y - 8

    if (porCima) {
      inimigo.vivo = false
      inimigo.corpo.body.enable = false
      sons.estrela()
      confete(this, inimigo.figura.x, inimigo.figura.y - 20, { quantidade: 8, espalhar: 60 })
      this.tweens.add({
        targets: inimigo.figura,
        scaleY: 0.2,
        alpha: 0,
        duration: this.ctx.efeitos ? 250 : 1,
        onComplete: () => inimigo.figura.destroy(),
      })
      c.setVelocityY(-380)
      this.esticar = 0.3
      this.pulosRestantes = 1
      this.estrelas++
      this.contador.setText(`⭐ ${this.estrelas}`)
    } else {
      const dir = this.corpo.x < inimigo.corpo.x ? -1 : 1
      c.setVelocity(dir * 260, -260)
      this.empurraoAte = this.time.now + 250
      this.imuneAte = this.time.now + 900
      sons.erro()
      balancar(this, this.jogador, 10)
    }
  }

  criarAmigo(x, animal, situacao) {
    const amigo = { x, situacao, resolvido: false }
    amigo.figura = this.add
      .text(x, TOPO_CHAO, animal, { fontFamily: FONTE, fontSize: '56px' })
      .setOrigin(0.5, 1)
      .setDepth(4)
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
      acenar(this, amigo.figura, 6, 400 + Math.random() * 300) // o amigo balança chamando
    }
    // zona alta: não dá para pular por cima do amigo sem encontrá-lo
    amigo.zona = this.add.rectangle(x, 200, 70, 500)
    this.physics.add.existing(amigo.zona, true)
    amigo.zona.amigo = amigo
    this.zonasAmigo.push(amigo.zona)
  }

  desenharNuvens() {
    for (let i = 0; i < 10; i++) {
      const nuvem = this.add
        .text(i * 330 + Phaser.Math.Between(0, 120), Phaser.Math.Between(60, 170), '☁️', {
          fontFamily: FONTE,
          fontSize: `${Phaser.Math.Between(40, 70)}px`,
        })
        .setAlpha(0.6)
        .setScrollFactor(0.3)
      // além da rolagem lenta (parallax), as nuvens vão à deriva
      if (this.ctx.efeitos) {
        this.tweens.add({
          targets: nuvem,
          x: nuvem.x + Phaser.Math.Between(50, 120),
          duration: Phaser.Math.Between(5000, 9000),
          yoyo: true,
          repeat: -1,
          ease: 'Sine.InOut',
        })
      }
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
        .setRounded(RAIO + 4)
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
    const dica = (this.dica = caixaTexto(
      this,
      400,
      100,
      texto,
      { fontSize: '20px', color: '#ffffff', align: 'center' },
      { px: 14, py: 8, alpha: 0.55, depth: 27, fixo: true },
    ))
    this.time.delayedCall(4500, () => dica.destroy())
  }

  update() {
    if (this.fim || this.dialogo) return
    const corpo = this.corpo.body
    const esq = this.setas.left.isDown || this.teclas.A.isDown || this.toque.esq
    const dir = this.setas.right.isDown || this.teclas.D.isDown || this.toque.dir
    const pulo = this.setas.up.isDown || this.setas.space.isDown || this.teclas.W.isDown || this.toque.pulo

    // depois de esbarrar numa lesma, o empurrão tem prioridade por um instante
    if (this.time.now > this.empurraoAte) {
      const vel = VEL * this.ctx.velocidade
      corpo.setVelocityX(dir === esq ? 0 : dir ? vel : -vel)
    }
    if (dir !== esq) this.direcao = dir ? 1 : -1

    // pulo duplo: segurar pula sempre que está no chão; no ar é preciso apertar de novo
    const noChao = corpo.blocked.down || corpo.touching.down
    if (noChao) this.pulosRestantes = 2
    const apertou = pulo && !this.seguravaPulo
    this.seguravaPulo = pulo
    if (this.pulosRestantes > 0 && (apertou || (pulo && noChao))) {
      corpo.setVelocityY(this.pulosRestantes === 2 ? PULO : PULO_DUPLO)
      this.pulosRestantes--
      this.esticar = 0.35
      sons.pulo()
      if (!noChao) confete(this, this.corpo.x, this.corpo.y + 24, { quantidade: 4, espalhar: 30 })
    }

    this.jogador.setPosition(this.corpo.x, this.corpo.y)
    if (dir !== esq) this.jogador.setFlipX(dir)

    // o personagem quica ao andar, respira parado e estica ao pular
    if (this.ctx.efeitos) {
      const andando = dir !== esq
      const onda = Math.sin(this.time.now / (andando ? 70 : 350)) * (andando ? 0.07 : 0.025)
      this.esticar *= 0.85
      const e = onda + this.esticar
      this.jogador.setScale(1 - e / 2, 1 + e)
    }

    this.moverInimigos()
    this.moverSeguidores()

    for (const cp of this.checkpoints) if (this.corpo.x > cp.x) this.ponto = cp
    if (this.corpo.y > 520) this.cair()
  }

  moverInimigos() {
    for (const e of this.inimigos) {
      if (!e.vivo) continue
      if (e.corpo.x <= e.x1) e.corpo.body.setVelocityX(50)
      if (e.corpo.x >= e.x2) e.corpo.body.setVelocityX(-50)
      e.figura.setPosition(e.corpo.x, TOPO_CHAO)
      e.figura.setFlipX(e.corpo.body.velocity.x > 0)
    }
  }

  // Os amigos ajudados vão atrás do personagem, repetindo o caminho dele, e pegam as
  // estrelas que passarem por perto.
  moverSeguidores() {
    this.rastro.push({ x: this.corpo.x, y: this.corpo.y })
    if (this.rastro.length > 300) this.rastro.shift()

    this.seguidores.forEach((amigo, k) => {
      const atraso = (k + 1) * 14
      const alvo = this.rastro[Math.max(0, this.rastro.length - 1 - atraso)]
      const f = amigo.figura
      f.x += (alvo.x - this.direcao * (k + 1) * 26 - f.x) * 0.25
      f.y += (alvo.y + 8 - f.y) * 0.25
      f.setFlipX(this.direcao > 0)

      for (const z of this.zonasEstrela) {
        if (z.body.enable && Math.hypot(z.x - f.x, z.y - f.y) < 50) this.pegarEstrela(z)
      }
    })
  }

  cair() {
    this.corpo.setPosition(this.ponto.x, this.ponto.y)
    this.corpo.body.setVelocity(0, 0)
    this.rastro = [{ x: this.ponto.x, y: this.ponto.y }]
    sons.erro()
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
    const balao = caixaTexto(
      this,
      400,
      100,
      '',
      { fontSize: '24px', color: '#ffffff', align: 'center', wordWrap: { width: 640 } },
      { px: 16, py: 10, alpha: 0.6, depth: 31, fixo: true },
    )
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
      balancar(this, this.jogador, 8)
      d.balao.setText(`Hmm... ${op.feedback}\nTente outra opção.`)
      d.botoes[i].desativar()
      return
    }
    d.travado = true
    d.botoes.forEach((b) => b.desativar())
    d.balao.setText(`Isso! ${op.feedback}`)
    const { figura } = d.amigo
    this.hud.acerto({ x: figura.x, y: figura.y - 40 })
    estourar(this, this.jogador, 1.25)
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
    this.seguir(amigo)
    this.physics.resume()
  }

  // O amigo ajudado vira companheiro: diminui um pouco e passa a andar atrás do personagem.
  seguir(amigo) {
    amigo.cara.destroy()
    this.tweens.killTweensOf(amigo.figura)
    amigo.figura.setAngle(0).setOrigin(0.5, 0.5).setScale(0.75).setDepth(4)
    amigo.figura.y -= 28
    this.seguidores.push(amigo)
    sons.estrela()
    confete(this, amigo.figura.x, amigo.figura.y, { quantidade: 8, espalhar: 60 })
  }

  chegou() {
    if (this.fim) return
    this.fim = true
    this.corpo.body.setVelocity(0, 0)
    telaFinal(this, this.ctx, 'Muito bem! 🎉\nVocê ajudou todos os amigos!')
  }
}
