// Usa o delta da cena: pausa, eventos e desenhos compartilham o mesmo relógio.
export class AnimadorGuaxinim {
  constructor(dados, evento = () => {}) {
    this.dados = dados
    this.evento = evento
    this.iniciar('idle')
  }

  iniciar(estado) {
    this.estado = estado
    this.arte = ['raise', 'hold', 'lower'].includes(estado) ? 'defesa' : estado
    const meta = this.dados[this.arte]
    this.seq = estado === 'hold' ? [meta.hold_frame]
      : estado === 'raise' ? meta.raise_frames
        : estado === 'lower' ? meta.lower_frames
          : Array.from({ length: meta.frame_count }, (_, i) => i)
    this.indice = 0
    this.tempo = 0
    this.concluido = false
    this.emitidos = new Set()
    this.emitir()
  }

  get quadro() { return this.seq[this.indice] }
  get protegido() { return this.estado === 'hold' }
  get ocupado() { return this.estado !== 'idle' }

  emitir() {
    for (const e of this.dados[this.arte].events ?? []) {
      if (e.frame_index === this.quadro && !this.emitidos.has(e.name)) {
        this.emitidos.add(e.name)
        this.evento(e.name)
      }
    }
  }

  atualizar(delta) {
    if (this.estado === 'hold' || this.concluido) return
    this.tempo += delta
    const periodo = 1000 / this.dados[this.arte].frameRate
    while (this.tempo + 1e-8 >= periodo) {
      this.tempo -= periodo
      if (this.indice + 1 < this.seq.length) {
        this.indice++
        this.emitir()
      } else if (this.estado === 'idle') this.indice = 0
      else {
        const anterior = this.estado
        // A finalização é terminal: nunca repete a queda nem volta ao idle.
        if (anterior === 'final') this.concluido = true
        else this.iniciar(anterior === 'raise' ? 'hold' : 'idle')
        this.evento(`complete_${anterior}`)
        return
      }
    }
  }
}
