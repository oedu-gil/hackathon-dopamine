import { resolve } from 'node:path';
import { defineConfig } from 'vite';

// Configuração própria da sequência: abre e gera só este jogo, sem o menu nem os assets da base.
export default defineConfig({
  publicDir: false,
  server: { host: '127.0.0.1', port: 5175, strictPort: true },
  preview: { host: '127.0.0.1', port: 4175, strictPort: true },
  build: {
    outDir: 'dist/sequencia',
    emptyOutDir: true,
    assetsInlineLimit: 0, // o contrato aceita apenas URLs http(s), não data:
    rolldownOptions: { input: resolve(import.meta.dirname, 'sequencia.html') },
  },
});
