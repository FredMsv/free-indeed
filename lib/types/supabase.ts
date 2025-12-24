export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      addiction_types: {
        Row: {
          color: string
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          name: string
        }
        Insert: {
          color: string
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name: string
        }
        Update: {
          color?: string
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      daily_pledges: {
        Row: {
          created_at: string | null
          id: string
          pledge_date: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          pledge_date?: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          pledge_date?: string
          user_id?: string
        }
        Relationships: []
      }
      group_messages: {
        Row: {
          addiction_type_id: string
          content: string
          created_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          addiction_type_id: string
          content: string
          created_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          addiction_type_id?: string
          content?: string
          created_at?: string | null
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_messages_addiction_type_id_fkey"
            columns: ["addiction_type_id"]
            isOneToOne: false
            referencedRelation: "addiction_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_messages_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      prayer_requests: {
        Row: {
          addiction_type_id: string
          content: string
          created_at: string | null
          id: string
          is_resolved: boolean | null
          is_shared: boolean | null
          user_id: string
        }
        Insert: {
          addiction_type_id: string
          content: string
          created_at?: string | null
          id?: string
          is_resolved?: boolean | null
          is_shared?: boolean | null
          user_id: string
        }
        Update: {
          addiction_type_id?: string
          content?: string
          created_at?: string | null
          id?: string
          is_resolved?: boolean | null
          is_shared?: boolean | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "prayer_requests_addiction_type_id_fkey"
            columns: ["addiction_type_id"]
            isOneToOne: false
            referencedRelation: "addiction_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prayer_requests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      prayer_supports: {
        Row: {
          created_at: string | null
          id: string
          message: string | null
          request_id: string
          supporter_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          message?: string | null
          request_id: string
          supporter_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string | null
          request_id?: string
          supporter_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "prayer_supports_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "prayer_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prayer_supports_supporter_id_fkey"
            columns: ["supporter_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      relapses: {
        Row: {
          created_at: string | null
          id: string
          note: string | null
          previous_streak_days: number
          relapse_date: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          note?: string | null
          previous_streak_days: number
          relapse_date?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          note?: string | null
          previous_streak_days?: number
          relapse_date?: string
          user_id?: string | null
        }
        Relationships: []
      }
      streaks: {
        Row: {
          created_at: string | null
          days_count: number | null
          end_date: string | null
          id: string
          is_current: boolean | null
          start_date: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          days_count?: number | null
          end_date?: string | null
          id?: string
          is_current?: boolean | null
          start_date: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          days_count?: number | null
          end_date?: string | null
          id?: string
          is_current?: boolean | null
          start_date?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "streaks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_journals: {
        Row: {
          content: string | null
          context: string | null
          created_at: string | null
          id: string
          journal_date: string
          mood: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content?: string | null
          context?: string | null
          created_at?: string | null
          id?: string
          journal_date: string
          mood: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string | null
          context?: string | null
          created_at?: string | null
          id?: string
          journal_date?: string
          mood?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          addiction_type_id: string | null
          avatar_url: string | null
          birth_date: string | null
          can_change_addiction_after: string | null
          created_at: string | null
          daily_value_1: number | null
          daily_value_2: number | null
          doctor_phone: string | null
          email: string | null
          emergency_contact_phone: string | null
          first_name: string | null
          gender: string | null
          habits: Json | null
          id: string
          is_broken: boolean | null
          is_in_community: boolean | null
          is_onboarded: boolean | null
          last_name: string | null
          pastor_phone: string | null
          pastor_phones: string[] | null
          phone_number: string | null
          sobriety_days_at_change: number | null
          sobriety_start_date: string | null
          updated_at: string | null
          user_id: string | null
          username: string | null
        }
        Insert: {
          addiction_type_id?: string | null
          avatar_url?: string | null
          birth_date?: string | null
          can_change_addiction_after?: string | null
          created_at?: string | null
          daily_value_1?: number | null
          daily_value_2?: number | null
          doctor_phone?: string | null
          email?: string | null
          emergency_contact_phone?: string | null
          first_name?: string | null
          gender?: string | null
          habits?: Json | null
          id?: string
          is_broken?: boolean | null
          is_in_community?: boolean | null
          is_onboarded?: boolean | null
          last_name?: string | null
          pastor_phone?: string | null
          pastor_phones?: string[] | null
          phone_number?: string | null
          sobriety_days_at_change?: number | null
          sobriety_start_date?: string | null
          updated_at?: string | null
          user_id?: string | null
          username?: string | null
        }
        Update: {
          addiction_type_id?: string | null
          avatar_url?: string | null
          birth_date?: string | null
          can_change_addiction_after?: string | null
          created_at?: string | null
          daily_value_1?: number | null
          daily_value_2?: number | null
          doctor_phone?: string | null
          email?: string | null
          emergency_contact_phone?: string | null
          first_name?: string | null
          gender?: string | null
          habits?: Json | null
          id?: string
          is_broken?: boolean | null
          is_in_community?: boolean | null
          is_onboarded?: boolean | null
          last_name?: string | null
          pastor_phone?: string | null
          pastor_phones?: string[] | null
          phone_number?: string | null
          sobriety_days_at_change?: number | null
          sobriety_start_date?: string | null
          updated_at?: string | null
          user_id?: string | null
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_profiles_addiction_type_id_fkey"
            columns: ["addiction_type_id"]
            isOneToOne: false
            referencedRelation: "addiction_types"
            referencedColumns: ["id"]
          },
        ]
      }
      user_relapses: {
        Row: {
          created_at: string | null
          id: string
          reason: string | null
          relapse_date: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          reason?: string | null
          relapse_date: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          reason?: string | null
          relapse_date?: string
          user_id?: string | null
        }
        Relationships: []
      }
      users: {
        Row: {
          avatar_url: string | null
          birth_date: string | null
          created_at: string | null
          email: string | null
          first_name: string
          gender: string | null
          id: string
          last_name: string
          phone_number: string
          updated_at: string | null
          username: string
        }
        Insert: {
          avatar_url?: string | null
          birth_date?: string | null
          created_at?: string | null
          email?: string | null
          first_name: string
          gender?: string | null
          id: string
          last_name: string
          phone_number: string
          updated_at?: string | null
          username: string
        }
        Update: {
          avatar_url?: string | null
          birth_date?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string
          gender?: string | null
          id?: string
          last_name?: string
          phone_number?: string
          updated_at?: string | null
          username?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_sobriety_days: { Args: { p_user_id: string }; Returns: number }
      get_current_streak: {
        Args: { p_user_id: string }
        Returns: {
          days_count: number
          start_date: string
          streak_id: string
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const
