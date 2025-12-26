import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Calendar, ArrowLeft, BookOpen, Trophy, AlertTriangle, RefreshCcw, Heart, NotebookPen, LucideIcon } from "lucide-react";
import { MOOD_MAP } from "@/lib/constants/moods";
import { JournalForm } from "@/components/dashboard/JournalForm";
import { getTodayJournal, getJournalHistory } from "@/lib/actions/journal-actions";
import { DeleteJournalButton } from "@/components/journal/DeleteJournalButton";
import Link from "next/link";

interface JournalEntry {
  id: string;
  journal_date: string;
  mood: string;
  content: string | null;
  context: string | null;
  created_at: string;
}

// Configuration visuelle des tags pour l'affichage
const CONTEXT_MAP: Record<string, { label: string; icon: LucideIcon; style: string }> = {
  'victory': { label: 'Victoire', icon: Trophy, style: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  'struggle': { label: 'Lutte', icon: AlertTriangle, style: 'bg-orange-100 text-orange-700 border-orange-200' },
  'relapse': { label: 'Rechute', icon: RefreshCcw, style: 'bg-red-100 text-red-700 border-red-200' },
  'gratitude': { label: 'Gratitude', icon: Heart, style: 'bg-pink-100 text-pink-700 border-pink-200' },
  'note': { label: 'Note', icon: NotebookPen, style: 'bg-blue-100 text-blue-700 border-blue-200' },
};

export default async function JournalPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  // On récupère les données du dashboard ET le journal du jour en parallèle pour optimiser
  // On limite l'historique aux 10 dernières entrées pour la performance
  const [todayEntry, historyData] = await Promise.all([
    getTodayJournal(),
    getJournalHistory(10)
  ]);

  const history = (historyData as unknown as JournalEntry[]) || [];

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10 px-4 sm:px-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard" className="p-2 hover:bg-white rounded-full transition-colors text-gray-400 hover:text-gray-900">
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mon Journal</h1>
          <p className="text-sm text-gray-500">Exprimez vos pensées et suivez votre humeur.</p>
        </div>
      </div>

      <div className="space-y-10">
        {/* BLOC : Aujourd'hui (Saisie) */}
        <section>
          <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
            <h2 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
              <BookOpen size={18} className="text-blue-500" />
              Aujourd&apos;hui
            </h2>
            <JournalForm initialData={todayEntry || undefined} />
          </div>
        </section>

        {/* BLOC : Historique */}
        <section className="space-y-4">
          <h2 className="font-bold text-gray-900 flex items-center gap-2 ml-2">
            <Calendar size={18} className="text-blue-500" /> 
            Historique (10 derniers)
          </h2>
          
          {history.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-[2rem] border border-dashed border-gray-200">
              <p className="text-gray-400 text-sm">Aucune note pour le moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {history.map((entry) => {

                const mood = MOOD_MAP[entry.mood] || MOOD_MAP.neutral;
                // Récupération de la config du contexte (ou par défaut Note)
                const contextConfig = entry.context && CONTEXT_MAP[entry.context] 
                  ? CONTEXT_MAP[entry.context] 
                  : CONTEXT_MAP['note'];

                return (
                  <div key={entry.id} className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex gap-4 group hover:border-blue-300 transition-all">
                    
                    {/* Icône Humeur */}
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${mood.bg} ${mood.color}`}>
                      <mood.icon size={26} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                            {/* Date */}
                            <span className="text-sm font-bold text-gray-900 capitalize">
                            {new Date(entry.journal_date).toLocaleDateString('fr-FR', { 
                                weekday: 'long', 
                                day: 'numeric', 
                                month: 'long' 
                            })}
                            </span>

                            {/* --- AFFICHAGE DU TAG CONTEXTE --- */}
                            {contextConfig && (
                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide border ${contextConfig.style}`}>
                                    <contextConfig.icon size={10} strokeWidth={3} />
                                    {contextConfig.label}
                                </span>
                            )}
                        </div>

                        {/* Bouton Supprimer Client Component */}
                        <DeleteJournalButton entryId={entry.id} />
                      </div>

                      <p className="text-gray-600 text-sm mt-2 whitespace-pre-wrap leading-relaxed">
                        {entry.content || <span className="italic text-gray-300">Aucune note rédigée ce jour-là.</span>}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}