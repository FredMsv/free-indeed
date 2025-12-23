"use server";

import { createClient } from "@/lib/supabase/server";

// Définition des interfaces
interface AddictionTypeData {
  name: string;
  icon: string | null;
}

interface DashboardProfile {
  first_name: string | null;
  sobriety_start_date: string | null;
  daily_value_1: number | null;
  daily_value_2: number | null;
  addiction_types: AddictionTypeData | null; 
}

interface Pledge {
  pledge_date: string;
}

export async function getDashboardData() {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Non autorisé");

  // Récupération Profil + Type d'addiction
  const { data: profileData, error } = await supabase
    .from('user_profiles')
    .select(`
      first_name,
      sobriety_start_date,
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
    // Redirection soft si pas de profil (évite le crash)
    return {
       userFirstName: "Invité",
       daysSober: 0,
       hasPledgedToday: false,
       monthPledges: [],
       currentPhase: "Onboarding",
       nextMilestone: { label: "Départ", progress: 0, daysLeft: 1 },
       stats: { label1: "-", value1: "0", unit1: "", icon1: "activity", label2: "-", value2: "0", unit2: "", icon2: "activity" }
    };
  }

  const profile = profileData as unknown as DashboardProfile;

  // Récupération Engagements
  const { data: pledgesData } = await supabase
    .from('daily_pledges')
    .select('pledge_date')
    .eq('user_id', user.id);

  const pledges: Pledge[] = pledgesData || [];

  // --- 1. Calcul Jours Sobres (Basé sur la date) ---
  let daysSober = 0;
  if (profile.sobriety_start_date) {
    const start = new Date(profile.sobriety_start_date);
    const now = new Date();
    start.setHours(0, 0, 0, 0);
    now.setHours(0, 0, 0, 0);
    const diffTime = now.getTime() - start.getTime();
    daysSober = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    // Si la date est aujourd'hui, on peut dire 0 ou 1 selon votre préférence.
    // Ici on met max(0) pour éviter les négatifs.
    daysSober = Math.max(0, daysSober); 
  }

  // --- 2. Infos Pledges ---
  const todayStr = new Date().toLocaleDateString('en-CA');
  const hasPledgedToday = pledges.some((p) => p.pledge_date === todayStr);

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthPledges = pledges
    .filter((p) => {
      const d = new Date(p.pledge_date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    })
    .map((p) => p.pledge_date);

  // --- 3. Stats Dynamiques ---
  const v1 = profile.daily_value_1 || 0; 
  const v2 = profile.daily_value_2 || 0; 
  
  // Normalisation du nom pour la détection (Majuscules, sans accents si possible)
  const addictionName = profile.addiction_types?.name || 'ALCOHOL';
  const norm = addictionName.toUpperCase();

  let statsData = {
    label1: "Économies", value1: "0", unit1: "€", icon1: "wallet",
    label2: "Santé", value2: "0", unit2: "kcal", icon2: "activity"
  };

  // LOGIQUE DE DÉTECTION ROBUSTE
  if (norm.includes('TABAC') || norm.includes('CIGARETTE') || norm.includes('TOBACCO')) {
      // TABAC : v1 = Prix Paquet (20 cigs), v2 = Cigs/jour
      // Coût = (Jours * CigsParJour / 20) * PrixPaquet
      const cost = (daysSober * v2 / 20) * v1;
      
      // Vie gagnée : 1 cig = 11 minutes
      const minutesGained = daysSober * v2 * 11;
      const hoursGained = Math.floor(minutesGained / 60);

      statsData = {
        label1: "Économies",
        value1: cost.toFixed(0),
        unit1: "€",
        icon1: "wallet",
        label2: "Vie gagnée",
        value2: hoursGained.toString(),
        unit2: "h",
        icon2: "hourglass"
      };
  } 
  else if (norm.includes('PORNO') || norm.includes('SEX')) {
      // PORN : v1 = Heures/jour perdues
      const hoursSaved = daysSober * v1;
      
      statsData = {
        label1: "Temps gagné",
        value1: hoursSaved.toFixed(0),
        unit1: "h",
        icon1: "clock",
        label2: "Confiance",
        value2: "+" + (daysSober * 1.5).toFixed(0), // Arbitraire : +1.5% par jour
        unit2: "%",
        icon2: "brain"
      };
  } 
  else if (norm.includes('SOCIAL') || norm.includes('ECRAN') || norm.includes('RESEAU') || norm.includes('MEDIA')) {
      // RESEAUX : v1 = Heures/jour
      statsData = {
        label1: "Temps écran",
        value1: (daysSober * v1).toFixed(0),
        unit1: "h évitées",
        icon1: "smartphone-off",
        label2: "Productivité",
        value2: (daysSober * (v1 * 0.5)).toFixed(0), // On assume 50% du temps récupéré est productif
        unit2: "h gagnées",
        icon2: "zap"
      };
  } 
  else {
      // DÉFAUT (ALCOOL, DROGUE, ETC.)
      // v1 = Coût/jour, v2 = Calories/jour
      statsData = {
        label1: "Économies",
        value1: (daysSober * v1).toFixed(0),
        unit1: "€",
        icon1: "wallet",
        label2: "Santé",
        value2: (daysSober * v2).toFixed(0),
        unit2: "kcal",
        icon2: "activity"
      };
  }

  return {
    userFirstName: profile.first_name || "Utilisateur",
    daysSober,
    hasPledgedToday,
    monthPledges,
    currentPhase: "Phase 1",
    nextMilestone: { label: "30 Jours", progress: Math.min(100, (daysSober / 30) * 100), daysLeft: Math.max(0, 30 - daysSober) },
    stats: statsData
  };
}