"use client";

import { Wallet, Activity, Minus, Clock, Hourglass, Brain, Smartphone, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

const getIcon = (iconName: string) => {
  switch (iconName) {
    case 'wallet': return <Wallet size={20} />;
    case 'activity': return <Activity size={20} />;
    case 'clock': return <Clock size={20} />;
    case 'hourglass': return <Hourglass size={20} />;
    case 'brain': return <Brain size={20} />;
    // ✅ CORRECTION ICI : Smartphone au lieu de SmartphoneOff
    case 'smartphone-off': return <Smartphone size={20} />;
    case 'zap': return <Zap size={20} />;
    default: return <Activity size={20} />;
  }
};

interface StatsWidgetProps {
  data: {
    label1: string; value1: string; unit1: string; icon1: string;
    label2: string; value2: string; unit2: string; icon2: string;
  };
  isEditMode?: boolean;
  onDelete?: () => void;
}

export default function StatsWidget({ data, isEditMode = false, onDelete }: StatsWidgetProps) {
  const safeData = data || {
    label1: "-", value1: "0", unit1: "", icon1: "activity",
    label2: "-", value2: "0", unit2: "", icon2: "activity"
  };

  return (
    <div className={cn(
      "bg-white border border-gray-100 shadow-sm flex flex-col h-full relative overflow-hidden p-6 rounded-2xl justify-center"
    )}>
      
      <div className="absolute top-0 left-0 w-full h-1 bg-yellow-500"></div>

      {isEditMode && onDelete && (
        <button 
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            className="absolute top-6 right-6 z-50 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-md hover:bg-red-600 hover:scale-110 transition-all animate-in zoom-in duration-200"
            title="Supprimer"
        >
            <Minus size={16} strokeWidth={4} />
        </button>
      )}

      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 shrink-0">
            {getIcon(safeData.icon1)}
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">
              {safeData.value1}<span className="text-sm ml-0.5 align-baseline">{safeData.unit1}</span>
            </p>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{safeData.label1}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
            {getIcon(safeData.icon2)}
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">
              {safeData.value2}<span className="text-sm ml-0.5 align-baseline">{safeData.unit2}</span>
            </p>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{safeData.label2}</p>
          </div>
        </div>
      </div>
    </div>
  );
}