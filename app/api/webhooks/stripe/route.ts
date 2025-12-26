import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { stripe } from '@/lib/subscription/stripe';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ✅ SOLUTION : On force les types pour éviter les erreurs TS sur l'objet Subscription
interface PartialSubscription {
  id: string;
  metadata: Stripe.Metadata;
  status: Stripe.Subscription.Status;
  items: { data: { price: { id: string }; quantity?: number }[] };
  cancel_at_period_end: boolean;
  cancel_at: number | null;
  canceled_at: number | null;
  current_period_start: number;
  current_period_end: number;
  created: number;
  ended_at: number | null;
  trial_start: number | null;
  trial_end: number | null;
  customer: string | Stripe.Customer | Stripe.DeletedCustomer;
}

const manageSubscriptionStatusChange = async (
  subscriptionId: string,
  customerId: string,
  createAction = false
) => {
  const rawSubscription = await stripe.subscriptions.retrieve(subscriptionId, {
    expand: ['default_payment_method']
  });

  // Casting explicite pour que TS accepte les propriétés
  const subscription = rawSubscription as unknown as PartialSubscription;

  const { data: profileData } = await supabaseAdmin
    .from('user_profiles')
    .select('user_id')
    .eq('stripe_customer_id', customerId)
    .single();

  if (!profileData) {
    console.error(`Utilisateur introuvable pour le customer Stripe: ${customerId}`);
    return;
  }

  const userId = profileData.user_id;

  const subscriptionData = {
    id: subscription.id,
    user_id: userId,
    metadata: subscription.metadata,
    status: subscription.status,
   
    price_id: subscription.items.data[0].price.id,
    
    quantity: subscription.items.data[0].quantity ?? 1,
    cancel_at_period_end: subscription.cancel_at_period_end,
    cancel_at: subscription.cancel_at ? new Date(subscription.cancel_at * 1000).toISOString() : null,
    canceled_at: subscription.canceled_at ? new Date(subscription.canceled_at * 1000).toISOString() : null,
    
    current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
    current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
    
    created: new Date(subscription.created * 1000).toISOString(),
    ended_at: subscription.ended_at ? new Date(subscription.ended_at * 1000).toISOString() : null,
    trial_start: subscription.trial_start ? new Date(subscription.trial_start * 1000).toISOString() : null,
    trial_end: subscription.trial_end ? new Date(subscription.trial_end * 1000).toISOString() : null,
  };

  const { error } = await supabaseAdmin
    .from('subscriptions')
    .upsert([subscriptionData]);

  if (error) {
    console.error(`Erreur insertion abonnement [${subscription.id}]:`, error);
  }

  if (createAction) {
    await supabaseAdmin
      .from('user_profiles')
      .update({ stripe_subscription_id: subscription.id })
      .eq('user_id', userId);
  }
};

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get('Stripe-Signature') as string;

  let event: Stripe.Event;

  try {
    if (!process.env.STRIPE_WEBHOOK_SECRET) throw new Error("Webhook secret manquant");
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Unknown Error";
    console.error(`Webhook Error: ${errorMessage}`);
    return new NextResponse(`Webhook Error: ${errorMessage}`, { status: 400 });
  }

  const permittedEvents = [
    'checkout.session.completed',
    'customer.subscription.created',
    'customer.subscription.updated',
    'customer.subscription.deleted',
  ];

  if (permittedEvents.includes(event.type)) {
    try {
      switch (event.type) {
        case 'checkout.session.completed':
          const checkoutSession = event.data.object as Stripe.Checkout.Session;
          if (checkoutSession.mode === 'subscription') {
            const subscriptionId = checkoutSession.subscription as string;
            await manageSubscriptionStatusChange(
              subscriptionId,
              checkoutSession.customer as string,
              true
            );
          }
          break;
        case 'customer.subscription.created':
        case 'customer.subscription.updated':
        case 'customer.subscription.deleted':
          const subscription = event.data.object as Stripe.Subscription;
          await manageSubscriptionStatusChange(
            subscription.id,
            subscription.customer as string,
            event.type === 'customer.subscription.created'
          );
          break;
        default:
          throw new Error('Unhandled relevant event!');
      }
    } catch (error) {
      console.error(error);
      return new NextResponse('Webhook handler failed. View logs.', { status: 400 });
    }
  }

  return NextResponse.json({ received: true });
}