import Link from "next/link";
import { 
  ChevronRight, 
  Activity, 
  User, 
  Bell, 
  ShieldAlert, 
  LogOut 
} from "lucide-react";
import { signOutAction } from "@/lib/actions/auth-actions";

export default function SettingsPage() {
  
  const settingsGroups = [
    {
      title: "Mon Parcours",
      items: [
        {
          label: "Profil de consommation",
          desc: "Ajustez prix, quantités et temps perdu",
          href: "/consumption",
          icon: Activity,
          color: "text-blue-600",
          bgColor: "bg-blue-100"
        },
        {
          label: "Mon compte (Bientôt)",
          desc: "Email, mot de passe et données personnelles",
          href: "#",
          icon: User,
          color: "text-gray-400",
          bgColor: "bg-gray-100",
          disabled: true
        }
      ]
    },
    {
      title: "Application",
      items: [
        {
          label: "Notifications (Bientôt)",
          desc: "Rappels d'engagement et alertes",
          href: "#",
          icon: Bell,
          color: "text-gray-400",
          bgColor: "bg-gray-100",
          disabled: true
        },
        {
          label: "Contacts d'urgence",
          desc: "Gérer vos numéros SOS",
          href: "/sos", // On peut rediriger vers la page SOS existante
          icon: ShieldAlert,
          color: "text-red-600",
          bgColor: "bg-red-100"
        }
      ]
    }
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Paramètres</h1>
        <p className="text-gray-500">Gérez vos préférences et votre compte.</p>
      </div>

      <div className="space-y-6">
        {settingsGroups.map((group, idx) => (
          <div key={idx}>
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3 ml-1">
              {group.title}
            </h2>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              {group.items.map((item, itemIdx) => (
                <div key={item.label}>
                  <Link 
                    href={item.disabled ? '#' : item.href}
                    className={`
                      flex items-center gap-4 p-4 transition-colors
                      ${item.disabled ? 'cursor-default opacity-60' : 'hover:bg-gray-50 cursor-pointer'}
                    `}
                  >
                    {/* Icône */}
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${item.bgColor} ${item.color}`}>
                      <item.icon size={20} />
                    </div>

                    {/* Texte */}
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 flex items-center gap-2">
                        {item.label}
                        {item.disabled && (
                          <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-bold uppercase">
                            Bientôt
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">{item.desc}</p>
                    </div>

                    {/* Flèche */}
                    {!item.disabled && <ChevronRight className="text-gray-300" size={18} />}
                  </Link>
                  {/* Séparateur sauf pour le dernier élément */}
                  {itemIdx < group.items.length - 1 && <div className="h-px bg-gray-50 mx-4" />}
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Bouton Déconnexion (Zone Danger) */}
        <div className="pt-4">
            
            <form action={signOutAction}>
                <button 
                    type="submit"
                    className="w-full bg-white border border-red-100 text-red-600 font-medium p-4 rounded-xl flex items-center justify-center gap-2 hover:bg-red-50 transition-colors"
                >
                    <LogOut size={18} />
                    Se déconnecter
                </button>
            </form>
        </div>

      </div>
    </div>
  );
}