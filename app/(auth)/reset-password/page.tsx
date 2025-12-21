"use client";

import { useTransition } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Loader2, Lock, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import PasswordStrengthIndicator from "@/components/ui/PasswordStrengthIndicator";

import {
  resetPasswordSchema,
  type ResetPasswordFormValues,
} from "@/lib/validations/auth";
import { resetPasswordAction } from "@/lib/actions/auth-actions";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors } // On récupère isValid aussi
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "all", // "all" valide au changement ET au blur pour un feedback maximal
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const passwordValue = useWatch({ control, name: 'password', defaultValue: '' });
  const confirmValue = useWatch({ control, name: 'confirmPassword', defaultValue: '' });

  // Vérification manuelle pour le feedback visuel immédiat (Double sécurité)
  const passwordsMatch = passwordValue && confirmValue && passwordValue === confirmValue;
  const showMismatchError = confirmValue.length > 0 && !passwordsMatch;

  const onSubmit = (data: ResetPasswordFormValues) => {
    startTransition(async () => {
        const result = await resetPasswordAction(data);
        
        if (result.success) {
            toast.success("Mot de passe modifié avec succès");
            router.push("/login");
        } else {
            toast.error(result.error || "Une erreur est survenue");
        }
    });
  };

  const onInvalid = () => {
    // Feedback vibratoire ou visuel supplémentaire si besoin
    toast.error("Veuillez vérifier les champs rouges");
  };

  return (
    <div className="min-h-screen bg-gray-bg flex items-center justify-center p-6">
      <div className="card max-w-md w-full p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4 text-gold">
              <Lock size={32} />
            </div>
            <h1 className="text-2xl font-bold font-sans text-gray-900">
                Nouveau mot de passe
            </h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="space-y-6">
            
            {/* MOT DE PASSE */}
            <div>
                <Input
                    label="Nouveau mot de passe"
                    placeholder="••••••••"
                    isPassword
                    autoComplete="new-password"
                    icon={Lock}
                    disabled={isPending}
                    {...register('password')}
                    // Priorité à l'erreur Zod
                    error={errors.password?.message}
                />
                {passwordValue && <PasswordStrengthIndicator passwordValue={passwordValue} />}
            </div>

            {/* CONFIRMATION */}
            <div>
                <Input
                    label="Confirmer le mot de passe"
                    placeholder="••••••••"
                    isPassword
                    autoComplete="new-password"
                    icon={CheckCircle2}
                    disabled={isPending}
                    {...register('confirmPassword')}
                    // On force l'affichage de l'erreur si Zod le dit, OU si notre check manuel échoue
                    error={errors.confirmPassword?.message || (showMismatchError ? "Les mots de passe ne correspondent pas" : undefined)}
                />
            </div>

            {/* BLOC D'ERREUR GLOBAL (Filet de sécurité visuel) */}
            {Object.keys(errors).length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-3 animate-in fade-in slide-in-from-top-1">
                    <XCircle className="text-red-500 w-5 h-5 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-red-700">
                        <p className="font-semibold">Impossible de valider :</p>
                        <ul className="list-disc list-inside mt-1 space-y-1 text-xs">
                            {errors.password && <li>Mot de passe invalide</li>}
                            {(errors.confirmPassword || showMismatchError) && <li>Les mots de passe ne correspondent pas</li>}
                        </ul>
                    </div>
                </div>
            )}

            <Button disabled={isPending} type="submit" className="w-full mt-4">
                {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Modifier le mot de passe
            </Button>
        </form>
      </div>
    </div>
  );
}