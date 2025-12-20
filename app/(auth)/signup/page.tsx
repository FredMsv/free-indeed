"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, User, Lock, UserPlus, Check, X, Loader2 } from 'lucide-react';
import { signUpAction } from '@/lib/actions/auth-actions';
import { signUpSchema, type SignUpFormValues } from '@/lib/validations/auth';

// ✅ IMPORTS CORRECTS
import { Button } from '@/components/ui/Button'; // Named export
import Input from '@/components/ui/Input';       // Default export
import PhoneInput from '@/components/ui/PhoneInput'; // Default export
import PasswordStrengthIndicator from '@/components/ui/PasswordStrengthIndicator';

export default function SignUpPage() {
  const [serverError, setServerError] = useState<string | null>(null);
  const router = useRouter();
  
  const [usernameStatus, setUsernameStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');

  const { 
    register, 
    control, 
    handleSubmit, 
    setValue,
    formState: { errors, isSubmitting, isValid } 
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema), // ✅ Maintenant le schéma contient bien firstName, etc.
    mode: "onTouched", 
    defaultValues: {
      username: '',
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      phoneNumber: ''
    }
  });

  // ✅ CORRECTION TYPAGE : as string pour éviter les erreurs d'objets imbriqués
  const usernameValue = useWatch({ control, name: 'username' }) as string;
  const emailValue = useWatch({ control, name: 'email' }) as string;
  const passwordValue = useWatch({ control, name: 'password' }) as string;
  const phoneNumberValue = useWatch({ control, name: 'phoneNumber' }) as string;

  // 🔍 Check Username logic
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!usernameValue || usernameValue.length < 3) {
        setUsernameStatus('idle');
        return;
      }

      setUsernameStatus('checking');

      try {
        const res = await fetch(`/api/check-username?username=${usernameValue}`);
        const data = await res.json();
        setUsernameStatus(data.available ? 'available' : 'taken');
      } catch {
        setUsernameStatus('idle');
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [usernameValue]);

  const onSubmit = async (data: SignUpFormValues) => {
    if (usernameStatus === 'taken' || usernameStatus === 'checking') return;
    
    setServerError(null);
    const result = await signUpAction(data);
    
    // ✅ GESTION ERREUR TYPE-SAFE
    // next-safe-action v7 retourne { data, serverError, validationErrors }
    if (result?.serverError) {
      setServerError(result.serverError);
    } else if (result?.data?.success) {
      router.push('/signup/success');
    } else {
      setServerError("Une erreur inconnue est survenue.");
    }
  };

  const isButtonDisabled = 
    !isValid ||                   
    !!errors.email ||             
    !emailValue ||                
    usernameStatus === 'taken' || 
    usernameStatus === 'checking';

  return (
    <div className="min-h-screen bg-gray-bg flex items-center justify-center p-6">
      <div className="card max-w-2xl w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
        <h1 className="text-3xl font-bold text-center mb-8 font-sans">Créer un compte</h1>
        
        {serverError && (
          <div className="bg-error/10 text-error p-3 rounded-xl mb-6 text-center text-sm font-medium">
            {serverError}
          </div>
        )}
        
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input 
            label="Prénom" 
            placeholder="Ex: Thomas" 
            icon={User} 
            {...register('firstName')} 
            error={errors.firstName?.message} 
          />
          
          <Input 
            label="Nom" 
            placeholder="Ex: Durant" 
            icon={User} 
            {...register('lastName')} 
            error={errors.lastName?.message} 
          />
          
          <div className="relative">
            <Input 
              label="Pseudo" 
              placeholder="Ex: Warrior_77" 
              icon={User} 
              {...register('username', {
                onChange: (e) => {
                  if (e.target.value.length >= 3) {
                    setUsernameStatus('checking');
                  } else {
                    setUsernameStatus('idle');
                  }
                }
              })} 
              error={errors.username?.message || (usernameStatus === 'taken' ? "Ce pseudo est déjà pris" : undefined)} 
            />
            <div className="absolute right-3 top-[38px]">
              {usernameStatus === 'checking' && <Loader2 size={18} className="animate-spin text-gray-400" />}
              {usernameStatus === 'available' && <Check size={18} className="text-success" />}
              {usernameStatus === 'taken' && <X size={18} className="text-error" />}
            </div>
          </div>

          <PhoneInput 
            value={phoneNumberValue || ''}
            onChange={(val) => setValue('phoneNumber', val)}
            error={errors.phoneNumber?.message}
          />
          
          <div className="md:col-span-2">
            <Input 
              label="Email" 
              placeholder="thomas@exemple.com" 
              icon={Mail} 
              {...register('email')} 
              error={errors.email?.message} 
            />
          </div>

          <div className="md:col-span-2">
            <Input 
              label="Mot de passe" 
              isPassword={true} 
              placeholder="••••••••"
              icon={Lock} 
              error={errors.password?.message}
              {...register('password')}
            />
            <PasswordStrengthIndicator passwordValue={passwordValue || ''} />
          </div>

          <Button 
            type="submit" 
            className="md:col-span-2 mt-6" 
            disabled={isButtonDisabled || isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <UserPlus className="mr-2 h-4 w-4" />
            )}
            Créer mon compte
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Déjà un compte ?{' '}
          <Link href="/login" className="font-semibold text-gold hover:underline transition-all">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}