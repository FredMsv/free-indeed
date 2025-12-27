"use client";

import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { relapseSchema, RelapseInput } from "@/lib/validations/relapse";
import { declareRelapse } from "@/lib/actions/dashboard-actions";
import { toast } from "sonner";
import { Home, Briefcase, MapPin, Wine, Zap, Brain, Clock, MessageSquare, AlertTriangle, Smile } from "lucide-react";

type TriggerType = RelapseInput["trigger_type"];
type LocationType = RelapseInput["location"];
type PremeditationType = RelapseInput["premeditation_level"];

export default function RelapseForm({ onSuccess }: { onSuccess: () => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, setValue, control, formState: { errors } } = useForm<RelapseInput>({
    resolver: zodResolver(relapseSchema),
    defaultValues: {
      trigger_type: "stress",
      location: "maison",
      premeditation_level: "impulsif",
      context: ""
    }
  });

  const selectedTrigger = useWatch({ control, name: "trigger_type" });
  const selectedLocation = useWatch({ control, name: "location" });
  const selectedPremeditation = useWatch({ control, name: "premeditation_level" });

  const onSubmit = async (data: RelapseInput) => {
    setIsSubmitting(true);
    const result = await declareRelapse(data);
    setIsSubmitting(false);

    if (result.success) {
      toast.success("Analyse enregistrée. Relève-toi, demain est un nouveau jour.");
      onSuccess();
    } else {
      toast.error(result.error || "Une erreur est survenue");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 text-gray-900">
      <div>
        <label className="text-sm font-semibold mb-3 flex items-center gap-2">
          <AlertTriangle size={16} className="text-gold" /> Pourquoi est-ce arrivé ?
        </label>
        <div className="grid grid-cols-3 gap-2">
          {(["stress", "ennui", "solitude", "fatigue", "colere", "autre"] as const).map((id) => {
            const labels: Record<TriggerType, { label: string; icon: typeof Zap }> = {
              stress: { label: "Stress", icon: Zap },
              ennui: { label: "Ennui", icon: Clock },
              solitude: { label: "Solitude", icon: MessageSquare },
              fatigue: { label: "Fatigue", icon: Clock },
              colere: { label: "Colère", icon: AlertTriangle },
              autre: { label: "Autre", icon: Smile },
            };
            const ItemIcon = labels[id].icon;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setValue("trigger_type", id)}
                className={`flex flex-col items-center p-3 rounded-xl border-2 transition-all ${
                  selectedTrigger === id ? "border-gold bg-gold/5 text-gold" : "border-gray-100 text-gray-500"
                }`}
              >
                <ItemIcon size={20} className="mb-1" />
                <span className="text-xs font-medium">{labels[id].label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label className="text-sm font-semibold mb-3 flex items-center gap-2">
          <MapPin size={16} className="text-gold" /> Où étais-tu ?
        </label>
        <div className="grid grid-cols-2 gap-2">
          {(["maison", "travail", "exterieur", "soiree"] as const).map((id) => {
            const labels: Record<LocationType, { label: string; icon: typeof Home }> = {
              maison: { label: "À la maison", icon: Home },
              travail: { label: "Travail", icon: Briefcase },
              exterieur: { label: "Extérieur", icon: MapPin },
              soiree: { label: "En soirée", icon: Wine },
            };
            const ItemIcon = labels[id].icon;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setValue("location", id)}
                className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
                  selectedLocation === id ? "border-gold bg-gold/5 text-gold" : "border-gray-100 text-gray-500"
                }`}
              >
                <ItemIcon size={18} />
                <span className="text-sm font-medium">{labels[id].label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label className="text-sm font-semibold mb-3 flex items-center gap-2">
          <Brain size={16} className="text-gold" /> État d&apos;esprit
        </label>
        <div className="flex flex-col gap-2">
          {(["impulsif", "reflechi", "lutte_longue"] as const).map((id) => {
            const labels: Record<PremeditationType, { label: string; desc: string }> = {
              impulsif: { label: "Soudain (Impulsif)", desc: "Pas vu venir" },
              reflechi: { label: "J'y pensais un peu", desc: "La pensée tournait" },
              lutte_longue: { label: "Longue lutte", desc: "J'ai essayé de résister" },
            };
            return (
              <button
                key={id}
                type="button"
                onClick={() => setValue("premeditation_level", id)}
                className={`flex flex-col items-start p-3 rounded-xl border-2 transition-all ${
                  selectedPremeditation === id ? "border-gold bg-gold/5 text-gold" : "border-gray-100 text-gray-500"
                }`}
              >
                <span className="text-sm font-bold">{labels[id].label}</span>
                <span className="text-[10px] opacity-70">{labels[id].desc}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-1">
        <textarea
            {...register("context")}
            placeholder="Décris le contexte..."
            className={`w-full p-3 rounded-xl border-2 h-24 focus:outline-none transition-colors ${errors.context ? 'border-red-300' : 'border-gray-100 focus:border-gold'}`}
        />
        {errors.context && <p className="text-xs text-red-500 font-medium">{errors.context.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-gray-900 text-white font-bold py-4 rounded-xl disabled:opacity-50 hover:bg-black transition-colors"
      >
        {isSubmitting ? "Enregistrement..." : "Valider l'analyse"}
      </button>
    </form>
  );
}