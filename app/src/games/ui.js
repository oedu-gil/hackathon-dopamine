import { configurarAudio, iniciarMusica, pararMusica, sons } from '../audio.js'
import { chuvaDeConfete, confete } from './efeitos.js'
import { imagem, trocarImagem } from './arte.js'

// Fonte de jogo (Fredoka, carregada em main.jsx). Para trocar, mude só esta linha e o import.
export const FONTE = 'Fredoka, "Segoe UI", sans-serif'
export const RAIO = 14 // arredondamento das caixas

// Texto dentro de uma caixa de cantos arredondados (o Phaser só desenha fundo quadrado).
// Com texto vazio a caixa some.
export function caixaTexto(scene, x, y, texto, estilo = {}, opcoes = {}) {
  const { px = 14, py = 8, cor = 0x000000, alpha = 0.55, depth = 0, fixo = false } = opcoes
  const t = scene.add
    .text(x, y, texto, { fontFamily: FONTE, ...estilo })
    .setOrigin(0.5)
    .setDepth(depth + 1)
  const f = scene.add.rectangle(x, y, 10, 10, cor, alpha).setRounded(RAIO).setDepth(depth)
  if (fixo) {
    t.setScrollFactor(0)
    f.setScrollFactor(0)
  }
  const ajustar = () => {
    f.setVisible(t.text !== '')
    f.setSize(t.width + px * 2, t.height + py * 2)
  }
  ajustar()
  return {
    t,
    f,
    setText(s) {
      t.setText(s)
      ajustar()
      return this
    },
    setDepth(d) {
      f.setDepth(d)
      t.setDepth(d + 1)
      return this
    },
    destroy() {
      f.destroy()
      t.destroy()
    },
  }
}

// Caixa com `antes` + imagem + `depois`, centralizados. Serve para "Pegue: [rosto] Triste",
// para o contador de estrelas e para o balão de fala com a carinha do amigo.
export function caixaComIcone(scene, x, y, estado, estilo = {}, opcoes = {}) {
  const { px = 14, py = 8, cor = 0x000000, alpha = 0.55, depth = 0, fixo = false, tamanho = 44, folga = 10 } = opcoes
  const mk = (o) => (fixo ? o.setScrollFactor(0) : o)
  const f = mk(scene.add.rectangle(x, y, 10, 10, cor, alpha).setRounded(RAIO).setDepth(depth))
  const t1 = mk(scene.add.text(x, y, '', { fontFamily: FONTE, ...estilo }).setOrigin(0, 0.5).setDepth(depth + 1))
  const t2 = mk(scene.add.text(x, y, '', { fontFamily: FONTE, ...estilo }).setOrigin(0, 0.5).setDepth(depth + 1))
  let img = null
  let atual = { antes: '', icone: null, depois: '' }

  const montar = () => {
    const { antes, icone, depois } = atual
    t1.setText(antes)
    t2.setText(depois)
    if (icone && !img) img = mk(imagem(scene, x, y, icone, tamanho).setDepth(depth + 1))
    else if (icone && img.arteId !== icone) trocarImagem(img, icone)
    img?.setVisible(!!icone)

    const partes = [
      antes ? t1.width : 0,
      icone ? tamanho : 0,
      depois ? t2.width : 0,
    ]
    const usadas = partes.filter((w) => w > 0)
    const total = partes.reduce((s, w) => s + w, 0) + Math.max(0, usadas.length - 1) * folga
    let cursor = x - total / 2
    if (antes) {
      t1.setPosition(cursor, y)
      cursor += t1.width + folga
    }
    if (icone) {
      img.setPosition(cursor + tamanho / 2, y)
      cursor += tamanho + folga
    }
    if (depois) t2.setPosition(cursor, y)
    const alto = Math.max(t1.height, t2.height, icone ? tamanho : 0)
    f.setVisible(total > 0)
    f.setSize(total + px * 2, alto + py * 2)
  }

  const caixa = {
    f,
    definir(novo) {
      atual = { ...atual, ...novo }
      montar()
      return caixa
    },
    setDepth(d) {
      f.setDepth(d)
      t1.setDepth(d + 1)
      t2.setDepth(d + 1)
      img?.setDepth(d + 1)
      return caixa
    },
    destroy() {
      f.destroy()
      t1.destroy()
      t2.destroy()
      img?.destroy()
    },
  }
  return caixa.definir(estado)
}

// Componentes comuns às cenas: botão, HUD com a barra do próximo item e tela final.
export function botao(scene, x, y, w, h, texto, aoClicar, cor = 0x2f6fed) {
  const r = scene.add
    .rectangle(x, y, w, h, cor)
    .setRounded(RAIO)
    .setStrokeStyle(3, 0xffffff)
    .setInteractive({ useHandCursor: true })
    .setScrollFactor(0)
  const t = scene.add
    .text(x, y, texto, {
      fontFamily: FONTE,
      fontSize: '20px',
      color: '#ffffff',
      align: 'center',
      wordWrap: { width: w - 16 },
    })
    .setOrigin(0.5)
    .setScrollFactor(0)
  r.on('pointerdown', aoClicar)
  return {
    r,
    t,
    desativar() {
      r.disableInteractive()
      r.setAlpha(0.4)
      t.setAlpha(0.5)
    },
    destruir() {
      r.destroy()
      t.destroy()
    },
  }
}

export function criarHud(scene, ctx) {
  // som e música valem para a cena inteira; a música para quando a cena termina
  configurarAudio({ sons: ctx.sons, musica: ctx.musica })
  iniciarMusica()
  scene.events.once('shutdown', pararMusica)
  scene.events.once('destroy', pararMusica)

  const larguraBarra = 220
  // fixo na tela (scrollFactor 0) e acima do cenário, para cenas com câmera que rola
  const fixo = (o) => o.setScrollFactor(0).setDepth(40)
  const estiloRotulo = { fontFamily: FONTE, fontSize: '18px', color: '#ffffff' }

  // painel da pontuação (próximo item + barra) com cantos arredondados
  fixo(scene.add.rectangle(8, 4, 264, 52, 0x000000, 0.4).setOrigin(0, 0).setRounded(RAIO)).setDepth(39)
  const rotuloA = fixo(scene.add.text(20, 8, '', estiloRotulo))
  const rotuloIcone = fixo(imagem(scene, 0, 19, 'estrela', 24, { parado: true })).setVisible(false)
  const rotuloB = fixo(scene.add.text(20, 8, '', estiloRotulo))
  fixo(scene.add.rectangle(20, 40, larguraBarra, 10, 0xffffff, 0.25).setOrigin(0, 0.5).setRounded(5))
  const barra = fixo(scene.add.rectangle(20, 40, 10, 10, 0xffd447).setOrigin(0, 0.5).setRounded(5))
  const sair = botao(scene, 740, 26, 90, 34, 'Sair', () => ctx.sair(), 0x555555)
  sair.r.setDepth(40)
  sair.t.setDepth(41)

  function atualizar(e) {
    if (e.proximo) {
      rotuloA.setText('Próximo:')
      const x = 20 + rotuloA.width + 8
      trocarImagem(rotuloIcone, e.proximo.arte, { parado: true })
      rotuloIcone.setPosition(x + 12, 19).setVisible(true)
      rotuloB.setText(e.proximo.nome).setPosition(x + 30, 8)
      const pct = (e.total - e.anterior) / (e.limite - e.anterior)
      barra.setSize(Math.max(10, larguraBarra * pct), 10)
    } else {
      rotuloA.setText('Coleção completa!')
      rotuloIcone.setVisible(false)
      rotuloB.setText('')
      barra.setSize(larguraBarra, 10)
    }
    return e
  }

  function mostrarDesbloqueio(item) {
    const fundo = scene.add.rectangle(0, 0, 300, 250, 0x000000, 0.85).setRounded(RAIO + 6)
    const titulo = scene.add.text(0, -92, 'Novo item!', { fontFamily: FONTE, fontSize: '30px', color: '#ffe9a8' }).setOrigin(0.5)
    const figura = imagem(scene, 0, -10, item.arte, 120, { parado: true })
    const nome = scene.add
      .text(0, 82, item.nome, { fontFamily: FONTE, fontSize: '26px', color: '#ffffff', align: 'center', wordWrap: { width: 270 } })
      .setOrigin(0.5)
    const aviso = scene.add.container(400, 225, [fundo, titulo, figura, nome]).setScrollFactor(0).setDepth(45)
    if (ctx.efeitos) {
      aviso.setScale(0.2)
      scene.tweens.add({ targets: aviso, scale: 1, duration: 350, ease: 'Back.Out' })
      scene.tweens.add({ targets: figura, angle: { from: -8, to: 8 }, duration: 300, yoyo: true, repeat: 5 })
    }
    sons.desbloqueio()
    confete(scene, 400, 225, { quantidade: 28, espalhar: 220, fixo: true })
    scene.time.delayedCall(2200, () => aviso.destroy())
  }

  atualizar(ctx.estado())

  return {
    // `origem` (opcional): objeto de onde saem as estrelinhas do acerto
    acerto(origem) {
      ctx.registrarTentativa(true)
      sons.acerto()
      if (origem) confete(scene, origem.x, origem.y - 20)
      const e = atualizar(ctx.registrarAcerto())
      if (e.novoItem) mostrarDesbloqueio(e.novoItem)
    },
    erro() {
      ctx.registrarTentativa(false)
      sons.erro()
    },
  }
}

export function telaFinal(scene, ctx, mensagem) {
  sons.fim()
  chuvaDeConfete(scene)
  scene.add.rectangle(400, 225, 800, 450, 0x000000, 0.7).setScrollFactor(0).setDepth(50)
  const trofeu = imagem(scene, 400, 82, 'trofeu', 96, { parado: true }).setScrollFactor(0).setDepth(51)
  if (ctx.efeitos) {
    scene.tweens.add({ targets: trofeu, angle: { from: -8, to: 8 }, duration: 400, yoyo: true, repeat: -1, ease: 'Sine.InOut' })
  }
  caixaTexto(
    scene,
    400,
    175,
    mensagem,
    { fontSize: '32px', color: '#ffffff', align: 'center' },
    { px: 32, py: 14, alpha: 0.5, depth: 51, fixo: true },
  )
  const a = botao(scene, 280, 290, 220, 60, 'Jogar de novo', () => scene.scene.restart(), 0x2e9e5b)
  const b = botao(scene, 520, 290, 220, 60, 'Voltar ao menu', () => ctx.sair(), 0x555555)
  for (const o of [a, b]) {
    o.r.setDepth(53)
    o.t.setDepth(54)
  }
}

export function embaralhar(lista) {
  const copia = [...lista]
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copia[i], copia[j]] = [copia[j], copia[i]]
  }
  return copia
}
