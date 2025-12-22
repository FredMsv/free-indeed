import { Phone, LucideIcon } from 'lucide-react';

interface ContactCardProps {
  label: string;
  subLabel?: string;
  phoneNumber: string;
  icon: LucideIcon;
  variant?: 'danger' | 'primary' | 'default';
}

export default function ContactCard({ 
  label, 
  subLabel, 
  phoneNumber, 
  icon: Icon, 
  variant = 'default' 
}: ContactCardProps) {
  
  // Configuration des styles selon l'urgence
  const styles = {
    danger: {
      container: "bg-red-50 border-red-200 hover:bg-red-100",
      iconBox: "bg-red-100 text-red-600",
      text: "text-red-900",
      subText: "text-red-700/80",
      button: "bg-red-600 text-white"
    },
    primary: {
      container: "bg-gold/5 border-gold/30 hover:bg-gold/10",
      iconBox: "bg-gold/20 text-gold-dark",
      text: "text-gray-900",
      subText: "text-gray-600",
      button: "bg-gold text-white"
    },
    default: {
      container: "bg-white border-gray-100 hover:bg-gray-50",
      iconBox: "bg-gray-100 text-gray-500",
      text: "text-gray-900",
      subText: "text-gray-500",
      button: "bg-gray-900 text-white"
    }
  };

  const currentStyle = styles[variant];

  return (
    <a 
      href={`tel:${phoneNumber}`}
      className={`
        flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 group shadow-sm hover:shadow-md
        ${currentStyle.container}
      `}
    >
      {/* Icône */}
      <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${currentStyle.iconBox}`}>
        <Icon size={24} strokeWidth={2} />
      </div>

      {/* Texte */}
      <div className="flex-1 min-w-0">
        <h3 className={`font-bold text-lg truncate ${currentStyle.text}`}>
          {label}
        </h3>
        {subLabel && (
          <p className={`text-sm truncate ${currentStyle.subText}`}>
            {subLabel}
          </p>
        )}
        <p className="text-xs font-mono opacity-70 mt-1">{phoneNumber}</p>
      </div>

      {/* Bouton d'appel */}
      <div className={`
        w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110
        ${currentStyle.button}
      `}>
        <Phone size={18} fill="currentColor" />
      </div>
    </a>
  );
}