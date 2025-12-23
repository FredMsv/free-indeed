import { Laugh, Smile, Meh, Frown, Angry, LucideIcon } from "lucide-react";

export type MoodKey = 'happy' | 'calm' | 'neutral' | 'anxious' | 'angry';

export interface MoodConfig {
  id: MoodKey;
  icon: LucideIcon;
  color: string;
  bg: string;
  label: string;
}

export const MOODS: MoodConfig[] = [
  { id: 'happy', icon: Laugh, color: 'text-green-500', bg: 'bg-green-50', label: 'Joyeux' },
  { id: 'calm', icon: Smile, color: 'text-emerald-500', bg: 'bg-emerald-50', label: 'Calme' },
  { id: 'neutral', icon: Meh, color: 'text-blue-500', bg: 'bg-blue-50', label: 'Neutre' },
  { id: 'anxious', icon: Frown, color: 'text-orange-500', bg: 'bg-orange-50', label: 'Anxieux' },
  { id: 'angry', icon: Angry, color: 'text-red-500', bg: 'bg-red-50', label: 'Coléreux' },
];

export const MOOD_MAP = MOODS.reduce((acc, mood) => {
  acc[mood.id] = mood;
  return acc;
}, {} as Record<string, MoodConfig>);