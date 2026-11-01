// Relógio alimentado pelo delta da cena: pausa junto com o jogo.
export class AnimadorGatinho {
  constructor(dados, evento = () => {}) {
    this.dados = dados
    this.evento = evento
    this.pressionado = false
    this.iniciar('idle')
  }

  iniciar(estado, primeiro) {
    this.estado = estado
    this.arte = ['raise', 'hold', 'lower'].includes(estado) ? 'defesa' : estado
    const meta = this.dados[this.arte]
    this.seq = meta.states?.[estado]?.frame_indices ?? meta.frames.map((_, i) => i)
    if (estado === 'hold') this.seq = [meta.states.hold.frame_index]
    this.indice = Math.max(0, this.seq.indexOf(primeiro))
    this.tempo = 0
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

  defender(ativo) {
    this.pressionado = ativo
    const t = this.dados.defesa.transitions
    if (ativo && this.estado === 'lower') {
      const q = t.button_down_during_lower.frame_map[this.quadro]
      this.iniciar(q === 21 ? 'hold' : 'raise', q)
    } else if (ativo && ['idle', 'reacao'].includes(this.estado)) this.iniciar('raise')
    else if (!ativo && this.estado === 'raise') this.iniciar('lower', t.button_up_during_raise.frame_map[this.quadro])
    else if (!ativo && this.estado === 'hold') this.iniciar('lower')
  }

  atualizar(delta) {
    if (this.estado === 'hold') return
    this.tempo += delta
    let limite = 0
    while (this.tempo >= this.dados[this.arte].frames[this.quadro].duration_ms && limite++ < 500) {
      this.tempo -= this.dados[this.arte].frames[this.quadro].duration_ms
      if (++this.indice >= this.seq.length) {
        if (this.estado === 'idle') this.indice = 0
        else {
          const proximo = this.estado === 'raise' ? (this.pressionado ? 'hold' : 'lower')
            : this.estado === 'reacao' && this.pressionado ? 'raise' : 'idle'
          this.iniciar(proximo)
          return
        }
      }
      this.emitir()
    }
  }
}
