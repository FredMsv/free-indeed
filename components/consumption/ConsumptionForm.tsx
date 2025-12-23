"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Save, Loader2, Euro, Clock, Activity, Cigarette, Beer } from "lucide-react";
import { updateConsumptionSettings } from "@/lib/actions/settings-actions";

interface ConsumptionFormProps {
  initialValue1: number;
  initialValue2: number;
  addictionName: string;
}

// Fonction utilitaire pour convertir Décimal -> [Heures, Minutes]
// Ex: 1.5 -> [1, 30]
const decimalToTime = (decimal: number) => {
  const hours = Math.floor(decimal || 0);
  const minutes = Math.round((decimal - hours) * 60);
  return { hours, minutes };
};

export default function ConsumptionForm({ initialValue1, initialValue2, addictionName }: ConsumptionFormProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const norm = addictionName.toUpperCase();

  // --- CONFIGURATION DU FORMULAIRE SELON L'ADDICTION ---
  let config = {
    // Par défaut (Mode Argent)
    isTime1: false,
    label1: "Coût journalier (€)",
    placeholder1: "10",
    icon1: Euro,
    
    isTime2: false,
    label2: "Quantité / Calories",
    placeholder2: "0",
    icon2: Activity,
    
    desc: "Aidez-nous à calculer vos économies."
  };

  if (norm.includes('TABAC') || norm.includes('TOBACCO')) {
    config = {
      isTime1: false,
      label1: "Prix moyen du paquet (€)",
      placeholder1: "12.50",
      icon1: Euro,
      isTime2: false,
      label2: "Cigarettes fumées par jour",
      placeholder2: "15",
      icon2: Cigarette,
      desc: "Nous calculerons l'argent économisé et la vie gagnée."
    };
  } else if (norm.includes('PORNO') || norm.includes('SEX')) {
    config = {
      isTime1: true, // ✅ Mode Temps activé
      label1: "Temps perdu par jour",
      placeholder1: "",
      icon1: Clock,
      isTime2: false,
      label2: "Niveau de confiance (0-10)",
      placeholder2: "5",
      icon2: Activity,
      desc: "Nous suivrons le temps de vie que vous récupérez."
    };
  } else if (norm.includes('SOCIAL') || norm.includes('ECRAN')) {
    config = {
      isTime1: true, // ✅ Mode Temps activé
      label1: "Temps d'écran moyen",
      placeholder1: "",
      icon1: Clock,
      isTime2: true, // ✅ Mode Temps activé aussi pour la productivité
      label2: "Dont temps productif estimé",
      placeholder2: "",
      icon2: Activity,
      desc: "Transformez ce temps perdu en temps productif."
    };
  } else if (norm.includes('ALCOOL')) {
     config = {
      isTime1: false,
      label1: "Dépense moyenne par jour (€)",
      placeholder1: "8",
      icon1: Euro,
      isTime2: false,
      label2: "Calories estimées par jour",
      placeholder2: "400",
      icon2: Beer,
      desc: "Suivez vos économies financières et caloriques."
    };
  }

  // --- GESTION D'ÉTAT POUR LES CHAMPS TEMPS ---
  // On initialise les états seulement si c'est nécessaire, mais les hooks doivent être appelés inconditionnellement
  const t1 = decimalToTime(initialValue1);
  const [h1, setH1] = useState(t1.hours);
  const [m1, setM1] = useState(t1.minutes);

  const t2 = decimalToTime(initialValue2);
  const [h2, setH2] = useState(t2.hours);
  const [m2, setM2] = useState(t2.minutes);

  // Calcul dynamique des valeurs décimales pour les inputs cachés
  const calculatedValue1 = config.isTime1 ? (h1 + m1 / 60) : initialValue1;
  const calculatedValue2 = config.isTime2 ? (h2 + m2 / 60) : initialValue2;

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      // Si c'est un champ temps, on écrase la valeur du formData avec notre calcul
      if (config.isTime1) formData.set("dailyValue1", calculatedValue1.toString());
      if (config.isTime2) formData.set("dailyValue2", calculatedValue2.toString());

      const result = await updateConsumptionSettings(formData);
      if (result.success) {
        toast.success("Préférences sauvegardées !");
        router.refresh();
      } else {
        toast.error(result.error);
      }
    });
  };

  return (
    <form action={handleSubmit} className="space-y-6">
      
      <div className="bg-blue-50 text-blue-800 p-4 rounded-xl text-sm border border-blue-100 mb-6 flex gap-3">
        <div className="text-xl">ℹ️</div>
        <div>
           <strong>{config.desc}</strong><br/>
           Ces données servent uniquement à vos statistiques personnelles.
        </div>
      </div>

      {/* --- CHAMP 1 --- */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <config.icon1 size={16} className="text-gray-400" />
          {config.label1}
        </label>

        {config.isTime1 ? (
          // 🕒 MODE TEMPS (Heures + Minutes)
          <div className="flex gap-4">
             <div className="flex-1 relative">
                <input
                  type="number" min="0" value={h1} onChange={(e) => setH1(Number(e.target.value))}
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-gold focus:ring-2 focus:ring-gold/10 transition-all"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none">h</span>
             </div>
             <div className="flex-1 relative">
                <input
                  type="number" min="0" max="59" value={m1} onChange={(e) => setM1(Number(e.target.value))}
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-gold focus:ring-2 focus:ring-gold/10 transition-all"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none">min</span>
             </div>
             {/* Input caché pour l'envoi au serveur */}
             <input type="hidden" name="dailyValue1" value={calculatedValue1} />
          </div>
        ) : (
          // 🔢 MODE NOMBRE CLASSIQUE
          <input
            name="dailyValue1"
            type="number"
            step="0.01"
            defaultValue={initialValue1 || ''}
            placeholder={config.placeholder1}
            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-gold focus:ring-2 focus:ring-gold/10 transition-all"
          />
        )}
      </div>

      {/* --- CHAMP 2 --- */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <config.icon2 size={16} className="text-gray-400" />
          {config.label2}
        </label>

        {config.isTime2 ? (
          // 🕒 MODE TEMPS (Heures + Minutes)
          <div className="flex gap-4">
             <div className="flex-1 relative">
                <input
                  type="number" min="0" value={h2} onChange={(e) => setH2(Number(e.target.value))}
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-gold focus:ring-2 focus:ring-gold/10 transition-all"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none">h</span>
             </div>
             <div className="flex-1 relative">
                <input
                  type="number" min="0" max="59" value={m2} onChange={(e) => setM2(Number(e.target.value))}
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-gold focus:ring-2 focus:ring-gold/10 transition-all"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none">min</span>
             </div>
             <input type="hidden" name="dailyValue2" value={calculatedValue2} />
          </div>
        ) : (
          // 🔢 MODE NOMBRE CLASSIQUE
          <input
            name="dailyValue2"
            type="number"
            step="0.1"
            defaultValue={initialValue2 || ''}
            placeholder={config.placeholder2}
            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-gold focus:ring-2 focus:ring-gold/10 transition-all"
          />
        )}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-gray-900 text-white font-medium py-3 rounded-xl hover:bg-black transition-colors flex items-center justify-center gap-2 shadow-lg shadow-gray-200"
      >
        {isPending ? <Loader2 className="animate-spin" /> : <Save size={18} />}
        Enregistrer les paramètres
      </button>
    </form>
  );
}