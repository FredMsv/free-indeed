"use client";
import { useState, useEffect, useRef, useCallback, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { Settings2, Trophy, Plus, Minus, TrendingUp, BookText, Sparkles, Target } from 'lucide-react';

import DailyPledgeWidget from './DailyPledgeWidget';
import CalendarWidget from './CalendarWidget';
import StatsWidget from './StatsWidget';
import VerseWidget from './widgets/VerseWidget';
import { RelapseButton } from './RelapseButton';
import { BADGES } from "@/lib/constants/badges";

interface MilestoneData {
  label: string;
  progress: number;
  daysLeft: number;
}

interface StatsData {
  label1: string; value1: string; unit1: string; icon1: string;
  label2: string; value2: string; unit2: string; icon2: string;
}

interface VerseData {
    text: string;
    reference: string;
}

interface DashboardManagerProps {
  userName: string;
  userPhase: string;
  daysSober: number;
  isBroken: boolean;
  isJokerAvailable?: boolean;
  hasPledgedToday: boolean;
  sobrietyStartDate: string | null;
  relapseDates: string[];
  pledgeDates: string[];
  stats: StatsData;
  nextMilestone: MilestoneData;
  journalOverview: ReactNode;
  currentBadgeCode: string | null;
  dailyVerse: VerseData;
  previousStreak: number;
}

export default function DashboardManager({ 
  userName,
  userPhase,
  daysSober, 
  hasPledgedToday, 
  nextMilestone, 
  stats,
  journalOverview,
  sobrietyStartDate,
  relapseDates,
  pledgeDates,
  isBroken,
  isJokerAvailable,
  currentBadgeCode,
  dailyVerse,
  previousStreak
}: DashboardManagerProps) {
  
  const router = useRouter();
  const currentBadge = currentBadgeCode ? BADGES.find(b => b.code === currentBadgeCode) : null;
  const [isEditMode, setIsEditMode] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const dashboardRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const [showCalendar, setShowCalendar] = useState(false);
  const [showStats, setShowStats] = useState(true);
  const [showJournal, setShowJournal] = useState(true);
  const [showVerse, setShowVerse] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
      setShowCalendar(localStorage.getItem('dashboard_show_calendar') === 'true');
      const savedStats = localStorage.getItem('dashboard_show_stats');
      setShowStats(savedStats === null ? true : savedStats === 'true');
      const savedJournal = localStorage.getItem('dashboard_show_journal');
      setShowJournal(savedJournal === null ? true : savedJournal === 'true');
      const savedVerse = localStorage.getItem('dashboard_show_verse');
      setShowVerse(savedVerse === null ? true : savedVerse === 'true');
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
    <div className="space-y-6" ref={dashboardRef}>
      
      {/* HEADER : Nom + Progression + Settings */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        
        {/* BLOC NOM & PHASE */}
        <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold text-gray-900">
                Bonjour, {userName}
            </h1>
            <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-gray-500">Phase :</span>
                <span className="text-xs font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full uppercase tracking-wide">
                    {userPhase}
                </span>
            </div>
        </div>

        {/* ✅ BARRE DE PROGRESSION JALON (Avec bordure ajoutée) */}
        <div className="flex-1 w-full md:mx-8 flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Target size={16} />
            </div>
            <div className="flex-1">
                <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-gray-600">Prochain Jalon : {nextMilestone.label}</span>
                    <span className="text-blue-600">{nextMilestone.progress.toFixed(0)}%</span>
                </div>
                {/* MODIFICATION ICI : Ajout de border border-gray-200 */}
                <div className="w-full bg-gray-200/60 rounded-full h-1.5 overflow-hidden border border-gray-200">
                    <div 
                        className="bg-blue-500 h-1.5 rounded-full transition-all duration-1000 ease-out" 
                        style={{ width: `${nextMilestone.progress}%` }}
                    ></div>
                </div>
            </div>
        </div>

        {/* BLOC SETTINGS */}
        <div className="flex items-center gap-3 flex-shrink-0">
             <button 
                data-action="toggle-edit" 
                onClick={() => setIsEditMode(!isEditMode)}
                className={`
                    text-xs font-medium flex items-center gap-2 px-3 py-2 rounded-xl transition-all border
                    ${isEditMode 
                        ? 'bg-gray-900 text-white border-gray-900 shadow-md' 
                        : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300 hover:text-gray-700'}
                `}
                >
                <Settings2 size={16} />
                {isEditMode ? 'Terminer' : 'Personnaliser'}
            </button>
        </div>
      </div>

      {/* GRILLE DES WIDGETS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[220px]">
        
        {/* 1. COMPTEUR SÉRIE & BADGE */}
        <div className="col-span-1 bg-white p-6 rounded-3xl border border-gray-100 flex flex-col items-center justify-center text-center relative overflow-hidden shadow-sm h-full w-full">
          <div className="absolute top-0 left-0 w-full h-1 bg-yellow-500"></div>
          <div className="mb-3 animate-in fade-in zoom-in duration-500">
            {currentBadge ? (
               <div className="flex flex-col items-center gap-1">
                   <div className={`w-12 h-12 rounded-full flex items-center justify-center ${currentBadge.bg} ${currentBadge.color} shadow-sm`}>
                       <currentBadge.icon size={24} />
                   </div>
                   <span className="text-xs font-bold text-gray-500 uppercase tracking-wide bg-gray-50 px-2 py-0.5 rounded-full">
                       {currentBadge.label}
                   </span>
               </div>
            ) : (
               <div className="w-10 h-10 bg-yellow-500/10 rounded-full flex items-center justify-center text-yellow-600">
                    <Trophy size={20} />
                </div>
            )}
          </div>
          <span className="text-5xl font-black text-gray-900 mb-1">{daysSober}</span>
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Jours de liberté</span>
        </div>

        {/* 2. ENGAGEMENT */}
        <div className="col-span-1 h-full w-full">
            <DailyPledgeWidget 
                initialHasPledged={hasPledgedToday} 
                isBroken={isBroken}
                isJokerAvailable={isJokerAvailable}
                previousStreak={previousStreak}
            />
        </div>

        {/* 3. VERSET DU JOUR */}
        {showVerse ? (
            <div 
                className="col-span-1 relative group h-full w-full animate-in fade-in zoom-in duration-300 cursor-pointer"
                {...longPressHandlers}
            >
                {isEditMode && <div className="absolute inset-0 z-10 bg-white/10 rounded-2xl" />}
                <VerseWidget 
                    verse={dailyVerse}
                    isEditMode={isEditMode}
                    onDelete={() => toggleWidget('verse', showVerse, setShowVerse)}
                />
            </div>
        ) : isEditMode && (
            <button 
                onClick={() => toggleWidget('verse', showVerse, setShowVerse)}
                className="col-span-1 h-full w-full border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center text-gray-400 hover:border-indigo-500 hover:text-indigo-600 hover:bg-indigo-50/50 transition-all group animate-in fade-in zoom-in"
            >
                <div className="w-12 h-12 rounded-full bg-gray-100 group-hover:bg-indigo-100 flex items-center justify-center mb-2 transition-colors">
                    <Sparkles size={24} />
                </div>
                <span className="font-medium text-sm">Ajouter Verset</span>
            </button>
        )}

        {/* 4. JOURNAL */}
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

        {/* 5. CALENDRIER */}
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

        {/* 6. STATS */}
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

      <div className="pt-8 pb-4 flex justify-center">
        <RelapseButton /> 
      </div>

    </div>
  );
}