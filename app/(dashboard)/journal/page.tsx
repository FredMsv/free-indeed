import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Calendar, Trash2, ArrowLeft, BookOpen} from "lucide-react";
import { SupabaseClient } from "@supabase/supabase-js";
import { MOOD_MAP, MoodKey } from "@/lib/constants/moods";
import { JournalForm } from "@/components/dashboard/JournalForm";
import { deleteJournalEntry, getTodayJournal } from "@/lib/actions/journal-actions";
import Link from "next/link";

interface JournalEntry {
  id: string;
  journal_date: string;
  mood: MoodKey;
  content: string | null;
}

export default async function JournalPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const client = supabase as SupabaseClient;
  const [todayEntry, { data }] = await Promise.all([
    getTodayJournal(),
    client.from('user_journals').select('*').eq('user_id', user.id).order('journal_date', { ascending: false })
  ]);

  const history = (data as unknown as JournalEntry[]) || [];

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10 px-4 sm:px-6">
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
        {/* BLOC REPOSITIONNÉ : Aujourd'hui (Saisie) */}
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
            Historique
          </h2>
          
          {history.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-[2rem] border border-dashed border-gray-200">
              <p className="text-gray-400 text-sm">Aucune note pour le moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {history.map((entry) => {
                const mood = MOOD_MAP[entry.mood] || MOOD_MAP.neutral;
                return (
                  <div key={entry.id} className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex gap-4 group hover:border-blue-100 transition-colors">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${mood.bg} ${mood.color}`}>
                      <mood.icon size={26} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <span className="text-sm font-bold text-gray-900 capitalize">
                          {new Date(entry.journal_date).toLocaleDateString('fr-FR', { 
                            weekday: 'long', 
                            day: 'numeric', 
                            month: 'long' 
                          })}
                        </span>
                        <form action={async () => { "use server"; await deleteJournalEntry(entry.id); }}>
                          <button type="submit" className="text-gray-300 hover:text-red-500 p-1 opacity-0 group-hover:opacity-100 transition-all">
                            <Trash2 size={16}/>
                          </button>
                        </form>
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