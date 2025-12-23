export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string
          user_id: string
          first_name: string | null
          last_name: string | null
          username: string | null
          email: string | null
          phone_number: string | null
          gender: string | null
          birth_date: string | null
          avatar_url: string | null
          
          addiction_type_id: string | null
          sobriety_start_date: string | null
          emergency_contact_phone: string | null
          pastor_phone: string | null
          doctor_phone: string | null
          
          // ✅ COLONNES AJOUTÉES
          daily_value_1: number | null
          daily_value_2: number | null
          habits: Json | null
          
          is_onboarded: boolean
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          first_name?: string | null
          last_name?: string | null
          username?: string | null
          email?: string | null
          phone_number?: string | null
          gender?: string | null
          birth_date?: string | null
          avatar_url?: string | null
          
          addiction_type_id?: string | null
          sobriety_start_date?: string | null
          emergency_contact_phone?: string | null
          pastor_phone?: string | null
          doctor_phone?: string | null
          
          // ✅ COLONNES AJOUTÉES
          daily_value_1?: number | null
          daily_value_2?: number | null
          habits?: Json | null
          
          is_onboarded?: boolean
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          first_name?: string | null
          last_name?: string | null
          username?: string | null
          email?: string | null
          phone_number?: string | null
          gender?: string | null
          birth_date?: string | null
          avatar_url?: string | null
          
          addiction_type_id?: string | null
          sobriety_start_date?: string | null
          emergency_contact_phone?: string | null
          pastor_phone?: string | null
          doctor_phone?: string | null
          
          // ✅ COLONNES AJOUTÉES
          daily_value_1?: number | null
          daily_value_2?: number | null
          habits?: Json | null
          
          is_onboarded?: boolean
          created_at?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_profiles_addiction_type_id_fkey"
            columns: ["addiction_type_id"]
            isOneToOne: false
            referencedRelation: "addiction_types"
            referencedColumns: ["id"]
          }
        ]
      }
      user_journals: {
        Row: {
          id: string
          user_id: string
          journal_date: string
          mood: string
          content: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          journal_date: string
          mood: string
          content?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          journal_date?: string
          mood?: string
          content?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      addiction_types: {
        Row: {
          id: string
          name: string
          icon: string | null
          color: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          icon?: string | null
          color?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          icon?: string | null
          color?: string | null
          created_at?: string
        }
        Relationships: []
      }

      daily_pledges: {
        Row: {
          id: string
          user_id: string
          pledge_date: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          pledge_date: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          pledge_date?: string
          created_at?: string
        }
        Relationships: [
            {
                foreignKeyName: "daily_pledges_user_id_fkey"
                columns: ["user_id"]
                isOneToOne: false
                referencedRelation: "users"
                referencedColumns: ["id"]
              }
        ]
      }

      users: {
        Row: {
          id: string
          email: string | null
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id: string
          email?: string | null
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          email?: string | null
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_: string]: never
    }
    Functions: {
      [_: string]: never
    }
    Enums: {
      [_: string]: never
    }
    CompositeTypes: {
      [_: string]: never
    }
  }
}