import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { ShieldAlert, Ambulance, HeartHandshake, Stethoscope, Users, Phone } from 'lucide-react';
import ContactCard from '@/components/sos/ContactCard';

export default async function SOSPage() {
  const supabase = await createClient();

  // 1. Vérifier l'utilisateur
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  // 2. Récupérer les contacts du profil
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (!profile) return null;

  // On prépare les listes (car pastor_phones peut être null ou vide)
  const pastorPhones = profile.pastor_phones || [];
  // Rétro-compatibilité si un ancien champ unique existe
  if (profile.pastor_phone && !pastorPhones.includes(profile.pastor_phone)) {
    pastorPhones.push(profile.pastor_phone);
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <ShieldAlert size={32} />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Besoin d&apos;aide immédiate ?</h1>
        <p className="text-gray-500 max-w-md mx-auto">
          Ne restez pas seul(e). Appelez un contact de confiance ou un service d&apos;urgence maintenant.
        </p>
      </div>

      {/* 🚨 SECTION 1 : URGENCES VITALES (Statique) */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider ml-1">
          Urgences Publiques
        </h2>
        <div className="grid gap-3">
          <ContactCard 
            label="SAMU / Urgences" 
            subLabel="Service médical d'urgence"
            phoneNumber="15" 
            icon={Ambulance} 
            variant="danger" 
          />
          <ContactCard 
            label="Urgence Européenne" 
            subLabel="Numéro unique gratuit"
            phoneNumber="112" 
            icon={Phone} 
            variant="danger" 
          />
        </div>
      </div>

      {/* 🛡️ SECTION 2 : CONTACT PERSONNEL (Dynamique) */}
      {profile.emergency_contact_phone && (
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider ml-1">
            Votre Contact SOS
          </h2>
          <ContactCard 
            label="Contact de confiance" 
            subLabel="Personne désignée lors de l'inscription"
            phoneNumber={profile.emergency_contact_phone} 
            icon={HeartHandshake} 
            variant="primary" 
          />
        </div>
      )}

      {/* 👥 SECTION 3 : PASTEURS & MENTORS (Dynamique - Liste) */}
      {pastorPhones.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider ml-1">
            Vos Mentors & Pasteurs
          </h2>
          <div className="grid gap-3">
            {pastorPhones.map((phone, index) => (
              <ContactCard 
                key={index}
                label={`Pasteur / Mentor ${index + 1}`} 
                phoneNumber={phone} 
                icon={Users} 
                variant="default" 
              />
            ))}
          </div>
        </div>
      )}

      {/* 🩺 SECTION 4 : MÉDECIN (Dynamique) */}
      {profile.doctor_phone && (
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider ml-1">
            Suivi Médical
          </h2>
          <ContactCard 
            label="Médecin Traitant" 
            phoneNumber={profile.doctor_phone} 
            icon={Stethoscope} 
            variant="default" 
          />
        </div>
      )}

      {/* Message de bas de page */}
      <div className="bg-gray-50 p-4 rounded-xl text-center text-sm text-gray-500 border border-gray-100 mt-8">
        <p>
          &quot;Aucune tentation ne vous est survenue qui n&apos;ait été humaine...&quot; <br/>
          <span className="font-semibold text-gray-700">1 Corinthiens 10:13</span>
        </p>
      </div>

    </div>
  );
}