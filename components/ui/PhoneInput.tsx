"use client";

import 'react-phone-number-input/style.css';
import PhoneInputFromLib from 'react-phone-number-input';
import fr from 'react-phone-number-input/locale/fr.json';

interface PhoneInputProps {
  value?: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
}

export default function PhoneInput({ value, onChange, error, disabled }: PhoneInputProps) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-text ml-1">Téléphone</label>
      
      <div className="relative">
        <PhoneInputFromLib
          international
          defaultCountry="FR"
          labels={fr}
          placeholder="Numéro de téléphone"
          value={value}
          onChange={(val) => onChange(val || '')}
          disabled={disabled}
          className={`PhoneInput ${error ? 'PhoneInput--error' : ''}`}
          numberInputProps={{
            className: 'PhoneInputInput',
          }}
        />
      </div>

      {error && <p className="text-xs text-error ml-1 animate-in slide-in-from-top-1">{error}</p>}
    </div>
  );
}