// Serviço para gerenciar dados no banco Supabase

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

// Tipos para o banco de dados
export interface FootballMatch {
  id?: number;
  fixture_id: number;
  match_date: string;
  league_id: number;
  league_name: string;
  country: string;
  home_team_id: number;
  home_team_name: string;
  away_team_id: number;
  away_team_name: string;
  home_goals?: number | null;
  away_goals?: number | null;
  status: string;
  created_at?: string;
  updated_at?: string;
}

export interface BasketballMatch {
  id?: number;
  game_id: number;
  match_date: string;
  league_id: number;
  league_name: string;
  home_team_id: number;
  home_team_name: string;
  away_team_id: number;
  away_team_name: string;
  home_score?: number | null;
  away_score?: number | null;
  status: string;
  created_at?: string;
  updated_at?: string;
}

export interface BettingTip {
  id?: number;
  sport: string;
  league: string;
  match: string;
  date: string;
  time: string;
  tip: string;
  odds: number;
  confidence: number;
  analysis: string;
  status: 'pending' | 'green' | 'red';
  is_vip: boolean;
  created_at?: string;
  updated_at?: string;
}

// Salvar partidas de futebol
export async function saveFootballMatches(matches: FootballMatch[]) {
  try {
    const { data, error } = await supabase
      .from('football_matches')
      .upsert(matches, { onConflict: 'fixture_id' })
      .select();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error saving football matches:', error);
    return { success: false, error };
  }
}

// Salvar partidas de basquete
export async function saveBasketballMatches(matches: BasketballMatch[]) {
  try {
    const { data, error } = await supabase
      .from('basketball_matches')
      .upsert(matches, { onConflict: 'game_id' })
      .select();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error saving basketball matches:', error);
    return { success: false, error };
  }
}

// Salvar tips (corrigido para usar a tabela 'tips')
export async function saveBettingTips(tips: BettingTip[]) {
  try {
    const { data, error } = await supabase
      .from('tips')
      .insert(tips)
      .select();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error saving betting tips:', error);
    return { success: false, error };
  }
}

// Buscar partidas do dia (futebol)
export async function getTodayFootballMatches() {
  try {
    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await supabase
      .from('football_matches')
      .select('*')
      .gte('match_date', `${today}T00:00:00`)
      .lte('match_date', `${today}T23:59:59`)
      .order('match_date', { ascending: true });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching today football matches:', error);
    return { success: false, error, data: [] };
  }
}

// Buscar partidas do dia (basquete)
export async function getTodayBasketballMatches() {
  try {
    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await supabase
      .from('basketball_matches')
      .select('*')
      .gte('match_date', `${today}T00:00:00`)
      .lte('match_date', `${today}T23:59:59`)
      .order('match_date', { ascending: true });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching today basketball matches:', error);
    return { success: false, error, data: [] };
  }
}

// Buscar tips do dia
export async function getTodayTips() {
  try {
    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await supabase
      .from('tips')
      .select('*')
      .gte('created_at', `${today}T00:00:00`)
      .eq('status', 'pending')
      .order('confidence', { ascending: false });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching today tips:', error);
    return { success: false, error, data: [] };
  }
}

// Atualizar status de uma tip
export async function updateTipStatus(tipId: number, status: 'green' | 'red') {
  try {
    const { data, error } = await supabase
      .from('tips')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', tipId)
      .select();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error updating tip status:', error);
    return { success: false, error };
  }
}
