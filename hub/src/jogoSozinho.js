// Abre um jogo sem o hub, para quem está desenvolvendo ele: jogo.html?id=memoria&tema=trem
// Os resultados aparecem no console do navegador.
import '@fontsource/fredoka/400.css'
import { HIPERFOCOS } from './compartilhado/temas.js'
import { JOGOS, jogoPorId } from './jogos/registro.js'

const params = new URLSearchParams(location.search)
const jogo = jogoPorId(params.get('id'))
const tema = HIPERFOCOS.find((h) => h.id === params.get('tema')) ?? HIPERFOCOS[0]
const raiz = document.getElementById('raiz')
document.body.style.margin = '0'

if (!jogo) {
  raiz.innerHTML = `<p style="font: 18px system-ui; padding: 16px">Escolha um jogo: ${JOGOS.map(
    (j) => `<a href="?id=${j.id}">${j.id}</a>`,
  ).join(' · ')}</p>`
} else {
  raiz.style.cssText = 'position: fixed; inset: 0; overflow: auto'
  const { montar } = await jogo.carregar()
  const desmontar = montar(raiz, {
    tema,
    nivel: Number(params.get('nivel')) || 1,
    opcoes: { sons: params.get('sons') !== '0', musica: params.get('musica') === '1', reduzirMovimento: params.get('rm') === '1' },
    aoTerminar: (resultado) => console.info('[jogo] resultado', resultado),
    aoSair: () => {
      desmontar()
      raiz.innerHTML = '<p style="font: 18px system-ui; padding: 16px">O jogo pediu para sair. <a href="">Abrir de novo</a></p>'
    },
  })
  window.__desmontar = desmontar
}
