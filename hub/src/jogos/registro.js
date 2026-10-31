// Catálogo do hub: fonte única dos jogos. Para adicionar um jogo, crie jogos/<id>/
// seguindo jogos/contrato.js e acrescente uma linha aqui.
import { validarManifesto } from './contrato.js'
import memoria from './memoria/manifesto.js'
import sequencia from './sequencia/manifesto.js'
import chuvaEmocoes from './chuva-emocoes/manifesto.js'
import cuidarAmigo from './cuidar-amigo/manifesto.js'
import plataformaAmigo from './plataforma-amigo/manifesto.js'

// `carregar` só baixa o código do jogo quando a criança abre ele.
export const JOGOS = [
  { ...memoria, carregar: () => import('./memoria/index.js') },
  { ...sequencia, carregar: () => import('./sequencia/index.js') },
  { ...chuvaEmocoes, carregar: () => import('./chuva-emocoes/index.js') },
  { ...cuidarAmigo, carregar: () => import('./cuidar-amigo/index.js') },
  { ...plataformaAmigo, carregar: () => import('./plataforma-amigo/index.js') },
]

JOGOS.forEach(validarManifesto)

export const jogoPorId = (id) => JOGOS.find((j) => j.id === id) ?? null
