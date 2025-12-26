import { BADGES } from "@/lib/constants/badges";
import { Lock } from "lucide-react";

interface BadgeGridProps {
  earnedBadges: { badge_code: string; created_at: string }[];
}

export default function BadgeGrid({ earnedBadges }: BadgeGridProps) {
  // Compter combien de fois chaque badge a été gagné
  const badgeCounts = earnedBadges.reduce((acc, curr) => {
    acc[curr.badge_code] = (acc[curr.badge_code] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
      {BADGES.map((badge) => {
        const count = badgeCounts[badge.code] || 0;
        const isEarned = count > 0;
        
        return (
          <div 
            key={badge.code}
            className={`flex flex-col items-center text-center p-3 rounded-2xl border transition-all relative
                ${isEarned 
                    ? `bg-white border-gray-100 shadow-sm transform hover:scale-105` 
                    : 'bg-gray-50 border-transparent opacity-60 grayscale'}
            `}
          >
            {/* Compteur pour les Stackable */}
            {isEarned && count > 1 && (
                <div className="absolute top-2 right-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white shadow-sm z-10">
                    x{count}
                </div>
            )}

            <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${isEarned ? badge.bg : 'bg-gray-200'}`}>
                {isEarned ? (
                    <badge.icon className={`w-6 h-6 ${badge.color}`} />
                ) : (
                    <Lock className="w-5 h-5 text-gray-400" />
                )}
            </div>
            
            <h4 className="text-xs font-bold text-gray-900 leading-tight mb-1">{badge.label}</h4>
            <p className="text-[9px] text-gray-500 hidden sm:block">{badge.description}</p>
          </div>
        );
      })}
    </div>
  );
}