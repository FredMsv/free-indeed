import { LucideIcon } from 'lucide-react';

export interface RiskFactor {
  label: string;
  intensity: 'low' | 'medium' | 'high';
  description: string;
}

export interface PredictionInsight {
  score: number;
  level: 'stable' | 'caution' | 'danger';
  factors: RiskFactor[];
  advice: string;
}

export interface GlobalHealthScore {
  total: number;
  constance: number;
  emotional: number;
  spiritual: number;
  trend: 'up' | 'down' | 'stable'; // Type restreint aux valeurs autorisées par le design
}

export interface EnrichedUserAnalytics {
  health: GlobalHealthScore;
  prediction: PredictionInsight;
  patterns: {
    topTriggerCombo: string;
    criticalWindow: string;
  };
}

export interface PilierMiniProps {
  label: string;
  value: number;
  icon: LucideIcon;
  color: string;
}