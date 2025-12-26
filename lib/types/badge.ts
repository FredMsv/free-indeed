import { BadgeDef } from "@/lib/constants/badges";

/**
 * Résultat d'une tentative d'attribution de badge.
 */
export interface BadgeAwardResult {
  awarded: boolean;
  badge: BadgeDef | null; // Le badge complet pour l'affichage (notification)
  error?: string;
}

/**
 * Extension pour les données de badge stockées (si besoin d'étendre earned_badges plus tard)
 */
export interface EarnedBadgeDB {
  id: string;
  user_id: string;
  badge_code: string;
  created_at: string;
  metadata?: Record<string, unknown> | null;
}