import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';

// ============================================
// GET /api/workouts/[dayIndex]
// ============================================

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ dayIndex: string }> }
) {
  try {
  const resolvedParams = await params;
  const dayIndex = parseInt(resolvedParams.dayIndex);

    if (isNaN(dayIndex) || dayIndex < 1) {
      return NextResponse.json(
        { error: 'dayIndex inválido' },
        { status: 400 }
      );
    }

    // Criar cliente Supabase
    const supabase = createClient();

    // Obter usuário autenticado
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      );
    }

    // Buscar perfil do usuário
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('is_premium, trial_started_at')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json(
        { error: 'Perfil não encontrado' },
        { status: 404 }
      );
    }

    // ============================================
    // LÓGICA DE ACESSO (SSOT)
    // ============================================

    const isPremium = profile.is_premium || false;
    const trialStartedAt = profile.trial_started_at;

    // PREMIUM: Acesso completo
    if (isPremium) {
      return NextResponse.json({
        allowed: true,
        reason: 'premium',
        dayIndex,
      });
    }

    // NÃO INICIOU TRIAL: Bloquear tudo exceto D1 (preview)
    if (!trialStartedAt) {
      if (dayIndex === 1) {
        return NextResponse.json({
          allowed: false,
          reason: 'trial_not_started',
          message: 'Inicie o trial para desbloquear',
          dayIndex,
        });
      }

      return NextResponse.json({
        allowed: false,
        reason: 'trial_not_started',
        message: 'Inicie o trial para desbloquear',
        dayIndex,
      });
    }

    // CALCULAR DIAS DESDE INÍCIO DO TRIAL
    const startDate = new Date(trialStartedAt);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // TRIAL ATIVO (D1-D7): Liberar D1-D7, bloquear D8+
    if (diffDays <= 7) {
      if (dayIndex <= 7) {
        return NextResponse.json({
          allowed: true,
          reason: 'trial_active',
          daysRemaining: 7 - diffDays + 1,
          dayIndex,
        });
      } else {
        return NextResponse.json({
          allowed: false,
          reason: 'trial_active_limited',
          message: 'Disponível após assinatura',
          dayIndex,
        });
      }
    }

    // TRIAL EXPIRADO (D8+): Liberar D1-D7, bloquear D8+
    if (dayIndex <= 7) {
      return NextResponse.json({
        allowed: true,
        reason: 'trial_expired_legacy_access',
        message: 'Acesso aos treinos do período de avaliação',
        dayIndex,
      });
    } else {
      return NextResponse.json({
        allowed: false,
        reason: 'trial_expired',
        message: 'Trial expirado. Assine para continuar.',
        dayIndex,
      });
    }

  } catch (error) {
    console.error('Erro na API /api/workouts/[dayIndex]:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}