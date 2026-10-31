export const FONTE = 'system-ui, "Segoe UI", sans-serif'

// Componentes comuns às cenas: botão, HUD com a barra do próximo item e tela final.
export function botao(scene, x, y, w, h, texto, aoClicar, cor = 0x2f6fed) {
  const r = scene.add
    .rectangle(x, y, w, h, cor)
    .setStrokeStyle(3, 0xffffff)
    .setInteractive({ useHandCursor: true })
  const t = scene.add
    .text(x, y, texto, {
      fontFamily: FONTE, fontSize: '20px',
      color: '#ffffff',
      align: 'center',
      wordWrap: { width: w - 16 },
    })
    .setOrigin(0.5)
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
  const larguraBarra = 220
  const rotulo = scene.add.text(20, 8, '', { fontFamily: FONTE, fontSize: '18px', color: '#ffffff' })
  scene.add.rectangle(20, 38, larguraBarra, 12, 0x000000, 0.4).setOrigin(0, 0.5)
  const barra = scene.add.rectangle(20, 38, 1, 12, 0xffd447).setOrigin(0, 0.5)
  botao(scene, 740, 26, 90, 34, 'Sair', () => ctx.sair(), 0x555555)

  function atualizar(e) {
    if (e.proximo) {
      rotulo.setText(`Próximo: ${e.proximo.emoji} ${e.proximo.nome}`)
      const pct = (e.total - e.anterior) / (e.limite - e.anterior)
      barra.width = Math.max(1, larguraBarra * pct)
    } else {
      rotulo.setText('Coleção completa! 🎉')
      barra.width = larguraBarra
    }
    return e
  }

  function mostrarDesbloqueio(item) {
    const aviso = scene.add
      .text(400, 225, `Novo item!\n${item.emoji}\n${item.nome}`, {
        fontFamily: FONTE, fontSize: '36px',
        color: '#ffffff',
        align: 'center',
        backgroundColor: '#000000cc',
        padding: { x: 24, y: 16 },
      })
      .setOrigin(0.5)
      .setDepth(10)
    if (ctx.efeitos) {
      aviso.setScale(0.2)
      scene.tweens.add({ targets: aviso, scale: 1, duration: 350, ease: 'Back.Out' })
    }
    scene.time.delayedCall(2200, () => aviso.destroy())
  }

  atualizar(ctx.estado())

  return {
    acerto() {
      const e = atualizar(ctx.registrarAcerto())
      if (e.novoItem) mostrarDesbloqueio(e.novoItem)
    },
  }
}

export function telaFinal(scene, ctx, mensagem) {
  scene.add.rectangle(400, 225, 800, 450, 0x000000, 0.7).setDepth(20)
  scene.add
    .text(400, 150, mensagem, { fontFamily: FONTE, fontSize: '34px', color: '#ffffff', align: 'center' })
    .setOrigin(0.5)
    .setDepth(21)
  const a = botao(scene, 280, 280, 220, 60, 'Jogar de novo', () => scene.scene.restart(), 0x2e9e5b)
  const b = botao(scene, 520, 280, 220, 60, 'Voltar ao menu', () => ctx.sair(), 0x555555)
  for (const o of [a, b]) {
    o.r.setDepth(21)
    o.t.setDepth(22)
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
