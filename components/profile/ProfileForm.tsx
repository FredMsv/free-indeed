"use client";

import { useState, useTransition } from "react";
import AvatarUpload from "./AvatarUpload";
import { updateProfile } from "@/lib/actions/profile-actions";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { User as SupabaseUser } from "@supabase/supabase-js";

// Définir un type minimal pour le profil au lieu de 'any'
interface ProfileData {
  username: string | null;
  avatar_url: string | null;
  email?: string | null; // Souvent dans user, pas profile, mais bon pour l'affichage
}

export default function ProfileForm({ user, profile }: { user: SupabaseUser, profile: ProfileData }) {
  const [username, setUsername] = useState(profile?.username || "");
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || "");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append("username", username);
    formData.append("avatarUrl", avatarUrl);

    startTransition(async () => {
      const result = await updateProfile(formData);
      if (result.success) {
        toast.success("Profil mis à jour !");
      } else {
        toast.error("Erreur lors de la mise à jour");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      
      {/* Composant Avatar */}
      <AvatarUpload 
        uid={user.id}
        url={avatarUrl}
        onUpload={(url) => setAvatarUrl(url)}
      />

      <div className="space-y-4 mt-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input 
            type="text" 
            value={user.email} 
            disabled 
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-500 cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nom d&apos;utilisateur</label>
          <input 
            type="text" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Comment doit-on vous appeler ?"
            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
        </div>
      </div>

      <button 
        type="submit" 
        disabled={isPending}
        className="w-full bg-gray-900 text-white py-3 rounded-xl font-bold hover:bg-black transition-all flex items-center justify-center gap-2"
      >
        {isPending ? <Loader2 className="animate-spin" /> : "Enregistrer les modifications"}
      </button>
    </form>
  );
}