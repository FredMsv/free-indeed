'use server'

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export type DashboardData = {
  userFirstName: string;
  daysSober: number;
  currentPhase: string;
  nextMilestone: {
    label: string;
    progress: number;
    daysLeft: number;
  };
};

export async function getDashboardData(): Promise<DashboardData> {
  const supabase = await createClient();

  // 1. Vérification session
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/login');
  }

  // 2. Récupération profil
  // ✅ CORRECTION TYPESCRIPT : select('*') force l'utilisation du type complet de la table
  const { data: profile, error } = await supabase
    .from('user_profiles')
    .select('*') 
    .eq('user_id', user.id)
    .single();

  if (error || !profile) {
    console.error("Dashboard error:", error);
    // Fallback sécurisé en cas d'erreur
    return {
      userFirstName: "Utilisateur",
      daysSober: 0,
      currentPhase: "Initialisation",
      nextMilestone: { label: "Démarrage", progress: 0, daysLeft: 1 }
    };
  }

  // 3. Calcul ROBUSTE des jours de sobriété (Fix du bug "0 jours")
  // Si pas de date en base, on considère que c'est aujourd'hui
  const startDateStr = profile.sobriety_start_date || new Date().toISOString();
  
  const today = new Date();
  const start = new Date(startDateStr);

  // On normalise en UTC (Minuit à Minuit) pour ignorer les décalages horaires
  const utcToday = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
  const utcStart = Date.UTC(start.getFullYear(), start.getMonth(), start.getDate());

  const diffTime = utcToday - utcStart;
  
  // Math.floor pour compter les jours révolus complets
  const daysSober = Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)));

  // 4. Détermination de la Phase
  let currentPhase = "Stabilisation"; // 0-30 jours
  if (daysSober > 90) currentPhase = "Libération";
  else if (daysSober > 30) currentPhase = "Consolidation";

  // 5. Calcul du prochain Jalon (Gamification)
  const milestones = [3, 7, 14, 30, 60, 90, 180, 365];
  
  // Trouve le premier milestone supérieur aux jours actuels, sinon ajoute 30 jours
  const nextTarget = milestones.find(m => m > daysSober) || (daysSober + 30);
  
  // Calcul progression (Barre de chargement)
  const prevTarget = milestones.slice().reverse().find(m => m <= daysSober) || 0;
  const totalInterval = nextTarget - prevTarget;
  const daysDoneInInterval = daysSober - prevTarget;
  
  // Pourcentage borné entre 5% (visibilité min) et 100%
  const rawProgress = totalInterval > 0 ? (daysDoneInInterval / totalInterval) * 100 : 0;
  const progress = Math.min(100, Math.round(rawProgress));
  
  const daysLeft = nextTarget - daysSober;

  return {
    userFirstName: profile.first_name || "Ami",
    daysSober,
    currentPhase,
    nextMilestone: {
      label: `Objectif ${nextTarget} jours`,
      progress: Math.max(5, progress), 
      daysLeft
    }
  };
}