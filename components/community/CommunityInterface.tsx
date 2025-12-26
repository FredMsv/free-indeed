"use client";

import { useState, useTransition } from "react";
import { Lock, Globe, MessageCircle, HeartHandshake, Users, ArrowRight, Loader2 } from "lucide-react";
import GroupChat from "./GroupChat";
import { MyRequestWithSupports, PrayerRequestWithProfile } from "@/lib/actions/prayer-actions";
import MyPrayerWall from "./MyPrayerWall";
import PrayerFeed from "./PrayerFeed";
import { joinCommunity } from "@/lib/actions/community-actions";
import { toast } from "sonner";

interface CommunityInterfaceProps {
  myRequests: MyRequestWithSupports[];
  communityRequests: PrayerRequestWithProfile[];
  isInCommunity: boolean; // Nouvelle prop
}

type Tab = 'wall' | 'group';
type GroupTab = 'feed' | 'chat';

export default function CommunityInterface({ myRequests, communityRequests, isInCommunity }: CommunityInterfaceProps) {
  // Si pas dans la communauté, on force l'onglet par défaut sur "wall"
  const [activeTab, setActiveTab] = useState<Tab>(isInCommunity ? 'group' : 'wall');
  const [groupTab, setGroupTab] = useState<GroupTab>('feed');
  const [isJoining, startTransition] = useTransition();

  const handleJoin = () => {
    startTransition(async () => {
      const res = await joinCommunity();
      if (res.success) {
        toast.success("Bienvenue dans le groupe !");
      } else {
        toast.error("Erreur de connexion.");
      }
    });
  };

  return (
    <div className="space-y-6">
      
      {/* NAVIGATION PRINCIPALE */}
      <div className="flex bg-gray-100 p-1 rounded-2xl">
        <button
          onClick={() => setActiveTab('wall')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${
            activeTab === 'wall' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Lock size={16} /> Mon Mur
        </button>
        <button
          onClick={() => setActiveTab('group')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${
            activeTab === 'group' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Globe size={16} /> Groupe
          {!isInCommunity && <span className="bg-blue-100 text-blue-600 text-[10px] px-1.5 py-0.5 rounded">?</span>}
        </button>
      </div>

      {/* CONTENU GROUPE */}
      {activeTab === 'group' && (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
          
          {/* CAS 1 : UTILISATEUR NON MEMBRE -> PAGE D'INVITATION */}
          {!isInCommunity ? (
            <div className="bg-white p-8 rounded-3xl border border-blue-100 text-center space-y-6 shadow-sm">
                <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users size={32} />
                </div>
                
                <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Rejoindre le Cercle</h3>
                    <p className="text-gray-500 text-sm max-w-md mx-auto leading-relaxed">
                        Pour accéder aux demandes de prières des autres et discuter en direct, vous devez rejoindre le groupe de soutien.
                        <br/><br/>
                        En rejoignant, vous acceptez de partager ce fardeau avec bienveillance et confidentialité.
                    </p>
                </div>
            
                <button 
                    onClick={handleJoin}
                    disabled={isJoining}
                    className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-95 flex items-center gap-2 mx-auto"
                >
                    {isJoining ? <Loader2 className="animate-spin" /> : <>Rejoindre maintenant <ArrowRight size={16}/></>}
                </button>
            </div>
          ) : (
            /* CAS 2 : UTILISATEUR MEMBRE -> ACCÈS COMPLET */
            <div className="space-y-6">
                <div className="flex border-b border-gray-200">
                    <button
                    onClick={() => setGroupTab('feed')}
                    className={`pb-3 px-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
                        groupTab === 'feed' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-400 hover:text-gray-600'
                    }`}
                    >
                    <HeartHandshake size={16} /> Prières
                    </button>
                    <button
                    onClick={() => setGroupTab('chat')}
                    className={`pb-3 px-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
                        groupTab === 'chat' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-400 hover:text-gray-600'
                    }`}
                    >
                    <MessageCircle size={16} /> Discussion
                    </button>
                </div>

                {groupTab === 'chat' ? (
                    <GroupChat />
                ) : (
                    <PrayerFeed initialData={communityRequests} />
                )}
            </div>
          )}
        </div>
      )}

      {/* CONTENU MON MUR */}
      {activeTab === 'wall' && (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* ✅ CORRECTION : On passe la prop isInCommunity */}
            <MyPrayerWall initialData={myRequests} isInCommunity={isInCommunity} />
        </div>
      )}
    </div>
  );
}