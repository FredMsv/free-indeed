"use client";

import { useState,  useTransition } from "react";
import { ChallengeWithStatus } from "@/lib/types/challenge";
import { joinChallenge, completeChallenge } from "@/lib/actions/challenge-actions";
import { Trophy, CheckCircle2, ArrowRight, BookOpen, Loader2, Lock, Clock } from "lucide-react";
import { toast } from "sonner";
import confetti from "canvas-confetti";

export default function ChallengeCard({ challenge }: { challenge: ChallengeWithStatus }) {
  const [isPending, startTransition] = useTransition();
  const [isMounted] = useState(false);

  // Removed useEffect and isMounted as per React best practices.
  // If you need to check for client-side only code, consider alternatives such as checking for window or lazy-loading.
  // Simply proceed to define the handleJoin function.

  const handleJoin = () => {
    startTransition(async () => {
        const res = await joinChallenge(challenge.id);
        if (res.success) toast.success("Défi accepté ! C'est parti.");
        else toast.error("Erreur");
    });
  };

  const handleComplete = () => {
    startTransition(async () => {
        const res = await completeChallenge(challenge.id);
        if (res.success) {
            confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
            toast.success("Félicitations ! Défi validé.");
        } else toast.error("Erreur");
    });
  };

  const isTransversal = !challenge.addiction_type_id;
  const isLocked = challenge.userStatus === 'locked';

  // Calcul du temps restant basé sur la donnée serveur (unlockedAt)
  let diffDays = 0;
  if (isLocked && isMounted) {
      const unlockDate = new Date(challenge.unlockedAt);
      const now = new Date();
      const diffTime = unlockDate.getTime() - now.getTime();
      diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  return (
    <div className={`bg-white rounded-3xl border shadow-xl overflow-hidden relative transition-all ${isLocked ? 'border-gray-200 grayscale-[0.5] opacity-90' : 'border-gray-100'}`}>
      
      {/* Badge Type */}
      <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
          isTransversal ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
      }`}>
          {isTransversal ? "Défi Commun" : "Défi Spécifique"}
      </div>

      {/* OVERLAY DE VERROUILLAGE */}
      {isLocked && (
        <div className="absolute inset-0 z-20 bg-white/60 backdrop-blur-[2px] flex flex-col items-center justify-center text-center p-6">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400 shadow-inner">
                <Lock size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Prochain niveau verrouillé</h3>
            <p className="text-gray-500 text-sm max-w-xs mb-6">
                Prenez le temps d&apos;assimiler la victoire précédente. La croissance demande du temps.
            </p>
            {isMounted && (
                <div className="bg-white border border-gray-200 px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-bold text-blue-600 shadow-sm animate-in fade-in">
                    <Clock size={16} />
                    Disponible dans {diffDays} jour{diffDays > 1 ? 's' : ''}
                </div>
            )}
        </div>
      )}

      <div className="p-8">
        <div className="w-16 h-16 bg-yellow-50 rounded-2xl flex items-center justify-center mb-6 text-yellow-600">
            <Trophy size={32} />
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-2">{challenge.title}</h2>
        
        <p className={`text-gray-600 leading-relaxed mb-6 ${isLocked ? 'blur-[3px] select-none' : ''}`}>
            {challenge.description}
        </p>

        {challenge.scripture_text && (
            <div className={`bg-gray-50 p-4 rounded-xl border border-gray-100 mb-6 italic text-gray-600 text-sm flex gap-3 ${isLocked ? 'blur-[3px] select-none' : ''}`}>
                 <BookOpen size={18} className="flex-shrink-0 text-gray-400 mt-0.5" />
                <div>
                    &quot;{challenge.scripture_text}&quot;
                    <div className="text-xs font-bold text-gray-400 mt-1 not-italic">— {challenge.scripture_reference}</div>
                </div>
            </div>
        )}

        <div className={`flex items-center gap-4 bg-green-50 p-4 rounded-xl border border-green-100 text-green-800 text-sm font-medium mb-8 ${isLocked ? 'blur-[3px] select-none' : ''}`}>
            <CheckCircle2 size={20} className="flex-shrink-0" />
            Objectif : {challenge.action_text}
        </div>

        {/* Actions */}
        <div className="flex justify-end">
            {challenge.userStatus === 'none' && !isLocked && (
                <button 
                    onClick={handleJoin} disabled={isPending}
                    className="bg-gray-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-black transition-all flex items-center gap-2"
                >
                    {isPending ? <Loader2 className="animate-spin" /> : <>Relever le défi <ArrowRight size={18} /></>}
                </button>
            )}

            {challenge.userStatus === 'joined' && (
                <button 
                    onClick={handleComplete} disabled={isPending}
                    className="bg-green-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-green-700 transition-all flex items-center gap-2 shadow-lg shadow-green-200"
                >
                    {isPending ? <Loader2 className="animate-spin" /> : <>Je l&apos;ai fait ! <CheckCircle2 size={18} /></>}
                </button>
            )}

            {challenge.userStatus === 'completed' && (
                <div className="flex items-center gap-2 text-green-600 font-bold bg-green-50 px-4 py-2 rounded-lg">
                    <Trophy size={18} /> Défi validé
                </div>
            )}
        </div>
      </div>
    </div>
  );
}