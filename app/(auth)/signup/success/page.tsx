"use client";

import { Mail } from 'lucide-react';
import {Button} from '@/components/ui/Button';

export default function SignupSuccessPage() {
  return (
    <div className="min-h-screen bg-gray-bg flex items-center justify-center p-6">
      <div className="card max-w-md w-full text-center p-8 animate-in fade-in zoom-in-95 duration-500">
        
        {/* Icône animée */}
        <div className="w-20 h-20 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <Mail className="text-gold w-10 h-10 animate-bounce" strokeWidth={1.5} />
        </div>

        <h2 className="text-2xl font-bold mb-3 font-sans text-gray-900">
          Vérifiez votre boîte mail
        </h2>
        
        <p className="text-gray-600 mb-2 leading-relaxed">
          Un lien de confirmation vient d&apos;être envoyé à votre adresse email.
        </p>
        
        <p className="text-gray-500 text-sm mb-8 bg-gray-50 p-3 rounded-lg border border-gray-100">
          ⚠️ Pensez à vérifier vos <strong>spams</strong> ou courriers indésirables si vous ne le voyez pas.
        </p>

        <Button onClick={() => window.location.href = '/login'} className="w-full">
          Aller à la connexion
        </Button>
      </div>
    </div>
  );
}