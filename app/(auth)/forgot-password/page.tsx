"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, ArrowLeft, CheckCircle2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { forgotPasswordAction } from '@/lib/actions/auth-actions';
import { forgotPasswordSchema, type ForgotPasswordFormValues } from '@/lib/validations/auth';
import Input from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function ForgotPasswordPage() {
  const [isSuccess, setIsSuccess] = useState(false);
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting } 
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' }
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    try {
      // Appel au serveur
      await forgotPasswordAction(data);
      
      // ✅ CORRECTION : On affiche le succès peu importe le résultat technique
      // pour éviter de révéler si l'email existe ou non (Sécurité)
      setIsSuccess(true);
      toast.success("Demande prise en compte");
      
    } catch (error) {
      // Même en cas d'erreur crash, on affiche le succès pour ne pas bloquer l'UX
      console.error(error);
      setIsSuccess(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-bg flex items-center justify-center p-6">
      <div className="card max-w-md w-full p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold font-sans text-gray-900">Mot de passe oublié ?</h1>
          {!isSuccess && (
            <p className="text-gray-600 mt-2 text-sm">
              Entrez votre email pour recevoir un lien de réinitialisation.
            </p>
          )}
        </div>

        {isSuccess ? (
          <div className="text-center space-y-6 animate-in fade-in zoom-in-95">
            <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto text-success">
              <CheckCircle2 size={32} />
            </div>

            <div className="bg-green-50 text-green-800 p-4 rounded-xl text-sm leading-relaxed border border-green-100">
              <p className="font-semibold mb-1">Email envoyé !</p>
              Si un compte existe à cette adresse, vous recevrez les instructions dans quelques instants.
            </div>
            
            <Button onClick={() => window.location.href = '/login'} variant="secondary" className="w-full">
              Retour à la connexion
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input 
              label="Email" 
              placeholder="thomas@exemple.com" 
              icon={Mail} 
              {...register('email')} 
              error={errors.email?.message} 
            />

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Envoyer le lien"
              )}
            </Button>

            <div className="text-center">
              <Link 
                href="/login" 
                className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft size={16} /> Retour à la connexion
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}