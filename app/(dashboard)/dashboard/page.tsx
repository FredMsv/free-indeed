import { getDashboardStats } from '@/lib/actions/dashboard-actions';
import { getTodayJournal } from '@/lib/actions/journal-actions';
import DashboardManager from '@/components/dashboard/DashboardManager';
import { JournalOverviewWidget } from '@/components/dashboard/widgets/JournalOverviewWidget';
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { checkAndUnlockBadges } from "@/lib/gamification/badge-service";
// ✅ CHANGEMENT D'IMPORT
import { getDynamicVerse } from "@/lib/actions/verse-actions"; 

function calculatePhase(days: number): string {
    if (days <= 7) return "Détoxification";
    if (days <= 30) return "Consolidation";
    if (days <= 90) return "Réparation";
    return "Croissance";
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('username, first_name, is_broken, addiction_types(name)')
    .eq('user_id', user.id)
    .single();

  const userName = profile?.first_name || profile?.username || "Ami";
  const addictionName = profile?.addiction_types?.name || 'DEFAULT';

  // ✅ AJOUT DE getDynamicVerse dans le Promise.all
  const [rawStats, todayJournal, dailyVerse] = await Promise.all([
    getDashboardStats(),
    getTodayJournal(),
    getDynamicVerse(addictionName), // Appel Asynchrone ici
    checkAndUnlockBadges(user.id, 'sobriety') 
  ]);

  if (!rawStats) {
    return <div className="p-8 text-center">Erreur de chargement des données.</div>;
  }

  const milestones = [1, 3, 7, 14, 30, 60, 90, 180, 365, 730];
  const days = rawStats.daysClean;
  const nextTarget = milestones.find(m => m > days) || milestones[milestones.length - 1];
  const prevTarget = milestones.filter(m => m <= days).pop() || 0;
  const progress = Math.min(100, Math.max(0, ((days - prevTarget) / (nextTarget - prevTarget)) * 100));
  
  const nextMilestone = {
    label: `${nextTarget} Jours`,
    progress: progress,
    daysLeft: nextTarget - days
  };

  const formattedStats = {
    label1: "Économies",
    value1: rawStats.moneySaved.toFixed(0),
    unit1: "€",
    icon1: "wallet",
    label2: "Temps",
    value2: (rawStats.timeSaved / 60).toFixed(0),
    unit2: "h",
    icon2: "clock"
  };

  const userPhase = calculatePhase(rawStats.daysClean);

  let hasPledgedToday = rawStats.hasPledgedTodayFromDB;
  
  if (profile?.is_broken) {
      hasPledgedToday = false; 
  }

  return (
    <div className="max-w-6xl mx-auto pb-10 px-4 sm:px-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pt-6">
      <DashboardManager 
        userName={userName}
        userPhase={userPhase}
        daysSober={rawStats.daysClean}
        isBroken={profile?.is_broken || false}
        hasPledgedToday={hasPledgedToday}
        sobrietyStartDate={null} 
        nextMilestone={nextMilestone}
        stats={formattedStats}
        currentBadgeCode={rawStats.currentBadgeCode}
        dailyVerse={dailyVerse} // ✅ Passé directement
        journalOverview={<JournalOverviewWidget entry={todayJournal} />}
        relapseDates={rawStats.relapseDates || []} 
        pledgeDates={rawStats.pledgeDates || []}
        previousStreak={rawStats.lastRelapseStreak}
        isJokerAvailable={true}
      />
    </div>
  );
}