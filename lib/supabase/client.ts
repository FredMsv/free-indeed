import { createBrowserClient } from '@supabase/ssr'
import { CustomDatabase } from '@/lib/types/custom-database' // <-- Utilise CustomDatabase

export const createClient = () =>
  createBrowserClient<CustomDatabase>( // <-- Typage ici
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )