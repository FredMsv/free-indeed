"use client";

import { Check, X } from 'lucide-react';

interface PasswordStrengthIndicatorProps {
  passwordValue: string;
}

export default function PasswordStrengthIndicator({ passwordValue }: PasswordStrengthIndicatorProps) {
  // Critères de validation
  const criteria = [
    { label: "8 caractères minimum", valid: passwordValue.length >= 8 },
    { label: "Une majuscule", valid: /[A-Z]/.test(passwordValue) },
    { label: "Un chiffre", valid: /[0-9]/.test(passwordValue) },
    { label: "Un caractère spécial", valid: /[^A-Za-z0-9]/.test(passwordValue) },
  ];

  // Calcul du score pour la barre de progression (0 à 4)
  const score = criteria.filter(c => c.valid).length;

  const getStrengthColor = () => {
    if (score <= 2) return "bg-error"; // Rouge
    if (score === 3) return "bg-warning"; // Orange
    return "bg-success"; // Vert
  };

  return (
    <div className="space-y-3 mt-3 animate-in fade-in slide-in-from-top-1">
      {/* Barre de progression */}
      <div className="flex gap-1 h-1.5 w-full">
        {[1, 2, 3, 4].map((i) => (
          <div 
            key={i} 
            className={`flex-1 rounded-full transition-all duration-300 ${
              i <= score ? getStrengthColor() : 'bg-gray-border'
            }`} 
          />
        ))}
      </div>

      {/* Liste des critères avec icônes */}
      <div className="grid grid-cols-2 gap-x-2 gap-y-1">
        {criteria.map((item, index) => (
          <div key={index} className="flex items-center gap-1.5">
            {item.valid ? (
              <Check size={12} className="text-success" strokeWidth={3} />
            ) : (
              <X size={12} className="text-gray-400" strokeWidth={3} />
            )}
            <span className={`text-xs font-medium transition-colors ${
              item.valid ? 'text-success' : 'text-gray-500'
            }`}>
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}