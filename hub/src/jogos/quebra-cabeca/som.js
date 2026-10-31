// Som curto de papel, gerado na hora. Só toca se a criança ligar o Som (começa desligado).
export function createPaperSound() {
  let ctx = null;
  return {
    play() {
      try {
        ctx ??= new (window.AudioContext || window.webkitAudioContext)();
        const len = Math.floor(ctx.sampleRate * 0.07);
        const buffer = ctx.createBuffer(1, len, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len) ** 2;
        const src = ctx.createBufferSource(), filter = ctx.createBiquadFilter(), gain = ctx.createGain();
        filter.type = 'bandpass';
        filter.frequency.value = 2400;
        gain.gain.value = 0.18;
        src.buffer = buffer;
        src.connect(filter).connect(gain).connect(ctx.destination);
        src.start();
      } catch {
        // sem som neste navegador
      }
    },
    close() {
      ctx?.close().catch(() => {});
      ctx = null;
    },
  };
}
