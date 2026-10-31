import Phaser from 'phaser'
import fonteTexto from './fontes/atkinson-hyperlegible-400.woff2'
import fonteNegrito from './fontes/atkinson-hyperlegible-700.woff2'
import fonteTitulo from './fontes/baloo2-800.woff2'
import { cenarioDoTema, bordasDoTema } from '../arte/cenarios.js'
import { imagem, trocarImagem } from './arte.js'
import { sons } from './audio.js'
import { chuvaDeConfete, confete } from './efeitos.js'
import { ligarHud } from './ui.js'

// Visual "papel recortado", o mesmo do quebra-cabeça (docs/quebra-cabeca/DIRECAO-ARTISTICA.md):
// cartões creme com contorno escuro e sombra chapada, figuras como adesivos de borda branca,
// roxo para o destaque, Baloo 2 nos títulos e Atkinson Hyperlegible no resto.
// Usado pela Chuva de emoções e pelo Cuidar do amigo.

export const PAPEL = {
  tinta: 0x2a1f3d,
  tintaCss: '#2a1f3d',
  tintaSuave: '#57466e',
  papel: 0xfffaf2,
  linha: 0xe8d8c4,
  bandeja: 0x7fc8a9,
  destaque: 0x6a3fc8,
  destaqueCss: '#6a3fc8',
  amarelo: 0xffd166,
  branco: 0xffffff,
}

export const FONTES = {
  titulo: 'PapelBaloo, "Segoe UI", sans-serif',
  texto: 'PapelAtkinson, "Segoe UI", sans-serif',
  negrito: 'PapelAtkinsonBold, "Segoe UI", sans-serif',
}

// Carrega as fontes antes do jogo começar (o canvas não redesenha quando a fonte chega).
export function prepararFontes() {
  const fontes = [
    new FontFace('PapelAtkinson', `url(${fonteTexto})`, { weight: '400' }),
    new FontFace('PapelAtkinsonBold', `url(${fonteNegrito})`, { weight: '700' }),
    new FontFace('PapelBaloo', `url(${fonteTitulo})`, { weight: '800' }),
  ]
  return Promise.all(
    fontes.map((f) =>
      f
        .load()
        .then((ok) => document.fonts.add(ok))
        .catch(() => {}),
    ),
  )
}

// Pinta as faixas que sobram em volta do canvas com o céu (em cima) e o chão (embaixo) do
// cenário, para o jogo não ficar numa moldura branca. A troca de cor acontece na mesma altura
// do horizonte do jogo (`horizonte`, em pixels do jogo de 800 x 450). `chao` troca a cor de
// baixo quando o jogo cobre o chão (a bandeja do Cuidar do amigo). Devolve a função que desfaz.
export function pintarBordas(elemento, temaId, { chao: outroChao, horizonte = 372 } = {}) {
  const { ceu, chao: chaoDoTema } = bordasDoTema(temaId)
  const chao = outroChao ?? chaoDoTema
  const antes = elemento.style.background
  const pintar = () => {
    const { width, height } = elemento.getBoundingClientRect()
    // o canvas fica centrado e mantém a proporção 16:9 (Phaser.Scale.FIT)
    const alturaJogo = Math.min(height, (width * 450) / 800)
    const corte = Math.round(height / 2 + (horizonte / 450 - 0.5) * alturaJogo)
    elemento.style.background = `linear-gradient(${ceu} ${corte}px, ${chao} ${corte}px)`
  }
  pintar()
  const observador = new ResizeObserver(pintar)
  observador.observe(elemento)
  return () => {
    observador.disconnect()
    elemento.style.background = antes
  }
}

// ---------- cenário ----------

const chaveCenario = (temaId) => `cenario_${temaId}`

export function carregarCenario(scene, temaId) {
  const chave = chaveCenario(temaId)
  if (scene.textures.exists(chave)) return
  const url = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(cenarioDoTema(temaId))))}`
  scene.load.svg(chave, url, { width: 800, height: 450 })
}

export function desenharCenario(scene, temaId) {
  return scene.add.image(400, 225, chaveCenario(temaId)).setDepth(-10)
}

// ---------- cartão de papel ----------

// Retângulo creme com contorno e sombra chapada, centrado em (x, y).
export function cartao(scene, x, y, w, h, opcoes = {}) {
  const { cor = PAPEL.papel, raio = 18, sombra = 6, borda = 3, depth = 0 } = opcoes
  const g = scene.add.graphics({ x, y }).setDepth(depth)
  g.desenhar = (largura, altura, novaCor = cor) => {
    g.clear()
    g.fillStyle(PAPEL.tinta, 1).fillRoundedRect(-largura / 2 + sombra, -altura / 2 + sombra, largura, altura, raio)
    g.fillStyle(novaCor, 1).fillRoundedRect(-largura / 2, -altura / 2, largura, altura, raio)
    g.lineStyle(borda, PAPEL.tinta, 1).strokeRoundedRect(-largura / 2, -altura / 2, largura, altura, raio)
    g.largura = largura
    g.altura = altura
    return g
  }
  return g.desenhar(w, h)
}

// Texto num cartão que cresce com o texto. Some quando o texto fica vazio.
export function rotulo(scene, x, y, texto, opcoes = {}) {
  const {
    tamanho = 22,
    fonte = FONTES.negrito,
    cor = PAPEL.tintaCss,
    fundo = PAPEL.papel,
    px = 18,
    py = 8,
    largura,
    sombra = 4,
    depth = 0,
  } = opcoes
  const f = cartao(scene, x, y, 10, 10, { cor: fundo, sombra, raio: 16, depth })
  const t = scene.add
    .text(x, y, texto, {
      fontFamily: fonte,
      fontSize: `${tamanho}px`,
      color: cor,
      align: 'center',
      ...(largura ? { wordWrap: { width: largura } } : {}),
    })
    .setOrigin(0.5)
    .setDepth(depth + 1)
  const ajustar = () => {
    f.setVisible(t.text !== '')
    f.desenhar(t.width + px * 2, t.height + py * 2)
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
    destroy() {
      f.destroy()
      t.destroy()
    },
  }
}

// ---------- adesivo ----------

// Figura com borda branca e sombra chapada, como um adesivo recortado. A borda e a sombra
// são cópias da própria figura pintadas de uma cor só, então funcionam com qualquer desenho
// (inclusive os animados). É um Container: dá para mover, girar, escalar e arrastar.
const DIRECOES = Array.from({ length: 12 }, (_, i) => [Math.cos((i * Math.PI) / 6), Math.sin((i * Math.PI) / 6)])

export function adesivo(scene, x, y, id, tamanho, opcoes = {}) {
  const { borda = Math.max(3, Math.round(tamanho * 0.045)), sombra = 3, parado = false } = opcoes
  const c = scene.add.container(x, y)
  const camadas = []
  const copia = (dx, dy, cor, alfa = 1) => {
    const s = imagem(scene, dx, dy, id, tamanho, { parado })
    if (cor !== undefined) s.setTint(cor).setTintMode(Phaser.TintModes.FILL).setAlpha(alfa)
    camadas.push(s)
    c.add(s)
  }
  // sem borda, uma cópia só basta para a sombra
  const contorno = borda > 0 ? DIRECOES : [[0, 0]]
  if (sombra) for (const [dx, dy] of contorno) copia(dx * borda + sombra, dy * borda + sombra, PAPEL.tinta, 0.9)
  if (borda > 0) for (const [dx, dy] of DIRECOES) copia(dx * borda, dy * borda, PAPEL.branco)
  copia(0, 0)
  c.arteId = id
  c.figura = camadas[camadas.length - 1]
  c.setSize(tamanho + borda * 2, tamanho + borda * 2)
  c.trocar = (novo, { parado: p = parado } = {}) => {
    for (const s of camadas) trocarImagem(s, novo, { parado: p })
    c.arteId = novo
    return c
  }
  return c
}

// ---------- botão ----------

export function botaoPapel(scene, x, y, w, h, texto, aoClicar, { primario = false, depth = 0 } = {}) {
  const fundo = cartao(scene, 0, 0, w, h, { cor: primario ? PAPEL.destaque : PAPEL.branco, raio: 22, sombra: 4 })
  const t = scene.add
    .text(0, 0, texto, { fontFamily: FONTES.negrito, fontSize: '22px', color: primario ? '#ffffff' : PAPEL.tintaCss })
    .setOrigin(0.5)
  const c = scene.add.container(x, y, [fundo, t]).setSize(w, h).setDepth(depth).setScrollFactor(0)
  c.setInteractive({ useHandCursor: true })
  // afunda na sombra enquanto está apertado, como o botão do quebra-cabeça
  c.on('pointerdown', () => c.setPosition(x + 2, y + 2))
  c.on('pointerout', () => c.setPosition(x, y))
  c.on('pointerup', () => {
    c.setPosition(x, y)
    aoClicar()
  })
  return c
}

// ---------- HUD e tela final ----------

export function criarHudPapel(scene, ctx) {
  const larguraBarra = 206
  const fixo = (o) => o.setScrollFactor(0).setDepth(40)
  const estilo = { fontFamily: FONTES.negrito, fontSize: '17px', color: PAPEL.tintaCss }

  const painel = fixo(cartao(scene, 0, 36, 10, 54, { raio: 16, sombra: 4 })).setDepth(39)
  // o cartão cresce para caber nomes longos, sempre preso à esquerda
  const ajustarPainel = (fimDoTexto) => {
    const largura = Math.max(larguraBarra + 30, fimDoTexto - 16 + 14)
    painel.desenhar(largura, 54).setX(16 + largura / 2)
  }
  const rotuloA = fixo(scene.add.text(30, 13, '', estilo))
  const icone = fixo(imagem(scene, 0, 23, 'estrela', 24, { parado: true })).setVisible(false)
  const rotuloB = fixo(scene.add.text(30, 13, '', estilo))
  const trilho = fixo(scene.add.graphics())
  trilho.fillStyle(PAPEL.linha, 1).fillRoundedRect(30, 41, larguraBarra, 12, 6)
  trilho.lineStyle(2, PAPEL.tinta, 1).strokeRoundedRect(30, 41, larguraBarra, 12, 6)
  const barra = fixo(scene.add.graphics())

  const preencher = (pct) => {
    const w = Math.max(12, larguraBarra * pct)
    barra.clear()
    barra.fillStyle(PAPEL.amarelo, 1).fillRoundedRect(30, 41, w, 12, 6)
    barra.lineStyle(2, PAPEL.tinta, 1).strokeRoundedRect(30, 41, w, 12, 6)
  }

  function atualizar(e) {
    if (e.proximo) {
      rotuloA.setText('Próximo:')
      const x = 30 + rotuloA.width + 8
      trocarImagem(icone, e.proximo.arte, { parado: true })
      icone.setPosition(x + 12, 23).setVisible(true)
      rotuloB.setText(e.proximo.nome).setPosition(x + 30, 13)
      preencher((e.total - e.anterior) / (e.limite - e.anterior))
      ajustarPainel(rotuloB.x + rotuloB.width)
    } else {
      rotuloA.setText('Coleção completa!')
      icone.setVisible(false)
      rotuloB.setText('')
      preencher(1)
      ajustarPainel(rotuloA.x + rotuloA.width)
    }
    return e
  }

  function mostrarDesbloqueio(item) {
    const fundo = cartao(scene, 0, 0, 300, 250, { raio: 24, sombra: 8 })
    const titulo = scene.add
      .text(0, -88, 'Novo item!', { fontFamily: FONTES.titulo, fontSize: '32px', color: PAPEL.destaqueCss })
      .setOrigin(0.5)
    const figura = adesivo(scene, 0, -6, item.arte, 110, { parado: true })
    const nome = scene.add
      .text(0, 84, item.nome, {
        fontFamily: FONTES.negrito,
        fontSize: '24px',
        color: PAPEL.tintaCss,
        align: 'center',
        wordWrap: { width: 260 },
      })
      .setOrigin(0.5)
    const aviso = scene.add.container(400, 225, [fundo, titulo, figura, nome]).setScrollFactor(0).setDepth(45)
    if (ctx.efeitos) {
      aviso.setScale(0.6)
      scene.tweens.add({ targets: aviso, scale: 1, duration: 280, ease: 'Back.Out' })
    }
    sons.desbloqueio()
    confete(scene, 400, 225, { quantidade: 24, espalhar: 220, fixo: true })
    scene.time.delayedCall(2200, () => aviso.destroy())
  }

  return ligarHud(scene, ctx, { atualizar, mostrarDesbloqueio })
}

export function telaFinalPapel(scene, ctx, mensagem) {
  ctx.concluir?.()
  sons.fim()
  chuvaDeConfete(scene)
  scene.add.rectangle(400, 225, 800, 450, PAPEL.tinta, 0.45).setScrollFactor(0).setDepth(50)
  const painel = scene.add.container(400, 215).setScrollFactor(0).setDepth(51)
  painel.add(cartao(scene, 0, 0, 500, 330, { raio: 28, sombra: 10 }))
  painel.add(adesivo(scene, 0, -92, 'trofeu', 104, { parado: true }))
  painel.add(
    scene.add
      .text(0, 22, mensagem, {
        fontFamily: FONTES.titulo,
        fontSize: '32px',
        color: PAPEL.tintaCss,
        align: 'center',
        lineSpacing: -6,
      })
      .setOrigin(0.5),
  )
  if (ctx.efeitos) {
    painel.setScale(0.7)
    scene.tweens.add({ targets: painel, scale: 1, duration: 260, ease: 'Back.Out' })
  }
  botaoPapel(scene, 280, 330, 210, 60, 'Jogar de novo', () => scene.scene.restart(), { primario: true, depth: 53 })
  botaoPapel(scene, 520, 330, 210, 60, 'Voltar ao menu', () => ctx.sair(), { depth: 53 })
}
