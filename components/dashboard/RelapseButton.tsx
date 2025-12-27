"use client";

import { useState } from "react";
import { AlertCircle, X } from "lucide-react";
import RelapseForm from "./RelapseForm";

interface RelapseButtonProps {
  onSuccess: () => void;
}

export default function RelapseButton({ onSuccess }: RelapseButtonProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl border border-red-100"
      >
        <AlertCircle size={18} />
        <span>Déclarer une rechute</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl text-gray-900">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-xl font-bold">Analyse de la situation</h2>
              <button onClick={() => setIsOpen(false)}><X size={20} /></button>
            </div>
            <div className="p-6 max-h-[80vh] overflow-y-auto">
              <RelapseForm onSuccess={() => { setIsOpen(false); onSuccess(); }} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}