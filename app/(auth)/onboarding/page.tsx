"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, FieldErrors, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { ChevronRight, ChevronLeft, Save, HeartPulse, Loader2 } from 'lucide-react';
import { onboardingSchema, step1Schema, type OnboardingFormValues } from '@/lib/validations/onboarding';
import { completeOnboardingAction } from '@/lib/actions/onboarding-actions';
import { createClient } from '@/lib/supabase/client'; // Vérifiez ce chemin (voir note plus bas)
import { toast } from 'sonner';

// ✅ IMPORT NOMMÉ (Standardisé avec votre projet)
import { Button } from '@/components/ui/Button';
import PhoneInput from '@/components/ui/PhoneInput';
import CustomDatePicker from '@/components/ui/CustomDatePicker';

// Définition propre du type Addiction pour éviter les 'any'
type AddictionType = {
  id: string;
  name?: string;  // Supabase field often 'name'
  label?: string; // Fallback
  icon?: string;
};

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(0);
  const [serverError, setServerError] = useState<string | null>(null);
  const router = useRouter();

  // ✅ TYPAGE STRICT
  const [addictions, setAddictions] = useState<AddictionType[]>([]);
  const [isLoadingAddictions, setIsLoadingAddictions] = useState(true);

  const today = new Date();
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(today.getFullYear() - 1);

  const {
    handleSubmit,
    setValue,
    getValues,
    setError,
    clearErrors,
    control,
    formState: { errors, isSubmitting }
  } = useForm<OnboardingFormValues>({
    resolver: zodResolver(onboardingSchema),
    mode: 'onChange',
    defaultValues: {
      addictionTypeId: '',
      sobrietyStartDate: '',
      emergencyContactPhone: '',
      pastorPhones: '',
      doctorPhone: ''
    }
  });

  const emergencyPhoneValue = useWatch({ control, name: 'emergencyContactPhone' });
  const pastorPhoneValue = useWatch({ control, name: 'pastorPhones' });
  const doctorPhoneValue = useWatch({ control, name: 'doctorPhone' });

  const [selectedAddictionId, setSelectedAddictionId] = useState<string>(getValues('addictionTypeId') || '');
  const [sobrietyDate, setSobrietyDate] = useState<string>(getValues('sobrietyStartDate') || '');

  // ✅ FETCH DES DONNÉES
  useEffect(() => {
    async function fetchAddictions() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('addiction_types')
          .select('*')
          .order('name'); 
        
        if (error) {
          console.error('Erreur fetch addictions:', error);
          toast.error("Impossible de charger les types d'addictions");
        } else {
          setAddictions(data || []);
        }
      } catch (err) {
        console.error("Erreur inattendue:", err);
      } finally {
        setIsLoadingAddictions(false);
      }
    }
    fetchAddictions();
  }, []);

  const handleAddictionSelect = (id: string) => {
    setSelectedAddictionId(id);
    setValue('addictionTypeId', id);
    if (errors.addictionTypeId) clearErrors('addictionTypeId');
  };

  const handleDateChange = (date: string) => {
    setSobrietyDate(date);
    setValue('sobrietyStartDate', date);
    if (errors.sobrietyStartDate) clearErrors('sobrietyStartDate');
  };

  const handleNext = () => {
    const values = getValues();
    const result = step1Schema.safeParse(values);

    if (result.success) {
      setServerError(null);
      setDirection(1);
      setStep(2);
    } else {
      result.error.issues.forEach((issue) => {
        const path = issue.path[0] as keyof OnboardingFormValues;
        setError(path, { message: issue.message });
      });
    }
  };

  const handleBack = () => {
    setDirection(-1);
    setStep(1);
  };

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x < -50 && step === 1) {
      handleNext();
    } else if (info.offset.x > 50 && step === 2) {
      handleBack();
    }
  };

  const onSubmit = async (data: OnboardingFormValues) => {
    setServerError(null);
    const result = await completeOnboardingAction(data);
    if (result?.error) {
      setServerError(result.error);
    } else {
      router.push('/dashboard');
    }
  };

  const onInvalid = (errors: FieldErrors<OnboardingFormValues>) => {
    console.error("Erreurs de validation :", errors);
  };

  const variants = {
    enter: (direction: number) => ({ x: direction > 0 ? "100%" : "-100%", opacity: 0, scale: 0.95 }),
    center: { zIndex: 1, x: 0, opacity: 1, scale: 1 },
    exit: (direction: number) => ({ zIndex: 0, x: direction < 0 ? "100%" : "-100%", opacity: 0, scale: 0.95 })
  };

  const transition = { x: { type: "tween", ease: "easeInOut", duration: 0.4 }, opacity: { duration: 0.3 } } as const;

  return (
    <div className="min-h-screen bg-gray-bg flex flex-col justify-center p-4 sm:p-6">
      <div className="max-w-xl w-full mx-auto bg-white p-6 sm:p-8 rounded-3xl shadow-xl border border-white/50 relative">
        
        {/* Progress Bar */}
        <div className="flex gap-2 mb-8">
          <div className={`h-1.5 flex-1 rounded-full transition-colors duration-500 ${step >= 1 ? 'bg-gold' : 'bg-gray-100'}`} />
          <div className={`h-1.5 flex-1 rounded-full transition-colors duration-500 ${step >= 2 ? 'bg-gold' : 'bg-gray-100'}`} />
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-2 font-sans">
          {step === 1 ? "Votre combat" : "Vos soutiens"}
        </h1>
        <p className="text-gray-500 mb-8">
          {step === 1 ? "Définissons ensemble votre point de départ." : "Vous n'êtes pas seul. Entourez-vous."}
        </p>

        {serverError && (
          <div className="bg-error/10 text-error p-3 rounded-xl mb-6 text-sm font-medium animate-in slide-in-from-top-2">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="relative overflow-x-hidden min-h-[600px]">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            
            {/* --- ÉTAPE 1 --- */}
            {step === 1 && (
              <motion.div
                key="step1"
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={transition}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                onDragEnd={handleDragEnd}
                className="space-y-8 absolute w-full pb-8"
              >
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-text ml-1">Ce dont je me libère</label>
                  
                  {isLoadingAddictions ? (
                    <div className="grid grid-cols-2 gap-3">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="h-24 bg-gray-100 rounded-xl animate-pulse" />
                        ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3">
                        {addictions.length > 0 ? (
                            addictions.map((addiction) => (
                            <button
                                key={addiction.id}
                                type="button"
                                onClick={() => handleAddictionSelect(addiction.id)}
                                className={`
                                p-4 rounded-xl border text-left transition-all duration-200
                                ${selectedAddictionId === addiction.id 
                                    ? 'border-gold bg-gold/5 ring-1 ring-gold/20' 
                                    : 'border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50'}
                                `}
                            >
                                <span className="text-2xl mb-2 block">{addiction.icon || '🎯'}</span>
                                {/* ✅ CORRECTION 'ANY' : Utilisation du type sécurisé */}
                                <span className={`text-sm font-medium ${selectedAddictionId === addiction.id ? 'text-gray-900' : 'text-gray-600'}`}>
                                  {addiction.name || addiction.label || 'Inconnu'}
                                </span>
                            </button>
                            ))
                        ) : (
                            <div className="col-span-2 text-center text-sm text-gray-500 py-4 bg-gray-50 rounded-xl">
                                Aucune catégorie trouvée.
                            </div>
                        )}
                    </div>
                  )}
                  {errors.addictionTypeId && <p className="text-xs text-error ml-1">{errors.addictionTypeId.message}</p>}
                </div>

                <div className="relative z-50">
                    <CustomDatePicker
                    label="Date de début de sobriété"
                    value={sobrietyDate}
                    onChange={handleDateChange}
                    error={errors.sobrietyStartDate?.message}
                    minDate={oneYearAgo}
                    maxDate={today}
                    />
                </div>

                {/* ✅ CORRECTION BUTTON : Syntaxe standard (Children) */}
                <Button 
                  type="button"
                  onClick={handleNext} 
                  className="w-full"
                >
                  Continuer <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </motion.div>
            )}

            {/* --- ÉTAPE 2 --- */}
            {step === 2 && (
              <motion.div
                key="step2"
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={transition}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                onDragEnd={handleDragEnd}
                className="space-y-6 absolute w-full pb-8"
              >
                <div className="bg-red-50 p-4 rounded-xl border border-red-100 space-y-4">
                  <div className="flex items-center gap-2 text-red-800 font-medium mb-2">
                    <HeartPulse size={18} />
                    Contact d`&apos;Urgence (SOS)
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-text ml-1">Numéro de téléphone</label>
                    <PhoneInput 
                      value={emergencyPhoneValue || ''}
                      onChange={(val) => setValue('emergencyContactPhone', val, { shouldValidate: true })}
                      error={errors.emergencyContactPhone?.message}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-gray-900 ml-1">Soutiens spirituels & médicaux (Optionnel)</h3>
                  
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-500 ml-1">Pasteur / Mentor</label>
                    <PhoneInput 
                      value={pastorPhoneValue || ''}
                      onChange={(val) => setValue('pastorPhones', val)}
                      error={errors.pastorPhones?.message}
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-500 ml-1">Médecin</label>
                    <PhoneInput 
                      value={doctorPhoneValue || ''}
                      onChange={(val) => setValue('doctorPhone', val)}
                      error={errors.doctorPhone?.message}
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  {/* ✅ CORRECTION BUTTON : Syntaxe standard */}
                  <Button 
                    type="button" 
                    variant="secondary"
                    onClick={handleBack} 
                    className="flex-1"
                  >
                    <ChevronLeft className="mr-2 h-4 w-4" /> Retour
                  </Button>
                  
                  <Button 
                    type="submit" 
                    disabled={isSubmitting} 
                    className="flex-[2]"
                  >
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Terminer <Save className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </form>
      </div>
    </div>
  );
}