"use client";

import Link from "next/link";
import {  ArrowRight, Plus } from "lucide-react";
import { MOOD_MAP } from "@/lib/constants/moods";

// ✅ Définition précise du type attendu
interface JournalEntryData {
  mood: string;
  content: string | null;
  context: string | null;
  count: number;
}

interface JournalOverviewWidgetProps {
  entry: JournalEntryData | null; // ✅ On accepte 'entry'
}

export function JournalOverviewWidget({ entry }: JournalOverviewWidgetProps) {
  
  // Cas 1 : Aucune entrée aujourd'hui
  if (!entry) {
    return (
      <Link href="/journal" className="block h-full">
        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm h-full flex flex-col items-center justify-center text-center gap-3 hover:border-blue-200 hover:shadow-md transition-all group">
          <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
            <Plus size={24} />
          </div>
          <div>
            <p className="font-bold text-gray-900">Journal du jour</p>
            <p className="text-xs text-gray-400">Rien d&apos;écrit aujourd&apos;hui</p>
          </div>
        </div>
      </Link>
    );
  }

  // Cas 2 : Entrée existante
  // On récupère la config de l'humeur (icône, couleur...)
 
  const moodConfig = MOOD_MAP[entry.mood] || MOOD_MAP['neutral'];

  return (
    <Link href="/journal" className="block h-full group">
      <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm h-full flex flex-col justify-between hover:border-blue-200 hover:shadow-md transition-all relative overflow-hidden">
        
        {/* Header */}
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${moodConfig.bg} ${moodConfig.color}`}>
              <moodConfig.icon size={20} />
            </div>
            <div>
               <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Journal</p>
               <p className="font-bold text-gray-900 text-sm capitalize">{moodConfig.label}</p>
            </div>
          </div>
          <div className="bg-gray-50 p-2 rounded-full text-gray-300 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
            <ArrowRight size={16} />
          </div>
        </div>

        {/* Content Preview */}
        <div className="flex-1 min-h-0">
           <p className="text-gray-600 text-sm line-clamp-3 italic leading-relaxed">
             &quot;{entry.content || "Aucun texte..."}&quot;
           </p>
        </div>

        {/* Footer (Context Tag) */}
        {entry.context && (
            <div className="mt-3 pt-3 border-t border-gray-50 flex justify-between items-center">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider bg-gray-50 px-2 py-1 rounded-md">
                    {entry.context}
                </span>
                {entry.count > 1 && (
                    <span className="text-[10px] text-blue-500 font-medium">
                        +{entry.count - 1} autre(s)
                    </span>
                )}
            </div>
        )}
      </div>
    </Link>
  );
}