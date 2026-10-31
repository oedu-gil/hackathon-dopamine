// Efeitos visuais de recompensa e de "vida" do cenário. Todos respeitam a opção
// "Reduzir efeitos" (ctx.efeitos = false): nesse caso não animam nada.
const SIMBOLOS = ['⭐', '✨', '🎉', '💛', '💙', '💚']
const entre = (a, b) => a + Math.random() * (b - a)

// Explosão de estrelinhas e confete. `fixo` = coordenadas da tela, em vez do mundo da fase.
export function confete(scene, x, y, { quantidade = 16, espalhar = 100, fixo = false } = {}) {
  if (!scene.ctx.efeitos) return
  for (let i = 0; i < quantidade; i++) {
    const p = scene.add
      .text(x, y, SIMBOLOS[i % SIMBOLOS.length], { fontSize: `${Math.round(entre(22, 38))}px` })
      .setOrigin(0.5)
      .setDepth(60)
    if (fixo) p.setScrollFactor(0)
    const angulo = entre(0, Math.PI * 2)
    const distancia = espalhar * entre(0.5, 1.2)
    const duracao = entre(800, 1300)
    scene.tweens.add({
      targets: p,
      x: x + Math.cos(angulo) * distancia,
      y: y + Math.sin(angulo) * distancia - 30,
      angle: entre(-180, 180),
      scale: 0.6,
      duration: duracao,
      ease: 'Cubic.Out',
      onComplete: () => p.destroy(),
    })
    // some só na segunda metade, para o confete ficar visível enquanto voa
    scene.tweens.add({ targets: p, alpha: 0, delay: duracao * 0.5, duration: duracao * 0.5 })
  }
}

// Várias explosões espalhadas pela tela, para as celebrações.
export function chuvaDeConfete(scene, rodadas = 4) {
  for (let i = 0; i < rodadas; i++) {
    scene.time.delayedCall(i * 260, () =>
      confete(scene, entre(120, 680), entre(80, 260), { quantidade: 14, espalhar: 110, fixo: true }),
    )
  }
}

// "Pulinho de alegria": estica e volta.
export function estourar(scene, alvo, forca = 1.3) {
  if (!scene.ctx.efeitos) return
  scene.tweens.add({
    targets: alvo,
    scaleX: forca,
    scaleY: forca,
    duration: 110,
    yoyo: true,
    ease: 'Quad.Out',
  })
}

// Balanço rápido de lado a lado (um "opa" gentil ou um aceno).
export function balancar(scene, alvo, graus = 10) {
  if (!scene.ctx.efeitos) return
  scene.tweens.add({
    targets: alvo,
    angle: { from: -graus, to: graus },
    duration: 90,
    yoyo: true,
    repeat: 3,
    onComplete: () => alvo.setAngle(0),
  })
}

// Respirar: o personagem cresce e encolhe devagar, parado ou não.
export function respirar(scene, alvo, forca = 0.06) {
  if (!scene.ctx.efeitos) return
  scene.tweens.add({
    targets: alvo,
    scaleY: 1 + forca,
    scaleX: 1 - forca / 2,
    duration: 700,
    yoyo: true,
    repeat: -1,
    ease: 'Sine.InOut',
  })
}

// Acena sem parar (amigos, bandeira).
export function acenar(scene, alvo, graus = 7, duracao = 500) {
  if (!scene.ctx.efeitos) return
  alvo.setAngle(-graus)
  scene.tweens.add({
    targets: alvo,
    angle: graus,
    duration: duracao,
    yoyo: true,
    repeat: -1,
    ease: 'Sine.InOut',
  })
}

// Nuvens que passam devagar ao fundo (cenas sem rolagem).
export function nuvens(scene, quantidade = 6) {
  for (let i = 0; i < quantidade; i++) {
    const n = scene.add
      .text(entre(0, 800), entre(70, 330), '☁️', { fontSize: `${Math.round(entre(40, 70))}px` })
      .setAlpha(0.35)
      .setDepth(-1)
    if (!scene.ctx.efeitos) continue
    scene.tweens.add({
      targets: n,
      x: n.x + entre(60, 140) * (i % 2 ? 1 : -1),
      duration: entre(5000, 9000),
      yoyo: true,
      repeat: -1,
      ease: 'Sine.InOut',
    })
  }
}
