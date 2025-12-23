import { ArrowLeft, TrendingUp, Smile, Activity, Handshake, Trophy, AlertTriangle, RefreshCcw, Heart, LucideIcon, Target, Zap, Clock, TrendingDown } from 'lucide-react';
import Link from 'next/link';
import { getStatsData, Period } from '@/lib/actions/stats-actions';
import StatsFilter from '@/components/stats/StatsFilter';
import { EMOTIONAL_TRIGGERS, CONTEXT_HABITS } from '@/lib/constants/habits';

interface StatsPageProps {
  searchParams: Promise<{ period?: string }>
}

interface ContextBarProps {
  label: string;
  count: number;
  total: number;
  color: string;
  icon: LucideIcon;
}

// Helper pour générer les points SVG normalisés
const getSvgPoints = (data: number[], width: number = 100, height: number = 100) => {
  if (data.length === 0) return "";
  const min = Math.min(...data, 0); // Toujours inclure 0 pour référence
  const max = Math.max(...data, 10); // Minimum d'échelle
  const range = max - min || 1;
  
  return data.map((val, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((val - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');
};

export default async function StatsPage(props: StatsPageProps) {
  const searchParams = await props.searchParams;
  const period = (searchParams.period as Period) || '30d';
  
  const data = await getStatsData(period);
  
  if (!data) return <div className="p-8 text-center text-gray-500">Chargement des données...</div>;

  const { chartData, kpi, userHabits } = data;

  const userTriggers = EMOTIONAL_TRIGGERS.filter(t => userHabits.emotional_triggers.includes(t.id));
  const userContexts = CONTEXT_HABITS.filter(c => userHabits.context_habits.includes(c.id));

  // --- Préparation des données Chart (Consommation) ---
  const data1 = chartData.map(d => d.val1);
  const data2 = chartData.map(d => d.val2);
  
  const svgPoints1 = getSvgPoints(data1);
  const svgPoints2 = getSvgPoints(data2);

  const isPositive1 = kpi.totalSaved1 >= 0;
  // Détection de densité pour les barres (comme avant)
  const isHighDensity = chartData.length > 40;

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      
      {/* Header */}
      <div className="flex items-center gap-4 mb-2">
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
            <p className="text-gray-500">Comprenez vos habitudes.</p>
        </div>
      </div>

      <div className="flex justify-center">
        <StatsFilter />
      </div>

      {/* --- RANGÉE 1 --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* BLOC 1 : CONSTANCE */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between h-full">
            <div>
                <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-gray-900 flex items-center gap-2">
                        <TrendingUp size={18} className="text-blue-500"/>
                        Constance
                    </h3>
                    <span className={`text-xs font-bold px-2 py-1 rounded-full border ${
                        kpi.successRate >= 80 ? 'bg-green-50 text-green-600 border-green-100' : 'bg-orange-50 text-orange-600 border-orange-100'
                    }`}>
                        {kpi.successRate}% Réussite
                    </span>
                </div>
                
                {/* Graphique Barres */}
                <div className={`h-32 flex items-end w-full ${isHighDensity ? 'gap-0' : 'gap-1'}`}>
                    {chartData.map((day, i) => (
                        <div key={i} className="flex-1 flex flex-col justify-end items-center group relative h-full">
                            <div 
                                className={`
                                    w-full rounded-sm transition-all duration-500
                                    ${isHighDensity ? 'rounded-none' : 'rounded-sm'}
                                    ${day.status === 1 ? 'bg-green-400 h-full' : 
                                      day.status === -1 ? 'bg-red-400 h-3/4' : 
                                      'bg-gray-100 h-1.5'}
                                `}
                            />
                            {/* Tooltip */}
                            <div className="absolute bottom-full mb-1 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white text-[10px] px-2 py-1 rounded pointer-events-none whitespace-nowrap z-10 hidden sm:block">
                                {day.label}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex justify-between text-[10px] text-gray-400 mt-4 font-medium uppercase tracking-wide border-t border-gray-50 pt-2">
                <span>Début</span>
                <span>Fin</span>
            </div>
        </div>

        {/* BLOC 2 : PROFIL DE CONSOMMATION (DOUBLE COURBE) */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                    {isPositive1 ? <TrendingUp size={18} className="text-emerald-500"/> : <TrendingDown size={18} className="text-red-500"/>}
                    Profil Consommation
                </h3>
                
                {/* Indicateurs Cumulés */}
                <div className="flex gap-2">
                    {kpi.totalSaved1 !== 0 && (
                        <span className="text-xs font-bold px-2 py-1 rounded-full border bg-emerald-50 text-emerald-600 border-emerald-100">
                            {kpi.totalSaved1 > 0 ? '+' : ''}{kpi.totalSaved1} {kpi.unit1}
                        </span>
                    )}
                    {kpi.totalSaved2 !== 0 && (
                        <span className="text-xs font-bold px-2 py-1 rounded-full border bg-blue-50 text-blue-600 border-blue-100">
                            {kpi.totalSaved2 > 0 ? '+' : ''}{kpi.totalSaved2} {kpi.unit2}
                        </span>
                    )}
                </div>
            </div>

            <div className="h-32 w-full flex items-end relative">
                {/* Ligne Zéro (Indicative au milieu ou selon min/max - ici simplifiée au milieu visuel si mix positif/négatif) */}
                <div className="absolute w-full border-t border-dashed border-gray-200 top-1/2 z-0" />

                <svg className="w-full h-full overflow-visible z-10" preserveAspectRatio="none" viewBox="0 0 100 100">
                    
                    {/* Courbe 1 (Principale - Vert) */}
                    <path 
                        d={`M0,100 ${svgPoints1.split(' ').map(p => `L${p}`).join(' ')} L100,100 Z`} 
                        fill="none" // Pas de remplissage pour lisibilité double courbe
                        stroke="none"
                    />
                    <polyline 
                        points={svgPoints1} 
                        fill="none" 
                        stroke="#10B981" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                        className="transition-all duration-1000"
                    />

                    {/* Courbe 2 (Secondaire - Bleu) */}
                    {kpi.totalSaved2 !== 0 && (
                        <polyline 
                            points={svgPoints2} 
                            fill="none" 
                            stroke="#3B82F6" 
                            strokeWidth="2" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                            strokeDasharray="4,2" // Pointillés pour différencier
                            className="transition-all duration-1000 opacity-70"
                        />
                    )}
                </svg>
            </div>
            
            <div className="flex justify-between text-[10px] text-gray-400 mt-4 font-medium uppercase tracking-wide border-t border-gray-50 pt-2">
                <div className="flex gap-4">
                    <span className="flex items-center gap-1"><div className="w-2 h-0.5 bg-emerald-500"></div> {kpi.unit1}</span>
                    {kpi.totalSaved2 !== 0 && <span className="flex items-center gap-1"><div className="w-2 h-0.5 bg-blue-500 border-t border-dashed"></div> {kpi.unit2}</span>}
                </div>
                <span>Cumul Période</span>
            </div>
        </div>

      </div>

      {/* --- RANGÉE 2 --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* BLOC 3 : ÉMOTIONS & CONTEXTES */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 h-full">
            <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Smile size={18} className="text-yellow-500"/>
                Humeur & Journal
            </h3>
            
            <div className={`h-24 flex items-end w-full mb-6 border-b border-gray-50 pb-4 ${isHighDensity ? 'gap-0' : 'gap-1'}`}>
                {chartData.map((day, i) => {
                    const height = day.moodScore ? (day.moodScore / 5) * 100 : 0;
                    return (
                        <div key={i} className="flex-1 flex flex-col justify-end h-full group relative items-center">
                            {day.moodScore > 0 && (
                                <div 
                                    style={{ height: `${height}%` }} 
                                    className={`w-full rounded-t-sm transition-all ${
                                        day.moodScore >= 4 ? 'bg-green-300' :
                                        day.moodScore >= 3 ? 'bg-blue-300' : 'bg-orange-300'
                                    }`}
                                />
                            )}
                        </div>
                    );
                })}
            </div>

            <div className="space-y-3">
                <ContextBar label="Victoires" count={kpi.contextCounts.victory} total={chartData.length} color="bg-yellow-400" icon={Trophy} />
                <ContextBar label="Luttes" count={kpi.contextCounts.struggle} total={chartData.length} color="bg-orange-400" icon={AlertTriangle} />
                <ContextBar label="Rechutes" count={kpi.contextCounts.relapse} total={chartData.length} color="bg-red-400" icon={RefreshCcw} />
                <ContextBar label="Gratitude" count={kpi.contextCounts.gratitude} total={chartData.length} color="bg-pink-400" icon={Heart} />
            </div>
        </div>

        {/* BLOC 4 : PRIÈRES & SOUTIEN */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col h-full">
            <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Handshake size={18} className="text-purple-500"/> 
                Vie de Prière
            </h3>
            
            <div className="flex-1 flex flex-col justify-center gap-4">
                <div className="bg-purple-50 rounded-2xl p-5 flex items-center justify-between transition-transform hover:scale-[1.02]">
                    <div>
                        <p className="text-xs text-purple-600 font-bold uppercase tracking-wider mb-1">Soutien demandé</p>
                        <p className="text-3xl font-black text-gray-900">{kpi.prayersAsked}</p>
                    </div>
                    <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center text-purple-500 shadow-sm">
                        <Activity size={20} />
                    </div>
                </div>

                <div className="bg-blue-50 rounded-2xl p-5 flex items-center justify-between transition-transform hover:scale-[1.02]">
                    <div>
                        <p className="text-xs text-blue-600 font-bold uppercase tracking-wider mb-1">Soutien donné</p>
                        <p className="text-3xl font-black text-gray-900">{kpi.prayersSupported}</p>
                    </div>
                    <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center text-blue-500 shadow-sm">
                        <Handshake size={20} />
                    </div>
                </div>

                <p className="text-center text-xs text-gray-400 italic mt-4">
                    &quot;Portez les fardeaux les uns des autres...&quot; <br/> Galates 6:2
                </p>
            </div>
        </div>

      </div>

      {/* --- RANGÉE 3 : PROFIL DE RISQUE --- */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Target size={18} className="text-red-500"/>
                Profil de Risque
            </h3>
            <p className="text-xs text-gray-500 mb-6">
                Vos déclencheurs identifiés.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    {userTriggers.length > 0 ? (
                        <>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1">
                                <Zap size={10} /> Déclencheurs Émotionnels
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {userTriggers.map(t => (
                                    <span key={t.id} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-700 text-xs font-medium border border-red-100 transition-colors hover:bg-red-100">
                                        <t.icon size={12} />
                                        {t.label}
                                    </span>
                                ))}
                            </div>
                        </>
                    ) : (
                        <p className="text-xs text-gray-400 italic">Aucun déclencheur émotionnel identifié.</p>
                    )}
                </div>

                <div>
                    {userContexts.length > 0 ? (
                        <>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1">
                                <Clock size={10} /> Moments à Risque
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {userContexts.map(c => (
                                    <span key={c.id} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-50 text-orange-700 text-xs font-medium border border-orange-100 transition-colors hover:bg-orange-100">
                                        <c.icon size={12} />
                                        {c.label}
                                    </span>
                                ))}
                            </div>
                        </>
                    ) : (
                        <p className="text-xs text-gray-400 italic">Aucun contexte à risque identifié.</p>
                    )}
                </div>
            </div>

            {userTriggers.length === 0 && userContexts.length === 0 && (
                <div className="text-center py-4 mt-4 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                    <Link href="/onboarding" className="text-xs text-blue-600 font-bold hover:underline">
                        Compléter mon profil
                    </Link>
                </div>
            )}
      </div>

    </div>
  );
}

function ContextBar({ label, count, total, color, icon: Icon }: ContextBarProps) {
    if (count === 0) return null;
    const percent = total > 0 ? Math.min(100, Math.round((count / total) * 100)) : 0;
    
    return (
        <div className="flex items-center gap-3 text-xs">
            <div className={`p-1.5 rounded-md ${color} bg-opacity-20 text-gray-700`}>
                <Icon size={12} />
            </div>
            <div className="flex-1">
                <div className="flex justify-between mb-1">
                    <span className="font-medium text-gray-700">{label}</span>
                    <span className="text-gray-500">{count}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div style={{ width: `${percent}%` }} className={`h-full rounded-full ${color}`} />
                </div>
            </div>
        </div>
    )
}