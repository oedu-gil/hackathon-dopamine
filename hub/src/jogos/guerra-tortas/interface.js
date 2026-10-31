import { FONTE, ligarHud } from '../../compartilhado/kit-phaser/ui.js'
import { imagem, trocarImagem } from '../../compartilhado/kit-phaser/arte.js'
import { sons } from '../../compartilhado/kit-phaser/audio.js'
import { chaveTorta } from './arte.js'
import dadosGatinho from './gatinho-dados.json'
import { AnimadorGatinho } from './animador.js'

const TINTA = '#4a3624'
const TINTA_SUAVE = '#6b5238'
const CREME = 0xfff6df
const VERDE = 0x45664e
// Madeira clara do piquenique, combinando com a cerca e a cesta do cenário.
const MADEIRA = 0xb4885a
const TABUA = 0xf2ddb3
const VEIO = 0xe6cb98
const PREGO = 0x8d6a45

function texto(s, x, y, valor, tamanho = 18, cor = TINTA) {
  return s.add.text(x, y, valor, { fontFamily: FONTE, fontSize: `${tamanho}px`, color: cor }).setOrigin(0.5)
}

// Placas de madeira. `moldura`: folha creme com borda de madeira (telas de início e fim);
// sem moldura: tábua clara com veios e pregos (HUD). O índice 1 é a área de toque.
function painel(s, x, y, w, h, { moldura = false } = {}) {
  const b = moldura ? 10 : 5
  const g = s.add.graphics()
  g.fillStyle(0x4e3a24, 0.22).fillRoundedRect(-w / 2, -h / 2 + 5, w, h, 18)
  g.fillStyle(MADEIRA).fillRoundedRect(-w / 2, -h / 2, w, h, 18)
  g.fillStyle(moldura ? CREME : TABUA).fillRoundedRect(-w / 2 + b, -h / 2 + b, w - 2 * b, h - 2 * b, 14)
  if (!moldura) {
    g.lineStyle(2, VEIO)
    for (const k of [1, 2]) {
      const ly = -h / 2 + b + ((h - 2 * b) * k) / 3
      g.lineBetween(-w / 2 + b + 12, ly, w / 2 - b - 12, ly)
    }
  }
  const px = w / 2 - (moldura ? 5 : b + 9), py = h / 2 - (moldura ? 5 : b + 9)
  g.fillStyle(PREGO)
  for (const [sx, sy] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) g.fillCircle(sx * px, sy * py, moldura ? 3 : 2.5)
  const area = s.add.rectangle(0, 0, w, h, 0xffffff, 0)
  return s.add.container(x, y, [g, area]).setDepth(40)
}

// Pratinho visto de cima. Vazio, mostra um contorno pontilhado onde a torta vai pousar.
function prato(s, x, y, w, vazio = true) {
  const g = s.add.graphics()
  g.fillStyle(0xfffdf8).fillEllipse(0, 0, w, w * 0.44)
  g.lineStyle(2, 0xcbbfa8).strokeEllipse(0, 0, w, w * 0.44)
  g.fillStyle(0xf3eee3).fillEllipse(0, 0, w * 0.64, w * 0.26)
  if (vazio) {
    g.fillStyle(0xc4b69c)
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2
      g.fillCircle(Math.cos(a) * w * 0.32, Math.sin(a) * w * 0.13, 1.6)
    }
  }
  g.setPosition(x, y)
  return g
}

export function pequenoSalto(s, objeto) {
  if (!s.ctx.efeitos) return
  s.tweens.killTweensOf(objeto)
  // Tamanhos relativos à textura; volta à escala original, sem acumular crescimento.
  const x = objeto.scaleX, y = objeto.scaleY
  s.tweens.add({ targets: objeto, scaleX: x * 1.08, scaleY: y * 1.08, duration: 110, yoyo: true, ease: 'Sine.Out' })
}

function botaoPiquenique(s, x, y, w, rotulo, acao) {
  const grupo = s.add.container(x, y).setDepth(55)
  const sombra = s.add.rectangle(0, 4, w, 60, 0x294532).setRounded(18)
  const fundo = s.add.rectangle(0, 0, w, 60, VERDE).setRounded(18).setStrokeStyle(2, 0xd2dfb9)
    .setInteractive({ useHandCursor: true }).setData('bloquearLancamento', true)
  const legenda = texto(s, 0, 0, rotulo, 23, '#fff9ec')
  grupo.add([sombra, fundo, legenda])
  fundo.on('pointerdown', () => {
    fundo.disableInteractive()
    acao()
  })
  return grupo
}

export function criarInterface(s, quantidade) {
  // XP: só a barra e, no fim dela, o próximo item da coleção como meta.
  const LARGURA_BARRA = 150
  const xp = painel(s, 128, 42, 232, 62)
  xp.getAt(1).setInteractive().setData('bloquearLancamento', true)
  const trilho = s.add.rectangle(-92, 0, LARGURA_BARRA, 14, 0xe0c99c).setOrigin(0, 0.5).setRounded(7)
    .setStrokeStyle(2, 0xc9a874)
  const barra = s.add.rectangle(-92, 0, 14, 14, 0x7a9a5c).setOrigin(0, 0.5).setRounded(7)
  const icone = imagem(s, 84, -1, 'estrela', 40, { parado: true })
  xp.add([trilho, barra, icone])
  const aviso = painel(s, 371, 112, 230, 60).setVisible(false)
  const avisoTexto = texto(s, 0, 0, '', 18)
  aviso.add(avisoTexto)
  let timerAviso
  const hud = ligarHud(s, s.ctx, {
    atualizar(e) {
      const pct = e.proximo ? (e.total - e.anterior) / (e.limite - e.anterior) : 1
      barra.setSize(Math.max(14, LARGURA_BARRA * Math.min(1, Math.max(0, pct))), 14)
      if (e.proximo) trocarImagem(icone, e.proximo.arte, { parado: true })
      return e
    },
    mostrarDesbloqueio(item) {
      avisoTexto.setText(`Novo: ${item.nome}`)
      avisoTexto.setFontSize(18)
      if (avisoTexto.width > 206) avisoTexto.setFontSize(14)
      avisoTexto.setWordWrapWidth(206)
      aviso.setVisible(true)
      pequenoSalto(s, aviso)
      sons.desbloqueio()
      timerAviso?.remove()
      timerAviso = s.time.delayedCall(2400, () => aviso.setVisible(false))
    },
  })

  // Progresso: um pratinho por torta que o guaxinim comeu; sem número na tela.
  const progresso = painel(s, 642, 42, 292, 62)
  progresso.getAt(1).setInteractive().setData('bloquearLancamento', true)
  const pratos = []
  const tortas = []
  for (let i = 0; i < quantidade; i++) {
    const x = -104 + i * 52
    const p = prato(s, x, 8, 46)
    progresso.add(p)
    pratos.push(p)
    const torta = s.add.image(x, -1, chaveTorta('torta')).setDisplaySize(40, 40).setAlpha(0)
    progresso.add(torta)
    tortas.push(torta)
  }

  // Prato da criança: o desenho e o texto indicam o estado, além da cor.
  const pratoCrianca = painel(s, 167, 400, 312, 76)
  const area = pratoCrianca.getAt(1).setInteractive({ useHandCursor: true })
  pratoCrianca.add(prato(s, 102, 14, 72))
  const tortaPrato = s.add.image(102, 0, chaveTorta('torta')).setDisplaySize(58, 58).setVisible(false)
  const tituloPrato = texto(s, -39, -10, 'Vamos pegar uma torta', 19)
  const dicaPrato = texto(s, -39, 16, 'O adulto defende primeiro', 14, TINTA_SUAVE)
  pratoCrianca.add([tortaPrato, tituloPrato, dicaPrato])

  // Botão do adulto: a bandeja fica inteira dentro da placa, à esquerda do texto.
  const defesa = painel(s, 632, 400, 306, 76)
  defesa.getAt(1).setInteractive({ useHandCursor: true }).setData('bloquearLancamento', true)
    .on('pointerdown', p => { s.comandosDefesa.add(p.id); s.defender() })
  const nomeDefesa = texto(s, 40, -10, 'Adulto defende', 19)
  const dicaDefesa = texto(s, 40, 16, 'Segure a bandeja ou Espaço', 14, TINTA_SUAVE)
  defesa.add([nomeDefesa, dicaDefesa])
  // Defesa à direita e ataque à esquerda, com as mesmas áreas de toque.
  const ESCUDO = { x: 528, y: 400 }
  s.escudo = s.add.circle(ESCUDO.x, ESCUDO.y, 33, 0x8d6a45).setStrokeStyle(3, 0xfff6df).setDepth(42)
    .setInteractive({ useHandCursor: true }).setData('bloquearLancamento', true)
  const metal = s.add.image(ESCUDO.x, ESCUDO.y - 1, chaveTorta('bandeja')).setDisplaySize(54, 54).setDepth(43)
  s.escudo.on('pointerdown', p => { s.comandosDefesa.add(p.id); s.defender() })
  let ultimoEstado
  let ultimaDefesa

  return {
    // Evita os confetes longos do HUD compartilhado; feedback breve nos elementos locais.
    acerto() { hud.acerto() },
    erro() { hud.erro() },
    progresso(n) {
      const i = n - 1
      // o prato cheio perde o pontilhado e a torta pousa nele com um saltinho
      const cheio = prato(s, pratos[i].x, pratos[i].y, 46, false)
      progresso.replace(pratos[i], cheio, true)
      pratos[i] = cheio
      tortas[i].setAlpha(1)
      pequenoSalto(s, tortas[i])
    },
    atualizar() {
      const estado = s.fim ? 'fim' : s.tortaDaCriancaVoando ? 'voo' : !s.temTorta ? 'vazio'
        : s.animador.estado !== 'idle' ? 'aguarde' : 'pronta'
      if (estado !== ultimoEstado) {
        const ganhou = s.temTorta && !tortaPrato.visible
        tortaPrato.setVisible(s.temTorta)
        if (ganhou) pequenoSalto(s, tortaPrato)
        const frases = {
          vazio: ['Vamos pegar uma torta', 'O adulto defende primeiro'],
          aguarde: ['Tortinha na mão!', 'Espere a bandeja baixar'],
          pronta: ['Sua vez de lançar!', 'Toque aqui ou no cenário'],
          voo: ['Lá vai a tortinha!', 'Vamos ver onde ela chega'],
          fim: ['Conseguimos juntos!', 'Hora de descansar'],
        }
        tituloPrato.setText(frases[estado][0])
        dicaPrato.setText(frases[estado][1])
        area.input.cursor = estado === 'pronta' ? 'pointer' : 'default'
        ultimoEstado = estado
      }
      const protegendo = s.animador.protegido
      const pressionado = s.comandosDefesa.size > 0 && !s.tortaDaCriancaVoando && s.jogando && !s.fim
      const estadoDefesa = `${pressionado}:${protegendo}`
      if (ultimaDefesa !== estadoDefesa) {
        s.tweens.killTweensOf(metal)
        const alvo = pressionado ? 50 : 54
        const my = ESCUDO.y + (pressionado ? 2 : -1)
        if (s.ctx.efeitos) s.tweens.add({ targets: metal, displayWidth: alvo, displayHeight: alvo, y: my, duration: 110 })
        else metal.setDisplaySize(alvo, alvo).setY(my)
        s.escudo.setFillStyle(protegendo ? VERDE : 0x8d6a45)
        nomeDefesa.setText(protegendo ? 'Bandeja erguida!' : 'Adulto defende')
        dicaDefesa.setText(protegendo ? 'Solte para a criança lançar' : 'Segure a bandeja ou Espaço')
        ultimaDefesa = estadoDefesa
      }
    },
  }
}

// Prévia isolada: não usa o animador, os eventos nem os projéteis da partida.
function demonstracao(s, folha, x, acao) {
  const ataque = acao === 'ataque'
  const cartao = s.add.rectangle(x, 20, 286, 210, 0xf1e5cb).setRounded(16)
    .setInteractive({ useHandCursor: s.ctx.efeitos }).setData('bloquearLancamento', true)
  // gatinho menor e mais alto, para os títulos não encostarem nos pés
  const gato = s.add.sprite(x - 26, -28, `gato_${acao}`, ataque ? 19 : 21)
    .setDisplaySize(150, 150).setName(`demo-${acao}`)
  const torta = s.add.image(x + (ataque ? 95 : 60), -38, chaveTorta('torta'))
    .setDisplaySize(32, 32).setName(`demo-torta-${acao}`)
  const convite = texto(s, x, 114, s.ctx.efeitos ? 'Toque para ver a ação' : 'Pose da ação', 13, TINTA_SUAVE)
  folha.add([cartao, gato, torta, convite])
  let ativo = false, tempo = 0, saiu = false, encerrado = false
  const animador = new AnimadorGatinho(dadosGatinho, evento => {
    if (evento !== 'release' || !ataque) return
    torta.setPosition(x + 4, -45).setVisible(true)
    s.tweens.add({ targets: torta, x: x + 111, y: -56, duration: 280, ease: 'Sine.Out', onComplete: () => torta.setVisible(false) })
  })
  const restaurar = () => {
    ativo = false
    s.tweens.killTweensOf(torta)
    gato.setTexture(`gato_${acao}`, ataque ? 19 : 21)
    torta.setPosition(x + (ataque ? 95 : 60), -38).setVisible(true)
    convite.setText(s.ctx.efeitos ? 'Toque para rever' : 'Pose da ação')
  }
  const atualizar = (_, delta) => {
    if (!ativo) return
    tempo += delta
    animador.atualizar(delta)
    gato.setTexture(`gato_${animador.arte}`, animador.quadro)
    if (!ataque && tempo >= 450 && !saiu) {
      saiu = true
      torta.setVisible(true).setPosition(x + 111, -45)
      s.tweens.add({ targets: torta, x: x + 30, duration: 280, onComplete: () => torta.setVisible(false) })
    }
    if (!ataque && tempo >= 1000) animador.defender(false)
    if (tempo >= (ataque ? 1300 : 1550)) restaurar()
  }
  cartao.on('pointerdown', () => {
    if (!s.ctx.efeitos || ativo) return
    ativo = true; tempo = 0; saiu = false
    torta.setVisible(false)
    convite.setText(ataque ? 'Lançando a tortinha…' : 'Segurando a bandeja…')
    animador.pressionado = false
    animador.iniciar('idle')
    if (ataque) animador.iniciar('ataque')
    else animador.defender(true)
  })
  const limpar = () => {
    if (encerrado) return
    encerrado = true
    s.events.off('update', atualizar)
    s.events.off('shutdown', limpar)
    s.tweens.killTweensOf(torta)
  }
  s.events.on('update', atualizar)
  s.events.once('shutdown', limpar)
  folha.once('destroy', limpar)
}

export function mostrarInicio(s, aoComecar) {
  const sombra = s.add.rectangle(400, 225, 800, 450, 0x263a30, 0.46).setDepth(50).setInteractive().setData('bloquearLancamento', true)
  const folha = painel(s, 400, 203, 682, 336, { moldura: true }).setDepth(51)
  folha.add(texto(s, 0, -139, 'Uma dupla no piquenique', 30))
  folha.add(texto(s, 0, -109, 'Peguem as tortinhas juntos!', 18, TINTA_SUAVE))
  const cartao = (x, acao, titulo, gesto) => {
    demonstracao(s, folha, x, acao)
    folha.add(texto(s, x, 70, titulo, 23))
    folha.add(texto(s, x, 95, gesto, 15, TINTA_SUAVE))
  }
  cartao(-158, 'ataque', 'Criança lança', 'Toque na tela')
  cartao(158, 'defesa', 'Adulto defende', 'Segure a bandeja ou Espaço')
  const botao = botaoPiquenique(s, 400, 395, 256, 'Vamos brincar!', () => {
    sombra.destroy(); folha.destroy(); botao.destroy()
    s.time.delayedCall(50, aoComecar)
  })
  pequenoSalto(s, folha)
}

export function mostrarFinal(s) {
  s.ctx.concluir?.()
  sons.fim()
  s.add.rectangle(400, 225, 800, 450, 0x263a30, 0.46).setDepth(50).setInteractive().setData('bloquearLancamento', true)
  const folha = painel(s, 400, 216, 612, 300, { moldura: true }).setDepth(51)
  folha.add(texto(s, 0, -105, 'Conseguimos juntos!', 32))
  for (let i = 0; i < 5; i++) folha.add(s.add.image(-112 + i * 56, -37, chaveTorta('torta')).setDisplaySize(58, 58))
  folha.add(texto(s, 0, 22, 'O guaxinim comeu e foi descansar.', 21))
  folha.add(texto(s, 0, 53, 'Boa parceria!', 18))
  botaoPiquenique(s, 260, 317, 236, 'Brincar de novo', () => s.scene.restart())
  botaoPiquenique(s, 540, 317, 236, 'Voltar ao menu', () => s.ctx.sair())
  pequenoSalto(s, folha)
}
