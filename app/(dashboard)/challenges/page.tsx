import { getCurrentChallenge } from "@/lib/actions/challenge-actions";
import ChallengeCard from "@/components/challenges/ChallengeCard";
import { Mountain } from "lucide-react";

export default async function ChallengesPage() {
  const challenge = await getCurrentChallenge();

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
            <Mountain size={24} />
        </div>
        <div>
            <h1 className="text-2xl font-bold text-gray-900">Défi de la semaine</h1>
            <p className="text-gray-500 text-sm">Chaque semaine, une étape de plus vers la liberté.</p>
        </div>
      </div>

      {challenge ? (
        <ChallengeCard challenge={challenge} />
      ) : (
        <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-gray-200">
            <p className="text-gray-400">Aucun défi actif pour le moment.</p>
            <p className="text-sm text-gray-500 mt-1">Revenez lundi prochain !</p>
        </div>
      )}
    </div>
  );
}