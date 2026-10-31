import { Router } from 'express'
import multer from 'multer'
import { db, q } from './db.js'
import { sugerirJogos, nivelDoJogo, calcularXp, resumirDesempenho, validarResultado } from './regras.js'
import { HABILIDADES } from '../../../pdi/src/habilidades.js'

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } })

export const rotas = Router()

// Login simulado: compara com a tabela usuarios. O "token" é o id do usuário (só para a demo).
rotas.post('/login', async (req, res) => {
  const { email, senha } = req.body ?? {}
  const [usuario] = await q(
    db.from('usuarios').select('id, nome, perfil, aluno_id').eq('email', String(email ?? '').trim().toLowerCase()).eq('senha', String(senha ?? '')).limit(1),
  )
  if (!usuario) return res.status(401).json({ erro: 'E-mail ou senha incorretos.' })
  res.json({ usuario })
})

// Daqui para baixo, toda rota exige o cabeçalho x-usuario.
rotas.use(async (req, res, next) => {
  const id = req.get('x-usuario')
  if (!id) return res.status(401).json({ erro: 'Faça login.' })
  const [usuario] = await q(db.from('usuarios').select('id, nome, perfil, aluno_id').eq('id', id).limit(1))
  if (!usuario) return res.status(401).json({ erro: 'Faça login.' })
  req.usuario = usuario
  next()
})

function podeVerAluno(usuario, alunoId) {
  return usuario.perfil === 'escola' || usuario.aluno_id === alunoId
}

function soEscola(req, res, next) {
  if (req.usuario.perfil !== 'escola') return res.status(403).json({ erro: 'Só a escola pode fazer isso.' })
  next()
}

rotas.param('alunoId', (req, res, next, alunoId) => {
  if (!podeVerAluno(req.usuario, alunoId)) return res.status(403).json({ erro: 'Sem acesso a este aluno.' })
  next()
})

rotas.get('/alunos', soEscola, async (req, res) => {
  res.json(await q(db.from('alunos').select('id, nome').order('nome')))
})

rotas.get('/habilidades', (req, res) => res.json(HABILIDADES))

async function ultimoPdi(alunoId) {
  const [pdi] = await q(db.from('pdis').select('*').eq('aluno_id', alunoId).order('criado_em', { ascending: false }).limit(1))
  return pdi ?? null
}

// Visão do aluno adaptada ao perfil de quem pede.
rotas.get('/alunos/:alunoId', async (req, res) => {
  const { alunoId } = req.params
  const [aluno] = await q(db.from('alunos').select('*').eq('id', alunoId).limit(1))
  if (!aluno) return res.status(404).json({ erro: 'Aluno não encontrado.' })

  const [pdi, jogos, aprovacoes, resultados] = await Promise.all([
    ultimoPdi(alunoId),
    q(db.from('jogos').select('*').order('nome')),
    q(db.from('aprovacoes').select('jogo_id, status').eq('aluno_id', alunoId)),
    q(db.from('resultados').select('status').eq('aluno_id', alunoId)),
  ])

  const statusPorJogo = Object.fromEntries(aprovacoes.map((a) => [a.jogo_id, a.status]))
  const itensPdi = pdi?.itens ?? []
  const comStatus = jogos
    .filter((j) => statusPorJogo[j.id])
    .map((j) => ({ ...j, status: statusPorJogo[j.id], nivel: nivelDoJogo(itensPdi, j) }))
  const xp = calcularXp(resultados)
  const { perfil } = req.usuario

  if (perfil === 'crianca') {
    // A criança vê só os jogos aprovados para ela, nunca o banco inteiro.
    return res.json({ aluno, xp, jogos: comStatus.filter((j) => j.status === 'aprovado') })
  }

  if (perfil === 'responsavel') {
    // Resumo completo para os pais: tópicos, pontos de atenção e atividades
    // por habilidade, links de pesquisa curados e aviso — tudo já vem pronto
    // e validado de processarPdi() (ver pdi/src/processarPdi.js), nunca
    // gerado aqui. Nenhuma ação é sugerida.
    const resumo = pdi?.resumo_pais ?? null
    return res.json({ aluno, xp, resumo, jogos: comStatus.filter((j) => j.status === 'aprovado') })
  }

  res.json({ aluno, xp, pdi, jogos: comStatus })
})

// Envio do PDI em PDF: extrai o texto, a IA identifica as habilidades e o site sugere jogos.
rotas.post('/alunos/:alunoId/pdi', soEscola, upload.single('pdf'), async (req, res) => {
  if (!req.file) return res.status(400).json({ erro: 'Envie um arquivo PDF no campo "pdf".' })
  const { alunoId } = req.params

  // Import tardio: o servidor sobe mesmo sem as dependências de pdi/ instaladas.
  const [{ extrairTexto }, { processarPdi }, { chamarFeatherless }] = await Promise.all([
    import('../../../pdi/src/extrairTexto.js'),
    import('../../../pdi/src/processarPdi.js'),
    import('../../../pdi/src/featherlessClient.js'),
  ])

  const texto = await extrairTexto(req.file.buffer)
  const resultado = await processarPdi(texto, HABILIDADES, chamarFeatherless)

  const [pdi] = await q(
    db.from('pdis').insert({
      aluno_id: alunoId,
      arquivo: req.file.originalname,
      itens: resultado.itens,
      resumo_pais: resultado.resumoPais,
      erro: resultado.erro ?? null,
    }).select(),
  )

  // Um PDI novo recomeça a aprovação: os jogos sugeridos voltam a "sugerido".
  await q(db.from('aprovacoes').delete().eq('aluno_id', alunoId))
  const sugeridos = sugerirJogos(resultado.itens, await q(db.from('jogos').select('*')))
  if (sugeridos.length) {
    await q(db.from('aprovacoes').insert(sugeridos.map((j) => ({ aluno_id: alunoId, jogo_id: j.id, status: 'sugerido' }))))
  }

  res.status(resultado.erro === 'pdf-sem-texto' ? 422 : 201).json({ pdi, sugeridos: sugeridos.map((j) => j.id) })
})

rotas.patch('/alunos/:alunoId/jogos/:jogoId', soEscola, async (req, res) => {
  const { status } = req.body ?? {}
  if (!['aprovado', 'recusado', 'sugerido'].includes(status)) return res.status(400).json({ erro: 'Status inválido.' })
  const linhas = await q(
    db.from('aprovacoes').update({ status, atualizado_em: new Date().toISOString() })
      .eq('aluno_id', req.params.alunoId).eq('jogo_id', req.params.jogoId).select(),
  )
  if (!linhas.length) return res.status(404).json({ erro: 'Este jogo não foi sugerido para o aluno.' })
  res.json(linhas[0])
})

rotas.patch('/alunos/:alunoId/hiperfoco', async (req, res) => {
  const { hiperfoco } = req.body ?? {}
  if (typeof hiperfoco !== 'string' || !hiperfoco) return res.status(400).json({ erro: 'Tema inválido.' })
  const [aluno] = await q(db.from('alunos').update({ hiperfoco }).eq('id', req.params.alunoId).select())
  res.json(aluno)
})

// Recebe o resultado de uma partida, no formato de createResult() dos jogos.
rotas.post('/alunos/:alunoId/resultados', async (req, res) => {
  const { jogoId, status, attempts, correct, hints = 0 } = req.body ?? {}
  const erro = validarResultado({ status, attempts, correct, hints })
  if (erro) return res.status(400).json({ erro })

  const [aprovacao] = await q(
    db.from('aprovacoes').select('status').eq('aluno_id', req.params.alunoId).eq('jogo_id', jogoId).limit(1),
  )
  if (aprovacao?.status !== 'aprovado') return res.status(403).json({ erro: 'Jogo não aprovado para este aluno.' })

  await q(db.from('resultados').insert({ aluno_id: req.params.alunoId, jogo_id: jogoId, status, attempts, correct, hints }))
  const resultados = await q(db.from('resultados').select('status').eq('aluno_id', req.params.alunoId))
  res.status(201).json({ xp: calcularXp(resultados) })
})

rotas.get('/alunos/:alunoId/desempenho', async (req, res) => {
  if (req.usuario.perfil === 'crianca') return res.status(403).json({ erro: 'Sem acesso.' })
  const [jogos, resultados] = await Promise.all([
    q(db.from('jogos').select('id, nome').order('nome')),
    q(db.from('resultados').select('*').eq('aluno_id', req.params.alunoId)),
  ])
  res.json({ porJogo: resumirDesempenho(resultados, jogos), totalPartidas: resultados.length, xp: calcularXp(resultados) })
})

// Histórico para a escola e a família: todos os PDIs (só os tópicos) e todas as partidas com data.
// O site recorta por bimestre, semestre ou ano e resume com resumirDesempenho().
rotas.get('/alunos/:alunoId/historico', async (req, res) => {
  if (req.usuario.perfil === 'crianca') return res.status(403).json({ erro: 'Sem acesso.' })
  const { alunoId } = req.params
  const [jogos, pdis, resultados] = await Promise.all([
    q(db.from('jogos').select('id, nome').order('nome')),
    q(db.from('pdis').select('id, arquivo, itens, erro, criado_em').eq('aluno_id', alunoId).order('criado_em')),
    q(db.from('resultados').select('jogo_id, status, attempts, correct, hints, criado_em').eq('aluno_id', alunoId).order('criado_em')),
  ])
  const nome = (id) => HABILIDADES.find((h) => h.id === id)?.nome ?? id
  res.json({
    jogos,
    pdis: pdis.filter((p) => !p.erro).map((p) => ({ id: p.id, arquivo: p.arquivo, criado_em: p.criado_em, topicos: p.itens.map((i) => nome(i.habilidade)) })),
    resultados,
  })
})
