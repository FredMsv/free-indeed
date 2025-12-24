import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import CommunityInterface from "@/components/community/CommunityInterface";
import { getCommunityPrayerRequests, getMyPrayerRequests } from "@/lib/actions/prayer-actions";
import { getCommunityStatus } from "@/lib/actions/community-actions";

export default async function CommunityPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  // On récupère le statut d'abord
  const isInCommunity = await getCommunityStatus();

  // Chargement conditionnel
  const myRequestsReq = getMyPrayerRequests();
  // Si pas dans la communauté, on ne fetch pas les données du groupe (tableau vide)
  const communityRequestsReq = isInCommunity ? getCommunityPrayerRequests() : Promise.resolve([]);

  const [myRequests, communityRequests] = await Promise.all([
    myRequestsReq,
    communityRequestsReq
  ]);

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 px-4 sm:px-6">
      <div className="pt-6 pb-2">
        <h1 className="text-2xl font-bold text-gray-900">Espace Spirituel</h1>
        <p className="text-gray-500 text-sm">Gérez votre mur personnel et connectez-vous aux autres.</p>
      </div>

      <CommunityInterface 
        myRequests={myRequests}
        communityRequests={communityRequests}
        isInCommunity={isInCommunity} // On passe l'info
      />
    </div>
  );
}