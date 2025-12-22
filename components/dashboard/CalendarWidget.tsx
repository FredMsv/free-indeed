"use client";

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Loader2, Minus } from 'lucide-react';
import { getMonthPledges } from '@/lib/actions/calendar-actions';
import { cn } from '@/lib/utils';

interface CalendarWidgetProps {
  initialPledges?: string[];
  miniMode?: boolean;
  isEditMode?: boolean;
  onDelete?: () => void;
}

export default function CalendarWidget({ 
  initialPledges = [], 
  miniMode = false,
  isEditMode = false,
  onDelete
}: CalendarWidgetProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [pledgedDates, setPledgedDates] = useState<string[]>(initialPledges);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (currentDate.getMonth() !== new Date().getMonth()) {
        const fetchData = async () => {
        setIsLoading(true);
        const dates = await getMonthPledges(currentDate.getFullYear(), currentDate.getMonth());
        setPledgedDates(dates);
        setIsLoading(false);
        };
        fetchData();
    }
  }, [currentDate]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = (new Date(year, month, 1).getDay() + 6) % 7;

  const changeMonth = (val: number) => setCurrentDate(new Date(year, month + val, 1));

  const days = [];
  for (let i = 0; i < firstDay; i++) days.push(<div key={`empty-${i}`} />);
  
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = new Date(year, month, d).toLocaleDateString('en-CA');
    const isPledged = pledgedDates.includes(dateStr);
    const isToday = new Date().toDateString() === new Date(year, month, d).toDateString();

    days.push(
      <div key={d} className={cn(
        "flex items-center justify-center rounded-md relative font-medium transition-all",
        miniMode ? "h-full w-full" : "aspect-square", 
        isPledged ? "bg-success text-white font-bold" : "bg-gray-50 text-gray-600",
        isToday && !isPledged && "ring-1 ring-gold ring-offset-1 z-10",
        miniMode ? "text-[10px]" : "text-sm"
      )}>
        {d}
      </div>
    );
  }

  return (
    <div className={cn(
      // On applique ici les mêmes classes que votre exemple (bg-white, border-gray-100, shadow-sm...)
      "bg-white border border-gray-100 shadow-sm flex flex-col h-full transition-all duration-500 relative overflow-hidden",
      miniMode ? "p-6 rounded-2xl" : "p-6 rounded-2xl"
    )}>
      
      {/* --- AJOUT : La barre jaune décorative en haut (Comme sur le widget Trophée) --- */}
      <div className="absolute top-0 left-0 w-full h-1 bg-yellow-500"></div>

      {/* BOUTON SUPPRIMER */}
      {isEditMode && onDelete && (
        <button 
            onClick={(e) => {
                e.stopPropagation();
                onDelete();
            }}
            className="absolute top-6 right-6 z-50 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-md hover:bg-red-600 hover:scale-110 transition-all animate-in zoom-in duration-200"
            title="Supprimer le widget"
        >
            <Minus size={16} strokeWidth={4} />
        </button>
      )}

      {/* Header */}
      <div className={cn("flex items-center justify-between", miniMode ? "mb-2" : "mb-4")}>
        <span className={cn("font-bold text-gray-900 capitalize", miniMode ? "text-sm" : "text-lg")}>
            {currentDate.toLocaleDateString('fr-FR', { month: 'long' })} <span className="text-gray-400 font-normal">{miniMode ? '' : year}</span>
        </span>
        
        <div className={cn("flex gap-1", isEditMode ? "opacity-0 pointer-events-none" : "opacity-100")}>
            <button 
              onClick={(e) => { e.stopPropagation(); changeMonth(-1); }} 
              className="p-1 hover:bg-gray-100 rounded text-gray-400 transition-colors"
            >
                <ChevronLeft size={miniMode ? 16 : 20} />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); changeMonth(1); }} 
              className="p-1 hover:bg-gray-100 rounded text-gray-400 transition-colors"
              disabled={new Date() < new Date(year, month + 1, 1)}
            >
                <ChevronRight size={miniMode ? 16 : 20} />
            </button>
        </div>
      </div>

      {/* Grille */}
      <div className="flex-1 flex flex-col justify-between relative">
          {isLoading && (
            <div className="absolute inset-0 bg-white/80 z-20 flex items-center justify-center">
              <Loader2 className="animate-spin text-gold w-5 h-5"/>
            </div>
          )}
          
          <div className="grid grid-cols-7 text-center mb-1">
            {['L','M','M','J','V','S','D'].map((d, i) => (
                <span key={i} className={cn("font-bold text-gray-400", miniMode ? "text-[9px]" : "text-xs")}>
                  {d}
                </span>
            ))}
          </div>
          
          <div className={cn(
              "grid grid-cols-7 flex-1", 
              miniMode ? "gap-1 auto-rows-fr" : "gap-2"
          )}>
            {days}
          </div>
      </div>
    </div>
  );
}