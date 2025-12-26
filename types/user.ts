import { Database } from '@/lib/types/supabase';

// Type dérivé directement de la structure DB pour éviter les erreurs de mapping
export type UserProfile = Database['public']['Tables']['user_profiles']['Row'];

// Type étendu si tu as besoin de mixer les infos Auth et Public dans l'UI
export interface AuthUser extends UserProfile {
  role?: string | null;
  is_anonymous?: boolean;
  email_confirmed_at?: string | null;
}