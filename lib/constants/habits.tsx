import { 
    Zap, Hourglass, User, CloudRain, Flame, Trophy, BatteryLow, Moon, 
    Sun, Utensils, Coffee, Sunset, Calendar, Users, Lock,
    Wine, EyeOff, UserMinus, Car, Clock, CreditCard, AlertTriangle, 
    Smartphone, Scale, Gamepad2, Cookie, Heart, Banknote, MessageSquareX, Frown,
    LucideIcon 
  } from 'lucide-react';
  
  // Type pour nos objets d'habitudes
  export type HabitOption = {
    id: string;
    label: string;
    icon: LucideIcon; // On stocke le composant directement
  };
  
  export const EMOTIONAL_TRIGGERS: HabitOption[] = [
    { id: 'stress', label: 'Stress / Anxiété', icon: Zap },
    { id: 'boredom', label: 'Ennui', icon: Hourglass },
    { id: 'loneliness', label: 'Solitude', icon: User },
    { id: 'sadness', label: 'Tristesse / Déprime', icon: CloudRain },
    { id: 'anger', label: 'Colère / Frustration', icon: Flame },
    { id: 'reward', label: 'Récompense / Célébration', icon: Trophy },
    { id: 'fatigue', label: 'Fatigue / Épuisement', icon: BatteryLow },
    { id: 'insomnia', label: 'Insomnie', icon: Moon },
  ];
  
  export const CONTEXT_HABITS: HabitOption[] = [
    { id: 'morning', label: 'Dès le réveil', icon: Sun },
    { id: 'meals', label: 'Après les repas', icon: Utensils },
    { id: 'work_break', label: 'Pauses au travail', icon: Coffee },
    { id: 'evening', label: 'Le soir (Détente)', icon: Sunset },
    { id: 'night', label: 'La nuit (Cachette)', icon: Moon },
    { id: 'weekend', label: 'Le week-end (Festif)', icon: Calendar },
    { id: 'social', label: 'En groupe / Soirée', icon: Users },
    { id: 'alone', label: 'Seul(e) / Isolé(e)', icon: Lock },
  ];
  
  export const SPECIFIC_BEHAVIORS: Record<string, HabitOption[]> = {
    'Alcool': [
      { id: 'binge', label: 'Binge drinking (Vitesse)', icon: Wine },
      { id: 'blackout', label: 'Jusqu\'au trou noir', icon: EyeOff },
      { id: 'solo', label: 'Boire seul en cachette', icon: UserMinus },
      { id: 'morning_drink', label: 'Besoin le matin', icon: Sun },
    ],
    'Tabac / Cigarette': [
      { id: 'coffee', label: 'Avec le café', icon: Coffee },
      { id: 'drive', label: 'En conduisant', icon: Car },
      { id: 'social_smoke', label: 'Pause collègues', icon: Users },
      { id: 'waiting', label: 'En attendant (Bus, RDV)', icon: Clock },
    ],
    'Pornographie': [
      { id: 'binge_watch', label: 'Sessions répétées', icon: Hourglass },
      { id: 'spending', label: 'Achat de contenu /abonnements', icon: CreditCard },
      { id: 'risk', label: 'Exhibitionnisme (Public)', icon: AlertTriangle },
      { id: 'insomnia_p', label: 'Détente pour réussir à dormir', icon: Moon },
    ],
    'Écrans / Réseaux': [
      { id: 'doomscrolling', label: 'Scroll infini', icon: Smartphone },
      { id: 'procrastination', label: 'Procrastination', icon: Clock },
      { id: 'comparison', label: 'Comparaison sociale', icon: Scale },
      { id: 'gaming', label: 'Sessions nocturnes', icon: Gamepad2 },
    ],
    'Nourriture': [
      { id: 'binge_eating', label: 'Hyperphagie (Gaver)', icon: Utensils },
      { id: 'sugar', label: 'Addiction au sucre', icon: Cookie },
      { id: 'night_snack', label: 'Grignotage', icon: Moon },
      { id: 'emotional_eat', label: 'Boulimie (Emotions)', icon: Heart },
    ],
    'default': [
      { id: 'money', label: 'Problèmes financiers', icon: Banknote },
      { id: 'lies', label: 'Mensonges aux proches', icon: MessageSquareX },
      { id: 'isolation', label: 'Isolement social', icon: UserMinus },
      { id: 'regret', label: 'Culpabilité immédiate', icon: Frown },
    ]
  };