import { 
    ArrowLeft, 
    Activity, 
    TrendingUp, 
    TrendingDown, 
    Target, 
    Zap, 
    Clock, 
    Smile, 
    Heart, 
    RefreshCcw, 
    AlertTriangle, 
    Trophy,
    LucideIcon 
  } from 'lucide-react';
  import Link from 'next/link';
  import { getStatsData, getVulnerabilityData } from '@/lib/actions/stats-actions';
  import StatsFilter from '@/components/stats/StatsFilter';
  import VulnerabilityAnalysis from '@/components/stats/VulnerabilityAnalysis';
  import { StatsPeriod, DayChartEntry } from '@/lib/types/stats';
  import { EMOTIONAL_TRIGGERS, CONTEXT_HABITS } from '@/lib/constants/habits';
  import { cn } from "@/lib/utils";
  
  interface StatsPageProps {
    searchParams: Promise<{ period?: string }>
  }
  
  /**
   * Page de statistiques consolidant les données de sobriété, 
   * d'humeur et d'analyse de risque.
   */
  export default async function StatsPage(props: StatsPageProps) {
    const searchParams = await props.searchParams;
    const period = (searchParams.period as StatsPeriod) || '30d';
  
    // Récupération des données via Server Actions avec typage strict
    const [data, vulnerability] = await Promise.all([
      getStatsData(period),
      getVulnerabilityData()
    ]);
  
    if (!data) {
      return (
        <div className="p-8 text-center text-gray-500">
          Chargement des statistiques...
        </div>
      );
    }
  
    // Filtrage des constantes locales basé sur les IDs stockés en DB
    const userTriggers = EMOTIONAL_TRIGGERS.filter(t => 
      data.userHabits.emotional_triggers.includes(t.id)
    );
    const userContexts = CONTEXT_HABITS.filter(c => 
      data.userHabits.context_habits.includes(c.id)
    );
  
    const isPositiveSuccess = data.kpi.successRate >= 80;
  
    return (
      <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
        
        {/* Header avec navigation retour */}
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
              <p className="text-gray-500">Analysez vos habitudes pour mieux triompher.</p>
          </div>
        </div>
  
        <div className="flex justify-center">
          <StatsFilter />
        </div>
  
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* BLOC CONSTANCE */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between h-full">
              <div>
                  <div className="flex items-center justify-between mb-6">
                      <h3 className="font-bold text-gray-900 flex items-center gap-2">
                          <TrendingUp size={18} className="text-blue-500"/>
                          Constance
                      </h3>
                      <span className={`text-xs font-bold px-2 py-1 rounded-full border ${
                          isPositiveSuccess ? 'bg-green-50 text-green-600 border-green-100' : 'bg-orange-50 text-orange-600 border-orange-100'
                      }`}>
                          {data.kpi.successRate}% Réussite
                      </span>
                  </div>
                  
                  <div className="h-32 flex items-end w-full gap-1">
                      {data.chartData.map((day: DayChartEntry, i: number) => (
                          <div key={i} className="flex-1 flex flex-col justify-end items-center group relative h-full">
                              <div 
                                  title={day.date}
                                  className={`w-full transition-all duration-500 rounded-sm ${
                                      day.status === 1 ? 'bg-green-400 h-full' : 
                                      day.status === -1 ? 'bg-red-400 h-3/4' : 'bg-gray-100 h-1.5'
                                  }`} 
                              />
                          </div>
                      ))}
                  </div>
              </div>
              <div className="flex justify-between text-[10px] text-gray-400 mt-4 font-medium uppercase tracking-wide border-t border-gray-50 pt-2">
                  <span>Début</span>
                  <span>Fin</span>
              </div>
          </div>
  
          {/* BLOC CONSOMMATION */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 h-full flex flex-col">
              <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-gray-900 flex items-center gap-2">
                      {data.kpi.totalSaved1 >= 0 ? <TrendingUp size={18} className="text-emerald-500"/> : <TrendingDown size={18} className="text-red-500"/>}
                      Profil Consommation
                  </h3>
                  <span className="text-xs font-bold px-2 py-1 rounded-full border bg-emerald-50 text-emerald-600 border-emerald-100">
                      {data.kpi.totalSaved1 > 0 ? '+' : ''}{data.kpi.totalSaved1} {data.kpi.unit1}
                  </span>
              </div>
              <div className="flex-1 flex flex-col justify-center items-center text-center">
                  <p className="text-4xl font-black text-gray-900">
                    {data.kpi.totalSaved1} {data.kpi.unit1}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Cumul total épargné.</p>
                  <div className="mt-4">
                      <p className="text-lg font-bold text-blue-600">{data.kpi.totalSaved2} {data.kpi.unit2}</p>
                      <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Volume évité</p>
                  </div>
              </div>
          </div>
        </div>
  
        {/* ANALYSE DE VULNÉRABILITÉ */}
        <VulnerabilityAnalysis data={vulnerability} />
  
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* DISTRIBUTION DES ÉMOTIONS (CORRIGÉ) */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 h-full">
              <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Smile size={18} className="text-yellow-500"/>
                  Humeur & Journal
              </h3>
              <div className="space-y-4">
                  <StatBar label="Victoires" count={data.kpi.contextCounts.victory} total={data.chartData.length} color="bg-yellow-400" icon={Trophy} />
                  <StatBar label="Luttes" count={data.kpi.contextCounts.struggle} total={data.chartData.length} color="bg-orange-400" icon={AlertTriangle} />
                  <StatBar label="Rechutes" count={data.kpi.contextCounts.relapse} total={data.chartData.length} color="bg-red-400" icon={RefreshCcw} />
                  <StatBar label="Gratitude" count={data.kpi.contextCounts.gratitude} total={data.chartData.length} color="bg-pink-400" icon={Heart} />
              </div>
          </div>
  
          {/* PROFIL DE RISQUE */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col h-full">                  
              <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Target size={18} className="text-red-500"/> 
                  Profil de Risque
              </h3>
              <div className="space-y-6">
                  <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1">
                          <Zap size={10} /> Déclencheurs Identifiés
                      </p>
                      <div className="flex flex-wrap gap-2">
                          {userTriggers.map(t => (
                              <span key={t.id} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-700 text-xs font-medium border border-red-100">
                                  <t.icon size={12} /> {t.label}
                              </span>
                          ))}
                      </div>
                  </div>
                  <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1">
                          <Clock size={10} /> Moments de Vigilance
                      </p>
                      <div className="flex flex-wrap gap-2">
                          {userContexts.map(c => (
                              <span key={c.id} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-50 text-orange-700 text-xs font-medium border border-orange-100">
                                  <c.icon size={12} /> {c.label}
                              </span>
                          ))}
                      </div>
                  </div>
              </div>
          </div>
        </div>
      </div>
    );
  }
  
  /**
   * Sous-composant de barre de progression pour les catégories du journal.
   */
  interface StatBarProps {
    label: string;
    count: number;
    total: number;
    color: string;
    icon: LucideIcon;
  }
  
  function StatBar({ label, count, total, color, icon: Icon }: StatBarProps) {
      // Calcul du pourcentage basé sur le nombre total d'entrées
      const percent = total > 0 ? Math.min(100, Math.round((count / total) * 100)) : 0; 
      
      return (
          <div className="flex items-center gap-3 text-xs">
              <div className={cn("p-1.5 rounded-md bg-opacity-20 text-gray-700", color)}>
                  <Icon size={12} />
              </div>
              <div className="flex-1">
                  <div className="flex justify-between mb-1">
                      <span className="font-medium text-gray-700">{label}</span>
                      <span className="text-gray-500 font-bold">{count}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                      {/* Correction : On applique la classe de couleur de fond (ex: bg-yellow-400) 
                          pour que le remplissage soit visible */}
                      <div 
                        style={{ width: `${percent}%` }} 
                        className={cn("h-full rounded-full transition-all duration-700", color)}
                      />
                  </div>
              </div>
          </div>
      );
  }