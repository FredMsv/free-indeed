"use client";

import { useTransition } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { deleteJournalEntry } from "@/lib/actions/journal-actions";
import { toast } from "sonner";

interface DeleteButtonProps {
  entryId: string;
}

export function DeleteJournalButton({ entryId }: DeleteButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = async () => {
    if (!confirm("Voulez-vous vraiment supprimer cette note ?")) return;

    startTransition(async () => {
      const result = await deleteJournalEntry(entryId);
      if (result.success) {
        toast.success("Note supprimée");
      } else {
        toast.error("Erreur lors de la suppression");
      }
    });
  };

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        handleDelete();
      }}
      disabled={isPending}
      className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all disabled:opacity-50 group-hover:opacity-100 sm:opacity-0 opacity-100"
      title="Supprimer cette entrée"
    >
      {isPending ? (
        <Loader2 size={18} className="animate-spin text-red-500" />
      ) : (
        <Trash2 size={18} />
      )}
    </button>
  );
}