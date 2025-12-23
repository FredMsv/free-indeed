import { DAILY_VERSES, BibleVerse } from '../constants/daily-verses';

export function getVerseForTheDay(addictionName: string): BibleVerse {
  const norm = addictionName.toUpperCase();
  let category = 'DEFAULT';

  if (norm.includes('TABAC')) category = 'TABAC';
  else if (norm.includes('ALCOOL')) category = 'ALCOOL';
  else if (norm.includes('PORNO')) category = 'PORNO';
  else if (norm.includes('ECRAN')) category = 'ECRANS';

  const verses = DAILY_VERSES[category];
  
  // Utilise le jour de l'année pour choisir l'index
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  const index = dayOfYear % verses.length;
  return verses[index];
}