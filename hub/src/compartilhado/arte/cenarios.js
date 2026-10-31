// Cenários de fundo (800 x 450) no estilo "papel recortado" do quebra-cabeça: formas de cor
// chapada, cada camada com uma sombra chapada embaixo, sem contorno e sem degradê.
// O meio da tela fica calmo (só céu) para o que acontece no jogo aparecer bem; o canto de cima
// à esquerda fica livre para o painel de progresso. Os enfeites do tema ficam nas laterais e
// no chão (faixa de y = 372 a 450).

const SOMBRA = 'rgba(42,31,61,0.16)'

// Forma com sombra chapada, como papel colado em cima de outro.
const recorte = (d, cor, dy = 5) =>
  `<path d="${d}" fill="${SOMBRA}" transform="translate(0 ${dy})"/><path d="${d}" fill="${cor}"/>`

const nuvem = (x, y, s = 1) => {
  const d = `M${x} ${y} q${-34 * s} 0 ${-34 * s} ${-20 * s} q0 ${-20 * s} ${26 * s} ${-20 * s} q${10 * s} ${-26 * s} ${44 * s} ${-18 * s} q${30 * s} ${-12 * s} ${46 * s} ${16 * s} q${30 * s} 0 ${30 * s} ${22 * s} q0 ${20 * s} ${-26 * s} ${20 * s} z`
  return recorte(d, '#fffaf2', 4)
}

const sol = (x, y, r = 34) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${SOMBRA}" transform="translate(0 4)"/><circle cx="${x}" cy="${y}" r="${r}" fill="#ffd166"/>`

const svg = (fundo, interno) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450" width="800" height="450"><rect width="800" height="450" fill="${fundo}"/>${interno}</svg>`

const colinas = (cor1, cor2) =>
  recorte('M0 300 Q140 236 300 286 T620 268 T800 262 V450 H0Z', cor1, 6) +
  recorte('M0 346 Q180 312 360 340 T800 330 V450 H0Z', cor2, 6)

const TREM = svg(
  '#a8d8ea',
  sol(712, 70) +
    nuvem(150, 96) +
    nuvem(560, 70, 0.8) +
    colinas('#8cc084', '#5e9c5a') +
    // estação à esquerda
    recorte('M24 336 V262 H132 V336Z', '#f4a261') +
    recorte('M14 266 L78 226 L142 266Z', '#d1495b') +
    `<rect x="52" y="290" width="26" height="46" rx="4" fill="#6b4f3a"/><rect x="92" y="282" width="26" height="20" rx="3" fill="#fff3c4"/>` +
    // semáforo à direita
    `<rect x="724" y="270" width="8" height="70" fill="#333d47"/>` +
    recorte('M708 222 h40 v56 h-40z', '#333d47', 4) +
    `<circle cx="728" cy="238" r="8" fill="#e76f51"/><circle cx="728" cy="262" r="8" fill="#7fc8a9"/>` +
    // trilhos
    recorte('M0 372 H800 V450 H0Z', '#c9b48a', 0) +
    `<g fill="#6b4f3a">${Array.from({ length: 20 }, (_, i) => `<rect x="${i * 42 + 6}" y="382" width="22" height="34" rx="3"/>`).join('')}</g>` +
    `<rect y="388" width="800" height="6" fill="#4a5560"/><rect y="404" width="800" height="6" fill="#4a5560"/>`,
)

const teia = (cx, cy, r) => {
  const raios = Array.from({ length: 8 }, (_, i) => {
    const a = (i * Math.PI) / 4
    return `M${cx} ${cy} L${(cx + Math.cos(a) * r).toFixed(1)} ${(cy + Math.sin(a) * r).toFixed(1)}`
  }).join(' ')
  const aneis = [0.35, 0.65, 0.95]
    .map((k) => {
      const pts = Array.from({ length: 8 }, (_, i) => {
        const a = (i * Math.PI) / 4
        return `${(cx + Math.cos(a) * r * k).toFixed(1)},${(cy + Math.sin(a) * r * k).toFixed(1)}`
      })
      return `<polygon points="${pts.join(' ')}"/>`
    })
    .join('')
  return `<g fill="none" stroke="#fffaf2" stroke-width="3" stroke-linejoin="round"><path d="${raios}"/>${aneis}</g>`
}

const flor = (x, y, cor) =>
  `<rect x="${x - 2}" y="${y}" width="4" height="${380 - y}" fill="#3f7f4a"/>` +
  [0, 72, 144, 216, 288]
    .map((g) => `<ellipse cx="${x}" cy="${y - 11}" rx="7" ry="11" fill="${cor}" transform="rotate(${g} ${x} ${y})"/>`)
    .join('') +
  `<circle cx="${x}" cy="${y}" r="7" fill="#ffd166"/>`

const ARANHA = svg(
  '#bfe3f0',
  sol(560, 46, 26) +
    nuvem(470, 80, 0.9) +
    // galho com folhas no canto direito, segurando a teia
    `<path d="M560 0 Q640 40 800 30" stroke="#8a5a3c" stroke-width="14" fill="none" stroke-linecap="round"/>` +
    recorte('M640 34 Q660 4 696 10 Q684 34 640 34Z', '#4f9d5a', 3) +
    recorte('M720 30 Q750 52 784 44 Q764 20 720 30Z', '#4f9d5a', 3) +
    teia(700, 120, 82) +
    colinas('#9ccf8a', '#6fb267') +
    // capim e flores nas laterais
    recorte('M0 372 Q40 300 60 372 Q90 316 110 372 Q130 330 160 372Z', '#4f9d5a', 4) +
    recorte('M640 372 Q670 318 700 372 Q730 300 760 372 Q780 326 800 372Z', '#4f9d5a', 4) +
    flor(200, 330, '#f28482') +
    flor(240, 346, '#fff3c4') +
    flor(590, 336, '#cdb4f5') +
    recorte('M0 372 H800 V450 H0Z', '#7fb069', 0) +
    `<g fill="#6aa05a">${Array.from({ length: 16 }, (_, i) => `<ellipse cx="${i * 52 + 20}" cy="${400 + (i % 3) * 14}" rx="14" ry="4"/>`).join('')}</g>`,
)

const AVIAO = svg(
  '#9fd8f7',
  `<rect y="200" width="800" height="120" fill="#c4e8fb"/>` +
    sol(724, 64, 30) +
    nuvem(300, 90) +
    nuvem(640, 130, 0.8) +
    nuvem(120, 230, 0.7) +
    // prédios baixos ao fundo
    `<g>${[
      [0, 286, 70, '#f4a261'],
      [74, 300, 56, '#e9c46a'],
      [612, 276, 60, '#f28482'],
      [676, 296, 54, '#e9c46a'],
      [734, 284, 66, '#457b9d'],
    ]
      .map(([x, y, w, c]) => recorte(`M${x} ${y} h${w} V372 h${-w}z`, c, 0) + `<g fill="#fff3c4">${[0, 1].map((k) => `<rect x="${x + 12 + k * (w / 2 - 4)}" y="${y + 16}" width="12" height="14" rx="2"/>`).join('')}</g>`)
      .join('')}</g>` +
    // torre de controle
    recorte('M160 372 V250 H184 V372Z', '#eef2f5', 0) +
    recorte('M146 226 h52 l-6 28 h-40z', '#2a6f97', 4) +
    `<rect x="154" y="232" width="36" height="12" rx="3" fill="#d6eef7"/>` +
    // pista
    recorte('M0 372 H800 V450 H0Z', '#8d99a6', 0) +
    `<g fill="#fffaf2">${Array.from({ length: 10 }, (_, i) => `<rect x="${i * 84 + 14}" y="406" width="44" height="8" rx="3"/>`).join('')}</g>`,
)

const palmeira = (x, base, altura) =>
  `<path d="M${x} ${base} Q${x - 12} ${base - altura / 2} ${x + 6} ${base - altura}" stroke="#8a5a3c" stroke-width="12" fill="none" stroke-linecap="round"/>` +
  [
    `M${x + 6} ${base - altura} q-40 -20 -64 6 q30 -12 64 -6z`,
    `M${x + 6} ${base - altura} q-26 -40 -60 -40 q32 16 60 40z`,
    `M${x + 6} ${base - altura} q14 -44 50 -46 q-28 20 -50 46z`,
    `M${x + 6} ${base - altura} q40 -16 64 10 q-32 -10 -64 -10z`,
  ]
    .map((d) => recorte(d, '#4f9d5a', 3))
    .join('')

const DINOSSAURO = svg(
  '#ffe0b5',
  sol(640, 52, 28) +
    nuvem(250, 92, 0.8) +
    nuvem(580, 70, 0.7) +
    // vulcão ao fundo, à direita, sem fumaça animada
    recorte('M560 340 L668 170 H716 L800 300 V340Z', '#7a5a8c', 6) +
    `<path d="M668 170 H716 L726 190 Q710 182 700 196 Q690 182 678 194 Q670 182 658 188Z" fill="#e76f51"/>` +
    `<g fill="#cdbfcf"><circle cx="684" cy="150" r="14"/><circle cx="704" cy="128" r="18"/><circle cx="730" cy="108" r="20"/></g>` +
    colinas('#e9c46a', '#d4a85c') +
    palmeira(70, 372, 160) +
    palmeira(150, 372, 110) +
    recorte('M0 372 H800 V450 H0Z', '#c99a5b', 0) +
    `<g fill="#a87b45"><ellipse cx="300" cy="408" rx="22" ry="7"/><ellipse cx="520" cy="428" rx="16" ry="5"/><ellipse cx="700" cy="404" rx="20" ry="6"/></g>` +
    // pegadas no chão
    `<g fill="#a87b45">${[220, 380, 460, 620]
      .map((x, i) => `<g transform="translate(${x} ${i % 2 ? 426 : 412})"><ellipse rx="9" ry="7"/><circle cx="-9" cy="-10" r="3.5"/><circle cx="0" cy="-13" r="3.5"/><circle cx="9" cy="-10" r="3.5"/></g>`)
      .join('')}</g>`,
)

export const CENARIOS = { trem: TREM, aranha: ARANHA, aviao: AVIAO, dinossauro: DINOSSAURO }

// Cores do céu e do chão de cada cenário, para pintar as faixas que sobram em volta do jogo
// quando a tela não tem o mesmo formato (16:9) do canvas.
export const BORDAS = {
  trem: { ceu: '#a8d8ea', chao: '#c9b48a' },
  aranha: { ceu: '#bfe3f0', chao: '#7fb069' },
  aviao: { ceu: '#9fd8f7', chao: '#8d99a6' },
  dinossauro: { ceu: '#ffe0b5', chao: '#c99a5b' },
}

export const cenarioDoTema = (id) => CENARIOS[id] ?? CENARIOS.trem
export const bordasDoTema = (id) => BORDAS[id] ?? BORDAS.trem
