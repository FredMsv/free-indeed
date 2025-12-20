import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  // "next" est la page où l'utilisateur voulait aller (ex: /dashboard)
  const next = searchParams.get("next");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // ✅ SÉCURITÉ : Protection contre les "Open Redirects"
      // On s'assure que 'next' commence par '/' mais pas par '//' (qui redirigerait vers un site externe)
      const isInternalUrl = next && next.startsWith("/") && !next.startsWith("//");
      
      // Si l'URL est sûre, on y va. Sinon, direction le dashboard par défaut.
      const redirectUrl = isInternalUrl ? `${origin}${next}` : `${origin}/dashboard`;
      
      return NextResponse.redirect(redirectUrl);
    }
  }

  // Si erreur ou pas de code, retour à la page de login avec une erreur
  return NextResponse.redirect(`${origin}/login?error=auth_code_error`);
}