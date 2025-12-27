export type StatsPeriod = '7d' | '30d' | '1y';

/**
 * Représentation de la vue matérialisée en base de données.
 * Ajouté pour corriger l'erreur TS2305 dans stats-actions.ts.
 */
export interface UserStatsDailyView {
  user_id: string;
  stat_date: string;
  pledge_count: number;
  relapse_count: number;
  monthly_gain_1: number;
  monthly_gain_2: number;
  journal_count: number;
  mood_entries_count: number;
}

export interface DayChartEntry {
  date: string;
  val1: number;
  val2: number;
  status: 1 | -1 | 0;
  moodScore: number;
}

export interface ContextAnalysis {
  victory: number;
  struggle: number;
  relapse: number;
  gratitude: number;
  note: number;
}

export interface UserHabits {
  emotional_triggers: string[];
  context_habits: string[];
  specific_behaviors: string[];
}

export interface AddictionTypeInfo {
  name: string;
}

export interface ProfileWithDetails {
  daily_value_1: number | null;
  daily_value_2: number | null;
  habits: UserHabits | null;
  addiction_types: AddictionTypeInfo | null;
}

export interface StatsDashboardData {
  chartData: DayChartEntry[];
  kpi: {
    successRate: number;
    totalSaved1: number;
    totalSaved2: number;
    unit1: string;
    unit2: string;
    prayersAsked: number;
    contextCounts: ContextAnalysis;
  };
  userHabits: UserHabits;
}