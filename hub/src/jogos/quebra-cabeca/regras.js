// Regras do quebra-cabeça, sem DOM: estado da partida e contagem (docs/quebra-cabeca/REGRAS-E-INTERACOES.md).
// A peça p tem a casa certa p (as duas numeradas de 0 a 14, em ordem de leitura).

export const N = 15
export const COLS = 5

// Bandeja embaralhada de forma repetível: a mesma semente dá a mesma ordem.
export function embaralhar(semente) {
  const a = Array.from({ length: N }, (_, i) => i)
  let x = semente * 9301 + 49297
  for (let i = N - 1; i > 0; i--) {
    x = (x * 9301 + 49297) % 233280
    const j = Math.floor((x / 233280) * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export class Partida {
  constructor(semente = 1) {
    this.slotOf = {} // peça -> lugar fixo na bandeja
    embaralhar(semente + 3).forEach((p, s) => { this.slotOf[p] = s })
    this.cellOf = Array(N).fill(null) // peça -> casa onde está (ou null, na bandeja)
    this.occ = Array(N).fill(null) // casa -> peça que está nela
    this.sel = null
    this.hint = null
    this.concluida = false
    this.metrics = { attempts: 0, correct: 0, hints: 0 }
    this.msg = ['Escolha uma peça', '']
  }

  certa(p) { return this.cellOf[p] === p }
  certas() { return this.cellOf.filter((c, p) => c === p).length }
  say(principal, apoio = '') { this.msg = [principal, apoio] }
  limpar() { this.sel = null; this.hint = null }

  tocarPeca(p) {
    if (this.concluida) return null
    const noTabuleiro = this.cellOf[p] !== null
    if (noTabuleiro && (this.certa(p) || (this.sel !== null && this.sel !== p))) return this.tocarCasa(this.cellOf[p])
    if (this.sel === p) {
      this.limpar()
      this.say('Escolha uma peça')
    } else {
      this.sel = p
      if (this.hint !== p) this.hint = null
      this.say('Agora toque na casa dela', noTabuleiro ? 'Ou devolva para a bandeja' : '')
    }
    return { tipo: 'selecionou' }
  }

  // Devolve { tipo: 'certa' | 'errada', peca, completa } quando a jogada conta como tentativa.
  tocarCasa(c) {
    if (this.concluida) return null
    const ocupante = this.occ[c]
    if (ocupante !== null && this.certa(ocupante)) { this.say('Essa casa já está completa'); return { tipo: 'nada' } }
    if (this.sel === null) {
      if (ocupante !== null) return this.tocarPeca(ocupante)
      this.say('Primeiro escolha uma peça')
      return { tipo: 'nada' }
    }
    if (ocupante === this.sel) { this.limpar(); this.say('Escolha uma peça'); return { tipo: 'nada' } }
    return this.colocar(this.sel, c)
  }

  colocar(p, c) {
    this.metrics.attempts++
    const de = this.cellOf[p]
    if (de !== null) this.occ[de] = null
    const ocupante = this.occ[c]
    if (ocupante !== null) this.cellOf[ocupante] = null // a peça que estava na casa volta ao lugar dela
    this.cellOf[p] = c
    this.occ[c] = p
    this.limpar()
    if (p === c) {
      this.metrics.correct++
      this.say('Encaixou!')
      return { tipo: 'certa', peca: p, completa: this.certas() === N }
    }
    this.say('Ela fica em outro lugar', 'Pode trocar quando quiser')
    return { tipo: 'errada', peca: p, completa: false }
  }

  devolver() {
    if (this.sel === null || this.cellOf[this.sel] === null) return false
    this.occ[this.cellOf[this.sel]] = null
    this.cellOf[this.sel] = null
    this.limpar()
    this.say('Escolha uma peça')
    return true
  }

  // Cada dica nova soma 1 em hints; repetir a mesma dica não soma.
  ajuda() {
    if (this.concluida) return false
    let alvo = this.sel
    if (alvo === null) {
      alvo = Array.from({ length: N }, (_, i) => i).find((i) => !this.certa(i))
      this.sel = alvo
    }
    if (this.hint === alvo) { this.say('A dica já está na tela', 'É a casa com o contorno tracejado'); return false }
    this.hint = alvo
    this.metrics.hints++
    this.say('A dica mostra a casa dela', this.cellOf[alvo] !== null ? 'Ou devolva para a bandeja' : '')
    return true
  }

  concluir() {
    this.concluida = true
    this.limpar()
    this.say('Pronto!')
  }
}
