"use client";

import { useState, useTransition } from 'react';
import { CheckCircle2, Loader2, Check } from 'lucide-react';
import { toast } from 'sonner';
import confetti from 'canvas-confetti'; 
import { submitDailyPledge } from '@/lib/actions/pledge-actions';

interface DailyPledgeWidgetProps {
  initialHasPledged: boolean;
}

export default function DailyPledgeWidget({ initialHasPledged }: DailyPledgeWidgetProps) {
  const [hasPledged, setHasPledged] = useState(initialHasPledged);
  const [isPending, startTransition] = useTransition();

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
    if (hasPledged) return;

    startTransition(async () => {
      try {
        const result = await submitDailyPledge();
        
        if (result.success) {
          setHasPledged(true);
          toast.success("Engagement validé ! Courage pour aujourd'hui 💪");
          
          // Déclenche l'animation
          try { triggerConfetti(); } catch (e) { console.error(e); }
        } else {
          toast.error(result.error || "Une erreur est survenue");
        }
      } catch (error) {
        console.error("Erreur widget:", error);
        toast.error("Erreur de connexion");
      }
    });
  };

  return (
    <div className={`
      p-6 rounded-2xl shadow-sm border transition-all duration-500 flex flex-col justify-between relative overflow-hidden
      ${hasPledged 
        ? 'bg-gradient-to-br from-gold/10 to-white border-gold/30' 
        : 'bg-white border-gray-100'}
    `}>
      
      {/* Contenu Texte + Icône */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          {hasPledged ? (
            <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center text-success animate-in zoom-in">
              <Check size={18} strokeWidth={3} />
            </div>
          ) : (
            <CheckCircle2 className="text-gray-400" size={24} />
          )}
          <span className={`font-semibold ${hasPledged ? 'text-gray-900' : 'text-gray-900'}`}>
            {hasPledged ? "Engagement validé" : "Engagement du jour"}
          </span>
        </div>
        
        <p className="text-gray-600 text-sm leading-relaxed">
          {hasPledged 
            ? "Vous avez pris l'engagement de rester libre aujourd'hui. Une promesse envers vous-même."
            : "Je m'engage à rester sobre aujourd'hui, peu importent les défis et les tentations."}
        </p>
      </div>

      {/* Bouton d'action */}
      <button 
        onClick={handlePledge}
        disabled={hasPledged || isPending}
        className={`
          mt-6 w-full py-3 rounded-xl font-medium transition-all text-sm flex items-center justify-center gap-2
          ${hasPledged
            ? 'bg-success text-white cursor-default shadow-sm'
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