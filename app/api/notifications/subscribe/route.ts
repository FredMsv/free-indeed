import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { subscription, userAgent } = body;

  if (!subscription) {
    return NextResponse.json({ error: 'No subscription provided' }, { status: 400 });
  }

  // Enregistrement de la souscription
  const { error } = await supabase
    .from('push_subscriptions')
    .insert({
      user_id: user.id,
      subscription: subscription, // Supabase gère le JSONB automatiquement
      user_agent: userAgent
    });

  if (error) {
    console.error('Subscription error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}