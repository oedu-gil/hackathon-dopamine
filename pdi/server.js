import { pathToFileURL } from 'node:url'
import express from 'express'
import cors from 'cors'
import multer from 'multer'
import { extrairTexto } from './src/extrairTexto.js'
import { processarPdi } from './src/processarPdi.js'
import { chamarFeatherless } from './src/featherlessClient.js'
import { HABILIDADES } from './src/habilidades.js'

const upload = multer({ storage: multer.memoryStorage() })

export function criarApp(chamarLLM = chamarFeatherless) {
  const app = express()
  app.use(cors())

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' })
  })

  app.post('/pdi', upload.single('pdf'), async (req, res) => {
    if (!req.file) {
      res.status(400).json({ erro: 'Nenhum arquivo pdf enviado (campo "pdf")' })
      return
    }

    const texto = await extrairTexto(req.file.buffer)
    const resultado = await processarPdi(texto, HABILIDADES, chamarLLM)
    res.json(resultado)
  })

  return app
}

const executadoDiretamente = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href
if (executadoDiretamente) {
  const PORT = process.env.PORT || 3000
  criarApp().listen(PORT, () => {
    console.log(`pdi: servidor rodando em http://localhost:${PORT}`)
  })
}
