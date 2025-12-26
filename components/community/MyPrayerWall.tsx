"use client";

import { useState, useTransition } from "react";
import { Lock, Globe, Plus, MessageSquare, ChevronDown, ChevronUp, Trash2, Loader2 } from "lucide-react";
import { createPrayerRequest, MyRequestWithSupports, deletePrayerRequest } from "@/lib/actions/prayer-actions";
import { toast } from "sonner";

interface MyPrayerWallProps {
  initialData: MyRequestWithSupports[];
  isInCommunity: boolean;
}

export default function MyPrayerWall({ initialData, isInCommunity }: MyPrayerWallProps) {
  const [content, setContent] = useState("");
  const [isShared, setIsShared] = useState(false); // Par défaut privé
  const [isPending, startTransition] = useTransition();

  // Logique de blocage : On ne peut pas partager si on n'est pas dans le groupe
  const handleToggleVisibility = () => {
    if (!isInCommunity && !isShared) {
      toast.error("Rejoignez le groupe pour partager vos prières.", {
        description: "Allez dans l'onglet 'Groupe' pour activer l'accès."
      });
      return;
    }
    setIsShared(!isShared);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    startTransition(async () => {
      const result = await createPrayerRequest(content, isShared);
      if (result.success) {
        toast.success(isShared ? "Demande partagée au groupe" : "Note ajoutée à votre mur privé");
        setContent("");
        setIsShared(false); // Reset
      } else {
        toast.error("Erreur lors de la création");
      }
    });
  };

  return (
    <div className="space-y-8">
      
      {/* FORMULAIRE DE CRÉATION */}
      <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Plus size={18} className="text-blue-500" /> Nouvelle Prière
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Qu'avez-vous sur le cœur aujourd'hui ?"
            className="w-full bg-gray-50 border-0 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all h-32 resize-none"
            disabled={isPending}
          />
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            {/* Toggle Visibilité */}
            <div 
                className={`flex items-center gap-3 cursor-pointer bg-gray-50 px-3 py-2 rounded-xl border border-gray-200 transition-colors ${!isInCommunity ? 'opacity-70' : 'hover:bg-gray-100'}`}
                onClick={handleToggleVisibility}
            >
                <div className={`
                    w-10 h-6 rounded-full p-1 transition-colors duration-300 flex items-center
                    ${isShared ? 'bg-blue-500 justify-end' : 'bg-gray-300 justify-start'}
                `}>
                    <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
                </div>
                <span className="text-xs font-medium text-gray-600 flex items-center gap-2">
                    {isShared ? (
                        <><Globe size={14} className="text-blue-500"/> Visible par le groupe</>
                    ) : (
                        <><Lock size={14} className="text-gray-500"/> Privé (Moi uniquement)</>
                    )}
                </span>
            </div>

            <button
              type="submit"
              disabled={!content.trim() || isPending}
              className="w-full sm:w-auto bg-gray-900 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-black disabled:opacity-50 transition-all shadow-md active:scale-95"
            >
              {isPending ? "Enregistrement..." : "Enregistrer"}
            </button>
          </div>
        </form>
      </div>

      {/* LISTE DES PRIÈRES */}
      <div className="space-y-4">
        <h3 className="font-bold text-gray-900 px-2">Mon Historique (10 derniers)</h3>
        {initialData.length === 0 ? (
          <div className="text-center py-10 text-gray-400 text-sm">
            Votre mur est vide. Commencez par écrire une pensée.
          </div>
        ) : (
          initialData.map((item) => (
            <MyPrayerItem key={item.id} item={item} />
          ))
        )}
      </div>
    </div>
  );
}

// Sous-composant pour gérer l'affichage des réponses (Accordéon)
function MyPrayerItem({ item }: { item: MyRequestWithSupports }) {
    const [showSupports, setShowSupports] = useState(false);
    const [isDeleting, startDeleteTransition] = useTransition();
    const hasSupports = item.supports.length > 0;

    const handleDelete = () => {
        if (!confirm("Voulez-vous vraiment supprimer cette prière ?")) return;
        
        startDeleteTransition(async () => {
            const result = await deletePrayerRequest(item.id);
            if (result.success) {
                toast.success("Prière supprimée");
            } else {
                toast.error("Impossible de supprimer");
            }
        });
    };

    return (
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm relative group">
            {/* Badge Visibilité */}
            <div className={`absolute top-4 right-4 text-[10px] font-bold px-2 py-1 rounded-full border flex items-center gap-1
                ${item.is_shared 
                    ? 'bg-blue-50 text-blue-600 border-blue-100' 
                    : 'bg-gray-50 text-gray-500 border-gray-100'}
            `}>
                {item.is_shared ? <Globe size={10} /> : <Lock size={10} />}
                {item.is_shared ? 'Public' : 'Privé'}
            </div>

            <p className="text-xs text-gray-400 mb-2">
                {new Date(item.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', hour: '2-digit', minute:'2-digit' })}
            </p>
            
            <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap mb-4 pr-16">
                {item.content}
            </p>

            {/* Actions : Toggle Support / Supprimer */}
            <div className="border-t border-gray-50 pt-3 flex items-center justify-between">
                {item.is_shared ? (
                    <button 
                        disabled={!hasSupports}
                        onClick={() => setShowSupports(!showSupports)}
                        className={`flex items-center gap-2 text-xs font-bold transition-colors 
                            ${hasSupports ? 'text-purple-600 hover:text-purple-700' : 'text-gray-300 cursor-default'}
                        `}
                    >
                        <MessageSquare size={14} />
                        {item.supports.length} Message(s) de soutien
                        {hasSupports && (
                            showSupports ? <ChevronUp size={14}/> : <ChevronDown size={14}/>
                        )}
                    </button>
                ) : (
                    <span className="text-xs text-gray-300 italic">Visible uniquement par vous</span>
                )}

                {/* Bouton Supprimer */}
                <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                    title="Supprimer"
                >
                    {isDeleting ? <Loader2 size={14} className="animate-spin text-red-500"/> : <Trash2 size={14}/>}
                </button>
            </div>

            {/* Liste des messages reçus (Accordéon) */}
            {item.is_shared && showSupports && (
                <div className="mt-3 space-y-2 pl-4 border-l-2 border-purple-100 animate-in slide-in-from-top-2 fade-in">
                    {item.supports.map((support) => (
                        <div key={support.id} className="bg-purple-50/50 p-3 rounded-xl text-sm">
                            <div className="flex justify-between items-center mb-1">
                                <span className="font-bold text-purple-700 text-xs">
                                    {support.supporter?.username || "Un frère"}
                                </span>
                                <span className="text-[10px] text-purple-400">
                                   {new Date(support.created_at).toLocaleDateString()}
                                </span>
                            </div>
                            <p className="text-gray-700 text-xs italic">
                                &quot;{support.message}&quot;
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}