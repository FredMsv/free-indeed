"use client";

import { useForm, type FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  resetPasswordSchema,
  type ResetPasswordFormValues,
} from "@/lib/validations/auth";
import { resetPasswordAction } from "@/lib/actions/auth-actions";
import { useAction } from "next-safe-action/hooks";

// ✅ CORRECTION 1 : Retour aux imports NOMMÉS (avec accolades)
// TypeScript a confirmé qu'il n'y a pas d'export par défaut.
import { Button } from "@/components/ui/Button";
import Input  from "@/components/ui/Input";

// ✅ Import du formulaire standard shadcn
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  // FormLabel, // On le retire car votre Input gère son propre label
  FormMessage,
} from "@/components/ui/form";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function ResetPasswordPage() {
  const router = useRouter();

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const { execute, status } = useAction(resetPasswordAction, {
    onSuccess: () => {
      toast.success("Mot de passe modifié avec succès");
      router.push("/login");
    },
    onError: ({ error }) => {
      const msg = error.serverError || "Une erreur est survenue";
      toast.error(msg);
    },
  });

  const onSubmit = (data: ResetPasswordFormValues) => {
    execute(data);
  };

  const onError = (formErrors: FieldErrors<ResetPasswordFormValues>) => {
    if (formErrors.confirmPassword) {
      toast.error(formErrors.confirmPassword.message);
    } else if (formErrors.password) {
      toast.error(formErrors.password.message);
    }
  };

  const isLoading = status === "executing";

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Réinitialisation du mot de passe
          </h1>
          <p className="text-sm text-muted-foreground">
            Nouveau mot de passe requis.
          </p>
        </div>

        <div className="grid gap-6">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit, onError)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      {/* ✅ CORRECTION 2 : Ajout de la prop 'label' obligatoire */}
                      <Input
                        label="Nouveau mot de passe"
                        placeholder="********"
                        type="password"
                        autoCapitalize="none"
                        autoComplete="new-password"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      {/* ✅ CORRECTION 2 : Ajout de la prop 'label' obligatoire */}
                      <Input
                        label="Confirmer le mot de passe"
                        placeholder="********"
                        type="password"
                        autoCapitalize="none"
                        autoComplete="new-password"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button disabled={isLoading} type="submit" className="w-full">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Modifier le mot de passe
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}