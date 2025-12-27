"use client";

import { useState } from "react";
import { GlobalHealthScore, PilierMiniProps } from "@/lib/types/analytics";
import { 
  Activity, 
  ShieldCheck, 
  Heart, 
  Sparkles, 
  TrendingUp, 
  TrendingDown, 
  Info, 
  X, 
  Minus,
  LucideIcon 
} from "lucide-react";
import { cn } from "@/lib/utils";

interface HealthScoreWidgetProps {
  data: GlobalHealthScore;
  isEditMode?: boolean;
  onDelete?: () => void;
}

/**
 * Widget de score de santé globale avec modal d'aide opaque et scrollable.
 */
export default function HealthScoreWidget({ data, isEditMode, onDelete }: HealthScoreWidgetProps) {
  const [showHelp, setShowHelp] = useState(false);

  return (
    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col h-full relative overflow-hidden group transition-all z-10">
      
      {/* BOUTON DE SUPPRESSION HARMONISÉ */}
      {isEditMode && onDelete && (
        <button 
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDelete(); }}
          className="absolute top-4 right-4 z-30 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-md hover:bg-red-600 transition-all hover:scale-110"
          type="button"
        >
          <Minus size={16} strokeWidth={4} />
        </button>
      )}

      {/* HEADER */}
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-gold/10 rounded-lg text-gold">
            <Activity size={16} />
          </div>
          <h3 className="font-bold text-gray-900 text-sm">Santé Globale</h3>
          {!isEditMode && (
            <button 
              onClick={() => setShowHelp(true)}
              className="text-gray-300 hover:text-gold transition-colors"
              type="button"
            >
              <Info size={14} />
            </button>
          )}
        </div>
        <div className={cn(
          "flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase",
          data.trend === 'up' ? "bg-green-50 text-green-600" : "bg-gray-50 text-gray-400"
        )}>
          {data.trend === 'up' ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
          {data.trend === 'up' ? "En hausse" : "Stable"}
        </div>
      </div>

      {/* SCORE CENTRAL */}
      <div className="mb-3 flex flex-col justify-center flex-1">
        <div className="flex items-baseline gap-1">
          <span className="text-5xl font-black text-gray-900 leading-none">
            {data.total}
          </span>
          <span className="text-lg font-bold text-gray-200">/100</span>
        </div>
        <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mt-2">
          Indice de vitalité actuel
        </p>
      </div>

      {/* PILLIERS MINI */}
      <div className="grid grid-cols-3 gap-3 mt-auto">
        <MiniStat 
          label="Discipline" 
          val={data.constance} 
          icon={ShieldCheck} 
          color="text-blue-500" 
        />
        <MiniStat 
          label="Mental" 
          val={data.emotional} 
          icon={Heart} 
          color="text-rose-500" 
        />
        <MiniStat 
          label="Esprit" 
          val={data.spiritual} 
          icon={Sparkles} 
          color="text-purple-500" 
        />
      </div>

      {/* MODAL D'AIDE : bg-white total pour bloquer la transparence */}
      {showHelp && !isEditMode && (
        <div className="absolute inset-0 bg-white z-[40] p-6 flex flex-col animate-in fade-in duration-200">
          <div className="flex justify-between items-center mb-4 shrink-0 border-b border-gray-50 pb-2">
            <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider">Détails du score</h4>
            <button 
              onClick={() => setShowHelp(false)} 
              className="text-gray-400 hover:text-gray-900 p-1" 
              type="button"
            >
              <X size={18} />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto pr-2 space-y-4 text-[11px] leading-relaxed text-gray-600 custom-scrollbar">
            <p>Ce score synthétise votre parcours sur les <strong>30 derniers jours</strong> :</p>
            
            <div className="space-y-4">
              <div>
                <p className="font-bold text-blue-600 uppercase text-[9px] mb-1 flex items-center gap-1">
                  <ShieldCheck size={10} /> Discipline
                </p>
                <p>Mesure la régularité de vos engagements (Pledges) quotidiens. Chaque jour validé augmente ce pilier.</p>
              </div>
              
              <div>
                <p className="font-bold text-rose-600 uppercase text-[9px] mb-1 flex items-center gap-1">
                  <Heart size={10} /> Mental
                </p>
                <p>Analyse votre stabilité émotionnelle via le journal. Les notes positives stabilisent ce score.</p>
              </div>
              
              <div>
                <p className="font-bold text-purple-600 uppercase text-[9px] mb-1 flex items-center gap-1">
                  <Sparkles size={10} /> Esprit
                </p>
                <p>Reflète votre connexion et vos demandes de soutien spirituel sur le mur communautaire.</p>
              </div>

              <div className="pt-2 border-t border-gray-100">
                <p className="italic text-[10px]">
                  Note : Le score global accorde une importance majeure (60%) à la Discipline quotidienne.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f9fafb;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e5e7eb;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #d4af37;
        }
      `}</style>
    </div>
  );
}

/**
 * Sous-composant pour les barres de progression
 */
function MiniStat({ label, val, icon: Icon, color }: { label: string, val: number, icon: LucideIcon, color: string }) {
  const bgColor = color.replace('text-', 'bg-');
  
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-1">
        <Icon size={10} className={cn("shrink-0", color)} />
        <span className="text-[8px] font-bold text-gray-400 uppercase truncate">{label}</span>
      </div>
      <div className="flex items-baseline gap-0.5">
        <span className="text-xs font-bold text-gray-700">{val}</span>
        <span className="text-[8px] text-gray-300">%</span>
      </div>
      <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
        <div 
          className={cn("h-full rounded-full transition-all duration-1000", bgColor)} 
          style={{ width: `${val}%` }} 
        />
      </div>
    </div>
  );
}