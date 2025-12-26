import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { CustomDatabase } from '@/lib/types/custom-database' // Import du type étendu

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient<CustomDatabase>( // Typage avec CustomDatabase
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

  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error && !error.message.includes('Refresh Token Not Found')) {
     console.error("Middleware Auth Error:", error.message)
  }

  const url = request.nextUrl.clone()
  
  // Protection des routes
  if (!user && (url.pathname.startsWith('/dashboard') || url.pathname.startsWith('/onboarding'))) {
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  if (user) {
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('is_onboarded')
      .eq('user_id', user.id)
      .single()

    const isOnboarded = profile?.is_onboarded ?? false

    if (url.pathname === '/login' || url.pathname === '/signup' || url.pathname === '/forgot-password') {
      url.pathname = isOnboarded ? '/dashboard' : '/onboarding'
      return NextResponse.redirect(url)
    }

    if (url.pathname.startsWith('/dashboard') && !isOnboarded) {
      url.pathname = '/onboarding'
      return NextResponse.redirect(url)
    }

    if (url.pathname.startsWith('/onboarding') && isOnboarded) {
      url.pathname = '/dashboard'
      return NextResponse.redirect(url)
    }
  }

  return response
}