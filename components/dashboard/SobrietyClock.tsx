"use client";

import React from "react";
import { Timer, Trophy, History } from "lucide-react";

interface Badge {
  code: string;
  name: string;
  description: string;
  threshold: number;
}

interface SobrietyClockProps {
  daysClean: number;
  badge: Badge;
  lastStreak: number;
}

export default function SobrietyClock({ daysClean, badge, lastStreak }: SobrietyClockProps) {
  return (
    <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm overflow-hidden relative">
      {/* Effet décoratif en arrière-plan */}
      <div className="absolute -right-8 -top-8 w-32 h-32 bg-gold/5 rounded-full blur-3xl" />
      
      <div className="relative z-10">
        <div className="flex items-center gap-2 text-gold mb-6">
          <Timer size={20} />
          <span className="text-sm font-bold uppercase tracking-wider">Temps de Victoire</span>
        </div>

        <div className="flex flex-col items-center justify-center py-4">
          <div className="text-7xl font-black text-gray-900 tracking-tighter mb-2">
            {daysClean}
          </div>
          <div className="text-lg font-semibold text-gray-500 uppercase tracking-widest">
            {daysClean <= 1 ? "Jour Sobre" : "Jours Sobres"}
          </div>
        </div>

        <div className="mt-8 space-y-4">
          {/* Badge Actuel */}
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
            <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-2xl">
              <Trophy className="text-gold" size={24} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">Badge Actuel</p>
              <h4 className="font-bold text-gray-900 leading-tight">{badge.name}</h4>
            </div>
          </div>

          {/* Comparaison avec la dernière série (Motivation) */}
          {lastStreak > 0 && daysClean < lastStreak && (
            <div className="flex items-center gap-4 p-4 bg-blue-50/50 rounded-2xl border border-blue-100/50">
              <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center">
                <History className="text-blue-500" size={24} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">Dernière Série</p>
                <p className="text-xs text-gray-600">
                  Plus que <span className="font-bold text-blue-600">{lastStreak - daysClean}j</span> pour battre ton record de {lastStreak}j !
                </p>
              </div>
            </div>
          )}
        </div>

        <p className="mt-6 text-center text-xs text-gray-400 italic">
          &quot;Le succès n&apos;est pas final, l&apos;échec n&apos;est pas fatal : c&apos;est le courage de continuer qui compte.&quot;
        </p>
      </div>
    </div>
  );
}