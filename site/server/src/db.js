import { createClient } from '@supabase/supabase-js'

const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env

export const bancoConfigurado = Boolean(SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY)

export const db = bancoConfigurado
  ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } })
  : null

// Lança o erro do Supabase em vez de devolver { data, error }.
export async function q(consulta) {
  const { data, error } = await consulta
  if (error) throw new Error(error.message)
  return data
}
