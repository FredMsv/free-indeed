import { Laugh, Smile, Meh, Frown, Angry, LucideIcon } from "lucide-react";

export type MoodKey = 'happy' | 'calm' | 'neutral' | 'anxious' | 'angry';

export interface MoodConfig {
  id: MoodKey;
  value: number; // Indispensable pour le calcul de la moyenne
  icon: LucideIcon;
  color: string;
  bg: string;
  label: string;
}

export const MOODS: MoodConfig[] = [
  { id: 'happy', value: 5, icon: Laugh, color: 'text-green-500', bg: 'bg-green-50', label: 'Joyeux' },
  { id: 'calm', value: 4, icon: Smile, color: 'text-emerald-500', bg: 'bg-emerald-50', label: 'Calme' },
  { id: 'neutral', value: 3, icon: Meh, color: 'text-blue-500', bg: 'bg-blue-50', label: 'Neutre' },
  { id: 'anxious', value: 2, icon: Frown, color: 'text-orange-500', bg: 'bg-orange-50', label: 'Anxieux' },
  { id: 'angry', value: 1, icon: Angry, color: 'text-red-500', bg: 'bg-red-50', label: 'Coléreux' },
];

// Option A : Exporter MOOD_MAP pour corriger l'erreur de build directement
export const MOOD_MAP = MOODS.reduce((acc, mood) => {
  acc[mood.id] = mood;
  return acc;
}, {} as Record<string, MoodConfig>);

// Option B : Helper pour trouver l'humeur la plus proche d'une moyenne numérique
export const getMoodFromValue = (val: number): MoodConfig => {
  const rounded = Math.round(val);
  return MOODS.find(m => m.value === rounded) || MOODS[2]; // Retourne Neutre par défaut
};