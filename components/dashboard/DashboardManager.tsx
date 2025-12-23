"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Settings2, Trophy, CalendarDays, Plus, Minus, TrendingUp, BookText } from 'lucide-react';
import DailyPledgeWidget from './DailyPledgeWidget';
import CalendarWidget from './CalendarWidget';
import StatsWidget from './StatsWidget';
import { RelapseButton } from './RelapseButton';

interface MilestoneData {
  label: string;
  progress: number;
  daysLeft: number;
}

interface StatsData {
  label1: string; value1: string; unit1: string; icon1: string;
  label2: string; value2: string; unit2: string; icon2: string;
}

interface DashboardManagerProps {
  daysSober: number;
  isBroken: boolean;
  hasPledgedToday: boolean;
  sobrietyStartDate: string | null;
  relapseDates: string[];
  pledgeDates: string[];
  stats: StatsData;
  nextMilestone: MilestoneData;
  monthPledges?: string[];
  journalOverview: React.ReactNode;
}

export default function DashboardManager({ 
  daysSober, 
  hasPledgedToday, 
  nextMilestone, 
  stats,
  journalOverview,
  sobrietyStartDate,
  relapseDates,
  pledgeDates,
  isBroken
}: DashboardManagerProps) {
  
  const router = useRouter();
  const [isEditMode, setIsEditMode] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const dashboardRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // --- États LocalStorage ---
  const [showCalendar, setShowCalendar] = useState(false);
  const [showStats, setShowStats] = useState(true);
  const [showJournal, setShowJournal] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
      setShowCalendar(localStorage.getItem('dashboard_show_calendar') === 'true');
      const savedStats = localStorage.getItem('dashboard_show_stats');
      setShowStats(savedStats === null ? true : savedStats === 'true');
      const savedJournal = localStorage.getItem('dashboard_show_journal');
      setShowJournal(savedJournal === null ? true : savedJournal === 'true');
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const toggleWidget = (key: string, current: boolean, setter: (val: boolean) => void) => {
    const newState = !current;
    setter(newState);
    localStorage.setItem(`dashboard_show_${key}`, String(newState));
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!isEditMode) return;
      const target = event.target as HTMLElement;
      if (dashboardRef.current && !dashboardRef.current.contains(target) && !target.closest('[data-action="toggle-edit"]')) {
        setIsEditMode(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isEditMode]);

  const startPress = useCallback(() => {
    if (isEditMode) return;
    timerRef.current = setTimeout(() => {
      if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(50);
      setIsEditMode(true);
    }, 800);
  }, [isEditMode]);

  const cancelPress = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const longPressHandlers = {
    onMouseDown: startPress,
    onMouseUp: cancelPress,
    onMouseLeave: cancelPress,
    onTouchStart: startPress,
    onTouchEnd: cancelPress,
  };

  if (!isMounted) return null;

  return (
    <div className="space-y-4" ref={dashboardRef}>
      
      <div className="flex justify-end">
        <button 
          data-action="toggle-edit" 
          onClick={() => setIsEditMode(!isEditMode)}
          className={`
            text-xs font-medium flex items-center gap-2 px-3 py-1.5 rounded-full transition-all border
            ${isEditMode 
                ? 'bg-gray-900 text-white border-gray-900 shadow-md transform scale-105' 
                : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300 hover:text-gray-700'}
          `}
        >
          <Settings2 size={14} />
          {isEditMode ? 'Terminer' : 'Personnaliser'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[220px]">
        
        {/* COMPTEUR */}
        <div className="col-span-1 bg-white p-6 rounded-3xl border border-gray-100 flex flex-col items-center justify-center text-center relative overflow-hidden shadow-sm h-full w-full">
          <div className="absolute top-0 left-0 w-full h-1 bg-yellow-500"></div>
          
          <div className="absolute top-4 right-4 z-20">
              <RelapseButton />
          </div>

          <div className="w-10 h-10 bg-yellow-500/10 rounded-full flex items-center justify-center mb-3 text-yellow-600">
            <Trophy size={20} />
          </div>
          <span className="text-5xl font-black text-gray-900 mb-1">{daysSober}</span>
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Jours de liberté</span>
        </div>

        {/* ENGAGEMENT */}
        <div className="col-span-1 h-full w-full">
            {/* CORRECTION ICI : Passage de isBroken */}
            <DailyPledgeWidget 
                initialHasPledged={hasPledgedToday} 
                isBroken={isBroken} 
            />
        </div>

        {/* JALON */}
        <div className="col-span-1 bg-white p-6 rounded-3xl border border-gray-100 flex flex-col justify-center shadow-sm h-full w-full">
          <div className="flex items-center gap-2 mb-4 text-gray-900 font-bold text-sm">
            <CalendarDays className="text-blue-500" size={18} />
            Prochain Jalon
          </div>
          <div className="space-y-4">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-gray-400">{nextMilestone.label}</span>
              <span className="text-gray-900">{nextMilestone.progress.toFixed(0)}%</span>
            </div>
            <div className="w-full bg-gray-50 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-1000 ease-out" 
                style={{ width: `${nextMilestone.progress}%` }}
              ></div>
            </div>
            <p className="text-[10px] text-gray-400">
               Il reste {nextMilestone.daysLeft} jours
            </p>
         </div>
        </div>

        {/* JOURNAL */}
        {showJournal ? (
          <div 
            className="col-span-1 relative group h-full w-full animate-in fade-in zoom-in duration-300 cursor-pointer"
            {...longPressHandlers}
          >
            {isEditMode && <div className="absolute inset-0 z-10 bg-white/10 rounded-2xl" />}
            {journalOverview}
            {isEditMode && (
              <button 
                onClick={(e) => { e.preventDefault(); toggleWidget('journal', showJournal, setShowJournal); }}
                className="absolute top-4 right-4 z-20 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-md hover:bg-red-600 transition-all animate-in zoom-in duration-200"
              >
                <Minus size={16} strokeWidth={4} />
              </button>
            )}
          </div>
        ) : isEditMode && (
          <button 
            onClick={() => toggleWidget('journal', showJournal, setShowJournal)}
            className="col-span-1 h-full w-full border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center text-gray-400 hover:border-yellow-500 hover:text-yellow-600 hover:bg-yellow-500/5 transition-all group animate-in fade-in zoom-in"
          >
            <div className="w-12 h-12 rounded-full bg-gray-100 group-hover:bg-yellow-500/10 flex items-center justify-center mb-2 transition-colors">
              <BookText size={24} />
            </div>
            <span className="font-medium text-sm">Ajouter Journal</span>
          </button>
        )}

        {/* CALENDRIER */}
        {showCalendar ? (
          <div 
            className="col-span-1 relative group h-full w-full overflow-hidden animate-in fade-in zoom-in duration-300 cursor-pointer"
            {...longPressHandlers}
          >
            {isEditMode && <div className="absolute inset-0 z-10 bg-white/10 rounded-2xl" />}
            
            <CalendarWidget 
                miniMode={true} 
                isEditMode={isEditMode}
                onDelete={() => toggleWidget('calendar', showCalendar, setShowCalendar)}
                sobrietyStartDate={sobrietyStartDate}
                relapseDates={relapseDates}
                pledgeDates={pledgeDates} 
                isBroken={isBroken}       
            />
          </div>
        ) : isEditMode && (
            <button 
                onClick={() => toggleWidget('calendar', showCalendar, setShowCalendar)}
                className="col-span-1 h-full w-full border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center text-gray-400 hover:border-yellow-500 hover:text-yellow-600 hover:bg-yellow-500/5 transition-all group animate-in fade-in zoom-in"
            >
                <div className="w-12 h-12 rounded-full bg-gray-100 group-hover:bg-yellow-500/10 flex items-center justify-center mb-2 transition-colors">
                    <Plus size={24} />
                </div>
                <span className="font-medium text-sm">Ajouter Calendrier</span>
            </button>
        )}

        {/* STATS */}
        {showStats ? (
            <div 
                className="col-span-1 relative group h-full w-full overflow-hidden animate-in fade-in zoom-in duration-300 cursor-pointer"
                {...longPressHandlers}
                onClick={() => !isEditMode && router.push('/stats')}
            >
                {isEditMode && <div className="absolute inset-0 z-10 bg-white/10 rounded-2xl" />}
                <StatsWidget 
                    data={stats}
                    isEditMode={isEditMode}
                    onDelete={() => toggleWidget('stats', showStats, setShowStats)}
                />
            </div>
        ) : isEditMode && (
            <button 
                onClick={() => toggleWidget('stats', showStats, setShowStats)}
                className="col-span-1 h-full w-full border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center text-gray-400 hover:border-green-500 hover:text-green-600 hover:bg-green-500/5 transition-all group animate-in fade-in zoom-in"
            >
                <div className="w-12 h-12 rounded-full bg-gray-100 group-hover:bg-green-500/10 flex items-center justify-center mb-2 transition-colors">
                    <TrendingUp size={24} />
                </div>
                <span className="font-medium text-sm">Ajouter Stats</span>
            </button>
        )}
        
      </div>
    </div>
  );
}