/**
 * Représentation TypeScript de la vue matérialisée `user_stats_daily`.
 */
export interface UserStatsDailyView {
    user_id: string;
    stat_date: string;
    pledge_count: number;
    journal_count: number;
    relapse_count: number;
    mood_entries_count: number;
  }
  
  /**
   * Format agrégé pour le frontend (StatsWidget).
   * Cette interface consolide les données de la vue pour l'affichage.
   */
  export interface DashboardStatsData {
    daysClean: number;
    moneySaved: number;
    timeSaved: number;
    
    // Nouveaux indicateurs dérivés de la vue
    pledgeRate: number; // Taux d'engagement
    journalRate: number; // Fréquence de journalisation
    
    // Métadonnées
    lastUpdate: string;
    currencyUnit: string;
    timeUnit: string;
  }