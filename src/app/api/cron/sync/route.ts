// API Route para sincronização automática via Cron Job
// Configure no Vercel Cron Jobs ou use serviços como cron-job.org

import { NextRequest, NextResponse } from 'next/server';
import { runFullSync } from '@/lib/sync-service';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    // Verificar token de autenticação (segurança)
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET || 'your-secret-key-here';
    
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('🤖 Iniciando sincronização automática via Cron...');
    
    // Executar sincronização completa
    const result = await runFullSync();
    
    return NextResponse.json({
      success: true,
      message: 'Sincronização automática executada com sucesso',
      timestamp: new Date().toISOString(),
      data: result
    });

  } catch (error) {
    console.error('❌ Erro na sincronização automática:', error);
    return NextResponse.json({
      success: false,
      message: 'Erro na sincronização automática',
      error: error instanceof Error ? error.message : 'Erro desconhecido',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

// POST também aceito para compatibilidade com diferentes serviços de cron
export async function POST(request: NextRequest) {
  return GET(request);
}
