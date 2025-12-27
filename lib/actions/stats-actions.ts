"use server";

import { createClient } from "@/lib/supabase/server";
import { logger } from "@/lib/utils/logger";
import { 
  StatsPeriod, 
  StatsDashboardData, 
  DayChartEntry, 
  ProfileWithDetails, 
  ContextAnalysis 
} from "@/lib/types/stats";

export async function getStatsData(period: StatsPeriod = '30d'): Promise<StatsDashboardData | null> {
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();
  const user = authData?.user;

  if (!user) return null;

  try {
    const now = new Date();
    const startDate = new Date();
    if (period === '7d') startDate.setDate(now.getDate() - 7);
    else if (period === '1y') startDate.setFullYear(now.getFullYear() - 1);
    else startDate.setDate(now.getDate() - 30);

    const startStr = startDate.toISOString().split('T')[0];

    const [profileRes, pledgesRes, relapsesRes, journalsRes, prayersRes] = await Promise.all([
      supabase.from("user_profiles").select("daily_value_1, daily_value_2, habits, addiction_types(name)").eq("user_id", user.id).single(),
      supabase.from("daily_pledges").select("pledge_date").eq("user_id", user.id).gte("pledge_date", startStr),
      supabase.from("relapses").select("relapse_date").eq("user_id", user.id).gte("relapse_date", startStr),
      supabase.from("user_journals").select("journal_date, mood, context").eq("user_id", user.id).gte("journal_date", startStr),
      supabase.from("prayer_requests").select("id").eq("user_id", user.id).gte("created_at", startStr)
    ]);

    if (!profileRes.data) return null;

    const profile = profileRes.data as ProfileWithDetails;
    const pledges = new Set(pledgesRes.data?.map(p => p.pledge_date) || []);
    const relapses = new Set(relapsesRes.data?.map(r => r.relapse_date.split('T')[0]) || []);

    const chartData: DayChartEntry[] = [];
    let successCount = 0;
    const daysToProcess = period === '7d' ? 7 : period === '1y' ? 365 : 30;

    for (let i = 0; i < daysToProcess; i++) {
      const d = new Date();
      d.setDate(now.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];

      const isRelapse = relapses.has(dateStr);
      const isPledge = pledges.has(dateStr);
      
      if (isPledge && !isRelapse) successCount++;

      chartData.unshift({
        date: dateStr,
        val1: profile.daily_value_1 || 0,
        val2: profile.daily_value_2 || 0,
        status: isRelapse ? -1 : isPledge ? 1 : 0,
        moodScore: 0
      });
    }

    const contextCounts: ContextAnalysis = { victory: 0, struggle: 0, relapse: 0, gratitude: 0, note: 0 };
    journalsRes.data?.forEach(j => {
      const ctx = j.context as keyof ContextAnalysis;
      if (ctx && ctx in contextCounts) contextCounts[ctx]++;
    });

    return {
      chartData,
      kpi: {
        successRate: Math.round((successCount / daysToProcess) * 100),
        totalSaved1: parseFloat((successCount * (profile.daily_value_1 || 0)).toFixed(1)),
        totalSaved2: parseFloat((successCount * (profile.daily_value_2 || 0)).toFixed(1)),
        unit1: "€",
        unit2: "h",
        prayersAsked: prayersRes.data?.length || 0,
        contextCounts
      },
      userHabits: profile.habits || { emotional_triggers: [], context_habits: [], specific_behaviors: [] }
    };
  } catch (error) {
    logger.error("Error calculating stats", error);
    return null;
  }
}

export async function getVulnerabilityData() {
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) return null;

  try {
    const { data: relapses, error } = await supabase
      .from("relapses")
      .select("trigger_type, location")
      .eq("user_id", authData.user.id);

    if (error || !relapses || relapses.length === 0) return null;

    const triggers = relapses.reduce((acc: Record<string, number>, curr) => {
      const key = curr.trigger_type || "autre";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    const locations = relapses.reduce((acc: Record<string, number>, curr) => {
      if (curr.location) acc[curr.location] = (acc[curr.location] || 0) + 1;
      return acc;
    }, {});

    const topTriggerEntry = Object.entries(triggers).sort((a, b) => b[1] - a[1])[0];
    const topLocationEntry = Object.entries(locations).sort((a, b) => b[1] - a[1])[0];

    return {
      topTrigger: topTriggerEntry ? { name: topTriggerEntry[0], count: topTriggerEntry[1] } : null,
      topLocation: topLocationEntry ? { name: topLocationEntry[0], count: topLocationEntry[1] } : null,
      totalRelapses: relapses.length
    };
  } catch (error) {
    logger.error("Error fetching vulnerability data", error);
    return null;
  }
}