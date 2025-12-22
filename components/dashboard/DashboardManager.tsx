"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { Settings2, Trophy, CalendarDays, Plus } from 'lucide-react';
import DailyPledgeWidget from './DailyPledgeWidget';
import CalendarWidget from './CalendarWidget';

interface MilestoneData {
  label: string;
  progress: number;
  daysLeft: number;
}

interface DashboardManagerProps {
  daysSober: number;
  hasPledgedToday: boolean;
  nextMilestone: MilestoneData;
  monthPledges: string[];
}

export default function DashboardManager({ 
  daysSober, 
  hasPledgedToday, 
  nextMilestone, 
  monthPledges 
}: DashboardManagerProps) {
  
  // --- 1. ÉTATS ---
  const [isEditMode, setIsEditMode] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  // Référence pour le widget calendrier (pour détecter le clic "ailleurs")
  const calendarRef = useRef<HTMLDivElement>(null);

  // Lecture du localStorage
  const [showCalendar, setShowCalendar] = useState(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('dashboard_show_calendar') === 'true';
  });
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // --- 2. GESTION HYDRATATION ---
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // --- 3. GESTION DU CLIC "AILLEURS" (Click Outside) ---
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Si on n'est pas en mode édition, on ne fait rien
      if (!isEditMode) return;

      const target = event.target as HTMLElement;

      // 1. Si on clique sur le bouton "Personnaliser" (ou son icône), on laisse le bouton gérer le toggle
      if (target.closest('[data-action="toggle-edit"]')) return;

      // 2. Si on clique À L'INTÉRIEUR du calendrier, on ne ferme pas (pour permettre de changer de mois)
      if (calendarRef.current && calendarRef.current.contains(target)) return;

      // 3. Sinon (clic dans le vide, sur un autre widget, etc.), on désactive le mode édition
      setIsEditMode(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isEditMode]);


  const toggleCalendar = () => {
    const newState = !showCalendar;
    setShowCalendar(newState);
    localStorage.setItem('dashboard_show_calendar', String(newState));
  };

  // --- LOGIQUE APPUI LONG ---
  const startPress = useCallback(() => {
    if (isEditMode) return;
    timerRef.current = setTimeout(() => {
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(50);
      }
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
    <div className="space-y-4">
      
      {/* Header : Bouton Personnaliser */}
      <div className="flex justify-end">
        <button 
          // On ajoute un attribut data-action pour l'identifier dans le useEffect
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

      {/* GRILLE 3 COLONNES */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[220px]">
        
        {/* 1. COMPTEUR */}
        <div className="col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center relative overflow-hidden justify-center h-full w-full">
          <div className="absolute top-0 left-0 w-full h-1 bg-yellow-500"></div>
          <div className="w-10 h-10 bg-yellow-500/10 rounded-full flex items-center justify-center mb-3 text-yellow-600">
            <Trophy size={20} />
          </div>
          <span className="text-4xl font-bold text-gray-900 mb-1">{daysSober}</span>
          <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Jours de liberté</span>
        </div>

        {/* 2. ENGAGEMENT */}
        <div className="col-span-1 h-full w-full">
            <DailyPledgeWidget initialHasPledged={hasPledgedToday} />
        </div>

        {/* 3. PROCHAIN JALON */}
        <div className="col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center h-full w-full">
          <div className="flex items-center gap-2 mb-4 text-gray-900 font-semibold text-sm">
            <CalendarDays className="text-blue-500" size={18} />
            Prochain Jalon
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-gray-500">{nextMilestone.label}</span>
              <span className="text-gray-900">{nextMilestone.progress}%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
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

        {/* 4. SLOT CALENDRIER */}
        {showCalendar && (
          <div 
            // On attache la REF ici pour savoir si on clique dedans ou dehors
            ref={calendarRef}
            className="col-span-1 relative group h-full w-full overflow-hidden animate-in fade-in zoom-in duration-300 cursor-pointer"
            {...longPressHandlers}
          >
            {isEditMode && <div className="absolute inset-0 z-10 bg-white/10 rounded-2xl" />}

            <CalendarWidget 
                initialPledges={monthPledges} 
                miniMode={true} 
                isEditMode={isEditMode}
                onDelete={toggleCalendar}
            />
          </div>
        )}

        {/* Case vide "+" */}
        {!showCalendar && isEditMode && (
            <button 
                onClick={toggleCalendar}
                className="col-span-1 h-full w-full border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center text-gray-400 hover:border-yellow-500 hover:text-yellow-600 hover:bg-yellow-500/5 transition-all group"
            >
                <div className="w-12 h-12 rounded-full bg-gray-100 group-hover:bg-yellow-500/10 flex items-center justify-center mb-2 transition-colors">
                    <Plus size={24} />
                </div>
                <span className="font-medium text-sm">Ajouter Calendrier</span>
            </button>
        )}

      </div>
    </div>
  );
}