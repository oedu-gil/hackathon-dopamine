// Quebra-cabeça (direção B, Papel recortado). Porta do protótipo aprovado em docs/quebra-cabeca/estudos/prototipo.html.
// Regras em regras.js; aqui ficam só o desenho (DOM + SVG + CSS) e o contrato do hub (jogos/contrato.js).
import './quebra-cabeca.css'
import { Partida, N, COLS } from './regras.js'
import { ALTURA, INCLINACOES, LARGURA, casaXY, emRetrato, encaixar, lugarXY } from './layout.js'
import { recorte, simbolo } from './composicao.js'
import trem from './assets/trem.svg'
import baleia from './assets/baleia.svg'
import foguete from './assets/foguete.svg'

// Imagens de demonstração (feitas por nós). A geração de imagens por tema ainda não existe:
// enquanto isso cada hiperfoco usa a imagem mais próxima; os que não têm usam o trem.
const IMAGENS = {
  trem: { url: trem, proporcao: 5 / 3, tema: 'trem a vapor no campo', descricao: 'Trem colorido com locomotiva vermelha soltando fumaça, num campo verde com céu azul.' },
  baleia: { url: baleia, proporcao: 5 / 3, tema: 'baleia no mar', descricao: 'Baleia azul nadando no mar, com um barquinho na superfície e peixes no fundo de areia.' },
  foguete: { url: foguete, proporcao: 1, tema: 'foguete no espaço', descricao: 'Foguete branco e vermelho decolando num céu noturno com estrelas e lua.' },
}
const IMAGEM_DO_TEMA = { trem: 'trem', aviao: 'foguete' }

// Cores da cartolina (DIRECAO-ARTISTICA.md); valor desconhecido usa o padrão.
const CARTOLINAS = { pessego: '#ffd9a8', menta: '#cdeedd', ceu: '#cfe3ff', lavanda: '#e6dcff' }

const ICONES = {
  dica: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9V16h7v-2.1A6 6 0 0 0 12 3z"/></svg>',
  somOff: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9z"/><path d="M17 9l4 6M21 9l-4 6"/></svg>',
  somOn: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12"/></svg>',
  ok: '<svg viewBox="0 0 24 24" fill="none" stroke="#2a1f3d" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7"/></svg>',
  tablet: '<svg width="200" height="130" viewBox="0 0 200 130" aria-hidden="true"><rect x="14" y="20" width="56" height="90" rx="9" fill="none" stroke="#2a1f3d" stroke-width="4" stroke-dasharray="7 6" opacity=".5"/><rect x="92" y="34" width="96" height="62" rx="9" fill="#fff" stroke="#2a1f3d" stroke-width="4"/><rect x="102" y="44" width="76" height="42" rx="3" fill="#7fc8a9"/><path d="M58 12 Q86 4 104 22" fill="none" stroke="#6a3fc8" stroke-width="5" stroke-linecap="round"/><path d="M92 22 L105 23 L102 10" fill="none" stroke="#6a3fc8" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
}

const escapar = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]))

export function montar(elemento, { tema, opcoes = {}, aoTerminar } = {}) {
  const uid = `qc${Math.random().toString(36).slice(2, 8)}`
  const imagem = IMAGENS[opcoes.imagem] ?? IMAGENS[IMAGEM_DO_TEMA[tema?.id]] ?? IMAGENS.trem
  const cartolina = CARTOLINAS[opcoes.corCartolina] ?? CARTOLINAS.pessego
  const reduzir = opcoes.reduzirMovimento ?? matchMedia('(prefers-reduced-motion: reduce)').matches
  const dur = (ms) => (reduzir ? 0 : ms)

  const raiz = document.createElement('div')
  raiz.className = 'qc-raiz'
  raiz.style.setProperty('--card', cartolina)
  raiz.innerHTML = `
    <svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>
      <filter id="${uid}-blur" x="0" y="0" width="1" height="1"><feGaussianBlur stdDeviation="14" edgeMode="duplicate"/></filter>
      <symbol id="${uid}-comp" viewBox="0 0 500 300">${simbolo({ url: imagem.url, proporcao: imagem.proporcao, filtro: `${uid}-blur` })}</symbol>
    </defs></svg>
    <div class="qc-palco"></div>`
  elemento.append(raiz)
  const palco = raiz.querySelector('.qc-palco')

  let partida, partidaNo = 0
  let fase = 'loading' // loading | error | start | play | done
  let ocupado = false // durante o encaixe, novos toques são ignorados
  let iniciada = false // a partida só conta depois do "Começar"
  let terminou = false // finish() sai uma vez por partida
  let som = false // desligado por padrão, a criança liga no botão
  let morto = false
  let timers = []
  let imgTeste = null

  const depois = (fn, ms) => {
    const t = setTimeout(() => { timers = timers.filter((x) => x !== t); if (!morto) fn() }, ms)
    timers.push(t)
    return t
  }

  // ---- Som opcional (papel), só depois de um toque e só se ligado ----
  let audio
  function papel() {
    if (!som) return
    try {
      audio = audio || new (window.AudioContext || window.webkitAudioContext)()
      const len = Math.floor(audio.sampleRate * 0.07)
      const buf = audio.createBuffer(1, len, audio.sampleRate)
      const d = buf.getChannelData(0)
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len) ** 2
      const fonte = audio.createBufferSource()
      const filtro = audio.createBiquadFilter()
      const ganho = audio.createGain()
      filtro.type = 'bandpass'
      filtro.frequency.value = 2400
      ganho.gain.value = 0.18
      fonte.buffer = buf
      fonte.connect(filtro).connect(ganho).connect(audio.destination)
      fonte.start()
    } catch {
      // sem som neste navegador
    }
  }

  // ---- Montagem do DOM de uma partida ----
  const $ = (seletor) => palco.querySelector(seletor)
  const peca = (p) => palco.querySelector(`.pc[data-p="${p}"]`)

  function montarPartida() {
    const casas = Array.from({ length: N }, (_, c) => {
      const [x, y] = casaXY(c)
      return `<button type="button" class="cell" data-cell="${c}" style="left:${x}px;top:${y}px" aria-label="Casa linha ${Math.floor(c / COLS) + 1}, coluna ${(c % COLS) + 1}"></button>`
    }).join('')
    const lugares = Array.from({ length: N }, (_, s) => {
      const [x, y] = lugarXY(s)
      return `<span class="slot" style="left:${x}px;top:${y}px"></span>`
    }).join('')
    const pecas = Array.from({ length: N }, (_, p) =>
      `<button type="button" class="pc" data-p="${p}" style="--tilt:${INCLINACOES[partida.slotOf[p]]}deg"><span class="in">${recorte(p, `${uid}-comp`)}</span><span class="badge">${ICONES.ok}</span><span class="tag">Esta peça</span></button>`).join('')
    const pontos = Array.from({ length: N }, () => '<i></i>').join('')
    const legenda = `<b>Tema:</b> ${escapar(imagem.tema)}`
    palco.innerHTML = `
      <div class="qc g" role="group" aria-label="Quebra-cabeça. ${escapar(imagem.descricao)}">
        <div class="bar">
          <div class="instr" aria-live="polite"><span class="main" data-r="main"></span><span class="sub" data-r="sub"></span></div>
          <button type="button" class="gbtn" data-r="ajuda">${ICONES.dica}Ajuda</button>
          <button type="button" class="gbtn" data-r="som" aria-pressed="false"></button>
        </div>
        <div class="left">
          <div class="lbl">Modelo</div>
          <div class="pic"><svg viewBox="0 0 500 300" role="img" aria-label="${escapar(imagem.descricao)}"><use href="#${uid}-comp"/></svg></div>
          <p class="cap">${legenda}</p>
        </div>
        <div class="prog"><div class="lbl" data-r="prog"></div><div class="dots" data-r="dots">${pontos}</div></div>
        <div class="boardbg"></div>
        ${casas}
        <div class="traybg"></div>
        ${lugares}
        ${pecas}
        <div class="hintbox" data-r="hintbox"><span>Dica</span></div>
        <button type="button" class="back" data-r="back">Devolver aqui</button>
        <div class="sticker">Pronto!</div>
        <div class="donebox"><div><h2>Você montou a imagem!</h2><p>As 15 peças estão no lugar.</p></div><div class="acts"><button type="button" class="gbtn big primary" data-r="again">Montar de novo</button></div></div>
        <div class="ov" data-ov="loading"><div class="paperstack"><i></i><i></i><i></i></div><h2>Preparando as peças…</h2></div>
        <div class="ov" data-ov="error"><div class="paperstack"><i></i><i></i><i></i></div><h2>Não consegui abrir a imagem</h2><p>Pode ser a internet. Tente de novo; se continuar, um adulto pode escolher outra atividade.</p><div class="acts"><button type="button" class="gbtn big primary" data-r="retry">Tentar de novo</button></div></div>
        <div class="ov" data-ov="start"><div class="bigpic"><svg viewBox="0 0 500 300" aria-hidden="true"><use href="#${uid}-comp"/></svg></div><h2>Vamos montar esta imagem</h2><p class="cap2">${legenda}</p><button type="button" class="gbtn big primary" data-r="start">Começar</button></div>
        <div class="rotate">${ICONES.tablet}<h2>Gire o tablet</h2><p>O quebra-cabeça funciona com o tablet deitado.</p></div>
      </div>`
    ligar()
    ajustar()
  }

  function ligar() {
    const em = (r, fn) => $(`[data-r="${r}"]`).addEventListener('click', fn)
    palco.querySelectorAll('.pc').forEach((el) => el.addEventListener('click', () => tocarPeca(+el.dataset.p)))
    palco.querySelectorAll('.cell').forEach((el) => el.addEventListener('click', () => tocarCasa(+el.dataset.cell)))
    em('back', devolver)
    em('ajuda', ajuda)
    em('som', () => { som = !som; desenhar(); papel() })
    em('start', () => { fase = 'play'; iniciada = true; partida.say('Escolha uma peça'); desenhar() })
    em('retry', carregar)
    em('again', novaPartida)
  }

  // ---- Jogadas (a regra está em Partida; aqui só o tempo do encaixe) ----
  const livre = () => fase === 'play' && !ocupado
  function trava(ms) { ocupado = true; depois(() => { ocupado = false; desenhar() }, ms) }

  function tocarPeca(p) {
    if (!livre()) return
    const r = partida.tocarPeca(p)
    if (r?.tipo === 'selecionou') papel()
    aplicar(r)
  }
  function tocarCasa(c) {
    if (!livre()) return
    aplicar(partida.tocarCasa(c))
  }
  function aplicar(r) {
    if (r?.tipo === 'certa' || r?.tipo === 'errada') {
      papel()
      trava(dur(200))
      if (r.tipo === 'certa') {
        const el = peca(r.peca)
        el.classList.add('moving')
        depois(() => {
          el.classList.remove('moving')
          if (!reduzir) { el.classList.add('glue'); depois(() => el.classList.remove('glue'), 200) }
          if (r.completa) concluir()
        }, dur(200))
      }
    }
    desenhar()
  }
  function devolver() {
    if (!livre() || !partida.devolver()) return
    trava(dur(200))
    desenhar()
  }
  function ajuda() {
    if (!livre()) return
    partida.ajuda()
    desenhar()
  }

  function concluir() {
    partida.concluir()
    fase = 'done'
    terminar('completed')
    desenhar()
  }
  function terminar(status) {
    if (terminou) return
    terminou = true
    aoTerminar?.({ status, ...partida.metrics })
  }

  // ---- Carregar a imagem, partida nova ----
  function carregar() {
    fase = 'loading'
    if (palco.firstChild) desenhar()
    imgTeste = new Image()
    imgTeste.onload = () => { if (morto) return; fase = 'start'; desenhar() }
    imgTeste.onerror = () => { if (morto) return; fase = 'error'; desenhar() }
    imgTeste.src = imagem.url
  }
  function novaPartida() {
    timers.forEach(clearTimeout)
    timers = []
    ocupado = false
    iniciada = false
    terminou = false
    partidaNo++
    partida = new Partida(partidaNo)
    fase = 'start'
    montarPartida()
    desenhar()
  }

  // ---- Desenho ----
  function desenhar() {
    const g = palco.firstElementChild
    if (!g) return
    g.classList.toggle('rm', reduzir)
    g.classList.toggle('done', fase === 'done')
    palco.querySelectorAll('.ov').forEach((o) => { o.style.display = o.dataset.ov === fase ? 'flex' : 'none' })
    $('[data-r="main"]').textContent = partida.msg[0]
    $('[data-r="sub"]').textContent = partida.msg[1]
    const botaoSom = $('[data-r="som"]')
    botaoSom.innerHTML = `${som ? ICONES.somOn : ICONES.somOff}Som`
    botaoSom.setAttribute('aria-pressed', String(som))
    botaoSom.setAttribute('aria-label', som ? 'Som ligado' : 'Som desligado')
    $('[data-r="ajuda"]').disabled = fase !== 'play'
    const certas = partida.certas()
    $('[data-r="prog"]').textContent = `${certas} de ${N} encaixadas`
    palco.querySelectorAll('[data-r="dots"] i').forEach((d, i) => d.classList.toggle('on', i < certas))
    for (let p = 0; p < N; p++) {
      const el = peca(p)
      const c = partida.cellOf[p]
      const [x, y] = c === null ? lugarXY(partida.slotOf[p]) : casaXY(c)
      el.style.transform = `translate(${x}px, ${y}px) scale(${c === null ? 0.75 : 1})`
      el.classList.toggle('intray', c === null)
      el.classList.toggle('ok', c === p)
      el.classList.toggle('sel', partida.sel === p)
      el.setAttribute('aria-pressed', String(partida.sel === p))
      el.setAttribute('aria-label', c === p
        ? `Peça encaixada, linha ${Math.floor(p / COLS) + 1}, coluna ${(p % COLS) + 1}`
        : c === null ? `Peça ${partida.slotOf[p] + 1} da bandeja`
          : `Peça fora do lugar, na linha ${Math.floor(c / COLS) + 1}, coluna ${(c % COLS) + 1}`)
      el.tabIndex = c === p || fase !== 'play' ? -1 : 0
    }
    const dica = $('[data-r="hintbox"]')
    if (partida.hint !== null && fase === 'play') {
      const [x, y] = casaXY(partida.hint)
      dica.style.left = `${x}px`
      dica.style.top = `${y}px`
      dica.style.display = 'block'
    } else dica.style.display = 'none'
    const volta = $('[data-r="back"]')
    if (fase === 'play' && partida.sel !== null && partida.cellOf[partida.sel] !== null) {
      const [x, y] = lugarXY(partida.slotOf[partida.sel])
      volta.style.left = `${x}px`
      volta.style.top = `${y}px`
      volta.style.display = 'block'
    } else volta.style.display = 'none'
  }

  // ---- Escala FIT: o palco de 960 x 600 é ampliado ou reduzido para caber ----
  function ajustar() {
    const w = raiz.clientWidth
    const h = raiz.clientHeight
    if (!w || !h) return
    const { escala, x, y } = encaixar(w, h)
    palco.style.transform = `translate(${x}px, ${y}px) scale(${escala})`
    palco.firstElementChild?.classList.toggle('portrait', emRetrato(w, h))
  }
  const observador = new ResizeObserver(ajustar)
  observador.observe(raiz)

  palco.style.width = `${LARGURA}px`
  palco.style.height = `${ALTURA}px`
  partida = new Partida(++partidaNo)
  montarPartida()
  carregar()

  return function desmontar() {
    // Sair no meio de uma partida envia "abandoned"; antes do "Começar" ou depois de terminar, não envia nada.
    if (iniciada && !terminou) terminar('abandoned')
    morto = true
    timers.forEach(clearTimeout)
    observador.disconnect()
    if (imgTeste) { imgTeste.onload = null; imgTeste.onerror = null }
    audio?.close?.().catch?.(() => {})
    raiz.remove()
  }
}
