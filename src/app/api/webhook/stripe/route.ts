import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-12-15.clover',
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Assinatura ausente' },
        { status: 400 }
      );
    }

    // Verificar assinatura do webhook
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      console.error('Erro na verificação do webhook:', err.message);
      return NextResponse.json(
        { error: `Webhook Error: ${err.message}` },
        { status: 400 }
      );
    }

    // Processar eventos
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session);
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdate(subscription);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(subscription);
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        await handlePaymentSucceeded(invoice);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        await handlePaymentFailed(invoice);
        break;
      }

      default:
        console.log(`Evento não tratado: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Erro no webhook:', error);
    return NextResponse.json(
      { error: error.message || 'Erro ao processar webhook' },
      { status: 500 }
    );
  }
}

// Funções auxiliares
async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.supabase_user_id;
  if (!userId) {
    console.error('User ID não encontrado no metadata do checkout');
    return;
  }

  // Atualizar perfil do usuário
  const { error } = await supabase
    .from('profiles')
    .update({
      subscription_status: 'active',
      subscription_tier: 'premium',
      is_premium: true,
      premium_since: new Date().toISOString(),
    })
    .eq('id', userId);

  if (error) {
    console.error('Erro ao atualizar perfil após checkout:', error);
  } else {
    console.log(`✅ Checkout completo para usuário ${userId}`);
  }
}

async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;

  // Buscar usuário pelo customer_id
  const { data: userData, error: userError } = await supabase
    .from('profiles')
    .select('id')
    .eq('stripe_customer_id', customerId)
    .single();

  if (userError || !userData) {
    console.error('Usuário não encontrado para customer_id:', customerId);
    return;
  }

  // Extrair período atual da assinatura com type assertion
  const subData = subscription as any;
  const currentPeriodStart = subData.current_period_start 
    ? new Date(subData.current_period_start * 1000).toISOString()
    : new Date().toISOString();
  
  const currentPeriodEnd = subData.current_period_end
    ? new Date(subData.current_period_end * 1000).toISOString()
    : new Date().toISOString();

  const trialEnd = subData.trial_end 
    ? new Date(subData.trial_end * 1000).toISOString() 
    : null;

  // Atualizar ou criar registro de assinatura
  const { error: subError } = await supabase
    .from('subscriptions')
    .upsert({
      user_id: userData.id,
      stripe_subscription_id: subscription.id,
      stripe_customer_id: customerId,
      status: subscription.status,
      price_id: subscription.items.data[0].price.id,
      current_period_start: currentPeriodStart,
      current_period_end: currentPeriodEnd,
      cancel_at_period_end: subscription.cancel_at_period_end || false,
      trial_end: trialEnd,
    });

  if (subError) {
    console.error('Erro ao atualizar assinatura:', subError);
  }

  // Atualizar perfil
  const isPremium = subscription.status === 'active' || subscription.status === 'trialing';
  const { error: profileError } = await supabase
    .from('profiles')
    .update({
      subscription_status: subscription.status,
      subscription_tier: isPremium ? 'premium' : 'free',
      is_premium: isPremium,
      premium_expires_at: currentPeriodEnd,
    })
    .eq('id', userData.id);

  if (profileError) {
    console.error('Erro ao atualizar perfil:', profileError);
  } else {
    console.log(`✅ Assinatura atualizada para usuário ${userData.id}`);
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;

  // Buscar usuário pelo customer_id
  const { data: userData, error: userError } = await supabase
    .from('profiles')
    .select('id')
    .eq('stripe_customer_id', customerId)
    .single();

  if (userError || !userData) {
    console.error('Usuário não encontrado para customer_id:', customerId);
    return;
  }

  // Atualizar status da assinatura
  const { error: subError } = await supabase
    .from('subscriptions')
    .update({
      status: 'canceled',
      canceled_at: new Date().toISOString(),
    })
    .eq('stripe_subscription_id', subscription.id);

  if (subError) {
    console.error('Erro ao atualizar status de cancelamento:', subError);
  }

  // Atualizar perfil
  const { error: profileError } = await supabase
    .from('profiles')
    .update({
      subscription_status: 'canceled',
      subscription_tier: 'free',
      is_premium: false,
      premium_expires_at: new Date().toISOString(),
    })
    .eq('id', userData.id);

  if (profileError) {
    console.error('Erro ao atualizar perfil após cancelamento:', profileError);
  } else {
    console.log(`✅ Assinatura cancelada para usuário ${userData.id}`);
  }
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  const invoiceData = invoice as any;
  const customerId = invoiceData.customer as string;
  const subscriptionId = invoiceData.subscription as string;

  // Buscar usuário pelo customer_id
  const { data: userData, error: userError } = await supabase
    .from('profiles')
    .select('id')
    .eq('stripe_customer_id', customerId)
    .single();

  if (userError || !userData) {
    console.error('Usuário não encontrado para customer_id:', customerId);
    return;
  }

  // Extrair timestamp de pagamento
  const paidAt = invoiceData.status_transitions?.paid_at
    ? new Date(invoiceData.status_transitions.paid_at * 1000).toISOString()
    : new Date().toISOString();

  // Registrar pagamento
  const { error: paymentError } = await supabase.from('payments').insert({
    user_id: userData.id,
    stripe_payment_id: invoiceData.payment_intent as string,
    stripe_invoice_id: invoiceData.id,
    stripe_subscription_id: subscriptionId,
    amount: (invoiceData.amount_paid || 0) / 100,
    currency: invoiceData.currency || 'brl',
    status: 'succeeded',
    paid_at: paidAt,
  });

  if (paymentError) {
    console.error('Erro ao registrar pagamento:', paymentError);
  } else {
    console.log(`✅ Pagamento registrado para usuário ${userData.id}`);
  }
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  const invoiceData = invoice as any;
  const customerId = invoiceData.customer as string;

  // Buscar usuário pelo customer_id
  const { data: userData, error: userError } = await supabase
    .from('profiles')
    .select('id')
    .eq('stripe_customer_id', customerId)
    .single();

  if (userError || !userData) {
    console.error('Usuário não encontrado para customer_id:', customerId);
    return;
  }

  // Registrar falha de pagamento
  const { error: paymentError } = await supabase.from('payments').insert({
    user_id: userData.id,
    stripe_payment_id: invoiceData.payment_intent as string,
    stripe_invoice_id: invoiceData.id,
    stripe_subscription_id: invoiceData.subscription as string,
    amount: (invoiceData.amount_due || 0) / 100,
    currency: invoiceData.currency || 'brl',
    status: 'failed',
    failed_at: new Date().toISOString(),
  });

  if (paymentError) {
    console.error('Erro ao registrar falha de pagamento:', paymentError);
  } else {
    console.log(`⚠️ Falha de pagamento registrada para usuário ${userData.id}`);
  }
}