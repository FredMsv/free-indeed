"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { forgotPasswordAction } from '@/lib/actions/auth-actions';
import { forgotPasswordSchema, type ForgotPasswordFormValues } from '@/lib/validations/auth';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function ForgotPasswordPage() {
  const [isSuccess, setIsSuccess] = useState(false);
  // 🗑️ SUPPRESSION : La ligne const [serverError...] a été retirée car inutile ici.

  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting } 
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' }
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    // 🗑️ SUPPRESSION : setServerError(null) retiré
    const result = await forgotPasswordAction(data);
    
    // On affiche toujours le succès pour des raisons de sécurité
    // peu importe si le backend renvoie une erreur ou un succès.
    if (result.success || result.error) {
      setIsSuccess(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-bg flex items-center justify-center p-6">
      <div className="card max-w-md w-full p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold font-sans text-gray-900">Mot de passe oublié ?</h1>
          <p className="text-gray-600 mt-2 text-sm">
            Entrez votre email pour recevoir un lien de réinitialisation.
          </p>
        </div>

        {isSuccess ? (
          <div className="text-center space-y-6 animate-in fade-in zoom-in-95">
            <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto text-success">
              <CheckCircle2 size={32} />
            </div>
            <div className="bg-green-50 text-green-800 p-4 rounded-xl text-sm leading-relaxed border border-green-100">
              Si un compte existe à cette adresse, vous recevrez un email avec les instructions dans quelques instants.
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
              isLoading={isSubmitting} 
            >
              Envoyer le lien
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