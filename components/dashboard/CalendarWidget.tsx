"use client";

import { useState } from "react";
import { Minus, Calendar, CheckCircle2, XCircle, ChevronLeft, ChevronRight, X } from "lucide-react";

interface CalendarWidgetProps {
    miniMode: boolean;
    isEditMode: boolean;
    onDelete: () => void;
    sobrietyStartDate: string | null;
    relapseDates: string[];
    pledgeDates: string[];
    isBroken: boolean;
}

export default function CalendarWidget({ 
    isEditMode, 
    onDelete, 
    sobrietyStartDate, 
    relapseDates = [], 
    pledgeDates = [] 
}: CalendarWidgetProps) {
    
    const [isOpen, setIsOpen] = useState(false);
    const [currentDate, setCurrentDate] = useState(new Date());

    // --- LOGIQUE MINI VUE (7 derniers jours) ---
    const last7Days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        return d;
    });

    // --- UTILITAIRES ---
    // ✅ CORRECTION : Utilisation de date locale (YYYY-MM-DD) pour éviter le décalage UTC
    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-CA'); // Renvoie YYYY-MM-DD en heure locale
    };

    const getDayStatus = (dateStr: string) => {
        const isRelapse = relapseDates.includes(dateStr);
        // Est sobre si : date >= date_début ET ce n'est pas une rechute
        const isSober = sobrietyStartDate 
            ? dateStr >= sobrietyStartDate.split('T')[0] && !isRelapse && dateStr <= formatDate(new Date())
            : false;
        
        const isPledged = pledgeDates.includes(dateStr);
        return { isRelapse, isSober, isPledged };
    };

    // --- LOGIQUE VUE COMPLÈTE (Mois) ---
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay(); // 0 = Dimanche
    // Ajustement pour commencer Lundi (0 = Lundi, 6 = Dimanche)
    const startDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1; 

    const monthDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const blanks = Array.from({ length: startDay }, (_, i) => i);

    const changeMonth = (offset: number) => {
        const newDate = new Date(currentDate.setMonth(currentDate.getMonth() + offset));
        setCurrentDate(new Date(newDate));
    };

    // Rendu d'une cellule de jour (partagé entre mini et full)
    const renderDayCircle = (date: Date, size: "sm" | "md") => {
        const dateStr = formatDate(date);
        const { isRelapse, isSober, isPledged } = getDayStatus(dateStr);
        const isToday = dateStr === formatDate(new Date());

        let bgClass = "bg-gray-50 text-gray-300";
        let icon = null;

        if (isRelapse) {
            bgClass = "bg-red-100 text-red-600 border border-red-200";
            icon = <XCircle size={size === "sm" ? 10 : 14} />;
        } else if (isPledged || isSober) {
            bgClass = "bg-emerald-100 text-emerald-600 border border-emerald-200";
            icon = <CheckCircle2 size={size === "sm" ? 10 : 14} />;
        } else if (isToday) {
            bgClass = "bg-blue-50 text-blue-600 border border-blue-200 font-bold";
        }

        const sizeClass = size === "sm" ? "w-8 h-8 text-[10px]" : "w-10 h-10 text-xs";

        return (
            <div className={`rounded-full flex items-center justify-center transition-all ${bgClass} ${sizeClass}`}>
                {icon ? icon : date.getDate()}
            </div>
        );
    };

    return (
        <>
            {/* --- WIDGET DASHBOARD --- */}
            <div 
                onClick={() => !isEditMode && setIsOpen(true)}
                className="h-full w-full bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col relative group hover:border-blue-200 transition-colors cursor-pointer"
            >
                {isEditMode && (
                    <button 
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDelete(); }}
                        className="absolute top-4 right-4 z-20 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-md hover:bg-red-600 transition-all"
                    >
                        <Minus size={16} strokeWidth={4} />
                    </button>
                )}

                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-gray-900 font-bold text-sm">
                        <Calendar className="text-blue-500" size={18} />
                        <span>Cette semaine</span>
                    </div>
                    <span className="text-[10px] text-gray-400 bg-gray-50 px-2 py-1 rounded-full">Voir tout</span>
                </div>

                <div className="flex-1 flex items-center justify-between gap-1">
                    {last7Days.map((date, i) => (
                        <div key={i} className="flex flex-col items-center gap-1">
                            {renderDayCircle(date, "sm")}
                            <span className={`text-[9px] uppercase font-bold ${i === 6 ? 'text-blue-600' : 'text-gray-300'}`}>
                                {date.toLocaleDateString('fr-FR', { weekday: 'narrow' })}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* --- MODAL CALENDRIER COMPLET --- */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
                    
                    <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg p-6 animate-in fade-in zoom-in duration-200">
                        {/* Header Modal */}
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-900 capitalize">
                                {currentDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                            </h2>
                            <div className="flex items-center gap-2">
                                <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-gray-100 rounded-full"><ChevronLeft size={20}/></button>
                                <button onClick={() => changeMonth(1)} className="p-2 hover:bg-gray-100 rounded-full"><ChevronRight size={20}/></button>
                                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-full ml-2">
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Jours Semaine - ✅ CORRECTION KEY */}
                        <div className="grid grid-cols-7 mb-2 text-center">
                            {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((d, index) => (
                                <span key={index} className="text-xs font-bold text-gray-400 py-2">{d}</span>
                            ))}
                        </div>

                        {/* Grille Mois */}
                        <div className="grid grid-cols-7 gap-2">
                            {blanks.map(x => <div key={`blank-${x}`} />)}
                            
                            {monthDays.map(d => {
                                const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), d);
                                return (
                                    <div key={d} className="flex justify-center">
                                        {renderDayCircle(date, "md")}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Légende */}
                        <div className="mt-6 flex justify-center gap-4 text-xs text-gray-500 border-t border-gray-100 pt-4">
                            <div className="flex items-center gap-1"><CheckCircle2 size={12} className="text-emerald-500"/> Engagement</div>
                            <div className="flex items-center gap-1"><XCircle size={12} className="text-red-500"/> Rechute</div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}