import express from 'express'
import cors from 'cors'
import { bancoConfigurado } from './db.js'
import { rotas } from './rotas.js'

const PORT = Number(process.env.PORT) || 3001
const WEB_ORIGIN = process.env.WEB_ORIGIN || 'http://127.0.0.1:5180'

const app = express()
app.use(cors({ origin: WEB_ORIGIN }))
app.use(express.json())

app.get('/health', (req, res) => res.json({ ok: true, banco: bancoConfigurado }))

app.use('/api', (req, res, next) => {
  if (!bancoConfigurado) {
    return res.status(503).json({ erro: 'Banco não configurado: preencha SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY em site/server/.env.' })
  }
  next()
}, rotas)

// Express 5 repassa erros de rotas async para cá. Nunca devolve detalhes internos ao navegador.
app.use((err, req, res, _next) => {
  console.error('erro na rota', req.method, req.path, err.message)
  res.status(500).json({ erro: 'Algo deu errado no servidor. Tente de novo.' })
})

app.listen(PORT, '127.0.0.1', () => {
  console.log(`site-server em http://127.0.0.1:${PORT}`)
  if (!bancoConfigurado) console.warn('Aviso: Supabase não configurado (veja site/server/.env.example).')
})
