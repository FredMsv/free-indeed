"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { RelapseInput } from "@/lib/validations/relapse";
import { logger } from "@/lib/utils/logger";
import { BADGES } from "@/lib/constants/badges";


interface UserProfile {
  daily_cost: number | null;
  daily_time_spent: number | null;
  last_check_in: string | null;
  daily_pledge: string | null;
  sobriety_start_date: string | null;
  is_broken: boolean | null;
}

/**
 * Interface générique stricte pour les réponses des actions.
 * On utilise Record<string, unknown> au lieu de any pour la sécurité.
 */
export type ActionResponse<T = Record<string, unknown>> = {
  success: boolean;
  error?: string;
  data?: T;
};

export async function getDashboardStats() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;

  const { data } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (!data) return null;

  const profile = data as unknown as UserProfile;

  const { data: relapses } = await supabase
    .from('relapses')
    .select('relapse_date')
    .eq('user_id', user.id);

  const relapseDates = relapses?.map(r => r.relapse_date) || [];

  const { data: pledges } = await supabase
    .from('daily_pledges')
    .select('pledge_date')
    .eq('user_id', user.id);

  const pledgeDates = pledges?.map(p => p.pledge_date) || [];
  const todayStr = new Date().toLocaleDateString('en-CA');
  const hasPledgedToday = pledgeDates.includes(todayStr);

  const start = new Date(profile.sobriety_start_date ?? new Date());
  const now = new Date();
  const diffTime = now.getTime() - start.getTime();
  const diffDays = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  const currentBadge = BADGES
    .filter(b => b.category === 'sobriety' && b.threshold <= diffDays)
    .sort((a, b) => b.threshold - a.threshold)[0] || null;

  let lastRelapseStreak = 0;
  if (profile.is_broken) {
      const { data: lastRelapse } = await supabase
        .from('relapses')
        .select('previous_streak_days')
        .eq('user_id', user.id)
        .order('relapse_date', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (lastRelapse) {
          lastRelapseStreak = lastRelapse.previous_streak_days;
      }
  }

  return {
    daysClean: diffDays,
    moneySaved: diffDays * (profile.daily_cost || 0),
    timeSaved: diffDays * (profile.daily_time_spent || 0),
    lastCheckIn: profile.last_check_in,
    pledgeText: profile.daily_pledge,
    currentBadgeCode: currentBadge ? currentBadge.code : null,
    relapseDates,
    pledgeDates,
    hasPledgedTodayFromDB: hasPledgedToday,
    lastRelapseStreak
  };
}

export async function signPledge(pledgeText: string): Promise<ActionResponse> {
  const supabase = await createClient();
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Non connecté" };

    const { error } = await supabase
      .from('user_profiles')
      .update({ 
        updated_at: new Date().toISOString(),
        daily_pledge: pledgeText
      })
      .eq('user_id', user.id);

    if (error) throw error;

    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    logger.error("Sign Pledge Error", error);
    return { success: false, error: "Erreur lors de l'engagement." };
  }
}

export async function declareRelapse(data: RelapseInput): Promise<ActionResponse> {
  const supabase = await createClient();
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Non connecté" };

    const today = new Date().toISOString();
    const { data: profile } = await supabase
        .from('user_profiles')
        .select('sobriety_start_date')
        .eq('user_id', user.id)
        .single();

    let previousStreak = 0;
    if (profile?.sobriety_start_date) {
        const start = new Date(profile.sobriety_start_date);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - start.getTime());
        previousStreak = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    const { error: relapseTableError } = await supabase
        .from('relapses')
        .insert({
            user_id: user.id,
            relapse_date: today,
            previous_streak_days: previousStreak,
            trigger_type: data.trigger_type,
            mood_before: data.mood_before,
            context: data.context
        });

    if (relapseTableError) logger.error("Error saving relapse history", relapseTableError);

    const { error: profileError } = await supabase
      .from('user_profiles')
      .update({ 
        sobriety_start_date: today,
        is_broken: true 
      })
      .eq('user_id', user.id);

    if (profileError) throw profileError;

    revalidatePath('/dashboard');
    revalidatePath('/stats');
    revalidatePath('/profile');
    
    return { success: true };
  } catch (error) {
    logger.error("Declare Relapse Error", error);
    return { success: false, error: "Impossible de déclarer la rechute." };
  }
}