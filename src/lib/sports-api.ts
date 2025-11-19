// Serviço para integração com APIs de Futebol e Basquete

const FOOTBALL_API_URL = process.env.NEXT_PUBLIC_FOOTBALL_API_URL || 'https://v3.football.api-sports.io/';
const BASKETBALL_API_URL = process.env.NEXT_PUBLIC_BASKETBALL_API_URL || 'https://v1.basketball.api-sports.io/';
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || '';

interface ApiHeaders {
  'x-rapidapi-key': string;
  'x-rapidapi-host': string;
}

// Headers para API de Futebol
const footballHeaders: ApiHeaders = {
  'x-rapidapi-key': API_KEY,
  'x-rapidapi-host': 'v3.football.api-sports.io'
};

// Headers para API de Basquete
const basketballHeaders: ApiHeaders = {
  'x-rapidapi-key': API_KEY,
  'x-rapidapi-host': 'v1.basketball.api-sports.io'
};

// Tipos de resposta
export interface FootballFixture {
  fixture: {
    id: number;
    date: string;
    timestamp: number;
  };
  league: {
    id: number;
    name: string;
    country: string;
  };
  teams: {
    home: {
      id: number;
      name: string;
    };
    away: {
      id: number;
      name: string;
    };
  };
  goals: {
    home: number | null;
    away: number | null;
  };
  score: {
    halftime: {
      home: number | null;
      away: number | null;
    };
    fulltime: {
      home: number | null;
      away: number | null;
    };
  };
}

export interface BasketballGame {
  id: number;
  date: string;
  time: string;
  timestamp: number;
  league: {
    id: number;
    name: string;
    type: string;
    season: string;
  };
  teams: {
    home: {
      id: number;
      name: string;
    };
    away: {
      id: number;
      name: string;
    };
  };
  scores: {
    home: {
      total: number | null;
    };
    away: {
      total: number | null;
    };
  };
}

// Buscar jogos de futebol
export async function getFootballFixtures(date?: string): Promise<FootballFixture[]> {
  try {
    const targetDate = date || new Date().toISOString().split('T')[0];
    const url = `${FOOTBALL_API_URL}fixtures?date=${targetDate}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: footballHeaders
    });

    if (!response.ok) {
      throw new Error(`Football API error: ${response.status}`);
    }

    const data = await response.json();
    return data.response || [];
  } catch (error) {
    console.error('Error fetching football fixtures:', error);
    return [];
  }
}

// Buscar jogos de futebol por liga
export async function getFootballFixturesByLeague(leagueId: number, season: number): Promise<FootballFixture[]> {
  try {
    const url = `${FOOTBALL_API_URL}fixtures?league=${leagueId}&season=${season}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: footballHeaders
    });

    if (!response.ok) {
      throw new Error(`Football API error: ${response.status}`);
    }

    const data = await response.json();
    return data.response || [];
  } catch (error) {
    console.error('Error fetching football fixtures by league:', error);
    return [];
  }
}

// Buscar estatísticas de time de futebol
export async function getFootballTeamStatistics(teamId: number, season: number, leagueId: number) {
  try {
    const url = `${FOOTBALL_API_URL}teams/statistics?team=${teamId}&season=${season}&league=${leagueId}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: footballHeaders
    });

    if (!response.ok) {
      throw new Error(`Football API error: ${response.status}`);
    }

    const data = await response.json();
    return data.response || null;
  } catch (error) {
    console.error('Error fetching football team statistics:', error);
    return null;
  }
}

// Buscar jogos de basquete
export async function getBasketballGames(date?: string): Promise<BasketballGame[]> {
  try {
    const targetDate = date || new Date().toISOString().split('T')[0];
    const url = `${BASKETBALL_API_URL}games?date=${targetDate}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: basketballHeaders
    });

    if (!response.ok) {
      throw new Error(`Basketball API error: ${response.status}`);
    }

    const data = await response.json();
    return data.response || [];
  } catch (error) {
    console.error('Error fetching basketball games:', error);
    return [];
  }
}

// Buscar jogos de basquete por liga (NBA)
export async function getBasketballGamesByLeague(leagueId: number, season: string): Promise<BasketballGame[]> {
  try {
    const url = `${BASKETBALL_API_URL}games?league=${leagueId}&season=${season}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: basketballHeaders
    });

    if (!response.ok) {
      throw new Error(`Basketball API error: ${response.status}`);
    }

    const data = await response.json();
    return data.response || [];
  } catch (error) {
    console.error('Error fetching basketball games by league:', error);
    return [];
  }
}

// Buscar estatísticas de time de basquete
export async function getBasketballTeamStatistics(teamId: number, season: string) {
  try {
    const url = `${BASKETBALL_API_URL}statistics?team=${teamId}&season=${season}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: basketballHeaders
    });

    if (!response.ok) {
      throw new Error(`Basketball API error: ${response.status}`);
    }

    const data = await response.json();
    return data.response || null;
  } catch (error) {
    console.error('Error fetching basketball team statistics:', error);
    return null;
  }
}

// IDs de ligas populares
export const LEAGUES = {
  // Futebol
  PREMIER_LEAGUE: 39,
  LA_LIGA: 140,
  SERIE_A: 135,
  BUNDESLIGA: 78,
  LIGUE_1: 61,
  BRASILEIRAO: 71,
  CHAMPIONS_LEAGUE: 2,
  
  // Basquete
  NBA: 12,
  EUROLEAGUE: 120,
  NBB: 138
};

// Helper para formatar data/hora
export function formatGameDateTime(timestamp: number) {
  const date = new Date(timestamp * 1000);
  return {
    date: date.toLocaleDateString('pt-BR'),
    time: date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  };
}
