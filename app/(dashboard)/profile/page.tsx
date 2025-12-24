import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ProfileForm from "@/components/profile/ProfileForm";

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  // CORRECTION : On gère le cas où le profil est null (sécurité TypeScript)
  if (!profile) {
    return (
      <div className="p-8 text-center text-red-500">
        Profil introuvable. Veuillez contacter le support.
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Mon Profil</h1>
      <p className="text-gray-500 mb-8">Gérez vos informations personnelles.</p>
      
      <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
        {/* Maintenant TypeScript sait que 'profile' n'est pas null ici */}
        <ProfileForm user={user} profile={profile} />
      </div>
    </div>
  );
}