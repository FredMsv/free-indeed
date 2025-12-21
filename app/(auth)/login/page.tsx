"use client";

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Lock, LogIn, ArrowRight, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { signInAction } from '@/lib/actions/auth-actions';
import { signInSchema, type SignInFormValues } from '@/lib/validations/auth';
import { mapAuthError } from '@/lib/errors/mapping';
import Input from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function SignInPage() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    }
  });

  const onSubmit = (data: SignInFormValues) => {
    setServerError(null);
    
    startTransition(async () => {
      try {
        const result = await signInAction(data);

        if (!result.success) {
          const mappedError = mapAuthError(new Error(result.error));
          setServerError(mappedError);
          toast.error(mappedError);
          return;
        }

        toast.success("Connexion réussie !");
        // Le middleware s'occupera de rediriger vers /onboarding ou /dashboard si l'utilisateur accède à la home
        // Mais nous forçons ici pour être explicite
        router.refresh(); // Important pour sync les cookies
        router.push(result.redirectTo || '/dashboard');
        
      } catch (err) {
        setServerError("Erreur inattendue.");
        console.error(err);
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-bg flex items-center justify-center p-6">
      <div className="card max-w-md w-full p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gold/10 mb-4">
            <LogIn className="w-8 h-8 text-gold" strokeWidth={1.5} />
          </div>
          <h1 className="text-2xl font-bold font-sans text-gray-900">Bon retour parmi nous</h1>
          <p className="text-gray-600 mt-3 text-sm leading-relaxed">
            Connectez-vous pour accéder à votre espace personnel Free Indeed.
          </p>
        </div>

        {serverError && (
          <div className="bg-error/10 text-error p-3 rounded-xl mb-6 text-center text-sm font-medium flex items-center justify-center gap-2">
            <Lock size={16} /> {serverError}
          </div>
        )}
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Input 
            label="Email" 
            placeholder="thomas@exemple.com" 
            icon={Mail} 
            {...register('email')} 
            error={errors.email?.message} 
          />

          <div>
            <Input 
              label="Mot de passe"
              isPassword 
              placeholder="••••••••"
              icon={Lock} 
              error={errors.password?.message}
              {...register('password')}
            />
            <div className="flex justify-end mt-2">
              <Link 
                href="/forgot-password" 
                className="text-xs text-gray-500 hover:text-gold transition-colors"
              >
                Mot de passe oublié ?
              </Link>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full mt-6" 
            disabled={isPending} 
          >
            {isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <ArrowRight className="mr-2 h-4 w-4" />
            )}
            Se connecter
          </Button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-500 border-t border-gray-100 pt-6">
          <p>
            Pas encore de compte ?{' '}
            <Link href="/signup" className="font-semibold text-gold hover:underline transition-all">
              Rejoindre Free Indeed
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}