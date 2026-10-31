import { useState } from 'react'
import PhaserGame from './PhaserGame'
import Pdi from './telas/Pdi'
import EscolhaHiperfoco from './telas/EscolhaHiperfoco'
import Jogos from './telas/Jogos'
import Colecao from './telas/Colecao'
import { estado, registrarAcerto } from './progresso.js'
import './App.css'

// Telas: pdi -> hiperfoco -> jogos -> (jogo | colecao)
function App() {
  const [tela, setTela] = useState('pdi')
  const [pdi, setPdi] = useState({ nome: '', itens: [] })
  const [hiperfoco, setHiperfoco] = useState(null)
  const [opcoes, setOpcoes] = useState({ velocidade: 1, efeitos: true })
  const [partida, setPartida] = useState(null)

  const ctx = partida && {
    hiperfoco,
    nivel: partida.nivel,
    velocidade: opcoes.velocidade,
    efeitos: opcoes.efeitos,
    sair: () => setTela('jogos'),
    estado: () => estado(hiperfoco),
    registrarAcerto: () => registrarAcerto(hiperfoco),
  }

  return (
    <main>
      <h1>Hackathon Dopamine</h1>
      {tela === 'pdi' && <Pdi pdi={pdi} setPdi={setPdi} avancar={() => setTela('hiperfoco')} />}
      {tela === 'hiperfoco' && (
        <EscolhaHiperfoco
          nome={pdi.nome}
          escolher={(h) => {
            setHiperfoco(h)
            setTela('jogos')
          }}
        />
      )}
      {tela === 'jogos' && (
        <Jogos
          pdi={pdi}
          hiperfoco={hiperfoco}
          opcoes={opcoes}
          setOpcoes={setOpcoes}
          jogar={(r) => {
            setPartida({ cena: r.jogo.cena, nivel: r.nivel })
            setTela('jogo')
          }}
          verColecao={() => setTela('colecao')}
          trocar={() => setTela('hiperfoco')}
        />
      )}
      {tela === 'colecao' && <Colecao hiperfoco={hiperfoco} voltar={() => setTela('jogos')} />}
      {tela === 'jogo' && <PhaserGame key={partida.cena} cena={partida.cena} ctx={ctx} />}
    </main>
  )
}

export default App
