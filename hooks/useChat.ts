"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { getInitialMessages, GroupMessage } from "@/lib/actions/chat-actions";
import { toast } from "sonner";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";
import { GroupMessageQueryResult } from "@/lib/types/query-types";

export function useChat() {
  const [messages, setMessages] = useState<GroupMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  
  useEffect(() => {
    let isMounted = true; // 🛡️ Protection contre updates sur composant démonté
    const supabase = createClient();
    let channel: ReturnType<typeof supabase.channel> | null = null;

    const initChat = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        // Si le composant a été démonté pendant l'await, on arrête
        if (!isMounted) return;
        if (!user) {
            setIsLoading(false);
            return;
        }

        setCurrentUserId(user.id);

        const { data: profile } = await supabase
          .from('user_profiles')
          .select('addiction_type_id')
          .eq('user_id', user.id)
          .single();

        if (!isMounted) return;

        if (!profile?.addiction_type_id) {
            setIsLoading(false);
            return;
        }

        const groupId = profile.addiction_type_id;
        const initialData = await getInitialMessages();
        
        if (isMounted) {
            setMessages(initialData);
            setIsLoading(false);
        }

        // Configuration Realtime
        channel = supabase
          .channel(`group_chat:${groupId}`)
          .on(
            'postgres_changes',
            {
              event: 'INSERT',
              schema: 'public',
              table: 'group_messages',
              filter: `addiction_type_id=eq.${groupId}`
            },
            async (payload: RealtimePostgresChangesPayload<{ [key: string]: unknown }>) => {
              if (!isMounted) return;

              const newMessageRaw = payload.new as { id: string; user_id: string };

              // On récupère le message complet avec les infos de l'utilisateur
              const { data: fullMessage } = await supabase
                .from('group_messages')
                .select(`
                  *,
                  user_profiles (
                    username,
                    avatar_url
                  )
                `)
                .eq('id', newMessageRaw.id)
                .single();

              if (fullMessage && isMounted) {
                // Validation de type via notre Query Type
                const typedMessage = fullMessage as unknown as GroupMessageQueryResult;
                const userProfile = typedMessage.user_profiles || { username: "Utilisateur inconnu", avatar_url: null };

                const formattedMessage: GroupMessage = {
                  id: typedMessage.id,
                  content: typedMessage.content,
                  created_at: typedMessage.created_at || new Date().toISOString(),
                  user_id: typedMessage.user_id,
                  users: userProfile,
                  is_me: typedMessage.user_id === user.id
                };

                setMessages((prev) => {
                    // Anti-doublon : on vérifie si le message n'est pas déjà là (cas Optimistic UI futur)
                    if (prev.some(m => m.id === formattedMessage.id)) return prev;
                    return [formattedMessage, ...prev];
                });
              }
            }
          )
          .subscribe();

      } catch (error) {
        console.error("Erreur init chat:", error);
        if (isMounted) {
            toast.error("Impossible de charger le chat");
            setIsLoading(false);
        }
      }
    };

    initChat();

    // 🧹 CLEANUP FUNCTION : Indispensable pour éviter les fuites de mémoire
    return () => {
      isMounted = false;
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, []);

  return { messages, isLoading, currentUserId, setMessages };
}