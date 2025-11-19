// API Route para sincronização manual e automática

import { NextRequest, NextResponse } from 'next/server';
import { runFullSync, syncFootballMatches, syncBasketballMatches, generateDailyTips } from '@/lib/sync-service';

export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json();

    switch (action) {
      case 'full':
        const fullResult = await runFullSync();
        return NextResponse.json({
          success: true,
          message: 'Sincronização completa executada',
          data: fullResult
        });

      case 'football':
        const footballResult = await syncFootballMatches();
        return NextResponse.json({
          success: true,
          message: 'Partidas de futebol sincronizadas',
          data: footballResult
        });

      case 'basketball':
        const basketballResult = await syncBasketballMatches();
        return NextResponse.json({
          success: true,
          message: 'Partidas de basquete sincronizadas',
          data: basketballResult
        });

      case 'tips':
        const tipsResult = await generateDailyTips();
        return NextResponse.json({
          success: true,
          message: 'Tips geradas',
          data: tipsResult
        });

      default:
        return NextResponse.json({
          success: false,
          message: 'Ação inválida. Use: full, football, basketball ou tips'
        }, { status: 400 });
    }
  } catch (error) {
    console.error('Erro na API de sincronização:', error);
    return NextResponse.json({
      success: false,
      message: 'Erro ao executar sincronização',
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 });
  }
}

// GET para verificar status
export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'API de sincronização ativa',
    endpoints: {
      POST: {
        full: 'Sincronização completa (partidas + tips)',
        football: 'Sincronizar apenas futebol',
        basketball: 'Sincronizar apenas basquete',
        tips: 'Gerar tips das partidas existentes'
      }
    }
  });
}
