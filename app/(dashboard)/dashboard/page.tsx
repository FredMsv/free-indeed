import { getDashboardData } from '@/lib/actions/dashboard-actions';
import { getTodayJournal } from '@/lib/actions/journal-actions';
import DashboardManager from '@/components/dashboard/DashboardManager';
import { JournalOverviewWidget } from '@/components/dashboard/widgets/JournalOverviewWidget';

export default async function DashboardPage() {
  
  // On récupère les données du dashboard ET le journal du jour en parallèle pour optimiser le temps de chargement 
  const [dashboardData, todayJournal] = await Promise.all([
    getDashboardData(),
    getTodayJournal()
  ]);
  
  const { 
    userFirstName, 
    daysSober, 
    hasPledgedToday, 
    monthPledges, 
    currentPhase, 
    nextMilestone, 
    stats 
  } = dashboardData; 

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      
      {/* Header : Bonjour + Phase */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bonjour, {userFirstName} 👋</h1>
          <p className="text-gray-500">Un jour à la fois. Votre espace personnel.</p>
        </div>
      
        <div className="text-sm bg-yellow-500/10 text-yellow-600 px-4 py-2 rounded-full font-medium self-start md:self-auto border border-yellow-500/20">
          Phase : {currentPhase}
        </div>
      </div> 

      {/* Gestionnaire principal (Compteur, Pledges, Stats, Calendrier).
          On injecte JournalOverviewWidget directement dans la grille du manager 
          pour qu'il se comporte comme les autres widgets (cliquable et harmonisé).
      */}
      <DashboardManager 
        daysSober={daysSober}
        hasPledgedToday={hasPledgedToday}
        nextMilestone={nextMilestone}
        monthPledges={monthPledges}
        stats={stats}
        // Ajout du widget d'aperçu cliquable vers la page journal
        journalOverview={<JournalOverviewWidget todayEntry={todayJournal} />}
      />

    </div>
  );
}