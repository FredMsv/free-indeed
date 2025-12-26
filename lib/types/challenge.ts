import { Database } from './supabase';

export type ChallengeRow = Database['public']['Tables']['weekly_challenges']['Row'];

export interface ChallengeWithStatus extends ChallengeRow {
  // 'locked' est le nouvel état clé pour le frontend
  userStatus: 'none' | 'joined' | 'completed' | 'locked';
  
  // Date pivot : 
  // - Si locked : c'est la date future de déblocage
  // - Si joined : c'est la date de début
  unlockedAt: string; 
}