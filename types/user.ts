import { Database } from './database.types';

// Type dérivé directement de la structure DB pour éviter les erreurs de mapping
export type UserProfile = Database['public']['Tables']['users']['Row'];

// Type étendu si tu as besoin de mixer les infos Auth et Public dans l'UI
export interface AuthUser extends UserProfile {
  role?: string | null;
  is_anonymous?: boolean;
  email_confirmed_at?: string | null;
}