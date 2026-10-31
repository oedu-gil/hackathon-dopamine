import { configurarAudio, iniciarMusica, pararMusica, sons } from '../audio.js'
import { chuvaDeConfete, confete } from './efeitos.js'

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
  // painel da pontuação (próximo item + barra) com cantos arredondados
  fixo(scene.add.rectangle(8, 4, 264, 52, 0x000000, 0.4).setOrigin(0, 0).setRounded(RAIO)).setDepth(39)
  const rotulo = fixo(
    scene.add.text(20, 8, '', {
      fontFamily: FONTE,
      fontSize: '18px',
      color: '#ffffff',
    }),
  )
  fixo(scene.add.rectangle(20, 40, larguraBarra, 10, 0xffffff, 0.25).setOrigin(0, 0.5).setRounded(5))
  const barra = fixo(scene.add.rectangle(20, 40, 10, 10, 0xffd447).setOrigin(0, 0.5).setRounded(5))
  const sair = botao(scene, 740, 26, 90, 34, 'Sair', () => ctx.sair(), 0x555555)
  sair.r.setDepth(40)
  sair.t.setDepth(41)

  function atualizar(e) {
    if (e.proximo) {
      rotulo.setText(`Próximo: ${e.proximo.emoji} ${e.proximo.nome}`)
      const pct = (e.total - e.anterior) / (e.limite - e.anterior)
      barra.setSize(Math.max(10, larguraBarra * pct), 10)
    } else {
      rotulo.setText('Coleção completa! 🎉')
      barra.setSize(larguraBarra, 10)
    }
    return e
  }

  function mostrarDesbloqueio(item) {
    const aviso = caixaTexto(
      scene,
      400,
      225,
      `Novo item!\n${item.emoji}\n${item.nome}`,
      { fontSize: '36px', color: '#ffffff', align: 'center' },
      { px: 28, py: 18, alpha: 0.85, depth: 45, fixo: true },
    )
    if (ctx.efeitos) {
      aviso.f.setScale(0.2)
      aviso.t.setScale(0.2)
      scene.tweens.add({ targets: [aviso.f, aviso.t], scale: 1, duration: 350, ease: 'Back.Out' })
    }
    sons.desbloqueio()
    confete(scene, 400, 225, { quantidade: 28, espalhar: 220, fixo: true })
    scene.time.delayedCall(2200, () => aviso.destroy())
  }

  atualizar(ctx.estado())

  return {
    // acerto avança a coleção e entra no desempenho; erro só entra no desempenho
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
  caixaTexto(
    scene,
    400,
    150,
    mensagem,
    { fontSize: '34px', color: '#ffffff', align: 'center' },
    { px: 32, py: 16, alpha: 0.5, depth: 51, fixo: true },
  )
  const a = botao(scene, 280, 280, 220, 60, 'Jogar de novo', () => scene.scene.restart(), 0x2e9e5b)
  const b = botao(scene, 520, 280, 220, 60, 'Voltar ao menu', () => ctx.sair(), 0x555555)
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
