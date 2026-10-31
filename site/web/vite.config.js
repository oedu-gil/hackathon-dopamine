import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Porta 5180 para não colidir com os jogos (5173). /api vai para o site-server.
export default defineConfig({
  plugins: [react()],
  server: {
    host: '127.0.0.1',
    port: 5180,
    strictPort: true,
    proxy: { '/api': 'http://127.0.0.1:3001' },
  },
})
