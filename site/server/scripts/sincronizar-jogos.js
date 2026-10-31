// Uso: npm run sincronizar-jogos (precisa do .env com as chaves do Supabase).
import { bancoConfigurado } from '../src/db.js'
import { sincronizarJogos } from '../src/catalogo.js'

if (!bancoConfigurado) {
  console.error('Configure SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY em site/server/.env.')
  process.exit(1)
}
const linhas = await sincronizarJogos()
console.log(`${linhas.length} jogos sincronizados: ${linhas.map((l) => l.id).join(', ')}`)
