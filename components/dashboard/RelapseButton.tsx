"use client";

import { useState } from "react";
import { handleRelapse } from "@/lib/actions/dashboard-actions";
import { RefreshCcw, AlertTriangle, Loader2, X } from "lucide-react";
import { toast } from "sonner";

export function RelapseButton() {
  const [isConfirming, setIsConfirming] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onRelapse = async () => {
    setIsLoading(true);
    try {
      const result = await handleRelapse();
      if (result.success) {
        toast.success("Nouveau départ ! Courage, chaque jour est une victoire.");
        setIsConfirming(false);
      } else {
        toast.error("Erreur lors de la réinitialisation.");
      }
    } catch (error) {
      console.error("Erreur lors de l'opération :", error);
      toast.error("Une erreur est survenue.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isConfirming) {
    return (
      <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-2">
        <button
          disabled={isLoading}
          onClick={onRelapse}
          className="bg-red-500 hover:bg-red-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-all shadow-sm"
        >
          {isLoading ? (
            <Loader2 size={12} className="animate-spin" />
          ) : (
            <AlertTriangle size={12} />
          )}
          Confirmer la rechute
        </button>
        <button
          onClick={() => setIsConfirming(false)}
          className="p-1.5 hover:bg-gray-100 rounded-full text-gray-400 transition-colors"
        >
          <X size={14} />
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setIsConfirming(true)}
      className="text-gray-300 hover:text-red-400 transition-colors p-1.5 rounded-full"
      title="Déclarer une rechute"
    >
<RefreshCcw size={16} />
    </button>
  );
}