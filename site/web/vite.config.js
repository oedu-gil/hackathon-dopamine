import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Porta 5180 para não colidir com os jogos (5173). /api vai para o site-server.
// Os jogos moram em hub/src/jogos e o site os importa pelo alias @hub (contrato em hub/src/jogos/contrato.js).
const hub = resolve(import.meta.dirname, '../../hub/src')

export default defineConfig({
  // Caminhos relativos: o build funciona em qualquer subpasta (GitHub Pages) com HashRouter.
  base: './',
  plugins: [react()],
  resolve: {
    alias: {
      '@hub': hub,
      // o hub não precisa ter node_modules instalado: o Phaser vem do site
      phaser: resolve(import.meta.dirname, 'node_modules/phaser'),
    },
  },
  build: {
    // a memória e a sequência só aceitam imagens por URL http(s), não data:
    assetsInlineLimit: 0,
  },
  server: {
    host: '127.0.0.1',
    port: 5180,
    strictPort: true,
    fs: { allow: [resolve(import.meta.dirname, '../..')] },
    proxy: { '/api': 'http://127.0.0.1:3001' },
  },
})
