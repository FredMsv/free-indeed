"use client";

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CalendarWidgetProps {
  miniMode?: boolean;
  isEditMode?: boolean;
  onDelete?: () => void;
  sobrietyStartDate: string | null;
  relapseDates: string[];
  pledgeDates: string[];
  isBroken: boolean;
}

export default function CalendarWidget({ 
  miniMode = false,
  isEditMode = false,
  onDelete,
  sobrietyStartDate,
  relapseDates,
  pledgeDates,
  isBroken
}: CalendarWidgetProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = (new Date(year, month, 1).getDay() + 6) % 7;

  // Utilitaire pour normaliser les dates (YYYY-MM-DD)
  const normalize = (d: Date) => d.toLocaleDateString('en-CA');

  const getDayStyles = (day: number) => {
    const d = new Date(year, month, day);
    const dateStr = normalize(d);
    const todayStr = normalize(new Date());

    // 1. FUTUR
    if (dateStr > todayStr) return "bg-transparent text-gray-200";

    // 2. RECHUTE : ROUGE FONCÉ
    if (relapseDates.includes(dateStr)) {
      return "bg-red-500 text-white font-bold ring-2 ring-red-100 shadow-sm";
    }

    // 3. ENGAGEMENT VALIDÉ : VERT
    if (pledgeDates.includes(dateStr)) {
      return "bg-green-500 text-white font-bold shadow-sm";
    }

    // 4. ÉTAT DE CHUTE : ROUGE PÂLE (Interruption de série)
    if (isBroken && sobrietyStartDate && dateStr > normalize(new Date(sobrietyStartDate))) {
      return "bg-red-50 text-red-400 border border-red-100";
    }

    // 5. PASSÉ NEUTRE : GRIS
    return "bg-gray-50 text-gray-300";
  };

  const days = [];
  for (let i = 0; i < firstDay; i++) days.push(<div key={`empty-${i}`} className="h-full w-full" />);
  
  for (let d = 1; d <= daysInMonth; d++) {
    const style = getDayStyles(d);
    const dateToCheck = new Date(year, month, d);
    const isToday = new Date().toDateString() === dateToCheck.toDateString();

    days.push(
      <div key={d} className={cn(
        "flex items-center justify-center rounded-xl transition-all relative",
        miniMode ? "h-full w-full text-[10px]" : "aspect-square text-sm", 
        style,
        isToday && "ring-2 ring-blue-400 ring-offset-0.7 z-10"
      )}>
        {d}
      </div>
    );
  }

  return (
    <div className={cn(
      "bg-white border border-gray-100 shadow-sm flex flex-col h-full relative overflow-hidden rounded-3xl",
      miniMode ? "p-4" : "p-6"
    )}>
      <div className="absolute top-0 left-0 w-full h-1 bg-yellow-500" />
      
      {isEditMode && onDelete && (
        <button onClick={onDelete} className="absolute top-4 right-4 bg-red-500 text-white rounded-full p-1 shadow-md z-20">
          <Minus size={14} />
        </button>
      )}

      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-gray-900 capitalize text-sm">
          {currentDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
        </h3>
        <div className="flex gap-1">
          <button onClick={() => setCurrentDate(new Date(year, month - 1, 1))} className="p-1 hover:bg-gray-50 rounded-lg">
            <ChevronLeft size={18} className="text-gray-400" />
          </button>
          <button onClick={() => setCurrentDate(new Date(year, month + 1, 1))} className="p-1 hover:bg-gray-50 rounded-lg" disabled={new Date() < new Date(year, month + 1, 1)}>
            <ChevronRight size={18} className="text-gray-400" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center font-bold text-[10px] text-gray-400 mb-2">
        {['L','M','M','J','V','S','D'].map((day, i) => (
          <span key={i}>{day}</span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1 flex-1">{days}</div>
    </div>
  );
}