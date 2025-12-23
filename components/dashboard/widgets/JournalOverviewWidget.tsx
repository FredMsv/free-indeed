import { MOOD_MAP, MoodKey } from "@/lib/constants/moods";
import { BookText, Plus } from "lucide-react";
import Link from "next/link";

interface JournalOverviewProps {
  todayEntry: { mood: string; content: string | null } | null;
}

export function JournalOverviewWidget({ todayEntry }: JournalOverviewProps) {
  const mood = todayEntry ? MOOD_MAP[todayEntry.mood as MoodKey] : null;
  const Icon = mood ? mood.icon : BookText;

  return (
    <Link href="/journal" className="block h-full">
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all h-full flex flex-col justify-between group relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-yellow-500"></div>
        
        <div className="flex justify-between items-start">
          <div className={`p-3 rounded-2xl ${mood ? mood.bg : 'bg-gray-50'}`}>
            <Icon className={`w-6 h-6 ${mood ? mood.color : 'text-gray-400'}`} />
          </div>
          <div className="bg-blue-50 text-blue-600 p-2 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
            <Plus size={16} />
          </div>
        </div>

        <div>
          <p className="text-gray-500 text-[10px] font-bold uppercase tracking-wider">Humeur du jour</p>
          <h3 className="text-xl font-bold text-gray-900 mt-1">
            {mood ? mood.label : "Non renseignée"}
          </h3>
          <p className="text-[10px] text-blue-600 font-bold mt-2">
            {todayEntry ? "Note enregistrée" : "Appuyer pour écrire"}
          </p>
        </div>
      </div>
    </Link>
  );
}