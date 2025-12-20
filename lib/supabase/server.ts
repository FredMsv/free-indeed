import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

// 📌 [CREATE CLIENT SERVEUR] : Gère la session via les cookies [cite: 242]
export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // 📌 Utilisation de l'erreur pour le log serveur
            console.error("Erreur lors de la définition du cookie:", error)
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            // 📌 Utilisation de l'erreur pour le log serveur
            console.error("Erreur lors de la suppression du cookie:", error)
          }
        },
      },
    }
  )
}