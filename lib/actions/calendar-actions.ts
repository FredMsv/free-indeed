'use server'

import { createClient } from '@/lib/supabase/server';

export async function getMonthPledges(year: number, month: number) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return [];

  // Calcul des bornes du mois (Début -> Fin)
  // Note: month est 0-indexé en JS (0=Jan), mais 1-indexé souvent en SQL. 
  // Ici on construit des dates ISO strings pour comparer.
  
  const startDate = new Date(year, month, 1).toISOString().split('T')[0];
  const endDate = new Date(year, month + 1, 0).toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('daily_pledges')
    .select('pledge_date')
    .eq('user_id', user.id)
    .gte('pledge_date', startDate)
    .lte('pledge_date', endDate);

  if (error) {
    console.error("Erreur calendrier:", error);
    return [];
  }

  // On retourne juste un tableau de strings ["2023-12-01", "2023-12-02", ...]
  return data.map(row => row.pledge_date);
}