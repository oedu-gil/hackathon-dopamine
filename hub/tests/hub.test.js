import test from 'node:test'
import assert from 'node:assert/strict'
import { readdir, readFile } from 'node:fs/promises'
import { dirname, join, relative, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import { criarResultado, validarManifesto } from '../src/jogos/contrato.js'

const JOGOS_DIR = new URL('../src/jogos/', import.meta.url)

async function pastasDeJogos() {
  const itens = await readdir(JOGOS_DIR, { withFileTypes: true })
  return itens.filter((i) => i.isDirectory()).map((i) => i.name)
}

const SRC = fileURLToPath(new URL('../src/', import.meta.url))

// caminhos absolutos dos .js de uma pasta, e o destino de cada import relativo
async function arquivosJs(dir) {
  const itens = await readdir(dir, { withFileTypes: true, recursive: true })
  return itens.filter((i) => i.isFile() && /\.jsx?$/.test(i.name)).map((i) => join(i.parentPath ?? i.path, i.name))
}
async function importsRelativos(arquivo) {
  const codigo = await readFile(arquivo, 'utf8')
  return [...codigo.matchAll(/from\s+'(\.[^']+)'|import\('(\.[^']+)'\)/g)].map((m) => {
    const caminho = m[1] ?? m[2]
    return { caminho, alvo: relative(SRC, resolve(dirname(arquivo), caminho)).split(sep).join('/') }
  })
}

test('cada pasta de jogo tem manifesto.js e index.js, e está no registro', async () => {
  const registro = await readFile(new URL('registro.js', JOGOS_DIR), 'utf8')
  for (const id of await pastasDeJogos()) {
    const arquivos = await readdir(new URL(`${id}/`, JOGOS_DIR))
    assert.ok(arquivos.includes('manifesto.js'), `${id} sem manifesto.js`)
    assert.ok(arquivos.includes('index.js'), `${id} sem index.js`)
    assert.ok(registro.includes(`'./${id}/manifesto.js'`), `${id} fora do registro`)
    assert.ok(registro.includes(`import('./${id}/index.js')`), `${id} sem carregar() no registro`)
    const manifesto = await readFile(new URL(`${id}/manifesto.js`, JOGOS_DIR), 'utf8')
    assert.ok(manifesto.includes(`id: '${id}'`), `${id}: o id do manifesto precisa ser o nome da pasta`)
  }
})

test('um jogo só importa da própria pasta e de compartilhado/', async () => {
  for (const id of await pastasDeJogos()) {
    for (const arquivo of await arquivosJs(join(SRC, 'jogos', id))) {
      for (const { caminho, alvo } of await importsRelativos(arquivo)) {
        const dentro = alvo.startsWith(`jogos/${id}/`) || alvo.startsWith('compartilhado/')
        assert.ok(dentro, `${id}: ${relative(SRC, arquivo)} importa ${caminho}`)
      }
    }
  }
})

test('compartilhado/ não importa nenhum jogo nem o hub', async () => {
  for (const arquivo of await arquivosJs(join(SRC, 'compartilhado'))) {
    for (const { caminho, alvo } of await importsRelativos(arquivo)) {
      assert.ok(alvo.startsWith('compartilhado/'), `${relative(SRC, arquivo)} importa ${caminho}`)
    }
  }
})

test('o manifesto exige id, nome, descrição, ícone e habilidades', () => {
  const ok = { id: 'teste', nome: 'Teste', descricao: 'Um jogo.', icone: '/a.svg', habilidades: ['empatia'] }
  assert.equal(validarManifesto(ok), ok)
  assert.throws(() => validarManifesto({ ...ok, id: 'Com Espaço' }))
  assert.throws(() => validarManifesto({ ...ok, habilidades: [] }))
  assert.throws(() => validarManifesto({ ...ok, icone: '' }))
})

test('o resultado segue o formato que o site envia ao servidor', () => {
  assert.deepEqual(criarResultado({ status: 'completed', attempts: 4, correct: 3 }), { status: 'completed', attempts: 4, correct: 3, hints: 0 })
  assert.throws(() => criarResultado({ status: 'pausado' }))
  assert.throws(() => criarResultado({ status: 'completed', attempts: 1, correct: 2 }))
})
