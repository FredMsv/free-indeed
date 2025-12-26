import { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, Phone, HeartHandshake, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Relèvement | Free Indeed",
  description: "Un nouvel élan après la chute.",
};

export default function RecoveryPage() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 max-w-2xl mx-auto text-center space-y-8 animate-in fade-in duration-700 slide-in-from-bottom-4">
      
      {/* Hero Section */}
      <div className="space-y-4">
        <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">
          Ne perdez pas espoir.
        </h1>
        <p className="text-lg text-gray-600">
          &quot;Sept fois le juste tombe, et il se relève.&quot; (Proverbes 24:16)
          <br />
          Ce n&apos;est pas la fin de votre histoire, c&apos;est une étape de votre apprentissage.
        </p>
      </div>

      {/* Immediate Actions Grid */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
        
        {/* Action 1: SOS */}
        <div className="bg-red-50 p-6 rounded-xl border border-red-100 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-white p-2 rounded-lg text-red-600 shadow-sm">
              <Phone className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-gray-900">Besoin d&apos;aide urgente ?</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            N&apos;hésitez pas à appeler un contact de confiance ou une ligne d&apos;écoute.
          </p>
          <Link 
            href="/sos" 
            className="block w-full py-2 px-4 bg-red-600 text-white text-center rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
          >
            Accéder aux Contacts SOS
          </Link>
        </div>

        {/* Action 2: Prayer */}
        <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-white p-2 rounded-lg text-indigo-600 shadow-sm">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-gray-900">Demander du soutien</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            La communauté est là pour vous porter dans la prière sans jugement.
          </p>
          <Link 
            href="/community" 
            className="block w-full py-2 px-4 bg-indigo-600 text-white text-center rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            Partager une demande de prière
          </Link>
        </div>
      </div>

      {/* Contextual Advice */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm w-full">
        <h3 className="font-semibold text-gray-900 mb-2">Conseil immédiat</h3>
        <p className="text-gray-600 text-sm leading-relaxed">
          Prenez 5 minutes pour respirer profondément. Ne vous isolez pas. 
          La culpabilité est votre ennemie maintenant, la grâce est votre alliée.
          L&apos;important n&apos;est pas la chute, mais la décision de vous relever maintenant.
        </p>
      </div>

      {/* Footer Action */}
      <div className="pt-4">
        <Link 
          href="/dashboard"
          className="text-gray-500 hover:text-gray-900 text-sm flex items-center gap-2 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour au tableau de bord
        </Link>
      </div>
    </div>
  );
}