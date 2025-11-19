import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Variáveis do Supabase não configuradas. Configure em: Configurações do Projeto → Integrações → Supabase');
}

export const supabase = createSupabaseClient<Database>(supabaseUrl, supabaseAnonKey);

// Função helper para criar cliente Supabase
export function createClient() {
  return createSupabaseClient<Database>(supabaseUrl, supabaseAnonKey);
}
