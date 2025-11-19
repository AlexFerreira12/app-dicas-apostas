// Sistema de geração automática de tips baseado em análise de dados

import { FootballMatch, BasketballMatch, BettingTip } from './database';

// Formatar data e hora para o formato brasileiro
function formatDateTime(dateString: string) {
  const date = new Date(dateString);
  const dateFormatted = date.toLocaleDateString('pt-BR');
  const timeFormatted = date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  return { date: dateFormatted, time: timeFormatted };
}

// Algoritmo de geração de tips para futebol
export function generateFootballTips(match: FootballMatch): BettingTip[] {
  const tips: BettingTip[] = [];
  const { date, time } = formatDateTime(match.match_date);

  // Análise básica baseada em padrões comuns
  // Nota: Em produção, isso seria muito mais sofisticado com ML e dados históricos

  // Tip 1: Análise de favorito (baseado em nome/liga)
  const isTopLeague = ['Premier League', 'La Liga', 'Serie A', 'Bundesliga', 'Champions League', 'Brasileirão'].includes(match.league_name);
  
  if (isTopLeague) {
    // Times grandes geralmente têm mais chances em casa
    tips.push({
      sport: 'Futebol',
      league: match.league_name,
      match: `${match.home_team_name} vs ${match.away_team_name}`,
      date,
      time,
      tip: `Vitória ${match.home_team_name}`,
      odds: 1.85,
      confidence: 65,
      analysis: `${match.home_team_name} jogando em casa em liga de alto nível. Histórico favorável e vantagem do mando de campo.`,
      status: 'pending',
      is_vip: false
    });
  }

  // Tip 2: Over/Under gols
  // Ligas ofensivas tendem a ter mais gols
  const offensiveLeagues = ['Bundesliga', 'Eredivisie', 'Brasileirão'];
  const isOffensive = offensiveLeagues.some(league => match.league_name.includes(league));

  if (isOffensive) {
    tips.push({
      sport: 'Futebol',
      league: match.league_name,
      match: `${match.home_team_name} vs ${match.away_team_name}`,
      date,
      time,
      tip: 'Over 2.5 Gols',
      odds: 1.90,
      confidence: 70,
      analysis: `Liga conhecida por jogos ofensivos: ${match.league_name}. Ambos os times têm histórico de marcar gols.`,
      status: 'pending',
      is_vip: false
    });
  } else {
    tips.push({
      sport: 'Futebol',
      league: match.league_name,
      match: `${match.home_team_name} vs ${match.away_team_name}`,
      date,
      time,
      tip: 'Under 2.5 Gols',
      odds: 1.75,
      confidence: 60,
      analysis: `Liga com tendência defensiva. Times costumam jogar de forma mais cautelosa.`,
      status: 'pending',
      is_vip: false
    });
  }

  // Tip 3: Ambas marcam (VIP)
  if (isTopLeague) {
    tips.push({
      sport: 'Futebol',
      league: match.league_name,
      match: `${match.home_team_name} vs ${match.away_team_name}`,
      date,
      time,
      tip: 'Ambas Marcam - Sim',
      odds: 1.80,
      confidence: 68,
      analysis: `Times de alto nível com ataque forte: ${match.home_team_name} vs ${match.away_team_name}. Ambos têm poder ofensivo e costumam balançar as redes.`,
      status: 'pending',
      is_vip: true
    });
  }

  return tips;
}

// Algoritmo de geração de tips para basquete
export function generateBasketballTips(match: BasketballMatch): BettingTip[] {
  const tips: BettingTip[] = [];
  const { date, time } = formatDateTime(match.match_date);

  // Análise básica para basquete
  const isNBA = match.league_name.includes('NBA');

  if (isNBA) {
    // NBA geralmente tem jogos de alta pontuação
    tips.push({
      sport: 'Basquete',
      league: match.league_name,
      match: `${match.home_team_name} vs ${match.away_team_name}`,
      date,
      time,
      tip: 'Over 220.5 Pontos',
      odds: 1.85,
      confidence: 72,
      analysis: `NBA: jogos costumam ter alta pontuação. Ambos os times têm ritmo ofensivo forte.`,
      status: 'pending',
      is_vip: false
    });

    // Vantagem de casa na NBA (VIP)
    tips.push({
      sport: 'Basquete',
      league: match.league_name,
      match: `${match.home_team_name} vs ${match.away_team_name}`,
      date,
      time,
      tip: `Vitória ${match.home_team_name}`,
      odds: 1.90,
      confidence: 63,
      analysis: `${match.home_team_name} com vantagem de jogar em casa na NBA. Torcida e familiaridade com a quadra fazem diferença.`,
      status: 'pending',
      is_vip: true
    });
  } else {
    // Outras ligas
    tips.push({
      sport: 'Basquete',
      league: match.league_name,
      match: `${match.home_team_name} vs ${match.away_team_name}`,
      date,
      time,
      tip: 'Over 160.5 Pontos',
      odds: 1.80,
      confidence: 65,
      analysis: `Jogo de basquete com expectativa de boa pontuação. Ambos os times têm capacidade ofensiva.`,
      status: 'pending',
      is_vip: false
    });
  }

  return tips;
}

// Filtrar tips por confiança mínima
export function filterTipsByConfidence(tips: BettingTip[], minConfidence: number = 60): BettingTip[] {
  return tips.filter(tip => tip.confidence >= minConfidence);
}

// Ordenar tips por confiança
export function sortTipsByConfidence(tips: BettingTip[]): BettingTip[] {
  return [...tips].sort((a, b) => b.confidence - a.confidence);
}

// Agrupar tips por tipo
export function groupTipsByType(tips: BettingTip[]): Record<string, BettingTip[]> {
  return tips.reduce((acc, tip) => {
    if (!acc[tip.tip]) {
      acc[tip.tip] = [];
    }
    acc[tip.tip].push(tip);
    return acc;
  }, {} as Record<string, BettingTip[]>);
}

// Calcular estatísticas das tips
export function calculateTipStats(tips: BettingTip[]) {
  const total = tips.length;
  const avgConfidence = tips.reduce((sum, tip) => sum + tip.confidence, 0) / total;
  const highConfidence = tips.filter(tip => tip.confidence >= 70).length;
  const mediumConfidence = tips.filter(tip => tip.confidence >= 60 && tip.confidence < 70).length;
  const lowConfidence = tips.filter(tip => tip.confidence < 60).length;

  return {
    total,
    avgConfidence: Math.round(avgConfidence * 100) / 100,
    highConfidence,
    mediumConfidence,
    lowConfidence
  };
}
