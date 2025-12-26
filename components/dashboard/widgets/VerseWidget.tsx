"use client";

import { Quote, Sparkles } from "lucide-react";

interface VerseWidgetProps {
    verse: {
        text: string;
        reference: string;
    };
    onDelete?: () => void;
    isEditMode?: boolean;
}

export default function VerseWidget({ verse, onDelete, isEditMode }: VerseWidgetProps) {
    return (
        <div className="h-full w-full bg-gradient-to-br from-indigo-50 to-white p-6 rounded-3xl border border-indigo-100 shadow-sm flex flex-col justify-center relative group">
            {isEditMode && onDelete && (
                <button 
                    onClick={(e) => { e.preventDefault(); onDelete(); }}
                    className="absolute top-4 right-4 z-20 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-md hover:bg-red-600 transition-all"
                >
                    <span className="text-xs font-bold">-</span>
                </button>
            )}
            
            <div className="absolute top-4 left-4 text-indigo-200">
                <Quote size={40} />
            </div>
            
            <div className="relative z-10 text-center space-y-3 mt-4">
                <p className="text-gray-800 font-medium italic leading-relaxed text-sm">
                    &quot;{verse.text}&quot;
                </p>
                <div className="flex items-center justify-center gap-1.5 text-indigo-600">
                    <Sparkles size={12} />
                    <p className="text-[10px] font-bold uppercase tracking-wider">
                        {verse.reference}
                    </p>
                </div>
            </div>
        </div>
    );
}