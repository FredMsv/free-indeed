import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value)
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  // Rafraîchir la session si elle existe
  const { data: { user } } = await supabase.auth.getUser()

  // ROUTE PROTECTION LOGIC
  const url = request.nextUrl.clone()
  
  // 1. Si utilisateur NON connecté essaie d'accéder au dashboard/onboarding -> Login
  if (!user && (url.pathname.startsWith('/dashboard') || url.pathname.startsWith('/onboarding'))) {
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // 2. Si utilisateur CONNECTÉ
  if (user) {
    // On vérifie s'il a fini l'onboarding
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('is_onboarded')
      .eq('user_id', user.id)
      .single()

    const isOnboarded = profile?.is_onboarded ?? false

    // Cas A : Il est sur une page d'auth (login/signup) -> Redirection intelligente
    if (url.pathname === '/login' || url.pathname === '/signup') {
      if (isOnboarded) {
        url.pathname = '/dashboard'
      } else {
        url.pathname = '/onboarding'
      }
      return NextResponse.redirect(url)
    }

    // Cas B : Il essaie d'aller au dashboard sans être onboardé
    if (url.pathname.startsWith('/dashboard') && !isOnboarded) {
      url.pathname = '/onboarding'
      return NextResponse.redirect(url)
    }

    // Cas C : Il essaie de refaire l'onboarding alors qu'il a fini
    if (url.pathname.startsWith('/onboarding') && isOnboarded) {
      url.pathname = '/dashboard'
      return NextResponse.redirect(url)
    }
  }

  return response
}