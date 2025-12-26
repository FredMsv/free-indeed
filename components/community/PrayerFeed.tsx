"use client";

import { useState, useTransition } from "react";
import { Heart, Send, User, Clock } from "lucide-react";
import { PrayerRequestWithProfile, sendPrayerSupport } from "@/lib/actions/prayer-actions";
import { toast } from "sonner";

interface PrayerFeedProps {
  initialData: PrayerRequestWithProfile[];
}

export default function PrayerFeed({ initialData }: PrayerFeedProps) {
  const [requests] = useState(initialData);

  return (
    <div className="space-y-4">
      {requests.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-gray-200">
          <p className="text-gray-400">Aucune demande pour le moment.</p>
          <p className="text-sm text-gray-500">Soyez le premier à partager si vous en ressentez le besoin.</p>
        </div>
      ) : (
        requests.map((req) => (
          <PrayerCard key={req.id} request={req} />
        ))
      )}
    </div>
  );
}

// Sous-composant Carte pour isoler la logique de réponse de chaque item
function PrayerCard({ request }: { request: PrayerRequestWithProfile }) {
  const [isReplying, setIsReplying] = useState(false);
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();
  
  // État local pour gérer l'UI optimiste
  const [hasSupported, setHasSupported] = useState(false);

  const handleSupport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isPending) return;

    // 🚀 OPTIMISTIC UPDATE
    setHasSupported(true);
    setIsReplying(false);
    const previousMessage = message;
    setMessage(""); // Reset input

    startTransition(async () => {
      const result = await sendPrayerSupport(request.id, previousMessage);
      
      if (result.success) {
        toast.success("Votre soutien a été envoyé !");
      } else {
        // 🚨 ROLLBACK en cas d'erreur
        setHasSupported(false);
        setIsReplying(true);
        setMessage(previousMessage);
        toast.error("Erreur lors de l'envoi.");
      }
    });
  };

  return (
    <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      {/* Header Auteur */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
            {request.users?.avatar_url ? (
               // eslint-disable-next-line @next/next/no-img-element
               <img src={request.users.avatar_url} alt="Av" className="w-full h-full rounded-full object-cover"/>
            ) : (
              <User size={18} />
            )}
          </div>
          <div>
            <p className="font-bold text-gray-900 text-sm">{request.users?.username || "Membre"}</p>
            <p className="text-xs text-gray-400 flex items-center gap-1">
              <Clock size={10} />
              {new Date(request.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* Contenu */}
      <p className="text-gray-700 text-sm leading-relaxed mb-4 whitespace-pre-wrap">
        {request.content}
      </p>

      {/* Footer Actions */}
      <div className="border-t border-gray-50 pt-3 flex items-center justify-between">
        <div className="text-xs text-gray-400 font-medium">
            {request.support_count > 0 ? (
                <span className="flex items-center gap-1 text-purple-600">
                    <Heart size={12} className="fill-purple-600" /> {request.support_count} soutiens
                </span>
            ) : (
                "Soyez le premier à soutenir"
            )}
        </div>

        {!hasSupported ? (
            <button
            onClick={() => setIsReplying(!isReplying)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${
                isReplying 
                ? "bg-gray-100 text-gray-600" 
                : "bg-purple-50 text-purple-600 hover:bg-purple-100"
            }`}
            >
            <Heart size={14} className={isReplying ? "" : "animate-pulse"} />
            {isReplying ? "Annuler" : "Soutenir"}
            </button>
        ) : (
            <span className="text-xs font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-100 animate-in zoom-in">
                Soutien envoyé ✓
            </span>
        )}
      </div>

      {/* Zone de réponse */}
      {isReplying && !hasSupported && (
        <form onSubmit={handleSupport} className="mt-4 animate-in fade-in slide-in-from-top-2">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Écrivez un mot d'encouragement ou une prière..."
            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-purple-500 focus:bg-white outline-none transition-all resize-none h-24"
            disabled={isPending}
          />
          <div className="flex justify-end mt-2">
            <button
              type="submit"
              disabled={!message.trim() || isPending}
              className="bg-purple-600 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-purple-700 disabled:opacity-50 transition-all"
            >
              {isPending ? "Envoi..." : <>Envoyer <Send size={12} /></>}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}