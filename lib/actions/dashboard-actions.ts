"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { RelapseInput } from "@/lib/validations/relapse";
import { logger } from "@/lib/utils/logger";
import { BADGES } from "@/lib/constants/badges";
import { UserStatsDailyView } from "@/lib/types/stats";
import { getVulnerabilityData } from "@/lib/actions/stats-actions";

interface UserProfile {
  daily_cost: number | null;
  daily_time_spent: number | null;
  last_check_in: string | null;
  daily_pledge: string | null;
  sobriety_start_date: string | null;
  is_broken: boolean | null;
  daily_value_1: number | null;
  daily_value_2: number | null;
}

export type ActionResponse<T = Record<string, unknown>> = {
  success: boolean;
  error?: string;
  data?: T;
};

export async function getDashboardStats() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;

  const [profileRes, statsRes, pledgesRes, relapsesRes, vulnerabilityData] = await Promise.all([
    supabase.from("user_profiles").select("*").eq("user_id", user.id).single(),
    supabase.from("user_stats_daily").select("*").eq("user_id", user.id).maybeSingle(),
    supabase.from("daily_pledges").select("pledge_date").eq("user_id", user.id),
    supabase.from("relapses").select("relapse_date").eq("user_id", user.id),
    getVulnerabilityData()
  ]);

  if (!profileRes.data) return null;

  const profile = profileRes.data as unknown as UserProfile;
  const stats = statsRes.data as UserStatsDailyView | null;

  const pledgeDates = pledgesRes.data?.map((p: { pledge_date: string }) => p.pledge_date) || [];
  const relapseDates = relapsesRes.data?.map((r: { relapse_date: string }) => r.relapse_date.split("T")[0]) || [];
  
  const todayStr = new Date().toLocaleDateString("en-CA");
  const hasPledgedToday = pledgeDates.includes(todayStr);

  let daysClean = 0;
  if (profile.sobriety_start_date && !profile.is_broken) {
      const start = new Date(profile.sobriety_start_date);
      const now = new Date();
      const diffTime = now.getTime() - start.getTime();
      daysClean = Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)));
  }

  const currentBadge = BADGES
    .filter((b) => b.category === "sobriety" && b.threshold <= daysClean)
    .sort((a, b) => b.threshold - a.threshold)[0] || null;

  let lastRelapseStreak = 0;
  if (profile.is_broken) {
      const { data: lastRelapse } = await supabase
        .from("relapses")
        .select("previous_streak_days")
        .eq("user_id", user.id)
        .order("relapse_date", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (lastRelapse) {
          lastRelapseStreak = (lastRelapse as { previous_streak_days: number }).previous_streak_days;
      }
  }

  return {
    daysClean,
    moneySaved: stats?.monthly_gain_1 || 0, 
    timeSaved: stats?.monthly_gain_2 || 0,
    lastCheckIn: profile.last_check_in,
    pledgeText: profile.daily_pledge,
    currentBadgeCode: currentBadge ? currentBadge.code : null,
    pledgeDates,
    relapseDates,
    hasPledgedTodayFromDB: hasPledgedToday,
    vulnerability: vulnerabilityData,
    lastRelapseStreak
  };
}

export async function signPledge(pledgeText: string): Promise<ActionResponse> {
  const supabase = await createClient();
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Non connecté" };

    const { error } = await supabase
      .from("user_profiles")
      .update({ 
        updated_at: new Date().toISOString(),
        daily_pledge: pledgeText
      })
      .eq("user_id", user.id);

    if (error) throw error;

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    logger.error("Sign Pledge Error", error);
    return { success: false, error: "Erreur lors de l&apos;engagement." };
  }
}

export async function declareRelapse(data: RelapseInput): Promise<ActionResponse> {
  const supabase = await createClient();
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Non connecté" };

    const today = new Date().toISOString();
    
    const { data: profile, error: profileFetchError } = await supabase
        .from("user_profiles")
        .select("sobriety_start_date")
        .eq("user_id", user.id)
        .single();

    if (profileFetchError) throw profileFetchError;

    let previousStreak = 0;
    if (profile?.sobriety_start_date) {
        const start = new Date(profile.sobriety_start_date);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - start.getTime());
        previousStreak = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    }

    const { error: relapseTableError } = await supabase
        .from("relapses")
        .insert({
            user_id: user.id,
            relapse_date: today,
            previous_streak_days: previousStreak,
            trigger_type: data.trigger_type,
            location: data.location,
            premeditation_level: data.premeditation_level,
            mood_before: data.mood_before,
            context: data.context
        });

    if (relapseTableError) throw relapseTableError;

    const { error: profileUpdateError } = await supabase
      .from("user_profiles")
      .update({ 
        sobriety_start_date: today,
        is_broken: true 
      })
      .eq("user_id", user.id);

    if (profileUpdateError) throw profileUpdateError;

    revalidatePath("/dashboard");
    revalidatePath("/stats");
    
    return { success: true };
  } catch (error) {
    logger.error("Declare Relapse Error", error);
    return { success: false, error: "Impossible de déclarer la rechute." };
  }
}