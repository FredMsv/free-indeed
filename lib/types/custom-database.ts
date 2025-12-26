import { Database as GeneratedDatabase } from './supabase';

/**
 * Extension manuelle des types Supabase pour inclure les nouveaux objets SQL
 * (Tables, Vues, Fonctions) sans régénérer tout le fichier via le CLI.
 */
export type CustomDatabase = GeneratedDatabase & {
  public: {
    Tables: {
      joker_usage_log: {
        Row: {
          id: string;
          user_id: string;
          used_at: string;
          relapse_id: string;
          days_restored: number;
        };
        Insert: {
          id?: string;
          user_id: string;
          used_at?: string;
          relapse_id: string;
          days_restored: number;
        };
        Update: {
          id?: string;
          user_id?: string;
          used_at?: string;
          relapse_id?: string;
          days_restored?: number;
        };
        Relationships: [
          {
            foreignKeyName: "joker_usage_log_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "joker_usage_log_relapse_id_fkey";
            columns: ["relapse_id"];
            referencedRelation: "relapses";
            referencedColumns: ["id"];
          }
        ];
      };
      // Définition de la Vue Matérialisée comme une Table en lecture seule
      user_stats_daily: {
        Row: {
          user_id: string;
          stat_date: string; // YYYY-MM-DD
          pledge_count: number;
          journal_count: number;
          relapse_count: number;
          mood_entries_count: number;
        };
        Insert: never; // Vue matérialisée -> pas d'insert
        Update: never;
        Relationships: [
          {
            foreignKeyName: "user_stats_daily_user_id_fkey"; // Implicite via la vue
            columns: ["user_id"];
            referencedRelation: "user_profiles";
            referencedColumns: ["user_id"];
          }
        ];
      };
    };
    Functions: {
      can_use_joker: {
        Args: {
          p_user_id: string;
          p_relapse_id: string;
        };
        Returns: import('./joker').JokerEligibility; // Typé via notre fichier dédié
      };
      award_badge_safe: {
        Args: {
          p_user_id: string;
          p_badge_code: string;
        };
        Returns: boolean;
      };
      is_valid_sobriety_date: {
        Args: {
          date_val: string;
        };
        Returns: boolean;
      };
    };
  };
};