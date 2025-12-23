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
    stats,
    dailyVerse,
    sobrietyStartDate,
    relapseDates,
    pledgeDates, // Indispensable pour colorer les jours verts passés
    isBroken     // Indispensable pour signaler la rupture de série
  } = dashboardData;

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      
      {/* Header : Bonjour + Phase */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div className="space-y-2 flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">
              Bonjour, {userFirstName} 👋
            </h1>
            
            {/* Alerte visuelle si l'utilisateur est en état de rechute non résolue */}
            {isBroken && (
              <span className="bg-red-50 text-red-600 px-3 py-1 rounded-full text-xs font-bold animate-pulse border border-red-100">
                Série interrompue
              </span>
            )}
          </div>
        </div>
        
        <div className="text-sm bg-yellow-500/10 text-yellow-600 px-4 py-2 rounded-full font-bold self-start md:self-auto border border-yellow-500/20 shadow-sm">
           Phase : {currentPhase}
        </div>

      </div>
        {/* Affichage du verset du jour */}
        {dailyVerse && (
            <div className="mt-4 p-4 bg-amber-50/50 border-l-4 border-amber-400 rounded-r-2xl max-w-2xl shadow-sm">
              <p className="text-gray-700 italic text-sm leading-relaxed">
                {dailyVerse.text}
              </p>
              <p className="text-xs font-bold text-amber-600 mt-2 uppercase tracking-wider">
                — {dailyVerse.reference}
              </p>
            </div>
          )}

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
        journalOverview={<JournalOverviewWidget todayEntry={todayJournal} />}
        sobrietyStartDate={sobrietyStartDate}
        relapseDates={relapseDates} // Transmission de l'historique des rechutes
        pledgeDates={pledgeDates}   // Transmission de l'historique des engagements
        isBroken={isBroken}         // Transmission de l'état de la série
      />

    </div>
  );
}