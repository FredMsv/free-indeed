"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// --- TYPES DE SORTIE ---
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

// --- 1. RÉCUPÉRER LE MUR (COMMUNAUTÉ) ---
export async function getCommunityPrayerRequests() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('addiction_type_id')
    .eq('user_id', user.id)
    .single();

  if (!profile?.addiction_type_id) return [];

  // CORRECTION : On demande 'user_profiles' au lieu de 'users'
  const { data, error } = await supabase
    .from('prayer_requests')
    .select(`
      id,
      content,
      created_at,
      user_id,
      is_shared,
      user_profiles (
        username,
        avatar_url
      ),
      prayer_supports (count)
    `)
    .eq('addiction_type_id', profile.addiction_type_id)
    .eq('is_shared', true)
    .neq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Erreur fetch prayers:", error);
    return [];
  }

  // Mapping : on transforme 'user_profiles' en 'users' pour le frontend
  return data.map((item) => ({
    ...item,

    users: item.user_profiles, 

    support_count: item.prayer_supports?.[0]?.count || 0
  })) as unknown as PrayerRequestWithProfile[];
}

// --- 2. RÉCUPÉRER MES DEMANDES ---
export async function getMyPrayerRequests() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  // CORRECTION : Ici aussi, pour les soutiens, on demande 'user_profiles'
  const { data, error } = await supabase
    .from('prayer_requests')
    .select(`
      id,
      content,
      created_at,
      is_shared,
      prayer_supports (
        id,
        message,
        created_at,
        user_profiles:supporter_id ( username ) 
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Erreur fetch my prayers:", error);
    return [];
  }

  // Mapping des résultats

  return data.map(req => ({
    id: req.id,
    content: req.content,
    created_at: req.created_at,
    is_shared: req.is_shared || false,

    supports: req.prayer_supports.map((s) => ({
        id: s.id,
        message: s.message,
        created_at: s.created_at,
        supporter: s.user_profiles // On mappe user_profiles vers supporter
    }))
  })) as MyRequestWithSupports[];
}

// --- 3. CRÉER UNE DEMANDE ---
export async function createPrayerRequest(content: string, isShared: boolean) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Non connecté" };

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

  if (error) return { success: false, error: error.message };

  revalidatePath('/community'); // Rafraichit la bonne page
  return { success: true };
}

// --- 4. ENVOYER UN SOUTIEN ---
export async function sendPrayerSupport(requestId: string, message: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Non connecté" };

  const { error } = await supabase
    .from('prayer_supports')
    .insert({
      request_id: requestId,
      supporter_id: user.id,
      message: message.trim()
    });

  if (error) return { success: false, error: error.message };

  revalidatePath('/community'); // Rafraichit la bonne page
  return { success: true };
}