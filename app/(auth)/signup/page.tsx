"use client";

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, User, Lock, UserPlus, Loader2, AlertCircle, Calendar, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';

import { signUpAction } from '@/lib/actions/auth-actions';
import { signUpSchema, type SignUpFormValues } from '@/lib/validations/auth';
import { mapAuthError } from '@/lib/errors/mapping';

import { Button } from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import PhoneInput from '@/components/ui/PhoneInput';
import PasswordStrengthIndicator from '@/components/ui/PasswordStrengthIndicator';

export default function SignUpPage() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const { 
    register, 
    handleSubmit, 
    setValue,
    setError,
    control,
    formState: { errors } 
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    mode: "onBlur", 
    defaultValues: {
      username: '',
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      phoneNumber: '',
      birthDate: '',
      // ✅ Initialisation "neutre" compatible avec z.union
      gender: undefined as unknown as SignUpFormValues["gender"]
    }
  });

  const passwordValue = useWatch({ control, name: 'password' });
  const phoneNumberValue = useWatch({ control, name: 'phoneNumber' });
  const genderValue = useWatch({ control, name: 'gender' });

  const onSubmit = (data: SignUpFormValues) => {
    setServerError(null);
    startTransition(async () => {
      try {
        const result = await signUpAction(data);
        
        if (!result.success) {
          if (result.fieldErrors) {
            Object.entries(result.fieldErrors).forEach(([field, message]) => {
              setError(field as keyof SignUpFormValues, {
                type: "server",
                message: message
              });
            });
            toast.error("Veuillez corriger les erreurs indiquées.");
            return;
          }

          const mappedError = mapAuthError(new Error(result.error));
          setServerError(mappedError);
          toast.error(mappedError);
          return;
        }

        toast.success("Compte créé avec succès !");
        if (result.redirectTo) {
          router.push(result.redirectTo);
        }
      } catch {
        const message = "Une erreur inattendue est survenue.";
        setServerError(message);
        toast.error(message);
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-bg flex items-center justify-center p-6">
      <div className="card max-w-2xl w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
        <h1 className="text-3xl font-bold text-center mb-8 font-sans">Créer un compte</h1>
        
        {serverError && (
          <div className="bg-error/10 text-error p-4 rounded-xl mb-6 text-sm font-medium flex items-start gap-3 animate-in slide-in-from-top-2">
            <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold mb-1">Erreur de création de compte</p>
              <p>{serverError}</p>
            </div>
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
          
          <Input 
            label="Pseudo" 
            placeholder="Ex: Warrior_77" 
            icon={User} 
            {...register('username')} 
            error={errors.username?.message}
          />

          <PhoneInput 
            value={phoneNumberValue || ''}
            onChange={(val) => setValue('phoneNumber', val)}
            error={errors.phoneNumber?.message}
          />

          {/* --- GENRE (Select) --- */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-text ml-1">Genre</label>
            <div className="relative">
              <select
                {...register('gender')}
                className={`
                  w-full bg-white border rounded-xl px-4 py-3 outline-none appearance-none transition-all cursor-pointer
                  ${errors.gender 
                    ? 'border-error ring-1 ring-error/20' 
                    : 'border-gray-border focus:border-gold focus:ring-2 focus:ring-gold/10'
                  }
                  ${!genderValue ? 'text-gray-400' : 'text-gray-900'}
                `}
                defaultValue=""
              >
                <option value="" disabled>Sélectionner</option>
                <option value="male">Homme</option>
                <option value="female">Femme</option>
              </select>
              
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                <ChevronDown size={18} />
              </div>
            </div>
            {errors.gender && <p className="text-xs text-error ml-1">{errors.gender.message}</p>}
          </div>

          {/* --- DATE DE NAISSANCE --- */}
          <div>
            <Input 
              type="date"
              label="Date de naissance" 
              icon={Calendar} 
              {...register('birthDate')} 
              error={errors.birthDate?.message}
            />
          </div>
          
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
            {passwordValue && <PasswordStrengthIndicator passwordValue={passwordValue} />}
          </div>

          <Button 
            type="submit" 
            className="md:col-span-2 mt-6" 
            disabled={isPending}
          >
            {isPending ? (
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