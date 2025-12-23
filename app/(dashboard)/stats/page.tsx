import { ArrowLeft, TrendingUp, Smile, Frown, Meh, Activity, Handshake } from 'lucide-react';
import Link from 'next/link';
import { getLast7DaysMoods } from '@/lib/actions/journal-actions';

export default async function StatsPage() {
  
  // 1. Récupération des VRAIES données depuis la base de données
  const moodHistory = await getLast7DaysMoods();

  const prayersCount = 12; // Placeholder (Statique pour l'instant)

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      
      {/* Header avec retour */}
      <div className="flex items-center gap-4">
        <Link 
            href="/dashboard" 
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
        >
            <ArrowLeft size={24} />
        </Link>
        <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                Mes Statistiques <Activity className="text-green-500" size={24}/>
            </h1>
            <p className="text-gray-500">Analyse détaillée de votre parcours.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* 1. GRAPHIQUE DE PROGRESSION (Simulation Visuelle) */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 col-span-1 md:col-span-2">
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                    <TrendingUp size={18} className="text-blue-500"/>
                    Constance sur 30 jours
                </h3>
                <span className="text-sm font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full">+12% vs mois dernier</span>
            </div>
            
            {/* Histogramme CSS simple */}
            <div className="h-48 flex items-end justify-between gap-2">
                {[40, 60, 45, 70, 80, 50, 90, 85, 60, 75, 95, 100].map((height, i) => (
                    <div key={i} className="w-full bg-blue-50 rounded-t-md relative group">
                        <div 
                            style={{ height: `${height}%` }} 
                            className="absolute bottom-0 w-full bg-blue-500 rounded-t-md transition-all duration-1000 ease-out group-hover:bg-blue-600"
                        ></div>
                    </div>
                ))}
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-2 font-medium">
                <span>Début du mois</span>
                <span>Aujourd&apos;hui</span>
            </div>
        </div>

        {/* 2. VARIATIONS D'HUMEUR (Connecté aux données réelles) */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Smile size={18} className="text-yellow-500"/>
                Humeur (7 derniers jours)
            </h3>
            <div className="flex justify-between items-center">
                {moodHistory.map((item, i) => (
                    <div key={i} className="flex flex-col items-center gap-2">
                        <div className={`
                            w-8 h-8 rounded-full flex items-center justify-center text-white text-xs shadow-sm transition-all
                            ${item.mood === 'happy' ? 'bg-green-400' : 
                              item.mood === 'neutral' ? 'bg-blue-400' : 
                              item.mood === 'sad' ? 'bg-orange-400' : 'bg-gray-100 text-gray-300'}
                        `}>
                            {item.mood === 'happy' && <Smile size={16}/>}
                            {item.mood === 'neutral' && <Meh size={16}/>}
                            {item.mood === 'sad' && <Frown size={16}/>}
                            {!item.mood && <span className="text-[10px]">•</span>}
                        </div>
                        <span className="text-[10px] text-gray-400 font-medium uppercase">{item.day}</span>
                    </div>
                ))}
            </div>
            <p className="text-xs text-gray-500 mt-6 text-center italic">
            &quot;Vos notes serviront bientôt à votre assistant IA.&quot;
            </p>
        </div>

        {/* 3. PRIÈRES (Statique pour l'instant) */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
            {/* Badge "Bientôt" */}
            <div className="absolute top-3 right-3 bg-gray-100 text-gray-500 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wide">
                Bêta
            </div>

            <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                <Handshake size={18} className="text-purple-500"/> 
                Prières & Méditations
            </h3>
            
            <div className="flex items-end gap-2 mt-4">
                <span className="text-5xl font-bold text-gray-900">{prayersCount}</span>
                <span className="text-sm text-gray-500 mb-2 font-medium">sessions ce mois-ci</span>
            </div>

            <div className="mt-4 w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div className="bg-purple-500 h-full w-1/3 rounded-full"></div>
            </div>
            <p className="text-xs text-gray-400 mt-2">
                Objectif : 30 sessions / mois
            </p>
        </div>

      </div>
    </div>
  );
}