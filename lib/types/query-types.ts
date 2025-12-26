import { Database } from '@/lib/types/supabase';

// Alias pour faciliter la lecture
type UserProfileRow = Database['public']['Tables']['user_profiles']['Row'];
type GroupMessageRow = Database['public']['Tables']['group_messages']['Row'];
type PrayerRequestRow = Database['public']['Tables']['prayer_requests']['Row'];
type PrayerSupportRow = Database['public']['Tables']['prayer_supports']['Row'];

// --- UTILITAIRES ---

// Type pour un profil "minifié" renvoyé par les jointures
export interface UserProfileMinimal {
  username: string | null;
  avatar_url: string | null;
}

// --- CHAT TYPES ---

// Résultat de la requête getInitialMessages
export interface GroupMessageQueryResult extends GroupMessageRow {
  user_profiles: UserProfileMinimal | null;
}

// --- PRAYER TYPES ---

interface SupportCount {
  count: number;
}

// Résultat de la requête getCommunityPrayerRequests
export interface CommunityPrayerQueryResult extends PrayerRequestRow {
  user_profiles: UserProfileMinimal | null;
  prayer_supports: SupportCount[]; // Supabase renvoie un tableau d'objets pour le count
}

// Résultat de la requête getMyPrayerRequests
// Note : on doit définir précisément la structure imbriquée des soutiens
export interface PrayerSupportWithSupporter extends PrayerSupportRow {
  // Alias 'user_profiles' utilisé dans la query
  user_profiles: { username: string | null } | null;
}

export interface MyPrayerQueryResult extends PrayerRequestRow {
  prayer_supports: PrayerSupportWithSupporter[];
}