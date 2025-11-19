import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

/**
 * Webhook do Kirvano para atualizar status VIP após pagamento
 * 
 * O Kirvano deve enviar um POST para esta URL quando o pagamento for confirmado:
 * https://seu-dominio.com/api/webhook/kirvano
 * 
 * Payload esperado:
 * {
 *   "event": "payment.approved",
 *   "customer_email": "usuario@email.com",
 *   "transaction_id": "xxx",
 *   "amount": 99.90,
 *   "status": "approved"
 * }
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('📥 Webhook Kirvano recebido:', body);

    // Validar se é um evento de pagamento aprovado
    if (body.event !== 'payment.approved' && body.status !== 'approved') {
      return NextResponse.json(
        { error: 'Evento não é de pagamento aprovado' },
        { status: 400 }
      );
    }

    // Extrair email do cliente
    const customerEmail = body.customer_email || body.email;
    
    if (!customerEmail) {
      return NextResponse.json(
        { error: 'Email do cliente não fornecido' },
        { status: 400 }
      );
    }

    // Atualizar usuário para VIP no Supabase
    const { data, error } = await supabase
      .from('users')
      .update({ 
        is_vip: true,
        vip_activated_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('email', customerEmail)
      .select();

    if (error) {
      console.error('❌ Erro ao atualizar usuário:', error);
      return NextResponse.json(
        { error: 'Erro ao atualizar status VIP', details: error.message },
        { status: 500 }
      );
    }

    if (!data || data.length === 0) {
      console.warn('⚠️ Usuário não encontrado:', customerEmail);
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      );
    }

    console.log('✅ Usuário atualizado para VIP:', customerEmail);

    // Registrar transação (opcional - criar tabela transactions se necessário)
    try {
      await supabase.from('transactions').insert({
        user_id: data[0].id,
        transaction_id: body.transaction_id,
        amount: body.amount,
        status: 'approved',
        payment_method: body.payment_method || 'unknown',
        created_at: new Date().toISOString()
      });
    } catch (transactionError) {
      // Não falhar se tabela transactions não existir
      console.warn('⚠️ Não foi possível registrar transação:', transactionError);
    }

    return NextResponse.json({
      success: true,
      message: 'Status VIP atualizado com sucesso',
      user: {
        email: customerEmail,
        is_vip: true
      }
    });

  } catch (error: any) {
    console.error('❌ Erro no webhook:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor', details: error.message },
      { status: 500 }
    );
  }
}

// Método GET para testar se o webhook está ativo
export async function GET() {
  return NextResponse.json({
    status: 'active',
    message: 'Webhook Kirvano está funcionando',
    endpoint: '/api/webhook/kirvano',
    method: 'POST',
    expected_payload: {
      event: 'payment.approved',
      customer_email: 'usuario@email.com',
      transaction_id: 'xxx',
      amount: 99.90,
      status: 'approved'
    }
  });
}
