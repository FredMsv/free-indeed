"use server";

import { createClient } from "@/lib/supabase/server";
import { DAILY_VERSES } from "@/lib/constants/daily-verses"; // Fallback

export interface Verse {
  text: string;
  reference: string;
}

export async function getDynamicVerse(addictionName: string): Promise<Verse> {
  const supabase = await createClient();
  const norm = addictionName.toUpperCase();
  
  // 1. Déterminer la catégorie
  let category = 'DEFAULT';
  if (norm.includes('TABAC')) category = 'TABAC';
  else if (norm.includes('ALCOOL')) category = 'ALCOOL';
  else if (norm.includes('PORNO')) category = 'PORNO';
  else if (norm.includes('ECRAN')) category = 'ECRANS';

  try {
    // 2. Récupérer TOUS les versets de la catégorie
    // ✅ CORRECTION : On utilise const pour la réponse initiale
    const { data: initialVerses, error } = await supabase
      .from('verses')
      .select('content, reference')
      .eq('category', category);

    // ✅ On crée une variable mutable 'verses' initialisée avec les données reçues
    let verses = initialVerses;

    // Si pas de verset trouvé pour cette catégorie ou erreur, on tente le DEFAULT de la DB
    if (error || !verses || verses.length === 0) {
       const { data: defaultVerses } = await supabase
        .from('verses')
        .select('content, reference')
        .eq('category', 'DEFAULT');
       verses = defaultVerses;
    }

    // 3. Fallback sur le fichier statique si la DB est vide ou inaccessible
    if (!verses || verses.length === 0) {
       // Conversion du format static au format {text, reference}
       const staticList = DAILY_VERSES[category] || DAILY_VERSES['DEFAULT'];
       return staticList[getDayIndex(staticList.length)];
    }

    // 4. Logique de rotation quotidienne (Stable sur 24h)
    const index = getDayIndex(verses.length);
    const selected = verses[index];

    return {
        text: selected.content,
        reference: selected.reference
    };

  } catch (error) {
    console.error("Erreur fetch verse:", error);
    // Dernier recours absolu
    return DAILY_VERSES['DEFAULT'][0];
  }
}

// Helper pour obtenir un index stable basé sur le jour de l'année
function getDayIndex(length: number): number {
    if (length === 0) return 0;
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now.getTime() - start.getTime();
    const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
    return dayOfYear % length;
}