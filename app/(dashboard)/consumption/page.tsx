import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ArrowLeft, Settings } from "lucide-react";
import Link from "next/link";
import ConsumptionForm from "@/components/consumption/ConsumptionForm";

export default async function ConsumptionPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  // Récupérer le profil et le type d'addiction
  const { data: profile } = await supabase
    .from('user_profiles')
    .select(`
      daily_value_1,
      daily_value_2,
      addiction_types ( name )
    `)
    .eq('user_id', user.id)
    .single();

  if (!profile) redirect('/onboarding');


  const addictionName = profile.addiction_types?.name || 'Default';

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link 
            href="/settings" 
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
        >
            <ArrowLeft size={24} />
        </Link>
        <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                Paramètres de Consommation
            </h1>
            <p className="text-gray-500 text-sm">Ajustez les données pour des statistiques précises.</p>
        </div>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-100">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-600">
                <Settings size={24} />
            </div>
            <div>
                <h2 className="font-semibold text-gray-900">Habitudes pour : {addictionName}</h2>
                <p className="text-xs text-gray-500">Modifiez ces valeurs à tout moment.</p>
            </div>
        </div>

        <ConsumptionForm 
            initialValue1={profile.daily_value_1 || 0}
            initialValue2={profile.daily_value_2 || 0}
            addictionName={addictionName}
        />
      </div>
    </div>
  );
}