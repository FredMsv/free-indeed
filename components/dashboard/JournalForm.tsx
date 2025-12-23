"use client";

import { useState } from "react";
import { saveJournalEntry } from "@/lib/actions/journal-actions";
import { MOODS } from "@/lib/constants/moods";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";

interface JournalFormProps {
  initialData?: { mood: string; content: string | null };
}

export function JournalForm({ initialData }: JournalFormProps) {
  const [loading, setLoading] = useState(false);
  const [selectedMood, setSelectedMood] = useState(initialData?.mood || "neutral");
  const [content, setContent] = useState(initialData?.content || "");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append("mood", selectedMood);
    formData.append("content", content);
    
    const result = await saveJournalEntry(formData);
    if (result.success) toast.success("Journal enregistré !");
    else toast.error("Erreur de sauvegarde");
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Container d'humeurs optimisé pour ne pas déborder */}
      <div className="grid grid-cols-5 gap-1 sm:gap-2">
        {MOODS.map((mood) => {
          const isSelected = selectedMood === mood.id;
          return (
            <button 
              key={mood.id} 
              type="button" 
              onClick={() => setSelectedMood(mood.id)} 
              className={`flex flex-col items-center p-2 rounded-xl border-2 transition-all ${
                isSelected ? 'border-blue-500 bg-blue-50 scale-105' : 'border-transparent bg-gray-50 opacity-70 hover:opacity-100'
              }`}
            >
              <mood.icon className={`w-6 h-6 sm:w-7 sm:h-7 ${mood.color}`} />
              <span className="text-[9px] sm:text-[10px] font-bold mt-1 truncate w-full text-center">
                {mood.label}
              </span>
            </button>
          );
        })}
      </div>

      <textarea 
        value={content} 
        onChange={(e) => setContent(e.target.value)} 
        placeholder="Comment s'est passée ta journée ?" 
        className="w-full p-4 rounded-2xl bg-gray-50 border-none text-sm min-h-[150px] resize-none focus:ring-2 focus:ring-blue-500/20 text-gray-900" 
      />

      <button 
        type="submit" 
        disabled={loading} 
        className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold text-sm hover:bg-black flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save size={18} />}
        Enregistrer
      </button>
    </form>
  );
}