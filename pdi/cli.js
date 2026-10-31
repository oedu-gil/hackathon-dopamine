import { readFile } from 'node:fs/promises'
import { extrairTexto } from './src/extrairTexto.js'
import { processarPdi } from './src/processarPdi.js'
import { chamarFeatherless } from './src/featherlessClient.js'
import { HABILIDADES } from './src/habilidades.js'

const caminho = process.argv[2]

if (!caminho) {
  console.error('Uso: node cli.js <caminho-do-pdf>')
  process.exit(1)
}

if (!process.env.FEATHERLESS_API_KEY) {
  console.error(
    'FEATHERLESS_API_KEY não encontrada no ambiente.\n' +
      'Crie pdi/.env a partir de pdi/.env.example com sua chave e rode:\n' +
      '  node --env-file=.env cli.js <caminho-do-pdf>',
  )
  process.exit(1)
}

const buffer = await readFile(caminho)
const texto = await extrairTexto(buffer)
const resultado = await processarPdi(texto, HABILIDADES, chamarFeatherless)

console.log(JSON.stringify(resultado, null, 2))
