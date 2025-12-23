"use client";

import { useState, useTransition, useEffect } from 'react';
import { CheckCircle2, Loader2, Check, RefreshCcw } from 'lucide-react';
import { toast } from 'sonner';
import confetti from 'canvas-confetti'; 
import { submitDailyPledge } from '@/lib/actions/pledge-actions';

interface DailyPledgeWidgetProps {
  initialHasPledged: boolean;
  isBroken: boolean; // NOUVEAU
}

export default function DailyPledgeWidget({ initialHasPledged, isBroken }: DailyPledgeWidgetProps) {
  // L'état local dépend de la prop initiale, mais aussi de l'état de rupture
  const [hasPledged, setHasPledged] = useState(initialHasPledged);
  const [isPending, startTransition] = useTransition();

  // Si on est "brisé", on considère visuellement qu'on n'a pas pledgé pour l'instant (pour réactiver le bouton)
  // Ou plutôt : le bouton change de fonction.
  
  // Sync avec les props si elles changent (après un router.refresh)
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
    // Si déjà pledgé ET pas brisé, on ne fait rien (bouton désactivé)
    if (hasPledged && !isBroken) return;

    startTransition(async () => {
      try {
        const result = await submitDailyPledge();
        
        if (result.success) {
          setHasPledged(true);
          
          if (isBroken) {
             toast.success("Série redémarrée ! Un nouveau départ.");
          } else {
             toast.success("Engagement validé ! Courage pour aujourd'hui 💪");
             try { triggerConfetti(); } catch (e) { console.error(e); }
          }
        } else {
          toast.error(result.error || "Une erreur est survenue");
        }
      } catch (error) {
        console.error("Erreur widget:", error);
        toast.error("Erreur de connexion");
      }
    });
  };

  // --- LOGIQUE D'AFFICHAGE ---
  // Cas 1 : Série Brisée (Prioritaire) -> Bouton de redémarrage
  if (isBroken) {
    return (
        <div className="p-6 rounded-3xl shadow-sm border border-orange-100 bg-orange-50/50 flex flex-col justify-between relative overflow-hidden h-full">
            <div>
                <div className="flex items-center gap-2 mb-4 text-orange-700">
                    <RefreshCcw size={24} />
                    <span className="font-bold">Série interrompue</span>
                </div>
                <p className="text-orange-800/70 text-sm leading-relaxed">
                    Une chute n&apos;est pas une fin. Relevez-vous maintenant et reprenez le combat.
                </p>
            </div>
            
            <button 
                onClick={handlePledge}
                disabled={isPending}
                className="mt-4 w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white transition-all shadow-md active:scale-[0.98]"
            >
                {isPending ? <Loader2 className="animate-spin" size={18} /> : "Redémarrer ma série"}
            </button>
        </div>
    );
  }

  // Cas 2 : Normal (Pledgé ou Pas encore)
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
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 animate-in zoom-in">
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
        {isPending ? (
          <Loader2 className="animate-spin" size={18} />
        ) : hasPledged ? (
          <>
            <Check size={18} /> Validé pour aujourd&apos;hui
          </>
        ) : (
          "Je valide mon engagement"
        )}
      </button>
    </div>
  );
}