import { getDashboardData } from '@/lib/actions/dashboard-actions';
import { getDailyPledgeStatus } from '@/lib/actions/pledge-actions';
import { getMonthPledges } from '@/lib/actions/calendar-actions';
import DashboardManager from '@/components/dashboard/DashboardManager';

export default async function DashboardPage() {
  
  const today = new Date();

  const [dashboardData, hasPledgedToday, monthPledges] = await Promise.all([
    getDashboardData(),
    getDailyPledgeStatus(),
    getMonthPledges(today.getFullYear(), today.getMonth())
  ]);

  const { userFirstName, daysSober, currentPhase, nextMilestone } = dashboardData;

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

      {/* 🚀 LE CHANGEMENT EST ICI :
         On appelle directement le DashboardManager sans titre "Votre Constance" autour.
         Le Manager s'occupe d'afficher les widgets proprement.
      */}
      <DashboardManager 
        daysSober={daysSober}
        hasPledgedToday={hasPledgedToday}
        nextMilestone={nextMilestone}
        monthPledges={monthPledges}
      />

    </div>
  );
}