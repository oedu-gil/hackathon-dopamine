// Uso: npm run dados-demo (precisa do .env com as chaves do Supabase).
// Apaga os PDIs, aprovações e partidas da Ana e cria um histórico de exemplo de 2025 e 2026,
// para os filtros de bimestre, semestre e ano terem o que mostrar. Os outros dados não mudam.
import { bancoConfigurado, db, q } from '../src/db.js'
import { nomeHabilidade } from '../../../pdi/src/habilidades.js'
import { recursosPara } from '../../../pdi/src/recursos.js'

if (!bancoConfigurado) {
  console.error('Configure SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY em site/server/.env.')
  process.exit(1)
}

const ALUNO = 'ana'

const ATENCAO = {
  'reconhecer-emocoes': 'Observe se a criança nomeia o que sente e se percebe a emoção no rosto de outras pessoas.',
  'resposta-social': 'Observe como a criança responde quando alguém a chama, cumprimenta ou convida para brincar.',
  empatia: 'Observe se a criança percebe quando alguém está triste ou precisando de ajuda.',
  'causa-efeito-social': 'Observe se a criança relaciona o que fez com a reação das outras pessoas.',
  'relacao-parte-todo': 'Observe se a criança junta partes para formar um todo, como em encaixes e montagens.',
}
const ATIVIDADES = {
  'reconhecer-emocoes': ['Nomear emoções de personagens ao ler histórias juntos.', 'Brincar de imitar caretas no espelho e dizer qual é a emoção.'],
  'resposta-social': ['Brincadeiras de revezar a vez, como passar a bola.', 'Cumprimentar pessoas conhecidas em situações do dia a dia.'],
  empatia: ['Conversar sobre como um personagem se sentiu em um desenho.', 'Cuidar juntos de uma planta ou de um bichinho de pelúcia.'],
  'causa-efeito-social': ['Contar o que aconteceu depois de uma situação do dia, em ordem.', 'Brincar de faz de conta com consequências simples.'],
  'relacao-parte-todo': ['Montar quebra-cabeças simples juntos.', 'Separar e juntar peças de blocos de montar.'],
}

// Cada PDI vale por um semestre. Os jogos aprovados seguem os tópicos dele.
const PDIS = [
  { data: '2025-02-17', arquivo: 'pdi-ana-2025-1.pdf', habilidades: ['reconhecer-emocoes', 'resposta-social'], jogos: ['memoria', 'sequencia'] },
  { data: '2025-08-04', arquivo: 'pdi-ana-2025-2.pdf', habilidades: ['reconhecer-emocoes', 'empatia'], jogos: ['memoria', 'chuva-emocoes', 'cuidar-amigo'] },
  { data: '2026-02-16', arquivo: 'pdi-ana-2026-1.pdf', habilidades: ['empatia', 'causa-efeito-social'], jogos: ['cuidar-amigo', 'plataforma-amigo', 'chuva-emocoes'] },
  { data: '2026-08-03', arquivo: 'pdi-ana-2026-2.pdf', habilidades: ['empatia', 'relacao-parte-todo'], jogos: ['cuidar-amigo', 'quebra-cabeca', 'chuva-emocoes'] },
]

const resumoPais = (habilidades) => ({
  topicos: habilidades.map(nomeHabilidade),
  porHabilidade: habilidades.map((h) => ({ habilidade: h, atencao: ATENCAO[h], atividades: ATIVIDADES[h], recursos: recursosPara(h) })),
  aviso: 'Estas sugestões são orientações gerais e não substituem acompanhamento profissional.',
  tempoRevisao: 'Sugerimos observar por 4 a 6 semanas e depois conversar com a escola e os profissionais que acompanham a criança.',
})

// Gerador fixo, para o histórico sair igual toda vez.
let semente = 7
const sorte = () => ((semente = (semente * 16807) % 2147483647) / 2147483647)

// Partidas de cada semana até hoje: o acerto sobe devagar com o tempo, e cai um pouco
// quando entra um tópico novo no PDI.
function partidas(pdi, fim) {
  const linhas = []
  const inicio = new Date(`${pdi.data}T12:00:00-03:00`)
  const total = (new Date('2026-10-31') - new Date('2025-02-17')) / 864e5
  for (let d = new Date(inicio.getTime() + 3 * 864e5); d < fim; d = new Date(d.getTime() + 7 * 864e5)) {
    const dias = (d - new Date('2025-02-17')) / 864e5
    const noPdi = (d - inicio) / 864e5
    for (const jogo of pdi.jogos) {
      if (sorte() < 0.25) continue
      const acerto = Math.min(0.95, 0.42 + 0.38 * (dias / total) + 0.06 * Math.min(1, noPdi / 90) + (sorte() - 0.5) * 0.12)
      const attempts = 6 + Math.floor(sorte() * 6)
      const abandonou = sorte() < 0.12 - 0.06 * (dias / total)
      const quando = new Date(d.getTime() + Math.floor(sorte() * 4) * 864e5)
      linhas.push({
        aluno_id: ALUNO,
        jogo_id: jogo,
        status: abandonou ? 'abandoned' : 'completed',
        attempts,
        correct: Math.round(attempts * acerto),
        hints: Math.max(0, Math.round((1 - acerto) * 4 + (sorte() - 0.5) * 2)),
        criado_em: quando.toISOString(),
      })
    }
  }
  return linhas
}

await q(db.from('resultados').delete().eq('aluno_id', ALUNO))
await q(db.from('aprovacoes').delete().eq('aluno_id', ALUNO))
await q(db.from('pdis').delete().eq('aluno_id', ALUNO))

const hoje = new Date()
const resultados = PDIS.flatMap((pdi, i) => partidas(pdi, i + 1 < PDIS.length ? new Date(`${PDIS[i + 1].data}T12:00:00-03:00`) : hoje))

await q(db.from('pdis').insert(PDIS.map((p) => ({
  aluno_id: ALUNO,
  arquivo: p.arquivo,
  itens: p.habilidades.map((h) => ({ habilidade: h, nivel: 1 })),
  resumo_pais: resumoPais(p.habilidades),
  criado_em: new Date(`${p.data}T10:00:00-03:00`).toISOString(),
}))))
const atual = PDIS.at(-1)
await q(db.from('aprovacoes').insert(atual.jogos.map((j) => ({ aluno_id: ALUNO, jogo_id: j, status: 'aprovado' }))))
await q(db.from('resultados').insert(resultados))

console.log(`Ana: ${PDIS.length} PDIs, ${atual.jogos.length} jogos aprovados e ${resultados.length} partidas de exemplo.`)
