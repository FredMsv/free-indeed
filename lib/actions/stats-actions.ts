"use server";

import { createClient } from "@/lib/supabase/server";
import { MOODS } from "@/lib/constants/moods";

export type Period = '7d' | '30d' | '1y';

interface UserHabits {
  emotional_triggers: string[];
  context_habits: string[];
  specific_behaviors: string[];
}

export async function getStatsData(period: Period = '30d') {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  // 1. Dates
  const endDate = new Date();
  const startDate = new Date();
  if (period === '7d') startDate.setDate(endDate.getDate() - 6);
  else if (period === '30d') startDate.setDate(endDate.getDate() - 29);
  else if (period === '1y') startDate.setFullYear(endDate.getFullYear() - 1);

  const startDateStr = startDate.toISOString().split('T')[0];

  // 2. Data Fetching
  const [profileReq, relapsesReq, pledgesReq, journalsReq, prayerReqs, prayerSupports] = await Promise.all([
    supabase.from('user_profiles').select('daily_value_1, daily_value_2, habits, addiction_types(name)').eq('user_id', user.id).single(),
    supabase.from('relapses').select('relapse_date').eq('user_id', user.id).gte('relapse_date', startDateStr),
    supabase.from('daily_pledges').select('pledge_date').eq('user_id', user.id).gte('pledge_date', startDateStr),
    supabase.from('user_journals').select('journal_date, mood, context').eq('user_id', user.id).gte('journal_date', startDateStr),
    supabase.from('prayer_requests').select('id', { count: 'exact' }).eq('user_id', user.id).gte('created_at', startDateStr),
    supabase.from('prayer_supports').select('id', { count: 'exact' }).eq('supporter_id', user.id).gte('created_at', startDateStr)
  ]);

  const profile = profileReq.data;
  const relapses = relapsesReq.data || [];
  const pledges = pledgesReq.data || [];
  const journals = journalsReq.data || [];
  
  const userHabits = (profile?.habits as unknown as UserHabits) || { 
    emotional_triggers: [], context_habits: [], specific_behaviors: [] 
  };

  // 3. Configuration des Unités et Valeurs
  const addictionName = profile?.addiction_types?.name?.toUpperCase() || 'DEFAULT';
  let unit1 = '€';
  let unit2 = 'qté';
  
  // Logique d'unités basée sur le type
  if (addictionName.includes('TABAC')) { unit1 = '€'; unit2 = 'cigs'; }
  else if (addictionName.includes('ALCOOL')) { unit1 = '€'; unit2 = 'kcal'; }
  else if (addictionName.includes('PORNO') || addictionName.includes('ECRAN')) { unit1 = 'h'; unit2 = 'pts'; }

  const val1Base = profile?.daily_value_1 || 0;
  const val2Base = profile?.daily_value_2 || 0;

  // 4. Calculs Globaux
  const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  const relapseDaysSet = new Set(relapses.map(r => r.relapse_date));
  const pledgeDaysSet = new Set(pledges.map(p => p.pledge_date));
  
  const totalPledges = pledgeDaysSet.size;
  const soberDays = totalPledges - [...pledgeDaysSet].filter(x => relapseDaysSet.has(x)).length;

  const contextCounts = {
    victory: journals.filter(j => j.context === 'victory').length,
    struggle: journals.filter(j => j.context === 'struggle').length,
    relapse: journals.filter(j => j.context === 'relapse').length,
    gratitude: journals.filter(j => j.context === 'gratitude').length,
    note: journals.filter(j => j.context === 'note').length,
  };

  // 5. Boucle Temporelle (Chart Data)
  const chartData = [];
  let cumul1 = 0;
  let cumul2 = 0;

  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toLocaleDateString('en-CA');
    const dayLabel = d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });

    let status = 0;
    if (relapseDaysSet.has(dateStr)) status = -1;
    else if (pledgeDaysSet.has(dateStr)) status = 1;

    // Calcul Cumulatif (Si sobre +, Si rechute -)
    if (status === 1) {
      cumul1 += val1Base;
      cumul2 += val2Base;
    } else if (status === -1) {
      cumul1 -= val1Base;
      cumul2 -= val2Base;
    }

    // Mood Score
    const daysJournals = journals.filter(j => j.journal_date === dateStr);
    let moodScore = 0;
    if (daysJournals.length > 0) {
      const sum = daysJournals.reduce((acc, curr) => {
        const m = MOODS.find(mood => mood.id === curr.mood);
        return acc + (m?.value || 3);
      }, 0);
      moodScore = parseFloat((sum / daysJournals.length).toFixed(1));
    }

    chartData.push({
      date: dateStr,
      label: dayLabel,
      status,
      moodScore,
      val1: parseFloat(cumul1.toFixed(1)),
      val2: parseFloat(cumul2.toFixed(1))
    });
  }

  return {
    period,
    userHabits,
    kpi: {
      successRate: totalDays > 0 ? Math.round((soberDays / totalDays) * 100) : 0,
      totalSaved1: parseFloat(cumul1.toFixed(0)), // Total Fin Période Var 1
      totalSaved2: parseFloat(cumul2.toFixed(0)), // Total Fin Période Var 2
      unit1,
      unit2,
      contextCounts,
      prayersAsked: prayerReqs.count || 0,
      prayersSupported: prayerSupports.count || 0
    },
    chartData
  };
}