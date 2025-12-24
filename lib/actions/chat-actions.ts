"use server";

import { createClient } from "@/lib/supabase/server";

export interface GroupMessage {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  users: {
    username: string | null;
    avatar_url: string | null;
  } | null;
  is_me?: boolean;
}

// Interface interne pour typer le retour brut de Supabase
interface RawMessage {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  user_profiles: {
    username: string | null;
    avatar_url: string | null;
  } | null;
}

/**
 * Récupère les 50 derniers messages du groupe de l'utilisateur
 */
export async function getInitialMessages() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  // 1. Récupérer le groupe (addiction_id)
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('addiction_type_id')
    .eq('user_id', user.id)
    .single();

  if (!profile?.addiction_type_id) return [];

  // 2. Récupérer les messages
  // CORRECTION : On sélectionne 'user_profiles' car c'est le nom de la table liée
  const { data, error } = await supabase
    .from('group_messages')
    .select(`
      id,
      content,
      created_at,
      user_id,
      user_profiles (
        username,
        avatar_url
      )
    `)
    .eq('addiction_type_id', profile.addiction_type_id)
    .order('created_at', { ascending: false })
    .limit(50);

  if (error || !data) {
    console.error("Erreur chat:", error);
    return [];
  }

  // 3. Transformation des données
  // On mappe 'user_profiles' vers 'users' pour respecter votre interface Frontend
  const rawMessages = data as unknown as RawMessage[];

  return rawMessages.reverse().map(msg => ({
    id: msg.id,
    content: msg.content,
    created_at: msg.created_at,
    user_id: msg.user_id,
    users: msg.user_profiles, // Mapping ici
    is_me: msg.user_id === user.id
  })) as GroupMessage[];
}

/**
 * Envoie un nouveau message
 */
export async function sendMessage(content: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return { success: false, error: "Non connecté" };
  if (!content.trim()) return { success: false, error: "Message vide" };

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('addiction_type_id')
    .eq('user_id', user.id)
    .single();

  if (!profile?.addiction_type_id) return { success: false, error: "Profil introuvable" };

  const { error } = await supabase
    .from('group_messages')
    .insert({
      user_id: user.id,
      addiction_type_id: profile.addiction_type_id,
      content: content.trim()
    });

  if (error) return { success: false, error: error.message };
  
  return { success: true };
}