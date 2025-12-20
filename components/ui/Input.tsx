import React, { InputHTMLAttributes, useState, forwardRef } from 'react';
import { LucideIcon, Eye, EyeOff } from 'lucide-react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: LucideIcon;
  // ✅ Option pour activer le toggle de mot de passe
  isPassword?: boolean; 
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon: Icon, isPassword, className = '', type, ...props }, ref) => {
    // État local pour basculer la visibilité
    const [showPassword, setShowPassword] = useState(false);
    
    // Détermine le type réel de l'input (password ou text)
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

    return (
      <div className="w-full space-y-1">
        <label className="text-sm font-medium text-gray-text ml-1">
          {label}
        </label>
        
        <div className="relative">
          {/* Icône de gauche (ex: Lock, Mail) */}
          {Icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Icon size={18} />
            </div>
          )}
          
          <input
            ref={ref}
            type={inputType}
            className={`
              w-full bg-white border rounded-xl px-4 py-3 text-gray-900 placeholder:text-gray-300
              outline-none transition-all duration-200
              ${Icon ? 'pl-10' : ''}
              ${isPassword ? 'pr-10' : ''} /* Espace pour l'œil */
              ${error 
                ? 'border-error ring-1 ring-error/20' 
                : 'border-gray-border focus:border-gold focus:ring-2 focus:ring-gold/10'
              }
              ${className}
            `}
            {...props}
          />

          {/* ✅ Bouton Toggle (Oeil) */}
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
              tabIndex={-1} // Pour ne pas gêner la navigation au clavier
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          )}
        </div>
        
        {error && (
          <p className="text-xs text-error ml-1 animate-in slide-in-from-top-1">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;