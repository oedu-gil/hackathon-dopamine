import { FONTE, ligarHud } from '../../compartilhado/kit-phaser/ui.js'
import { imagem, trocarImagem } from '../../compartilhado/kit-phaser/arte.js'
import { sons } from '../../compartilhado/kit-phaser/audio.js'
import { chaveTorta } from './arte.js'
import dadosGatinho from './gatinho-dados.json'
import { AnimadorGatinho } from './animador.js'

const TINTA = '#3d4437'
const CREME = 0xfff6df
const BORDA = 0xb99870
const VERDE = 0x45664e

function texto(s, x, y, valor, tamanho = 18, cor = TINTA) {
  return s.add.text(x, y, valor, { fontFamily: FONTE, fontSize: `${tamanho}px`, color: cor }).setOrigin(0.5)
}

// Painéis locais: papel creme, borda de madeira e detalhe de tecido xadrez.
function painel(s, x, y, w, h, tecido = false) {
  const sombra = s.add.rectangle(0, 4, w, h, 0x4e4637, 0.2).setRounded(18)
  const fundo = s.add.rectangle(0, 0, w, h, CREME).setRounded(18).setStrokeStyle(2, BORDA)
  const grupo = s.add.container(x, y, [sombra, fundo]).setDepth(40)
  if (tecido) {
    for (let i = 0; i < 7; i++) {
      grupo.add(s.add.rectangle(-36 + i * 12, -h / 2 + 5, 12, 7, i % 2 ? 0xe7c5b1 : 0xf6e5cd))
    }
  }
  return grupo
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
  const xp = painel(s, 128, 42, 232, 60)
  xp.getAt(1).setInteractive().setData('bloquearLancamento', true)
  const icone = imagem(s, -86, -4, 'estrela', 30, { parado: true })
  const nome = texto(s, 12, -12, 'Sua coleção', 15)
  const total = texto(s, 12, 6, '', 13)
  const trilho = s.add.rectangle(-62, 21, 156, 5, 0xe2d4b9).setOrigin(0, 0.5).setRounded(3)
  const barra = s.add.rectangle(-62, 21, 1, 5, 0x70865b).setOrigin(0, 0.5).setRounded(3)
  xp.add([icone, nome, total, trilho, barra])
  const aviso = painel(s, 371, 112, 230, 60, true).setVisible(false)
  const avisoTexto = texto(s, 0, 2, '', 18)
  aviso.add(avisoTexto)
  let timerAviso
  const hud = ligarHud(s, s.ctx, {
    atualizar(e) {
      total.setText(`${e.total} XP · ${e.proximo ? 'próxima surpresa' : 'coleção completa'}`)
      const pct = e.proximo ? (e.total - e.anterior) / (e.limite - e.anterior) : 1
      barra.setSize(Math.max(1, 156 * Math.min(1, Math.max(0, pct))), 5)
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

  const progresso = painel(s, 642, 47, 292, 70, true)
  progresso.getAt(1).setInteractive().setData('bloquearLancamento', true)
  const contagem = texto(s, 0, -18, 'Piquenique · 0 de 5', 16)
  progresso.add(contagem)
  const tortas = []
  for (let i = 0; i < quantidade; i++) {
    const x = -104 + i * 52
    progresso.add(s.add.ellipse(x, 14, 43, 20, 0xfaf7ed).setStrokeStyle(2, 0xc6bca5))
    const torta = s.add.image(x, 8, chaveTorta('torta')).setDisplaySize(44, 44).setAlpha(0)
    progresso.add(torta)
    tortas.push(torta)
  }

  // Prato da criança: o desenho e o texto indicam o estado, além da cor.
  const prato = painel(s, 167, 404, 312, 68, true)
  const area = s.add.rectangle(0, 0, 312, 68, 0xffffff, 0).setRounded(18).setInteractive({ useHandCursor: true })
  prato.add([area, s.add.ellipse(102, 13, 68, 25, 0xfffdf7).setStrokeStyle(2, 0xb5b4a5)])
  const tortaPrato = s.add.image(102, -3, chaveTorta('torta')).setDisplaySize(60, 60).setVisible(false)
  const tituloPrato = texto(s, -39, -7, 'Vamos pegar uma torta', 17)
  const dicaPrato = texto(s, -39, 17, 'O adulto defende primeiro', 13)
  prato.add([tortaPrato, tituloPrato, dicaPrato])

  const defesa = painel(s, 632, 404, 306, 68, true)
  defesa.getAt(1).setInteractive({ useHandCursor: true }).setData('bloquearLancamento', true)
    .on('pointerdown', p => { s.comandosDefesa.add(p.id); s.defender() })
  const nomeDefesa = texto(s, 34, -9, 'Adulto · defender', 18)
  const dicaDefesa = texto(s, 34, 16, 'Segure a bandeja ou Espaço', 13)
  defesa.add([nomeDefesa, dicaDefesa])
  // Defesa à direita e ataque à esquerda, com as mesmas áreas de toque.
  s.escudo = s.add.circle(543, 392, 46, 0x537988).setStrokeStyle(3, 0xfff9ec).setDepth(42)
    .setInteractive({ useHandCursor: true }).setData('bloquearLancamento', true)
  const metal = s.add.image(543, 390, chaveTorta('bandeja')).setDisplaySize(70, 70).setDepth(43)
  s.escudo.on('pointerdown', p => { s.comandosDefesa.add(p.id); s.defender() })
  let ultimoEstado
  let ultimaDefesa

  return {
    // Evita os confetes longos do HUD compartilhado; feedback breve nos elementos locais.
    acerto() { hud.acerto() },
    erro() { hud.erro() },
    progresso(n) {
      contagem.setText(`Piquenique · ${n} de ${quantidade}`)
      tortas[n - 1].setAlpha(1)
      pequenoSalto(s, tortas[n - 1])
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
        const alvo = pressionado ? 65 : 70
        if (s.ctx.efeitos) s.tweens.add({ targets: metal, displayWidth: alvo, displayHeight: alvo, y: pressionado ? 393 : 390, duration: 110 })
        else metal.setDisplaySize(alvo, alvo).setY(pressionado ? 393 : 390)
        s.escudo.setFillStyle(protegendo ? 0x45664e : 0x537988)
        nomeDefesa.setText(protegendo ? 'Bandeja erguida!' : 'Adulto · defender')
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
  const gato = s.add.sprite(x - 26, -18, `gato_${acao}`, ataque ? 19 : 21)
    .setDisplaySize(166, 166).setName(`demo-${acao}`)
  const torta = s.add.image(x + (ataque ? 95 : 60), -30, chaveTorta('torta'))
    .setDisplaySize(32, 32).setName(`demo-torta-${acao}`)
  const convite = texto(s, x, 111, s.ctx.efeitos ? 'Toque para ver a ação' : 'Pose da ação', 13)
  folha.add([cartao, gato, torta, convite])
  let ativo = false, tempo = 0, saiu = false, encerrado = false
  const animador = new AnimadorGatinho(dadosGatinho, evento => {
    if (evento !== 'release' || !ataque) return
    torta.setPosition(x + 8, -37).setVisible(true)
    s.tweens.add({ targets: torta, x: x + 111, y: -48, duration: 280, ease: 'Sine.Out', onComplete: () => torta.setVisible(false) })
  })
  const restaurar = () => {
    ativo = false
    s.tweens.killTweensOf(torta)
    gato.setTexture(`gato_${acao}`, ataque ? 19 : 21)
    torta.setPosition(x + (ataque ? 95 : 60), -30).setVisible(true)
    convite.setText(s.ctx.efeitos ? 'Toque para rever' : 'Pose da ação')
  }
  const atualizar = (_, delta) => {
    if (!ativo) return
    tempo += delta
    animador.atualizar(delta)
    gato.setTexture(`gato_${animador.arte}`, animador.quadro)
    if (!ataque && tempo >= 450 && !saiu) {
      saiu = true
      torta.setVisible(true).setPosition(x + 111, -37)
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
  const folha = painel(s, 400, 203, 682, 336, true).setDepth(51)
  folha.add(texto(s, 0, -139, 'Uma dupla no piquenique', 30))
  folha.add(texto(s, 0, -109, 'Peguem as tortinhas juntos!', 18))
  const cartao = (x, acao, titulo, gesto) => {
    demonstracao(s, folha, x, acao)
    folha.add(texto(s, x, 65, titulo, 23))
    folha.add(texto(s, x, 91, gesto, 15))
  }
  cartao(-158, 'ataque', 'Você lança', 'Solte a defesa e toque na tela')
  cartao(158, 'defesa', 'Você defende', 'Segure a bandeja ou Espaço')
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
  const folha = painel(s, 400, 216, 612, 300, true).setDepth(51)
  folha.add(texto(s, 0, -105, 'Conseguimos juntos!', 32))
  for (let i = 0; i < 5; i++) folha.add(s.add.image(-112 + i * 56, -37, chaveTorta('torta')).setDisplaySize(58, 58))
  folha.add(texto(s, 0, 22, 'O guaxinim comeu e foi descansar.', 21))
  folha.add(texto(s, 0, 53, 'Boa parceria!', 18))
  botaoPiquenique(s, 260, 317, 236, 'Brincar de novo', () => s.scene.restart())
  botaoPiquenique(s, 540, 317, 236, 'Voltar ao menu', () => s.ctx.sair())
  pequenoSalto(s, folha)
}
