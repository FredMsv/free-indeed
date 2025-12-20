import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

const querySchema = z.object({
  username: z.string().min(3).regex(/^[a-zA-Z0-9_]+$/),
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username');

  // Validation basique
  const result = querySchema.safeParse({ username });
  if (!result.success) {
    return NextResponse.json({ available: false, error: 'Format invalide' }, { status: 400 });
  }

  const supabase = await createClient();

  // On cherche si le pseudo existe déjà (en ignorant la casse)
  const { data, error } = await supabase
    .from('users')
    .select('username')
    .ilike('username', username!) // ilike = insensible à la casse
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Si data existe, le pseudo est pris. Sinon, il est libre.
  return NextResponse.json({ available: !data });
}