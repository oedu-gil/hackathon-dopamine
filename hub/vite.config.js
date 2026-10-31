import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    // a memória e a sequência só aceitam imagens por URL http(s), não data:
    assetsInlineLimit: 0,
    rolldownOptions: {
      input: {
        hub: resolve(import.meta.dirname, 'index.html'),
        jogo: resolve(import.meta.dirname, 'jogo.html'),
      },
    },
  },
})
