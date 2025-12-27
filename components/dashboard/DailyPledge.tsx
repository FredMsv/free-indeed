"use client";

import React, { useState } from "react";
import { ShieldCheck, Send, CheckCircle2 } from "lucide-react";
import { signPledge } from "@/lib/actions/dashboard-actions";
import { toast } from "sonner";

interface DailyPledgeProps {
  initialPledge: string | null;
  hasPledgedToday: boolean;
}

export default function DailyPledge({ initialPledge, hasPledgedToday }: DailyPledgeProps) {
  const [pledge, setPledge] = useState<string>(initialPledge || "");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(hasPledgedToday);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pledge.trim() || pledge.length < 3) {
      toast.error("Ton engagement est trop court pour être validé.");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await signPledge(pledge);
      if (result.success) {
        setIsSuccess(true);
        toast.success("Engagement enregistré pour aujourd&apos;hui !");
      } else {
        toast.error(result.error || "Une erreur est survenue.");
      }
    } catch (error) {
      console.error("Pledge Error:", error);
      toast.error("Impossible de signer l&apos;engagement.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-6 flex items-center gap-4">
        <div className="bg-white p-3 rounded-2xl shadow-sm">
          <CheckCircle2 className="text-emerald-500" size={24} />
        </div>
        <div>
          <h3 className="font-bold text-emerald-900">Engagement signé</h3>
          <p className="text-sm text-emerald-700 opacity-80">
            Tu as déclaré : &quot;{pledge}&quot;
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-gold/10 rounded-lg text-gold">
          <ShieldCheck size={20} />
        </div>
        <h3 className="font-bold text-gray-900 text-lg">Engagement du jour</h3>
      </div>

      <p className="text-sm text-gray-500 mb-6 leading-relaxed">
        Déclare ton intention pour les prochaines 24 heures. L&apos;engagement verbal renforce la volonté.
      </p>

      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={pledge}
          onChange={(e) => setPledge(e.target.value)}
          placeholder="Aujourd&apos;hui, je m&apos;engage à..."
          disabled={isSubmitting}
          className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 pl-5 pr-14 focus:border-gold focus:outline-none transition-all text-gray-900 placeholder:text-gray-400 font-medium"
        />
        <button
          type="submit"
          disabled={isSubmitting || !pledge.trim()}
          className="absolute right-2 top-2 bottom-2 px-4 bg-gray-900 text-white rounded-xl hover:bg-gold transition-all disabled:opacity-50 disabled:hover:bg-gray-900"
        >
          {isSubmitting ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Send size={18} />
          )}
        </button>
      </form>
      
      <p className="mt-4 text-[10px] text-center text-gray-400 uppercase tracking-widest font-bold">
        Un jour à la fois.
      </p>
    </div>
  );
}