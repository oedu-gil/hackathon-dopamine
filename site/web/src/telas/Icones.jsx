// Ícones de traço das áreas de adulto (sem emoji, conforme DESIGN.md).
const CAMINHOS = {
  envio: 'M12 16V4m0 0-5 5m5-5 5 5M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3',
  documento: 'M7 3h7l5 5v12a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Zm7 0v5h5M9 13h6M9 17h4',
  ok: 'm5 12 4.5 4.5L19 7',
  nao: 'M6 6l12 12M18 6 6 18',
  grafico: 'M4 20h16M7 16v-5m5 5V7m5 9v-3',
  ia: 'M12 3v3m0 12v3M3 12h3m12 0h3M6 6l2 2m8 8 2 2M6 18l2-2m8-8 2-2M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z',
  emocoes: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm-3.5-7a4.5 4.5 0 0 0 7 0M9 9.5h.01M15 9.5h.01',
  conversa: 'M4 5h11a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H9l-4 3v-3H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Zm15 4h1a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1h-1v3l-4-3h-4',
  coracao: 'M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z',
  causa: 'M4 12h10m0 0-3-3m3 3-3 3M17 6v12M20 6v12',
  memoria: 'M4 5h7v9H4zM13 10h7v9h-7zM7.5 9.5h.01M16.5 14.5h.01',
  quebra: 'M5 5h5a2 2 0 1 1 4 0h5v5a2 2 0 1 0 0 4v5h-5a2 2 0 1 0-4 0H5v-5a2 2 0 1 1 0-4Z',
  sequencia: 'M4 12a2 2 0 1 0 4 0 2 2 0 0 0-4 0Zm6 0a2 2 0 1 0 4 0 2 2 0 0 0-4 0Zm6 0a2 2 0 1 0 4 0 2 2 0 0 0-4 0Z',
}

export default function Icone({ nome, tamanho = 24 }) {
  return (
    <svg width={tamanho} height={tamanho} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={CAMINHOS[nome]} />
    </svg>
  )
}

export const ICONE_HABILIDADE = {
  'reconhecer-emocoes': 'emocoes',
  'resposta-social': 'conversa',
  empatia: 'coracao',
  'causa-efeito-social': 'causa',
}

export const ICONE_JOGO = { memory: 'memoria', puzzle: 'quebra', sequence: 'sequencia' }
