"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getCommunityStatus() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { data } = await supabase
    .from('user_profiles')
    .select('is_in_community')
    .eq('user_id', user.id)
    .single();

  return data?.is_in_community || false;
}

export async function joinCommunity() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Non connecté" };

  const { error } = await supabase
    .from('user_profiles')
    .update({ is_in_community: true })
    .eq('user_id', user.id);

  if (error) return { success: false, error: error.message };

  revalidatePath('/community');
  return { success: true };
}

export async function leaveCommunity() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Non connecté" };

  const { error } = await supabase
    .from('user_profiles')
    .update({ is_in_community: false })
    .eq('user_id', user.id);

  if (error) return { success: false, error: error.message };

  revalidatePath('/community');
  return { success: true };
}