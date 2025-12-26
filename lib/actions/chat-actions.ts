"use server";

import { createClient } from "@/lib/supabase/server";
import { logger } from "@/lib/utils/logger";
import { ActionResponse } from "./dashboard-actions";
import { GroupMessageQueryResult } from "@/lib/types/query-types";

// Interface Front-end
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

export async function getInitialMessages() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('addiction_type_id')
    .eq('user_id', user.id)
    .single();

  if (!profile?.addiction_type_id) return [];

  const { data, error } = await supabase
    .from('group_messages')
    .select(`
      *,
      user_profiles (
        username,
        avatar_url
      )
    `)
    .eq('addiction_type_id', profile.addiction_type_id)
    .order('created_at', { ascending: false })
    .limit(50);

  if (error || !data) {
    logger.error("Error fetching chat", error);
    return [];
  }

  // Validation de type sécurisée
  const rawMessages = data as unknown as GroupMessageQueryResult[];

  return rawMessages.reverse().map(msg => {
    // Gestion du cas où le profil utilisateur a été supprimé
    const userInfo = msg.user_profiles || { username: "Utilisateur inconnu", avatar_url: null };

    return {
      id: msg.id,
      content: msg.content,
      created_at: msg.created_at || new Date().toISOString(),
      user_id: msg.user_id,
      users: userInfo,
      is_me: msg.user_id === user.id
    } satisfies GroupMessage;
  });
}

export async function sendMessage(content: string): Promise<ActionResponse> {
  const supabase = await createClient();
  
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return { success: false, error: "Non connecté" };
    
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

    if (error) {
        logger.error("Error sending message", error, { userId: user.id });
        return { success: false, error: "Echec de l'envoi." };
    }
    
    return { success: true };

  } catch (error) {
    logger.error("Exception sendMessage", error);
    return { success: false, error: "Erreur serveur." };
  }
}