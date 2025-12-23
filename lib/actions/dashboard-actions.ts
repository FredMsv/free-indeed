"use server";

import { createClient } from "@/lib/supabase/server";
import { getVerseForTheDay } from '../utils/verse-picker';
import { revalidatePath } from "next/cache";

interface AddictionTypeData {
  name: string;
  icon: string | null;
}

interface DashboardProfile {
  first_name: string | null;
  sobriety_start_date: string | null;
  is_broken: boolean;
  created_at: string;
  daily_value_1: number | null;
  daily_value_2: number | null;
  addiction_types: AddictionTypeData | null; 
}

export async function handleRelapse() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { success: false, error: "Non autorisé" };

  // Date locale YYYY-MM-DD
  const todayStr = new Date().toLocaleDateString('en-CA');

  // 1. Archivage de la rechute (Rouge)
  // On ajoute previous_streak_days: 0 pour satisfaire TypeScript et la contrainte NOT NULL
  const { error: relapseError } = await supabase
    .from('relapses')
    .insert({
      user_id: user.id,
      relapse_date: todayStr,
      previous_streak_days: 0 
    });

  if (relapseError) {
    console.error("Erreur Relapse:", relapseError.message);
  }

  // 2. Mise en état de rupture (Le compteur s'arrête, calendrier en attente)
  const { error: profileError } = await supabase
    .from('user_profiles')
    .update({ is_broken: true })
    .eq('user_id', user.id);

  if (profileError) {
    return { success: false, error: profileError.message };
  }

  revalidatePath('/dashboard');
  return { success: true };
}

export async function getDashboardData() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Non autorisé");

  // Récupération Profil
  const { data: profileData, error } = await supabase
    .from('user_profiles')
    .select(`
      first_name, 
      sobriety_start_date, 
      is_broken, 
      created_at,
      daily_value_1, 
      daily_value_2,
      addiction_types (
        name,
        icon
      )
    `)
    .eq('user_id', user.id)
    .single();

  if (error || !profileData) {
    // Retour par défaut si pas de profil (Onboarding)
    return {
       userFirstName: "Invité",
       daysSober: 0,
       isBroken: false,
       hasPledgedToday: false,
       monthPledges: [],
       currentPhase: "Onboarding",
       nextMilestone: { label: "Départ", progress: 0, daysLeft: 1 },
       stats: { label1: "-", value1: "0", unit1: "", icon1: "activity", label2: "-", value2: "0", unit2: "", icon2: "activity" },
       dailyVerse: getVerseForTheDay("DEFAULT"),
       sobrietyStartDate: null,
       relapseDates: [],
       pledgeDates: []
    };
  }

  const profile = profileData as unknown as DashboardProfile;

  // Récupération des données connexes
  const { data: relapses } = await supabase.from('relapses').select('relapse_date').eq('user_id', user.id);
  const { data: pledges } = await supabase.from('daily_pledges').select('pledge_date').eq('user_id', user.id);

  // Calcul des jours sobres
  let daysSober = 0;
  // Si le profil est "brisé" (en rechute non résolue), le compteur est à 0
  if (profile.sobriety_start_date && !profile.is_broken) {
    const start = new Date(profile.sobriety_start_date);
    const now = new Date();
    start.setHours(0, 0, 0, 0);
    now.setHours(0, 0, 0, 0);
    const diffTime = now.getTime() - start.getTime();
    daysSober = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    daysSober = Math.max(0, daysSober);
  }

  const addictionName = profile.addiction_types?.name || 'DEFAULT';
  const todayStr = new Date().toLocaleDateString('en-CA');
  const pledgeDates = pledges?.map(p => p.pledge_date) || [];
  const hasPledgedToday = pledgeDates.includes(todayStr);

  // Stats (Simplifié pour l'exemple, reprenez votre logique complexe si besoin)
  const v1 = profile.daily_value_1 || 0;
  
  return {
    userFirstName: profile.first_name || "Utilisateur",
    daysSober,
    isBroken: profile.is_broken || false,
    hasPledgedToday,
    monthPledges: pledgeDates, // Rétrocompatibilité
    sobrietyStartDate: profile.sobriety_start_date,
    relapseDates: relapses?.map(r => r.relapse_date) || [],
    pledgeDates: pledgeDates,
    dailyVerse: getVerseForTheDay(addictionName),
    stats: { 
        label1: "Économies", 
        value1: (daysSober * v1).toFixed(0), 
        unit1: "€", 
        icon1: "wallet", 
        label2: "Santé", 
        value2: (daysSober * 5).toFixed(0), 
        unit2: "pts", 
        icon2: "activity" 
    },
    nextMilestone: { 
        label: "30 Jours", 
        progress: parseFloat(Math.min(100, (daysSober / 30) * 100).toFixed(1)), 
        daysLeft: Math.max(0, 30 - daysSober)
    },
    currentPhase: "Phase 1"
  };
}