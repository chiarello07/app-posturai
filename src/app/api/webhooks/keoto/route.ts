import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Inicializar Supabase com Service Role Key
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    // 1. Receber dados da Keoto
    const payload = await request.json();
    
    console.log('📩 Webhook recebido da Keoto:', JSON.stringify(payload, null, 2));

    // 2. Extrair informações importantes
    const {
      event, // Ex: "compra_aprovada", "assinatura_cancelada"
      customer_email, // Email do comprador
      product_name, // Ex: "PosturAI - Plano Anual Premium"
      status, // Ex: "approved", "cancelled"
      subscription_id, // ID da assinatura na Keoto
      expires_at // Data de expiração (formato ISO: "2025-12-31T23:59:59Z")
    } = payload;

    // 3. Validar se é evento relevante
    const validEvents = ['compra_aprovada', 'assinatura_renovada', 'assinatura_cancelada'];
    if (!validEvents.includes(event)) {
      console.log(`ℹ️ Evento "${event}" ignorado (não relevante)`);
      return NextResponse.json({ message: 'Evento ignorado' }, { status: 200 });
    }

    // 4. Buscar usuário no Supabase pelo email
    const { data: profile, error: profileError } = await supabase
      .from('profiles') // ← CORRIGIDO: usar 'profiles' ao invés de 'users'
      .select('id, email, is_premium')
      .eq('email', customer_email)
      .single();

    if (profileError || !profile) {
      console.error('❌ Usuário não encontrado no Supabase:', customer_email);
      console.error('Erro:', profileError);
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    console.log(`✅ Usuário encontrado: ${profile.email} (ID: ${profile.id})`);

    // 5. Atualizar status Premium no Supabase
    if (event === 'compra_aprovada' || event === 'assinatura_renovada') {
      // ATIVAR PREMIUM
      const { error: updateError } = await supabase
        .from('profiles') // ← CORRIGIDO
        .update({
          is_premium: true,
          premium_expires_at: expires_at || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 ano se não vier expires_at
          keoto_subscription_id: subscription_id,
          updated_at: new Date().toISOString()
        })
        .eq('id', profile.id);

      if (updateError) {
        console.error('❌ Erro ao ativar Premium:', updateError);
        return NextResponse.json({ error: 'Erro ao atualizar usuário' }, { status: 500 });
      }

      console.log(`✅ Premium ativado para: ${customer_email} (expira em ${expires_at})`);

    } else if (event === 'assinatura_cancelada') {
      // DESATIVAR PREMIUM
      const { error: updateError } = await supabase
        .from('profiles') // ← CORRIGIDO
        .update({
          is_premium: false,
          premium_expires_at: null,
          keoto_subscription_id: null,
          updated_at: new Date().toISOString()
        })
        .eq('id', profile.id);

      if (updateError) {
        console.error('❌ Erro ao desativar Premium:', updateError);
        return NextResponse.json({ error: 'Erro ao atualizar usuário' }, { status: 500 });
      }

      console.log(`⚠️ Premium desativado para: ${customer_email}`);
    }

    // 6. Retornar sucesso
    return NextResponse.json({ 
      success: true, 
      message: `Webhook processado: ${event}`,
      user_email: customer_email,
      is_premium: event !== 'assinatura_cancelada'
    }, { status: 200 });

  } catch (error) {
    console.error('❌ Erro crítico no webhook:', error);
    return NextResponse.json({ 
      error: 'Erro interno do servidor',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 });
  }
}

// Permitir apenas POST
export async function GET() {
  return NextResponse.json({ 
    error: 'Método não permitido. Use POST.' 
  }, { status: 405 });
}