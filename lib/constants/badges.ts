import { 
    Flame, Shield, Heart, BookOpen, 
    Users, Crown, Star, Sun, Mountain, 
    LucideIcon
  } from "lucide-react";
  
  export interface BadgeDef {
    code: string;
    category: 'sobriety' | 'resilience' | 'journal' | 'prayer_personal' | 'prayer_support' | 'challenge';
    type: 'unique' | 'stackable'; // ✅ NOUVEAU
    label: string;
    description: string;
    icon: LucideIcon; 
    color: string;
    bg: string;
    threshold: number;
  }
  
  export const BADGES: BadgeDef[] = [
    // --- SOBRIÉTÉ (Uniques) ---
    { code: 'sobriety_1', category: 'sobriety', type: 'unique', threshold: 1, label: 'Premier Pas', description: '24h de liberté.', icon: Sun, color: 'text-blue-500', bg: 'bg-blue-100' },
    { code: 'sobriety_7', category: 'sobriety', type: 'unique', threshold: 7, label: 'Semaine Propre', description: '7 jours de victoire.', icon: Shield, color: 'text-indigo-500', bg: 'bg-indigo-100' },
    { code: 'sobriety_30', category: 'sobriety', type: 'unique', threshold: 30, label: 'Mois de Liberté', description: '30 jours. Une nouvelle habitude.', icon: Star, color: 'text-purple-500', bg: 'bg-purple-100' },
    { code: 'sobriety_90', category: 'sobriety', type: 'unique', threshold: 90, label: 'Nouvelle Vie', description: '90 jours. Le cerveau guérit.', icon: Crown, color: 'text-gold', bg: 'bg-gold/20' },
  
    // --- RÉSILIENCE (Cumulable) ---
    { code: 'phoenix', category: 'resilience', type: 'stackable', threshold: 1, label: 'Phénix', description: 'S\'être relevé après une chute.', icon: Flame, color: 'text-orange-500', bg: 'bg-orange-100' },
  
    // --- JOURNAL (Uniques - Paliers) ---
    { code: 'writer_1', category: 'journal', type: 'unique', threshold: 1, label: 'Introspection', description: 'Première note de journal.', icon: BookOpen, color: 'text-teal-500', bg: 'bg-teal-100' },
    { code: 'writer_10', category: 'journal', type: 'unique', threshold: 10, label: 'Chroniqueur', description: '10 entrées dans le journal.', icon: BookOpen, color: 'text-teal-600', bg: 'bg-teal-100' },
  
    // --- PRIÈRES PERSO (Uniques) ---
    { code: 'prayer_p_1', category: 'prayer_personal', type: 'unique', threshold: 1, label: 'Cœur Ouvert', description: 'Première prière déposée.', icon: Heart, color: 'text-pink-500', bg: 'bg-pink-100' },
    { code: 'prayer_p_10', category: 'prayer_personal', type: 'unique', threshold: 10, label: 'Fidèle', description: '10 prières personnelles.', icon: Heart, color: 'text-pink-600', bg: 'bg-pink-100' },
  
    // --- SOUTIEN (Uniques - Paliers) ---
    { code: 'support_first', category: 'prayer_support', type: 'unique', threshold: 1, label: 'Ami', description: 'Premier soutien envoyé.', icon: Users, color: 'text-green-500', bg: 'bg-green-100' },
    { code: 'support_10', category: 'prayer_support', type: 'unique', threshold: 10, label: 'Frère d\'Armes', description: '10 soutiens envoyés.', icon: Users, color: 'text-green-600', bg: 'bg-green-100' },
  
    // --- DÉFIS (Uniques) ---
    { code: 'challenge_ace', category: 'challenge', type: 'unique', threshold: 1, label: 'Challenger', description: 'Premier défi validé.', icon: Mountain, color: 'text-yellow-600', bg: 'bg-yellow-100' },
    { code: 'challenge_5', category: 'challenge', type: 'unique', threshold: 5, label: 'Grimpeur', description: '5 défis validés.', icon: Mountain, color: 'text-yellow-700', bg: 'bg-yellow-100' },
  ];