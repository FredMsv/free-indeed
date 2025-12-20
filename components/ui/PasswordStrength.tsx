"use client";

interface PasswordStrengthProps {
  value: string; // 📌 Le mot de passe tapé
}

export default function PasswordStrength({ value }: PasswordStrengthProps) {
  // 📌 [LOGIQUE DE FORCE] : On vérifie chaque critère
  const checks = {
    length: value.length >= 8,
    upper: /[A-Z]/.test(value),
    number: /[0-9]/.test(value),
    special: /[^A-Za-z0-9]/.test(value),
  };

  const score = Object.values(checks).filter(Boolean).length;
  
  const colors = ["bg-gray-border", "bg-error", "bg-warning", "bg-gold", "bg-success"];

  return (
    <div className="mt-2 space-y-2">
      <div className="flex gap-1 h-1">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className={`flex-1 rounded-full transition-all ${i <= score ? colors[score] : "bg-gray-200"}`} />
        ))}
      </div>
      <p className="text-[10px] text-gray-text uppercase font-bold tracking-wider">
        Force du mot de passe : {score === 4 ? "Excellent" : score >= 2 ? "Moyen" : "Faible"}
      </p>
    </div>
  );
}