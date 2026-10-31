import { defineConfig, searchForWorkspaceRoot } from 'vite'
import react from '@vitejs/plugin-react'

// Porta 5180 para não colidir com os jogos (5173). /api vai para o site-server.
// O site usa a arte e os temas do hub (../../hub/src/compartilhado), por isso o fs.allow.
export default defineConfig({
  plugins: [react()],
  server: {
    host: '127.0.0.1',
    port: 5180,
    strictPort: true,
    proxy: { '/api': 'http://127.0.0.1:3001' },
    fs: { allow: [searchForWorkspaceRoot(process.cwd()), '../../hub/src/compartilhado'] },
  },
})
