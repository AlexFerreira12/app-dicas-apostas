// Serviço de sincronização automática de dados das APIs

import { 
  getFootballFixtures, 
  getBasketballGames,
  FootballFixture,
  BasketballGame
} from './sports-api';

import {
  saveFootballMatches,
  saveBasketballMatches,
  saveBettingTips,
  getTodayFootballMatches,
  getTodayBasketballMatches,
  FootballMatch,
  BasketballMatch
} from './database';

import {
  generateFootballTips,
  generateBasketballTips,
  filterTipsByConfidence,
  sortTipsByConfidence
} from './tip-generator';

// Sincronizar partidas de futebol do dia
export async function syncFootballMatches() {
  try {
    console.log('🔄 Sincronizando partidas de futebol...');
    
    // Buscar partidas da API
    const fixtures = await getFootballFixtures();
    
    if (fixtures.length === 0) {
      console.log('ℹ️ Nenhuma partida de futebol encontrada para hoje');
      return { success: true, count: 0 };
    }

    // Converter para formato do banco
    const matches: FootballMatch[] = fixtures.map(fixture => ({
      fixture_id: fixture.fixture.id,
      match_date: fixture.fixture.date,
      league_id: fixture.league.id,
      league_name: fixture.league.name,
      country: fixture.league.country,
      home_team_id: fixture.teams.home.id,
      home_team_name: fixture.teams.home.name,
      away_team_id: fixture.teams.away.id,
      away_team_name: fixture.teams.away.name,
      home_goals: fixture.goals.home,
      away_goals: fixture.goals.away,
      status: fixture.goals.home !== null ? 'finished' : 'scheduled'
    }));

    // Salvar no banco
    const result = await saveFootballMatches(matches);
    
    if (result.success) {
      console.log(`✅ ${matches.length} partidas de futebol sincronizadas`);
      return { success: true, count: matches.length };
    } else {
      console.error('❌ Erro ao salvar partidas de futebol:', result.error);
      return { success: false, error: result.error };
    }
  } catch (error) {
    console.error('❌ Erro na sincronização de futebol:', error);
    return { success: false, error };
  }
}

// Sincronizar partidas de basquete do dia
export async function syncBasketballMatches() {
  try {
    console.log('🔄 Sincronizando partidas de basquete...');
    
    // Buscar partidas da API
    const games = await getBasketballGames();
    
    if (games.length === 0) {
      console.log('ℹ️ Nenhuma partida de basquete encontrada para hoje');
      return { success: true, count: 0 };
    }

    // Converter para formato do banco
    const matches: BasketballMatch[] = games.map(game => ({
      game_id: game.id,
      match_date: `${game.date} ${game.time}`,
      league_id: game.league.id,
      league_name: game.league.name,
      home_team_id: game.teams.home.id,
      home_team_name: game.teams.home.name,
      away_team_id: game.teams.away.id,
      away_team_name: game.teams.away.name,
      home_score: game.scores.home.total,
      away_score: game.scores.away.total,
      status: game.scores.home.total !== null ? 'finished' : 'scheduled'
    }));

    // Salvar no banco
    const result = await saveBasketballMatches(matches);
    
    if (result.success) {
      console.log(`✅ ${matches.length} partidas de basquete sincronizadas`);
      return { success: true, count: matches.length };
    } else {
      console.error('❌ Erro ao salvar partidas de basquete:', result.error);
      return { success: false, error: result.error };
    }
  } catch (error) {
    console.error('❌ Erro na sincronização de basquete:', error);
    return { success: false, error };
  }
}

// Gerar tips para todas as partidas do dia
export async function generateDailyTips() {
  try {
    console.log('🎯 Gerando tips do dia...');
    
    // Buscar partidas do banco
    const footballResult = await getTodayFootballMatches();
    const basketballResult = await getTodayBasketballMatches();

    const allTips = [];

    // Gerar tips para futebol
    if (footballResult.success && footballResult.data) {
      for (const match of footballResult.data) {
        const tips = generateFootballTips(match);
        allTips.push(...tips);
      }
    }

    // Gerar tips para basquete
    if (basketballResult.success && basketballResult.data) {
      for (const match of basketballResult.data) {
        const tips = generateBasketballTips(match);
        allTips.push(...tips);
      }
    }

    if (allTips.length === 0) {
      console.log('ℹ️ Nenhuma tip gerada');
      return { success: true, count: 0 };
    }

    // Filtrar tips com confiança mínima de 60%
    const filteredTips = filterTipsByConfidence(allTips, 60);
    const sortedTips = sortTipsByConfidence(filteredTips);

    // Salvar tips no banco
    const result = await saveBettingTips(sortedTips);
    
    if (result.success) {
      console.log(`✅ ${sortedTips.length} tips geradas e salvas`);
      return { success: true, count: sortedTips.length, tips: sortedTips };
    } else {
      console.error('❌ Erro ao salvar tips:', result.error);
      return { success: false, error: result.error };
    }
  } catch (error) {
    console.error('❌ Erro na geração de tips:', error);
    return { success: false, error };
  }
}

// Executar sincronização completa (partidas + tips)
export async function runFullSync() {
  console.log('🚀 Iniciando sincronização completa...');
  
  const results = {
    football: await syncFootballMatches(),
    basketball: await syncBasketballMatches(),
    tips: { success: false, count: 0 }
  };

  // Gerar tips apenas se houver partidas sincronizadas
  if (results.football.success || results.basketball.success) {
    results.tips = await generateDailyTips();
  }

  console.log('✅ Sincronização completa finalizada');
  console.log(`📊 Resumo: ${results.football.count || 0} futebol, ${results.basketball.count || 0} basquete, ${results.tips.count || 0} tips`);
  
  return results;
}

// Agendar sincronização automática (executar a cada X horas)
export function scheduleAutoSync(intervalHours: number = 6) {
  const intervalMs = intervalHours * 60 * 60 * 1000;
  
  // Executar imediatamente
  runFullSync();
  
  // Agendar execuções futuras
  setInterval(() => {
    runFullSync();
  }, intervalMs);
  
  console.log(`⏰ Sincronização automática agendada a cada ${intervalHours} horas`);
}
