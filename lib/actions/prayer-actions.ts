"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { logger } from "@/lib/utils/logger";
import { ActionResponse } from "./dashboard-actions";
import { CommunityPrayerQueryResult, MyPrayerQueryResult } from "@/lib/types/query-types";

// ... (Les interfaces PrayerRequestWithProfile et MyRequestWithSupports restent identiques) ...
export interface PrayerRequestWithProfile {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  is_shared: boolean;
  users: {
    username: string | null;
    avatar_url: string | null;
  } | null;
  support_count: number;
}

export interface MyRequestWithSupports {
  id: string;
  content: string;
  created_at: string;
  is_shared: boolean;
  supports: {
    id: string;
    message: string | null;
    created_at: string;
    supporter: {
        username: string | null;
    } | null;
  }[];
}

export async function getCommunityPrayerRequests(limit = 10) {
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
    .from('prayer_requests')
    .select(`
      *,
      user_profiles (
        username,
        avatar_url
      ),
      prayer_supports (count)
    `)
    .eq('addiction_type_id', profile.addiction_type_id)
    .eq('is_shared', true)
    .neq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    logger.error("Error fetching community prayers", error);
    return [];
  }

  const rawData = data as unknown as CommunityPrayerQueryResult[];
  return rawData.map((item) => {
    const count = (item.prayer_supports && item.prayer_supports.length > 0) 
      ? item.prayer_supports[0].count 
      : 0;

    const userInfo = item.user_profiles || { username: "Membre", avatar_url: null };

    return {
      id: item.id,
      content: item.content,
      created_at: item.created_at || new Date().toISOString(),
      user_id: item.user_id,
      is_shared: item.is_shared || false,
      users: userInfo,
      support_count: count
    } satisfies PrayerRequestWithProfile;
  });
}

export async function getMyPrayerRequests(limit = 10) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('prayer_requests')
    .select(`
      *,
      prayer_supports (
        id,
        message,
        created_at,
        supporter_id,
        user_profiles:supporter_id ( username ) 
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    logger.error("Error fetching my prayers", error);
    return [];
  }

  const rawData = data as unknown as MyPrayerQueryResult[];
  return rawData.map(req => ({
    id: req.id,
    content: req.content,
    created_at: req.created_at || new Date().toISOString(),
    is_shared: req.is_shared || false,
    supports: req.prayer_supports.map((s) => ({
        id: s.id,
        message: s.message,
        created_at: s.created_at || new Date().toISOString(),
        supporter: s.user_profiles || { username: "Membre" }
    }))
  })) as MyRequestWithSupports[];
}

export async function createPrayerRequest(content: string, isShared: boolean): Promise<ActionResponse> {
  const supabase = await createClient();
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return { success: false, error: "Non connecté" };

    const { data: profile } = await supabase
      .from('user_profiles')
      .select('addiction_type_id')
      .eq('user_id', user.id)
      .single();

    if (!profile?.addiction_type_id) return { success: false, error: "Profil incomplet" };

    const { error } = await supabase
      .from('prayer_requests')
      .insert({
        user_id: user.id,
        addiction_type_id: profile.addiction_type_id,
        content: content.trim(),
        is_shared: isShared
      });

    if (error) {
      logger.error("Error creating prayer request", error, { userId: user.id });
      return { success: false, error: "Erreur lors de la création." };
    }

    revalidatePath('/community');
    return { success: true };

  } catch (error) {
    logger.error("Exception createPrayerRequest", error);
    return { success: false, error: "Erreur inattendue." };
  }
}

// ✅ CORRECTION ICI : Ajout de la vérification du count
export async function deletePrayerRequest(requestId: string): Promise<ActionResponse> {
  const supabase = await createClient();
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return { success: false, error: "Non connecté" };

    // On demande explicitement le 'count' des lignes supprimées
    const { error, count } = await supabase
      .from('prayer_requests')
      .delete({ count: 'exact' }) 
      .eq('id', requestId)
      .eq('user_id', user.id);

    if (error) {
      logger.error("Error deleting prayer request", error, { requestId });
      return { success: false, error: "Impossible de supprimer." };
    }

    // Si aucune ligne n'a été affectée (ex: ID incorrect ou mauvais user), on renvoie une erreur
    if (count === 0) {
        return { success: false, error: "Élément introuvable ou accès refusé." };
    }

    revalidatePath('/community');
    return { success: true };
  } catch (error) {
    logger.error("Exception deletePrayerRequest", error);
    return { success: false, error: "Erreur serveur." };
  }
}

export async function sendPrayerSupport(requestId: string, message: string): Promise<ActionResponse> {
  const supabase = await createClient();
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return { success: false, error: "Non connecté" };

    const { data: request } = await supabase.from('prayer_requests').select('user_id').eq('id', requestId).single();

    const { error } = await supabase
      .from('prayer_supports')
      .insert({
        request_id: requestId,
        supporter_id: user.id,
        message: message.trim()
      });

    if (error) {
      logger.error("Error sending support", error, { userId: user.id, requestId });
      return { success: false, error: "Erreur lors de l'envoi." };
    }

    if (request && request.user_id !== user.id) {
        await supabase.from('notifications').insert({
            user_id: request.user_id,
            type: 'support',
            title: 'Nouveau soutien 🙏',
            message: 'Quelqu\'un a prié pour vous.',
            link: '/community'
        });
    }

    revalidatePath('/community');
    return { success: true };
  } catch (error) {
    logger.error("Exception sendPrayerSupport", error);
    return { success: false, error: "Erreur inattendue." };
  }
}