"use client";

import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';

interface CustomDatePickerProps {
  value?: string;
  onChange: (date: string) => void;
  error?: string;
  label: string;
  minDate?: Date;
  maxDate?: Date;
}

export default function CustomDatePicker({ 
  value, 
  onChange, 
  error, 
  label,
  minDate,
  maxDate 
}: CustomDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState(new Date());
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialisation de la vue sur la date sélectionnée ou aujourd'hui
  useEffect(() => {
    if (value) {
      setViewDate(new Date(value));
    }
  }, [value]);

  // Fermeture au clic extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const displayDate = value 
    ? new Date(value).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
    : 'Sélectionner une date';

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    // 0 = Dimanche, 1 = Lundi, etc. On veut Lundi = 0 pour le grid
    const day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1;
  };

  const handleDayClick = (day: number) => {
    const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    // Ajustement fuseau horaire local pour éviter le décalage
    const localDate = new Date(newDate.getTime() - (newDate.getTimezoneOffset() * 60000));
    
    onChange(localDate.toISOString().split('T')[0]);
    setIsOpen(false);
  };

  const changeMonth = (increment: number) => {
    const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth() + increment, 1);
    setViewDate(newDate);
  };

  const isDateDisabled = (day: number) => {
    const current = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    if (minDate && current < minDate) return true;
    if (maxDate && current > maxDate) return true;
    return false;
  };

  const isSameDay = (d1: Date, d2: Date) => {
    return d1.getFullYear() === d2.getFullYear() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getDate() === d2.getDate();
  };

  // Génération de la grille
  const daysInMonth = getDaysInMonth(viewDate.getFullYear(), viewDate.getMonth());
  const firstDay = getFirstDayOfMonth(viewDate.getFullYear(), viewDate.getMonth());
  const days = [];
  
  // Cellules vides avant le premier jour
  for (let i = 0; i < firstDay; i++) {
    days.push(<div key={`empty-${i}`} className="h-9 w-9" />);
  }

  // Jours du mois
  for (let d = 1; d <= daysInMonth; d++) {
    const dateToCheck = new Date(viewDate.getFullYear(), viewDate.getMonth(), d);
    const disabled = isDateDisabled(d);
    const selected = value ? isSameDay(new Date(value), dateToCheck) : false;

    days.push(
      <button
        key={d}
        type="button"
        onClick={() => !disabled && handleDayClick(d)}
        disabled={disabled}
        className={`
          h-9 w-9 rounded-full flex items-center justify-center text-sm transition-colors
          ${selected ? 'bg-gold text-white font-bold shadow-md' : ''}
          ${!selected && !disabled ? 'hover:bg-gray-100 text-gray-700' : ''}
          ${disabled ? 'text-gray-300 cursor-not-allowed' : 'cursor-pointer'}
        `}
      >
        {d}
      </button>
    );
  }

  return (
    <div className="w-full space-y-1 relative" ref={containerRef}>
      <label className="text-sm font-medium text-gray-text ml-1">{label}</label>
      
      {/* Input Trigger */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-full bg-white border rounded-xl px-4 py-3 flex items-center gap-3 cursor-pointer transition-all
          ${error ? 'border-error ring-1 ring-error/20' : isOpen ? 'border-gold ring-2 ring-gold/10' : 'border-gray-border hover:border-gray-300'}
        `}
      >
        <CalendarIcon size={18} className="text-gray-400" />
        <span className={`flex-1 ${value ? 'text-gray-900' : 'text-gray-300'}`}>
          {displayDate}
        </span>
      </div>

      {error && <p className="text-xs text-error ml-1 animate-in slide-in-from-top-1">{error}</p>}

      {/* Calendar Dropdown */}
      {isOpen && (
        <div className="absolute z-50 bottom-full mb-2 left-0 w-full bg-white border border-gray-100 rounded-2xl shadow-xl p-4 animate-in fade-in zoom-in-95 slide-in-from-bottom-2">
          
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <button 
              type="button"
              onClick={() => changeMonth(-1)}
              className="p-1 hover:bg-gray-50 rounded-lg text-gray-500 transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="font-semibold text-gray-900 capitalize">
              {viewDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
            </span>
            <button 
              type="button"
              onClick={() => changeMonth(1)}
              className="p-1 hover:bg-gray-50 rounded-lg text-gray-500 transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Days Header */}
          <div className="grid grid-cols-7 mb-2">
            {/* ✅ CORRECTION ICI : Ajout de l'index dans la clé pour éviter le doublon "M" */}
            {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day, index) => (
              <div key={index} className="h-8 flex items-center justify-center text-xs font-medium text-gray-400">
                {day}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-y-1 place-items-center">
            {days}
          </div>
        </div>
      )}
    </div>
  );
}