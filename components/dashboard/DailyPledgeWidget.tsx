"use client";

import { useState, useTransition, useEffect } from 'react';
import { CheckCircle2, Loader2, Check, RefreshCcw, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';
import { submitDailyPledge, repairStreakWithJoker } from '@/lib/actions/pledge-actions';

interface DailyPledgeWidgetProps {
  initialHasPledged: boolean;
  isBroken: boolean;
  isJokerAvailable?: boolean;
  previousStreak?: number; 
}

export default function DailyPledgeWidget({ 
    initialHasPledged, 
    isBroken, 
    isJokerAvailable = false,
    previousStreak = 0 
}: DailyPledgeWidgetProps) {
  
  const [hasPledged, setHasPledged] = useState(initialHasPledged);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setHasPledged(initialHasPledged);
  }, [initialHasPledged]);

  const triggerConfetti = () => {
    const end = Date.now() + 1000;
    const colors = ['#ffc300', '#ffffff'];
    (function frame() {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  };

  const handlePledge = () => {
    if (isPending || (hasPledged && !isBroken)) return;
    
    const previousState = hasPledged;
    setHasPledged(true);

    startTransition(async () => {
      try {
        const result = await submitDailyPledge();
        
        if (result.success) {
          if (isBroken) {
            toast.success("Série redémarrée ! Un nouveau départ.");
          } else {
            triggerConfetti();
            toast.success("Engagement validé ! Courage pour aujourd'hui 💪");
          }
        } else {
          setHasPledged(previousState);
          toast.error(result.error || "Une erreur est survenue, engagement annulé.");
        }
      } catch (error) {
        console.error("Erreur widget:", error);
        setHasPledged(previousState); 
        toast.error("Erreur de connexion");
      }
    });
  };

  const handleJoker = () => {
    if (!confirm("Utiliser votre Joker pour sauver votre série ? (Disponible tous les 40 jours)")) return;

    startTransition(async () => {
        try {
            const result = await repairStreakWithJoker();
            if (result.success) {
                triggerConfetti();
                toast.success("Série sauvée ! Le joker a été utilisé.");
            } else {
                toast.error(result.error || "Impossible d'utiliser le joker");
            }
        } catch (error) {
            toast.error("Erreur technique");
        }
    });
  };

  if (isBroken) {
    const canUseJoker = isJokerAvailable && previousStreak >= 20;

    return (
        <div className="p-6 rounded-3xl shadow-sm border border-orange-100 bg-orange-50/50 flex flex-col justify-between relative overflow-hidden h-full">
            <div>
                <div className="flex items-center gap-2 mb-4 text-orange-700">
                    <RefreshCcw size={24} />
                    <span className="font-bold">Série interrompue</span>
                </div>
                <p className="text-orange-800/70 text-sm leading-relaxed mb-4">
                    Une chute n&apos;est pas une fin. Relevez-vous maintenant.
                </p>
                
                {canUseJoker && (
                    <div 
                        onClick={!isPending ? handleJoker : undefined}
                        className="inline-flex items-center gap-2 text-purple-600 cursor-pointer hover:text-purple-700 transition-colors group mb-4"
                    >
                        <div className="animate-pulse bg-purple-100 p-1.5 rounded-full">
                            <Sparkles size={14} className="group-hover:rotate-12 transition-transform" />
                        </div>
                        <span className="text-xs font-bold underline decoration-purple-300 underline-offset-2">
                            {isPending ? "Traitement..." : "Sauver ma série (Joker)"}
                        </span>
                    </div>
                )}
            </div>
            
            <button 
                onClick={handlePledge}
                disabled={isPending}
                className="w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.98] bg-orange-500 hover:bg-orange-600 text-white"
            >
                {isPending ? <Loader2 className="animate-spin" size={18} /> : "Redémarrer à zéro"}
            </button>
        </div>
    );
  }

  return (
    <div className={`
      p-6 rounded-3xl shadow-sm border transition-all duration-500 flex flex-col justify-between relative overflow-hidden h-full
      ${hasPledged 
        ? 'bg-gradient-to-br from-gold/10 to-white border-gold/30' 
        : 'bg-white border-gray-100'}
    `}>
      
      <div>
        <div className="flex items-center gap-2 mb-4">
           {hasPledged ? (
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 animate-in zoom-in duration-300">
              <Check size={18} strokeWidth={3} />
            </div>
          ) : (
            <CheckCircle2 className="text-gray-400" size={24} />
          )}
           <span className="font-bold text-gray-900">
            {hasPledged ? "Engagement validé" : "Engagement du jour"}
          </span>
        </div>
        
        <p className="text-gray-600 text-sm leading-relaxed">
          {hasPledged 
            ? "Vous avez pris l'engagement de rester libre aujourd'hui. Une promesse envers vous-même."
            : "Je m'engage à rester sobre aujourd'hui, peu importent les défis et les tentations."}
        </p>
      </div>

      <button 
        onClick={handlePledge}
        disabled={hasPledged || isPending}
        className={`
          mt-6 w-full py-3 rounded-xl font-medium transition-all text-sm flex items-center justify-center gap-2
          ${hasPledged
            ? 'bg-green-500 text-white cursor-default shadow-sm'
            : 'bg-gray-50 hover:bg-gold hover:text-white text-gray-600 border border-gray-200 hover:border-gold hover:shadow-md active:scale-[0.98]'
          }
        `}
      >
        {hasPledged ? (
          <>
            <Check size={18} /> Validé pour aujourd&apos;hui
          </>
        ) : isPending ? (
          <Loader2 className="animate-spin" size={18} />
        ) : (
          "Je valide mon engagement"
        )}
      </button>
    </div>
  );
}