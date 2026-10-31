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
  sair: 'M10 4H6a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h4m5-12-4 4 4 4m-4-4h10',
  voltar: 'M15 5l-7 7 7 7',
  avancar: 'm9 5 7 7-7 7',
  trocar: 'M4 8h13l-3-3m6 11H7l3 3',
  jogar: 'M8 5.5v13a.5.5 0 0 0 .77.42l10-6.5a.5.5 0 0 0 0-.84l-10-6.5A.5.5 0 0 0 8 5.5Z',
  estrela: 'm12 3 2.7 5.6 6.1.8-4.5 4.2 1.1 6-5.4-2.9-5.4 2.9 1.1-6-4.5-4.2 6.1-.8Z',
  cadeado: 'M7 11V8a5 5 0 0 1 10 0v3M6 11h12a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1Z',
  trofeu: 'M8 4h8v5a4 4 0 0 1-8 0V4Zm0 2H5v1a3 3 0 0 0 3 3m8-4h3v1a3 3 0 0 1-3 3m-4 3v4m-4 3h8m-6 0v-3h4v3',
  escola: 'M3 10 12 5l9 5-9 5-9-5Zm4 2.3V17c0 1 2.2 2.5 5 2.5s5-1.5 5-2.5v-4.7M21 10v5',
  familia: 'M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm9 1a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM3 20v-1a5 5 0 0 1 10 0v1m2 0v-1a4 4 0 0 1 6-3.5',
  crianca: 'M12 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-5 5 5-3 5 3m-5-3v5m-3 5 3-5 3 5',
  calendario: 'M7 3v3m10-3v3M4 8h16M5 5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Zm3 7h2m4 0h2m-8 4h2',
  link: 'M14 4h6v6m0-6-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5',
  lupa: 'M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14Zm5-2 4 4',
  folha: 'M5 19c0-8 5-14 15-14 0 10-6 15-14 15m-1-1 7-7',
  info: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-10v5m0-8h.01',
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
  'relacao-parte-todo': 'quebra',
}

export const ICONE_JOGO = {
  memoria: 'memoria',
  sequencia: 'sequencia',
  'chuva-emocoes': 'memoria',
  'cuidar-amigo': 'memoria',
  'plataforma-amigo': 'sequencia',
  'quebra-cabeca': 'quebra',
}
