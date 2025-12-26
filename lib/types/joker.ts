/**
 * Structure de retour JSON de la fonction SQL `can_use_joker`.
 * Doit correspondre exactement au `jsonb_build_object` du SQL.
 */
export interface JokerEligibility {
    allowed: boolean;
    reason: string;
    remaining_uses: number;
  }
  
  /**
   * Données nécessaires pour traiter une demande de Joker.
   */
  export interface JokerRequest {
    relapseId: string; // UUID de la rechute ciblée
  }
  
  /**
   * Résultat de l'action serveur d'utilisation du Joker.
   */
  export interface JokerActionResponse {
    success: boolean;
    error?: string;
    data?: {
      remainingUses: number;
      daysRestored: number;
      newStartDate: string;
    };
  }