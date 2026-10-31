// Regras da Guerra de tortas sem Phaser, para testar sem navegador.

// Ajustes por nível do PDI. O nível 1 é o mais calmo: tortas lentas, bandeja erguida por
// mais tempo, guaxinim desprotegido por mais tempo e espera máxima menor.
// Tempos em milissegundos.
export const NIVEIS = {
  1: { voo: 2200, bandeja: 1600, intervaloLancar: 4200, aberto: 2600, chanceDefender: 0.35, esperaMax: 2000 },
  2: { voo: 1700, bandeja: 1300, intervaloLancar: 3400, aberto: 2000, chanceDefender: 0.5, esperaMax: 3000 },
  3: { voo: 1300, bandeja: 1000, intervaloLancar: 2700, aberto: 1500, chanceDefender: 0.6, esperaMax: 4000 },
}

export const TORTAS_PARA_ENCHER = 5
export const AVISO = 600 // o balão aparece este tempo antes de cada ação do guaxinim
export const GUARDA = { min: 1200, max: 2200 }

export const configDoNivel = (nivel) => NIVEIS[Math.min(3, Math.max(1, Math.round(nivel) || 1))]

// Garantia contra espera longa: com a criança segurando uma torta desde `esperandoDesde`,
// o guaxinim começa a abrir a guarda a tempo de ficar desprotegido em até `esperaMax`.
export function deveAbrirGuarda({ agora, esperandoDesde, config }) {
  return esperandoDesde !== null && agora - esperandoDesde >= config.esperaMax - AVISO
}

// O que o guaxinim faz quando termina uma ação: 'lancar', 'defender' ou 'aberto'.
// Só lança depois de `intervaloLancar` desde o último lançamento.
export function proximaAcao({ agora, ultimoLancamento, esperandoDesde, config, aleatorio = Math.random }) {
  if (agora - ultimoLancamento >= config.intervaloLancar && aleatorio() < 0.5) return 'lancar'
  if (deveAbrirGuarda({ agora, esperandoDesde, config })) return 'aberto'
  return aleatorio() < config.chanceDefender ? 'defender' : 'aberto'
}

export const duracaoGuarda = (aleatorio = Math.random) => GUARDA.min + aleatorio() * (GUARDA.max - GUARDA.min)
