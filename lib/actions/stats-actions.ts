"use server";

import { createClient } from "@/lib/supabase/server";
import { UserStatsDailyView } from "@/lib/types/stats";
import { logger } from "@/lib/utils/logger";

export async function getStatsData() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  try {
    const { data: viewData } = await supabase
        .from('user_stats_daily')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

    const { data: profile } = await supabase
        .from('user_profiles')
        .select(`
            daily_value_1, 
            daily_value_2, 
            sobriety_start_date,
            is_broken,
            addiction_types ( name )
        `)
        .eq('user_id', user.id)
        .single();

    if (!profile) return null;

    let daysClean = 0;
    if (profile.sobriety_start_date && !profile.is_broken) {
        const start = new Date(profile.sobriety_start_date);
        const now = new Date();
        daysClean = Math.max(0, Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
    }

    const addictionName = profile.addiction_types?.name?.toUpperCase() || '';
    let unit1 = '€';
    let unit2 = 'h';
    if (['PORNO', 'SEX', 'ECRAN', 'SOCIAL', 'JEU'].some(k => addictionName.includes(k))) {
        unit1 = 'h';
        unit2 = ''; 
    } 
    else {
        if (addictionName.includes('TABAC')) unit2 = 'cig';
        if (addictionName.includes('ALCOOL')) unit2 = 'kcal';
    }

    const stats = viewData as UserStatsDailyView | null;
    const pledgeCount = stats?.pledge_count || 0;
    const relapseCount = stats?.relapse_count || 0;

    return {
        chartData: [], 
        kpi: {
            successRate: daysClean > 0 ? 100 : 0,
            totalSaved1: parseFloat((daysClean * (profile.daily_value_1 || 0)).toFixed(1)),
            totalSaved2: parseFloat((daysClean * (profile.daily_value_2 || 0)).toFixed(1)),
            unit1,
            unit2,
            prayersAsked: 0,
            prayersSupported: 0,
            contextCounts: {
                victory: pledgeCount,
                struggle: relapseCount
            }
        },
        userHabits: {
            emotional_triggers: [],
            context_habits: []
        }
    };

  } catch (error) {
    logger.error("Error getting stats data", error);
    return null;
  }
}