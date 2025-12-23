"use client";

import { useState } from "react";
import { saveJournalEntry } from "@/lib/actions/journal-actions";
import { MOODS } from "@/lib/constants/moods";
import { Loader2, Save, Trophy, AlertTriangle, RefreshCcw, Heart, NotebookPen } from "lucide-react";
import { toast } from "sonner";

interface JournalFormProps {
  initialData?: { mood: string; content: string | null; context?: string | null };
}

// Liste des contextes
const CONTEXTS = [
  { id: 'victory', label: 'Victoire', icon: Trophy, color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200' },
  { id: 'struggle', label: 'Lutte', icon: AlertTriangle, color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200' },
  { id: 'relapse', label: 'Rechute', icon: RefreshCcw, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' },
  { id: 'gratitude', label: 'Gratitude', icon: Heart, color: 'text-pink-600', bg: 'bg-pink-50', border: 'border-pink-200' },
  { id: 'note', label: 'Note', icon: NotebookPen, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
];

export function JournalForm({ initialData }: JournalFormProps) {
  const [loading, setLoading] = useState(false);
  const [selectedMood, setSelectedMood] = useState(initialData?.mood || "neutral");
  const [selectedContext, setSelectedContext] = useState(initialData?.context || "note");
  const [content, setContent] = useState(initialData?.content || "");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("mood", selectedMood);
      formData.append("content", content);
      formData.append("context", selectedContext); // AJOUTÉ

      const result = await saveJournalEntry(formData);

      if (result.success) {
        toast.success("Note enregistrée !");
        setContent("");
        setSelectedMood("neutral");
        setSelectedContext("note");
      } else {
        toast.error("Erreur : " + (result.error || "Impossible de sauvegarder"));
      }
    } catch (err) {
      console.error("Erreur lors de l'opération :", err);
      toast.error("Une erreur réseau est survenue");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      
      {/* 1. SÉLECTEUR HUMEUR */}
      <div>
        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 block">Humeur</label>
        <div className="grid grid-cols-5 gap-1 sm:gap-2">
          {MOODS.map((mood) => {
            const isSelected = selectedMood === mood.id;
            return (
              <button 
                key={mood.id} 
                type="button" 
                disabled={loading}
                onClick={() => setSelectedMood(mood.id)} 
                className={`flex flex-col items-center p-2 rounded-xl border-2 transition-all ${
                  isSelected ? 'border-blue-500 bg-blue-50 scale-105 shadow-sm' : 'border-transparent bg-gray-50 opacity-70 hover:opacity-100'
                } disabled:cursor-not-allowed`}
              >
                <mood.icon className={`w-6 h-6 sm:w-7 sm:h-7 ${mood.color}`} />
                <span className="text-[9px] sm:text-[10px] font-bold mt-1 truncate w-full text-center">
                  {mood.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. SÉLECTEUR CONTEXTE (NOUVEAU) */}
      <div>
        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 block">Contexte</label>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {CONTEXTS.map((ctx) => {
            const isSelected = selectedContext === ctx.id;
            return (
              <button
                key={ctx.id}
                type="button"
                disabled={loading}
                onClick={() => setSelectedContext(ctx.id)}
                className={`
                  flex items-center mt-2 ml-2 gap-2 px-3 py-2 rounded-lg border text-xs font-bold transition-all whitespace-nowrap
                  ${isSelected 
                    ? `${ctx.bg} ${ctx.color} ${ctx.border} ring-1 ring-offset-1` 
                    : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'}
                `}
              >
                <ctx.icon size={14} />
                {ctx.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* 3. TEXTE */}
      <textarea 
        value={content} 
        onChange={(e) => setContent(e.target.value)} 
        disabled={loading}
        placeholder="Comment s'est passée ta journée ?" 
        className="w-full p-4 rounded-2xl bg-gray-50 border-none text-sm min-h-[150px] resize-none focus:ring-2 focus:ring-blue-500/20 text-gray-900 disabled:opacity-50" 
      />

      <button 
        type="submit" 
        disabled={loading || !content.trim()} 
        className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold text-sm hover:bg-black flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save size={18} />}
        Enregistrer
      </button>
    </form>
  );
}