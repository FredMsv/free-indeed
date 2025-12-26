"use client";

import { useState } from "react";
import { AlertTriangle, Loader2, X } from "lucide-react";
import { declareRelapse } from "@/lib/actions/dashboard-actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function RelapseButton() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    mood_before: "",
    trigger_type: "",
    context: ""
  });

  const handleSubmit = async () => {
    if (!formData.mood_before || !formData.trigger_type) {
        toast.error("Merci de remplir l'humeur et le déclencheur.");
        return;
    }

    setLoading(true);
    try {
        const res = await declareRelapse(formData);
        if (res.success) {
            toast.success("Courage. C'est un nouveau départ.");
            setOpen(false);
            setFormData({ mood_before: "", trigger_type: "", context: "" });
            router.refresh();
        } else {
            toast.error("Erreur lors de la déclaration.");
        }
    } catch (error) {
        toast.error("Une erreur est survenue.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <>
      {/* BOUTON DÉCLENCHEUR */}
      <button 
        onClick={() => setOpen(true)}
        className="bg-red-50 text-red-600 border border-red-100 px-4 py-2 rounded-xl font-medium text-sm hover:bg-red-100 hover:border-red-200 transition-all flex items-center gap-2 shadow-sm"
      >
          <AlertTriangle size={16} />
          Signaler une rechute
      </button>

      {/* MODAL FAIT MAISON (Sans dépendance externe) */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Overlay flou */}
            <div 
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
                onClick={() => setOpen(false)}
            />
            
            {/* Contenu Modal */}
            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-start bg-gray-50/50">
                    <div>
                        <h2 className="text-lg font-bold text-red-600 flex items-center gap-2">
                            <AlertTriangle size={20} />
                            Déclarer une rechute
                        </h2>
                        <p className="text-xs text-gray-500 mt-1">
                            La transparence est la clé. Ce moment ne définit pas votre futur.
                        </p>
                    </div>
                    <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600">
                        <X size={20} />
                    </button>
                </div>

                {/* Formulaire */}
                <div className="p-6 space-y-4">
                    
                    {/* Select Humeur */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-700">Comment vous sentiez-vous avant ?</label>
                        <select 
                            className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-100"
                            value={formData.mood_before}
                            onChange={(e) => setFormData({...formData, mood_before: e.target.value})}
                        >
                            <option value="" disabled>Sélectionner une émotion</option>
                            <option value="stressed">Stressé(e)</option>
                            <option value="anxious">Anxieux(se)</option>
                            <option value="bored">Ennuyé(e)</option>
                            <option value="sad">Triste</option>
                            <option value="angry">En colère</option>
                            <option value="lonely">Seul(e)</option>
                            <option value="happy">Joyeux (Euphorie)</option>
                        </select>
                    </div>

                    {/* Select Déclencheur */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-700">Quel a été le déclencheur ?</label>
                        <select 
                            className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-100"
                            value={formData.trigger_type}
                            onChange={(e) => setFormData({...formData, trigger_type: e.target.value})}
                        >
                            <option value="" disabled>Sélectionner un déclencheur</option>
                            <option value="stress">Stress intense</option>
                            <option value="conflict">Conflit relationnel</option>
                            <option value="visual">Déclencheur visuel (Image/Film)</option>
                            <option value="insomnia">Insomnie / Fatigue</option>
                            <option value="urge">Pulsion soudaine</option>
                            <option value="opportunity">Occasion (Seul à la maison)</option>
                        </select>
                    </div>

                    {/* Textarea Contexte */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-700">Contexte (Optionnel)</label>
                        <textarea 
                            className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm min-h-[80px] focus:outline-none focus:ring-2 focus:ring-red-100 resize-none"
                            placeholder="Que s'est-il passé exactement ?" 
                            value={formData.context}
                            onChange={(e) => setFormData({...formData, context: e.target.value})}
                        />
                    </div>

                </div>

                {/* Footer Actions */}
                <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3">
                    <button 
                        onClick={() => setOpen(false)}
                        className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        Annuler
                    </button>
                    <button 
                        onClick={handleSubmit}
                        disabled={loading}
                        className="px-4 py-2 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-md shadow-red-200 transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                        {loading && <Loader2 className="animate-spin" size={16} />}
                        Confirmer le reset
                    </button>
                </div>
            </div>
        </div>
      )}
    </>
  );
}

// Petit composant helper pour remplacer SelectItem qui n'existe plus
function SelectItem({ value, children }: { value: string, children: React.ReactNode }) {
    return <option value={value}>{children}</option>;
}