"use client";

import { useEffect, useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client"; 
import { getInitialMessages, GroupMessage } from "@/lib/actions/chat-actions";
import { toast } from "sonner";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";

export function useChat() {
  const [messages, setMessages] = useState<GroupMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  
  const subscriptionRef = useRef<boolean>(false);

  useEffect(() => {
    if (subscriptionRef.current) return;
    subscriptionRef.current = true;

    const supabase = createClient();

    const initChat = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        setCurrentUserId(user.id);

        const { data: profile } = await supabase
          .from('user_profiles')
          .select('addiction_type_id')
          .eq('user_id', user.id)
          .single();

        if (!profile?.addiction_type_id) {
            setIsLoading(false);
            return;
        }

        const groupId = profile.addiction_type_id;

        const initialData = await getInitialMessages();
        setMessages(initialData);
        setIsLoading(false);

        const channel = supabase
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
              const newMessageRaw = payload.new as { id: string; user_id: string };

              // On récupère le message complet avec les infos de l'utilisateur
              const { data: fullMessage } = await supabase
                .from('group_messages')
                .select(`
                  id,
                  content,
                  created_at,
                  user_id,
                  user_profiles (
                    username,
                    avatar_url
                  )
                `)
                .eq('id', newMessageRaw.id)
                .single();

              if (fullMessage) {
                // CORRECTION ICI : Double casting (as unknown as Type) pour forcer TypeScript
                const userProfile = fullMessage.user_profiles as unknown as { username: string | null; avatar_url: string | null } | null;

                const formattedMessage: GroupMessage = {
                  id: fullMessage.id,
                  content: fullMessage.content,
                  created_at: fullMessage.created_at || new Date().toISOString(),
                  user_id: fullMessage.user_id,
                  users: userProfile,
                  is_me: fullMessage.user_id === user.id
                };

                setMessages((prev) => [formattedMessage, ...prev]);
              }
            }
          )
          .subscribe();

        return () => {
          supabase.removeChannel(channel);
        };

      } catch (error) {
        console.error("Erreur init chat:", error);
        toast.error("Impossible de charger le chat");
        setIsLoading(false);
      }
    };

    initChat();
  }, []);

  return { messages, isLoading, currentUserId, setMessages };
}