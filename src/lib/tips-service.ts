import { supabase } from './supabase';
import type { Database } from './database.types';

type Tip = Database['public']['Tables']['tips']['Row'];
type Statistics = Database['public']['Tables']['statistics']['Row'];

export async function getTips(sport?: 'nba' | 'futebol', isVip?: boolean) {
  let query = supabase
    .from('tips')
    .select('*')
    .order('created_at', { ascending: false });

  if (sport) {
    query = query.eq('sport', sport);
  }

  if (isVip !== undefined) {
    query = query.eq('is_vip', isVip);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching tips:', error);
    return [];
  }

  return data as Tip[];
}

export async function getFreeTips(sport?: 'nba' | 'futebol') {
  return getTips(sport, false);
}

export async function getVipTips(sport?: 'nba' | 'futebol') {
  return getTips(sport, true);
}

export async function getStatistics() {
  // Buscar a primeira linha de estatísticas (ou criar valores padrão se não existir)
  const { data, error } = await supabase
    .from('statistics')
    .select('*')
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error('Error fetching statistics:', error);
    return {
      total_tips: 0,
      green_tips: 0,
      red_tips: 0,
      win_rate: 0,
      roi: '+0%',
    };
  }

  // Se não houver dados, retornar valores padrão
  if (!data) {
    return {
      total_tips: 0,
      green_tips: 0,
      red_tips: 0,
      win_rate: 0,
      roi: '+0%',
    };
  }

  return data as Statistics;
}

export async function createTip(tip: Database['public']['Tables']['tips']['Insert']) {
  const { data, error } = await supabase
    .from('tips')
    .insert(tip)
    .select()
    .single();

  if (error) {
    console.error('Error creating tip:', error);
    throw error;
  }

  return data as Tip;
}

export async function updateTipStatus(id: string, status: 'green' | 'red' | 'pending') {
  const { data, error } = await supabase
    .from('tips')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating tip status:', error);
    throw error;
  }

  // Atualizar estatísticas
  await updateStatistics();

  return data as Tip;
}

async function updateStatistics() {
  // Buscar todas as tips
  const { data: tips } = await supabase.from('tips').select('status');
  
  if (!tips) return;

  const totalTips = tips.length;
  const greenTips = tips.filter(t => t.status === 'green').length;
  const redTips = tips.filter(t => t.status === 'red').length;
  const winRate = totalTips > 0 ? (greenTips / totalTips) * 100 : 0;

  // Buscar o ID da primeira linha de estatísticas
  const { data: statsData } = await supabase
    .from('statistics')
    .select('id')
    .limit(1);

  if (!statsData || statsData.length === 0) {
    // Se não existir, criar uma nova linha
    await supabase
      .from('statistics')
      .insert({
        total_tips: totalTips,
        green_tips: greenTips,
        red_tips: redTips,
        win_rate: parseFloat(winRate.toFixed(2)),
        roi: '+0%',
      });
    return;
  }

  // Atualizar estatísticas existentes
  const { error } = await supabase
    .from('statistics')
    .update({
      total_tips: totalTips,
      green_tips: greenTips,
      red_tips: redTips,
      win_rate: parseFloat(winRate.toFixed(2)),
      updated_at: new Date().toISOString(),
    })
    .eq('id', statsData[0].id);

  if (error) {
    console.error('Error updating statistics:', error);
  }
}
