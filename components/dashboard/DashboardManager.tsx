"use client";

import { useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { Settings2, Minus, Target, Plus, Eye, EyeOff } from 'lucide-react';
import { cn } from "@/lib/utils";
import DailyPledgeWidget from './DailyPledgeWidget';
import CalendarWidget from './CalendarWidget';
import StatsWidget from './StatsWidget';
import VerseWidget from './widgets/VerseWidget';
import HealthScoreWidget from './widgets/HealthScoreWidget';
import RelapseButton from './RelapseButton';
import { BADGES } from "@/lib/constants/badges";
import { EnrichedUserAnalytics, GlobalHealthScore } from "@/lib/types/analytics";

interface DashboardManagerProps {
  userName: string;
  userPhase: string;
  daysSober: number;
  isBroken: boolean;
  hasPledgedToday: boolean;
  nextMilestone: { label: string; progress: number; daysLeft: number };
  stats: { label1: string; value1: string; unit1: string; icon1: string; label2: string; value2: string; unit2: string; icon2: string; };
  journalOverview: ReactNode;
  sobrietyStartDate: string | null;
  relapseDates: string[];
  pledgeDates: string[];
  isJokerAvailable?: boolean;
  currentBadgeCode: string | null;
  dailyVerse: { text: string; reference: string };
  previousStreak: number;
  enrichedAnalytics: EnrichedUserAnalytics | null;
}

export default function DashboardManager({
  userName, userPhase, daysSober, hasPledgedToday, nextMilestone,
  stats, journalOverview, sobrietyStartDate, relapseDates,
  pledgeDates, isBroken, isJokerAvailable, currentBadgeCode,
  dailyVerse, previousStreak, enrichedAnalytics
}: DashboardManagerProps) {
  const router = useRouter();
  const [isEditMode, setIsEditMode] = useState(false);

  const [showHealth, setShowHealth] = useState<boolean>(() => 
    typeof window !== 'undefined' ? localStorage.getItem('dashboard_show_health') !== 'false' : true
  );
  const [showCalendar, setShowCalendar] = useState<boolean>(() => 
    typeof window !== 'undefined' ? localStorage.getItem('dashboard_show_calendar') !== 'false' : true
  );
  const [showStats, setShowStats] = useState<boolean>(() => 
    typeof window !== 'undefined' ? localStorage.getItem('dashboard_show_stats') !== 'false' : true
  );
  const [showJournal, setShowJournal] = useState<boolean>(() => 
    typeof window !== 'undefined' ? localStorage.getItem('dashboard_show_journal') !== 'false' : true
  );
  const [showVerse, setShowVerse] = useState<boolean>(() => 
    typeof window !== 'undefined' ? localStorage.getItem('dashboard_show_verse') !== 'false' : true
  );

  const toggleWidget = (key: string, current: boolean, setter: (val: boolean) => void) => {
    const newState = !current;
    setter(newState);
    if (typeof window !== 'undefined') {
      localStorage.setItem(`dashboard_show_${key}`, String(newState));
    }
  };

  const badgeDef = BADGES.find(b => b.code === currentBadgeCode) || BADGES[0];
  const deleteBtnClass = "absolute top-4 right-4 z-30 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-md hover:bg-red-600 transition-all hover:scale-110 active:scale-90";

  const availableWidgets = [
    { id: 'verse', label: 'Verset', active: showVerse, setter: setShowVerse },
    { id: 'journal', label: 'Journal', active: showJournal, setter: setShowJournal },
    { id: 'calendar', label: 'Calendrier', active: showCalendar, setter: setShowCalendar },
    { id: 'stats', label: 'Statistiques', active: showStats, setter: setShowStats },
    { id: 'health', label: 'Santé Globale', active: showHealth, setter: setShowHealth },
  ];

  // Valeur de secours typée pour éviter l'erreur TS trend "neutral" 
  const defaultHealth: GlobalHealthScore = {
    total: 0,
    trend: 'stable',
    constance: 0,
    emotional: 0,
    spiritual: 0
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="shrink-0">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            Bonjour, {userName} <span className="animate-bounce">👋</span>
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm text-gray-500">Phase :</span>
            <span className="text-xs font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full uppercase">
              {userPhase}
            </span>
          </div>
        </div>

        <div className="flex-1 w-full max-w-md">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center shrink-0">
              <Target size={16} />
            </div>
            <div className="flex-1">
              <div className="flex justify-between text-[10px] font-bold mb-1 uppercase tracking-tight">
                <span className="text-gray-500">Prochain Jalon : {nextMilestone.label}</span>
                <span className="text-blue-600">{nextMilestone.progress.toFixed(0)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                <div 
                  className="bg-blue-500 h-full rounded-full transition-all duration-1000" 
                  style={{ width: `${nextMilestone.progress}%` }}
                ></div>
              </div>
              <p className="text-[9px] text-gray-400 mt-1 italic text-right">
                {nextMilestone.daysLeft} jours restants
              </p>
            </div>
          </div>
        </div>

        <button 
          onClick={() => setIsEditMode(!isEditMode)} 
          className={cn(
            "text-xs font-medium flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all shrink-0 shadow-sm",
            isEditMode ? "bg-black text-white border-black" : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
          )}
        >
          <Settings2 size={16} />
          {isEditMode ? 'Terminer' : 'Personnaliser'}
        </button>
      </div>

      {isEditMode && (
        <div className="bg-amber-50 border border-amber-200 p-5 rounded-2xl animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2 mb-4">
            <Plus size={16} className="text-amber-600" />
            <h2 className="text-xs font-bold text-amber-800 uppercase tracking-wider">Réactiver des widgets</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            {availableWidgets.map((w) => (
              <button
                key={w.id}
                onClick={() => toggleWidget(w.id, w.active, w.setter)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all border shadow-sm",
                  w.active 
                    ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed" 
                    : "bg-white border-amber-300 text-amber-700 hover:bg-amber-100"
                )}
                disabled={w.active}
              >
                {w.active ? <EyeOff size={14} /> : <Eye size={14} />}
                {w.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[220px]">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 flex flex-col items-center justify-center text-center relative shadow-sm">
          <div className="absolute top-0 left-0 w-full h-1 bg-yellow-500"></div>
          <div className={cn("w-12 h-12 rounded-full flex items-center justify-center mb-3 shadow-inner", badgeDef.bg, badgeDef.color)}>
            <badgeDef.icon size={24} />
          </div>
          <span className="text-5xl font-black text-gray-900 leading-none">{daysSober}</span>
          <span className="text-[10px] text-gray-400 font-bold uppercase mt-2">Jours de liberté</span>
        </div>

        <DailyPledgeWidget initialHasPledged={hasPledgedToday} isBroken={isBroken} isJokerAvailable={isJokerAvailable} previousStreak={previousStreak} />

        {showVerse && (
          <div className="relative group h-full">
            <VerseWidget verse={dailyVerse} isEditMode={isEditMode} onDelete={() => toggleWidget('verse', showVerse, setShowVerse)} />
          </div>
        )}

        {showJournal && (
          <div className="relative group h-full">
            {journalOverview}
            {isEditMode && (
              <button onClick={() => toggleWidget('journal', showJournal, setShowJournal)} className={deleteBtnClass}>
                <Minus size={16} strokeWidth={4} />
              </button>
            )}
          </div>
        )}

        {showCalendar && (
          <div className="relative group h-full">
            <CalendarWidget miniMode={true} isEditMode={isEditMode} onDelete={() => toggleWidget('calendar', showCalendar, setShowCalendar)} sobrietyStartDate={sobrietyStartDate} relapseDates={relapseDates} pledgeDates={pledgeDates} isBroken={isBroken} />
          </div>
        )}

        {showStats && (
          <div className="relative group h-full" onClick={() => !isEditMode && router.push('/stats')}>
            <StatsWidget data={stats} isEditMode={isEditMode} onDelete={() => toggleWidget('stats', showStats, setShowStats)} />
          </div>
        )}

        {showHealth && (
          <div className="relative group h-full col-span-1">
            <HealthScoreWidget 
              data={enrichedAnalytics?.health || defaultHealth} 
              isEditMode={isEditMode} 
              onDelete={() => toggleWidget('health', showHealth, setShowHealth)} 
            />
          </div>
        )}
      </div>

      <div className="flex justify-center pt-4">
        <RelapseButton onSuccess={() => router.refresh()} /> 
      </div>
    </div>
  );
}