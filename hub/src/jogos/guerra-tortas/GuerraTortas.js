import Phaser from 'phaser'
import dadosGatinho from './gatinho-dados.json'
import { AnimadorGatinho } from './animador.js'
import { cenario, gatinho } from './assets.js'
import { RAIO, caixaTexto } from '../../compartilhado/kit-phaser/ui.js'
import { sons } from '../../compartilhado/kit-phaser/audio.js'
import { pequenoSalto as estourar, criarInterface, mostrarInicio, mostrarFinal } from './interface.js'
import { carregarArteTortas, chaveTorta, criarAnimacoesTortas, desenhar } from './arte.js'
import { AVISO, TORTAS_PARA_ENCHER, configDoNivel, deveAbrirGuarda, duracaoGuarda, proximaAcao } from './regras.js'

const GATO = { x: 190, y: 290 }
const GUAXINIM = { x: 610, y: 285 }
const CHAO = 372

// Jogo cooperativo: o adulto defende com a bandeja do gatinho (botão de escudo ou espaço) e
// a criança lança a torta (toque ou clique em qualquer outro lugar). Cada defesa dá uma torta.
// O guaxinim avisa com um balão antes de lançar e antes de abrir a guarda. Errar não tira
// nada: o gatinho leva um respingo de chantili, ou a torta cai da bandeja do guaxinim.
export default class GuerraTortas extends Phaser.Scene {
  constructor() {
    super('GuerraTortas')
  }

  init() {
    this.ctx = this.registry.get('ctx')
    this.cfg = configDoNivel(this.ctx.nivel)
  }

  preload() {
    carregarArteTortas(this)
    this.load.image('gt_cenario_piquenique', cenario)
    for (const nome of Object.keys(dadosGatinho)) {
      this.load.spritesheet(`gato_${nome}`, gatinho[nome], { frameWidth: 384, frameHeight: 384 })
    }
  }

  create() {
    this.ctx.efeitos = this.ctx.efeitos && !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    criarAnimacoesTortas(this)
    this.input.addPointer(2) // adulto e criança tocam ao mesmo tempo no tablet
    this.criarCenario()

    this.jogando = false
    this.fim = false
    this.temTorta = false
    this.esperandoDesde = null
    this.bandejaErguida = false
    this.guardaErguida = false
    this.tortaDaCriancaVoando = false
    this.ultimoLancamento = -Infinity
    this.comidas = 0
    this.estadoGuaxinim = 'aberto'
    this.timerGuaxinim = null

    this.criarPersonagens()
    this.comandosDefesa = new Set()
    this.hud = criarInterface(this, TORTAS_PARA_ENCHER)

    this.input.on('pointerdown', (_, sobre) => {
      if (!sobre.some(o => o.getData('bloquearLancamento'))) this.lancar()
    })
    this.input.keyboard?.addCapture('SPACE')
    const pressionar = (e) => { if (!e.repeat) { this.comandosDefesa.add('space'); this.defender() } }
    const soltar = () => { this.comandosDefesa.delete('space'); this.soltarDefesa() }
    this.input.keyboard?.on('keydown-SPACE', pressionar)
    this.input.keyboard?.on('keyup-SPACE', soltar)
    const soltarPonteiro = (p) => { this.comandosDefesa.delete(p.id); this.soltarDefesa() }
    this.input.on('pointerup', soltarPonteiro)
    this.input.on('pointerupoutside', soltarPonteiro)
    this.aoPerderFoco = () => { this.comandosDefesa.clear(); this.soltarDefesa() }
    this.game.events.on('blur', this.aoPerderFoco)
    window.addEventListener('pointercancel', this.aoPerderFoco)
    this.events.once('shutdown', () => {
      this.game.events.off('blur', this.aoPerderFoco)
      window.removeEventListener('pointercancel', this.aoPerderFoco)
      this.input.keyboard?.off('keydown-SPACE', pressionar)
      this.input.keyboard?.off('keyup-SPACE', soltar)
    })

    mostrarInicio(this, () => this.iniciar())
  }

  duracao(ms) {
    return this.ctx.efeitos ? ms : 1
  }

  // ---------- montagem ----------

  criarCenario() {
    // A arte desta brincadeira é fixa; o hiperfoco continua ligado ao XP no HUD.
    this.cameras.main.setBackgroundColor('#dce5ce')
    if (this.textures.exists('gt_cenario_piquenique')) {
      this.add.image(400, 225, 'gt_cenario_piquenique').setDisplaySize(800, 450).setDepth(-10)
    }
    // Sombras de contato estáticas, sem movimento decorativo no cenário.
    this.add.ellipse(GATO.x, CHAO - 9, 112, 18, 0x40513c, 0.16).setDepth(-1)
    this.add.ellipse(GUAXINIM.x, GUAXINIM.y + 72, 116, 18, 0x40513c, 0.16).setDepth(-1)
  }

  criarPersonagens() {
    this.animador = new AnimadorGatinho(dadosGatinho, (nome) => this.eventoGatinho(nome))
    // Célula e pivô comuns: não recentralizar a silhueta de cada desenho.
    this.gato = this.add.sprite(GATO.x, CHAO - 100, 'gato_idle', 0).setDisplaySize(220, 220).setDepth(2)
    this.movimentoGato = this.ctx.efeitos && !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    this.guaxinim = this.add.sprite(GUAXINIM.x, GUAXINIM.y, chaveTorta('guaxinim')).setDisplaySize(170, 170).setDepth(2)
    desenhar(this.guaxinim, 'guaxinim', this.ctx.efeitos)
    this.escalaGuaxinim = this.guaxinim.scaleX

    this.bandejaGato = this.add.image(0, 0, chaveTorta('bandeja')).setDepth(4)
    this.bandejaGuaxinim = this.add.image(0, 0, chaveTorta('bandeja')).setDepth(4)
    this.posicionarBandeja(this.bandejaGato, GATO, 1, false, false)
    this.bandejaGato.setVisible(false) // já desenhada na mão esquerda em todos os quadros
    this.posicionarBandeja(this.bandejaGuaxinim, GUAXINIM, -1, false, false)

    // a torta que a criança tem para lançar fica na mão do gatinho
    this.tortaNaMao = this.add.image(GATO.x - 62, GATO.y + 30, chaveTorta('torta')).setDisplaySize(64, 64).setDepth(5).setVisible(false)

    // balão de aviso acima do guaxinim
    const fundo = this.add.rectangle(0, 0, 84, 70, 0xffffff, 0.95).setRounded(RAIO)
    const ponta = this.add.triangle(0, 42, -10, 0, 10, 0, 0, 14, 0xffffff, 0.95)
    this.iconeBalao = this.add.image(0, 0, chaveTorta('torta')).setDisplaySize(54, 54)
    this.balao = this.add.container(GUAXINIM.x, GUAXINIM.y - 140, [fundo, ponta, this.iconeBalao]).setDepth(6).setVisible(false)
  }

  // `lado` 1 = bandeja à direita do personagem (gatinho), -1 = à esquerda (guaxinim).
  // Baixa, a bandeja fica deitada ao lado do corpo; erguida, fica de frente, como escudo.
  posicionarBandeja(bandeja, dono, lado, erguida, animar = true) {
    const alvo = erguida
      ? { x: dono.x + lado * 78, y: dono.y - 8, displayWidth: 104, displayHeight: 104 }
      : { x: dono.x + lado * 66, y: dono.y + 58, displayWidth: 70, displayHeight: 22 }
    this.tweens.killTweensOf(bandeja)
    if (!animar || !this.ctx.efeitos) {
      bandeja.setPosition(alvo.x, alvo.y).setDisplaySize(alvo.displayWidth, alvo.displayHeight)
      return
    }
    this.tweens.add({ targets: bandeja, ...alvo, duration: 140, ease: 'Quad.Out' })
  }

  iniciar() {
    this.jogando = true
    // a primeira ação é sempre um lançamento, para a dupla ganhar a primeira torta logo
    this.agendar(1200, () => this.avisarLancamento())
  }

  agendar(ms, acao) {
    this.timerGuaxinim?.remove()
    this.timerGuaxinim = this.time.delayedCall(ms, () => {
      if (!this.fim) acao()
    })
  }

  // ---------- guaxinim ----------

  decidir() {
    const acao = proximaAcao({
      agora: this.time.now,
      ultimoLancamento: this.ultimoLancamento,
      esperandoDesde: this.esperandoDesde,
      config: this.cfg,
    })
    if (acao === 'lancar') this.avisarLancamento()
    else if (acao === 'defender') this.erguerGuarda()
    else this.ficarAberto()
  }

  ficarAberto() {
    this.estadoGuaxinim = 'aberto'
    this.agendar(this.cfg.aberto, () => this.decidir())
  }

  mostrarBalao(icone) {
    this.iconeBalao.setTexture(chaveTorta(icone)).setDisplaySize(54, 54)
    this.balao.setVisible(true)
    // leve balanço do guaxinim junto com o balão; sem piscar
    if (this.ctx.efeitos) {
      this.tweens.add({ targets: this.guaxinim, angle: { from: -5, to: 5 }, duration: 150, yoyo: true, repeat: 1, onComplete: () => this.guaxinim.setAngle(0) })
    }
  }

  avisarLancamento() {
    this.estadoGuaxinim = 'avisando'
    this.mostrarBalao('torta')
    this.agendar(AVISO, () => this.lancarDoGuaxinim())
  }

  lancarDoGuaxinim() {
    this.balao.setVisible(false)
    this.ultimoLancamento = this.time.now
    const torta = this.add.image(GUAXINIM.x - 60, GUAXINIM.y - 10, chaveTorta('torta')).setDisplaySize(70, 70).setDepth(7)
    this.voar(torta, GATO.x + 78, GATO.y - 8, this.cfg.voo, () => this.tortaChegouNoGato(torta))
    // logo depois de lançar, o guaxinim fica desprotegido
    this.ficarAberto()
  }

  erguerGuarda() {
    this.estadoGuaxinim = 'guarda'
    this.guardaErguida = true
    this.posicionarBandeja(this.bandejaGuaxinim, GUAXINIM, -1, true)
    this.agendar(duracaoGuarda(), () => this.avisarAbertura())
  }

  avisarAbertura() {
    this.estadoGuaxinim = 'abrindo'
    this.mostrarBalao('bandeja_baixo')
    this.agendar(AVISO, () => {
      this.balao.setVisible(false)
      this.guardaErguida = false
      this.posicionarBandeja(this.bandejaGuaxinim, GUAXINIM, -1, false)
      this.ficarAberto()
    })
  }

  // ---------- dupla ----------

  // Torta em arco; a chegada decide o que acontece.
  voar(torta, x, y, ms, aoChegar) {
    const inicio = { x: torta.x, y: torta.y }
    const caminho = { t: 0 }
    this.tweens.add({
      targets: caminho,
      t: 1,
      duration: ms,
      onUpdate: () => {
        const t = caminho.t
        torta.setPosition(Phaser.Math.Linear(inicio.x, x, t), Phaser.Math.Linear(inicio.y, y, t) - Math.sin(t * Math.PI) * 70)
        if (this.ctx.efeitos) torta.setAngle(t * 360 * Math.sign(x - inicio.x))
      },
      onComplete: () => (this.fim ? torta.destroy() : aoChegar()),
    })
  }

  defender() {
    // defender e lançar não acontecem juntos
    if (!this.jogando || this.fim || this.tortaDaCriancaVoando) return
    this.animador.defender(true)
    this.respingo?.destroy()
    this.respingo = null
  }

  soltarDefesa() {
    if (!this.comandosDefesa.size) this.animador.defender(false)
  }

  update(_, delta) {
    if (!this.animador) return
    this.hud?.atualizar()
    if (this.fim) return
    if (this.estadoGuaxinim === 'guarda' && deveAbrirGuarda({ agora: this.time.now, esperandoDesde: this.esperandoDesde, config: this.cfg })) this.avisarAbertura()
    this.animador.atualizar(delta)
    this.bandejaErguida = this.animador.protegido
    let quadro = this.animador.quadro
    if (!this.movimentoGato) {
      const a = this.animador.arte
      quadro = a === 'defesa' ? (this.animador.protegido ? 21 : 0)
        : a === 'ataque' ? (quadro < 19 ? 0 : 19) : a === 'reacao' ? 28 : 0
    }
    this.gato.setTexture(`gato_${this.animador.arte}`, quadro)
    if (this.tortaNaMao) this.tortaNaMao.setVisible(this.temTorta && this.animador.estado === 'idle')
  }

  eventoGatinho(nome) {
    if (nome === 'release' && this.tortaDaCriancaVoando && !this.fim) {
      const torta = this.add.image(GATO.x + 45, GATO.y - 35, chaveTorta('torta')).setDisplaySize(64, 64).setDepth(7)
      this.voar(torta, GUAXINIM.x - 20, GUAXINIM.y - 20, 500, () => this.tortaChegouNoGuaxinim(torta))
    }
    if (nome === 'wipe_start' && this.respingo && this.movimentoGato) {
      this.tweens.add({ targets: this.respingo, alpha: 0, duration: 1083 })
    }
    if (nome === 'wipe_finish') {
      this.respingo?.destroy()
      this.respingo = null
    }
  }

  tortaChegouNoGato(torta) {
    if (this.animador.protegido) {
      // defesa certa: a torta fica para a criança lançar
      this.hud.acerto({ x: GATO.x + 78, y: GATO.y - 8 })
      torta.destroy()
      if (!this.temTorta) {
        this.temTorta = true
        this.esperandoDesde = this.time.now
        this.tortaNaMao.setVisible(true)
        estourar(this, this.tortaNaMao, 1.25)
      }
      return
    }
    // sem defesa: só um respingo de chantili, e o gatinho ri
    this.hud.erro()
    torta.destroy()
    this.respingo?.destroy()
    this.respingo = this.add.image(GATO.x, GATO.y, chaveTorta('chantili')).setDisplaySize(58, 58).setDepth(6)
    // Não cancelar um lançamento já aceito: ele ainda precisa soltar a torta.
    if (this.animador.estado !== 'ataque') this.animador.iniciar('reacao')
    else {
      const atual = this.respingo
      this.time.delayedCall(1000, () => { atual.destroy(); if (this.respingo === atual) this.respingo = null })
    }
  }

  lancar() {
    if (!this.jogando || this.fim || !this.temTorta || this.animador.ocupado || this.tortaDaCriancaVoando) return
    this.temTorta = false
    this.esperandoDesde = null
    this.tortaDaCriancaVoando = true
    this.tortaNaMao.setVisible(false)
    this.animador.iniciar('ataque')
  }

  tortaChegouNoGuaxinim(torta) {
    this.tortaDaCriancaVoando = false
    if (this.guardaErguida) {
      // bateu na bandeja: cai no chão e o guaxinim faz careta
      this.hud.erro()
      const idCareta = this.comidas >= 3 ? 'guaxinim_cheio_careta' : 'guaxinim_careta'
      desenhar(this.guaxinim, idCareta, this.ctx.efeitos)
      this.tweens.add({
        targets: torta,
        x: torta.x - 50,
        y: CHAO + 20,
        duration: this.duracao(450),
        ease: 'Quad.In',
        onComplete: () => this.tweens.add({ targets: torta, alpha: 0, delay: 500, duration: 300, onComplete: () => torta.destroy() }),
      })
      this.time.delayedCall(900, () => !this.fim && desenhar(this.guaxinim, this.desenhoDoGuaxinim(), this.ctx.efeitos))
      return
    }
    // acertou: o guaxinim come a torta e a barriga enche um pouco
    torta.destroy()
    this.hud.acerto({ x: GUAXINIM.x, y: GUAXINIM.y - 40 })
    this.comidas++
    this.hud.progresso(this.comidas)
    if (this.comidas >= TORTAS_PARA_ENCHER) return this.terminar()
    desenhar(this.guaxinim, this.desenhoDoGuaxinim(), this.ctx.efeitos)
    estourar(this, this.guaxinim, 1.12)
  }

  desenhoDoGuaxinim() {
    return this.comidas >= 3 ? 'guaxinim_cheio' : 'guaxinim'
  }

  // Final: o guaxinim fica cheio, deita e dorme; os dois comemoram.
  terminar() {
    this.fim = true
    this.timerGuaxinim?.remove()
    this.balao.setVisible(false)
    this.guardaErguida = false
    this.posicionarBandeja(this.bandejaGuaxinim, GUAXINIM, -1, false)
    this.bandejaGuaxinim.setVisible(false)
    desenhar(this.guaxinim, 'guaxinim_dormindo', false)
    const deitado = { angle: -80, y: CHAO - 40 }
    if (this.ctx.efeitos) this.tweens.add({ targets: this.guaxinim, ...deitado, duration: 300, ease: 'Quad.Out' })
    else this.guaxinim.setAngle(deitado.angle).setY(deitado.y)
    caixaTexto(this, GUAXINIM.x + 40, GUAXINIM.y - 110, 'Zzz', { fontSize: '30px', color: '#ffffff' }, { px: 12, py: 4, alpha: 0.35 })
    estourar(this, this.gato, 1.25)
    sons.estrela()
    this.time.delayedCall(2200, () => mostrarFinal(this))
  }
}
