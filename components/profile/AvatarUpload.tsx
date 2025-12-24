"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { User, Camera, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

interface AvatarUploadProps {
  uid: string;
  url: string | null;
  onUpload: (url: string) => void;
}

export default function AvatarUpload({ uid, url, onUpload }: AvatarUploadProps) {
  const supabase = createClient();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(url);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (url) setAvatarUrl(url);
  }, [url]);

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("Vous devez sélectionner une image.");
      }

      const file = event.target.files[0];
      const fileExt = file.name.split(".").pop();
      const filePath = `${uid}-${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // Récupérer l'URL publique
      const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
      
      setAvatarUrl(data.publicUrl);
      onUpload(data.publicUrl); // Renvoie l'URL au parent
      toast.success("Avatar mis à jour !");
      
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de l'upload de l'image.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative group">
        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-100 flex items-center justify-center">
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt="Avatar"
              width={128}
              height={128}
              className="object-cover w-full h-full"
            />
          ) : (
            <User size={64} className="text-gray-300" />
          )}
          
          {uploading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
              <Loader2 className="animate-spin text-white" />
            </div>
          )}
        </div>

        <label 
          htmlFor="single" 
          className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer shadow-md hover:bg-blue-700 transition-colors"
        >
          <Camera size={20} />
          <input
            style={{ display: "none" }}
            type="file"
            id="single"
            accept="image/*"
            onChange={uploadAvatar}
            disabled={uploading}
          />
        </label>
      </div>
      <p className="text-xs text-gray-400">Cliquez sur l&apos;appareil photo pour changer</p>
    </div>
  );
}