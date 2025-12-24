"use client";

import { useRef, useEffect, useState, useTransition } from "react";
import { Send, Loader2, User } from "lucide-react";
import { useChat } from "@/hooks/useChat";
import { sendMessage } from "@/lib/actions/chat-actions";
import { toast } from "sonner";

export default function GroupChat() {
  const { messages, isLoading, currentUserId } = useChat();
  const [newMessage, setNewMessage] = useState("");
  const [isSending, startTransition] = useTransition();
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll vers le bas à chaque nouveau message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!newMessage.trim() || isSending) return;

    const content = newMessage;
    setNewMessage(""); // Optimistic clear

    startTransition(async () => {
      const result = await sendMessage(content);
      if (!result.success) {
        toast.error("Erreur d'envoi");
        setNewMessage(content); // Restore on fail
      }
    });
  };

  if (isLoading) {
    return (
      <div className="h-[400px] flex items-center justify-center bg-gray-50 rounded-2xl">
        <Loader2 className="animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[500px] bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
      {/* HEADER */}
      <div className="p-4 border-b border-gray-100 bg-gray-50/50">
        <h3 className="font-bold text-gray-900 flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"/>
          Discussion du Groupe
        </h3>
        <p className="text-xs text-gray-500">Encouragez-vous les uns les autres.</p>
      </div>

      {/* MESSAGES AREA */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/30">
        {messages.length === 0 ? (
          <div className="text-center py-10 text-gray-400 text-sm">
            C&apos;est calme ici... Lancez la discussion ! 👋
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.user_id === currentUserId;
            
            return (
              <div 
                key={msg.id} 
                className={`flex gap-2 max-w-[85%] ${isMe ? "ml-auto flex-row-reverse" : ""}`}
              >
                {/* Avatar */}
                <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold border
                    ${isMe ? "bg-blue-100 text-blue-700 border-blue-200" : "bg-white text-gray-700 border-gray-200"}
                `}>
                  {msg.users?.avatar_url ? (
                     // eslint-disable-next-line @next/next/no-img-element
                     <img src={msg.users.avatar_url} alt="Av" className="w-full h-full rounded-full object-cover"/>
                  ) : (
                    <User size={14} />
                  )}
                </div>

                {/* Bulle Message */}
                <div className={`
                    p-3 rounded-2xl text-sm leading-relaxed shadow-sm
                    ${isMe 
                        ? "bg-blue-600 text-white rounded-tr-none" 
                        : "bg-white text-gray-800 border border-gray-100 rounded-tl-none"}
                `}>
                  {!isMe && (
                    <p className="text-[10px] font-bold opacity-50 mb-1">
                      {msg.users?.username || "Anonyme"}
                    </p>
                  )}
                  {msg.content}
                  <p className={`text-[9px] mt-1 text-right ${isMe ? "text-blue-200" : "text-gray-400"}`}>
                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* INPUT AREA */}
      <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-100 flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Écrivez un message..."
          className="flex-1 bg-gray-100 border-0 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
        />
        <button
          type="submit"
          disabled={!newMessage.trim() || isSending}
          className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md active:scale-95"
        >
          {isSending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
        </button>
      </form>
    </div>
  );
}