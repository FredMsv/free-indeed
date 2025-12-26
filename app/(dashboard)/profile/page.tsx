import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ProfileForm from "@/components/profile/ProfileForm";
import BadgeGrid from "@/components/profile/BadgeGrid";
import { getUserBadges } from "@/lib/gamification/badge-service"; // ✅ Import correct
import { Trophy } from "lucide-react";

interface ProfileData {
    username: string | null;
    avatar_url: string | null;
    email?: string | null;
}

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const [profileReq, badgesReq] = await Promise.all([
    supabase.from("user_profiles").select("*").eq("user_id", user.id).single(),
    getUserBadges(user.id)
  ]);

  const profile = profileReq.data;
  const userBadges = badgesReq;

  if (!profile) return <div className="p-8 text-center text-red-500">Profil introuvable.</div>;

  const safeProfile: ProfileData = {
      username: profile.username,
      avatar_url: profile.avatar_url,
      email: profile.email
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4 space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Mon Profil</h1>
        <p className="text-gray-500">Gérez vos informations et visualisez vos succès.</p>
      </div>
      
      <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
        <ProfileForm user={user} profile={safeProfile} />
      </div>

      <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Trophy className="text-gold" size={20} />
            Mes Réussites
            <span className="text-xs font-normal text-gray-400 bg-gray-100 px-2 py-1 rounded-full ml-auto">
                {userBadges.length} trophées
            </span>
        </h2>
        <BadgeGrid earnedBadges={userBadges} />
      </div>
    </div>
  );
}