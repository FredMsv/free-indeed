"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function StatsFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPeriod = searchParams.get("period") || "30d";

  const periods = [
    { value: "7d", label: "7 Jours" },
    { value: "30d", label: "30 Jours" },
    { value: "1y", label: "1 An" },
  ];

  const handleSelect = (value: string) => {
    router.push(`/stats?period=${value}`);
  };

  return (
    <div className="flex bg-gray-100 p-1 rounded-xl w-full max-w-sm mx-auto mb-8">
      {periods.map((p) => {
        const isActive = currentPeriod === p.value;
        return (
          <button
            key={p.value}
            onClick={() => handleSelect(p.value)}
            className={`
              flex-1 py-2 text-xs font-bold rounded-lg transition-all
              ${isActive 
                ? "bg-white text-gray-900 shadow-sm" 
                : "text-gray-500 hover:text-gray-700"}
            `}
          >
            {p.label}
          </button>
        );
      })}
    </div>
  );
}