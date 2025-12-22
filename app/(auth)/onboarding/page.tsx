"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
// ✅ Import de Controller indispensable pour les champs dynamiques
import { useForm, useWatch, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Save, Check, Loader2, LucideIcon, Plus, Trash2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

import { onboardingSchema, type OnboardingFormValues } from '@/lib/validations/onboarding';
import { completeOnboardingAction } from '@/lib/actions/onboarding-actions';
import { createClient } from '@/lib/supabase/client';
import { EMOTIONAL_TRIGGERS, CONTEXT_HABITS, SPECIFIC_BEHAVIORS } from '@/lib/constants/habits';

import { Button } from '@/components/ui/Button';
import PhoneInput from '@/components/ui/PhoneInput';
import CustomDatePicker from '@/components/ui/CustomDatePicker';

// --- COMPOSANT CARD ---
const SelectionCard = ({ 
  label, 
  icon: Icon, 
  selected, 
  onClick 
}: { 
  id?: string, 
  label: string, 
  icon?: LucideIcon, 
  selected: boolean, 
  onClick: () => void 
}) => (
  <div
    onClick={onClick}
    className={`
      cursor-pointer p-4 rounded-xl border flex items-center gap-4 transition-all duration-200 group
      ${selected 
        ? 'border-gold bg-gold/5 ring-1 ring-gold/20' 
        : 'border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50'}
    `}
  >
    {Icon && (
      <div className={`
        p-2 rounded-lg transition-colors
        ${selected ? 'bg-gold/20 text-gold' : 'bg-gray-100 text-gray-500 group-hover:text-gray-700'}
      `}>
        <Icon size={20} strokeWidth={2} />
      </div>
    )}
    
    <span className={`flex-1 text-sm font-medium ${selected ? 'text-gray-900' : 'text-gray-600'}`}>
      {label}
    </span>
    
    {selected && (
      <div className="text-gold animate-in zoom-in spin-in-90 duration-300">
        <Check size={18} strokeWidth={3} />
      </div>
    )}
  </div>
);

type AddictionType = { id: string; name: string; icon: string | null; };
type MultiSelectField = 'emotionalTriggers' | 'contextHabits' | 'specificBehaviors';

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(0);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isStepLocked, setIsStepLocked] = useState(false);

  const router = useRouter();
  const [addictions, setAddictions] = useState<AddictionType[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isLoadingAddictions, setIsLoadingAddictions] = useState(true);

  const today = new Date();
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(today.getFullYear() - 1);

  // Timer anti double-clic
  useEffect(() => {
    const timer = setTimeout(() => setIsStepLocked(false), 800);
    return () => clearTimeout(timer);
  }, [step]);

  const {
    handleSubmit,
    setValue,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getValues,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setError,
    control,
    formState: { errors, isSubmitting }
  } = useForm<OnboardingFormValues>({
    resolver: zodResolver(onboardingSchema),
    mode: 'onChange',
    defaultValues: {
      addictionTypeId: '',
      sobrietyStartDate: '',
      emotionalTriggers: [],
      contextHabits: [],
      specificBehaviors: [],
      emergencyContactPhone: '',
      pastorPhones: [''], // Un champ vide par défaut
      doctorPhone: ''
    }
  });

  // Gestion dynamique des champs Pasteurs
  const { fields, append, remove } = useFieldArray({
    control,
    name: "pastorPhones" as never, 
  });

  const selectedAddictionId = useWatch({ control, name: 'addictionTypeId' });
  const sobrietyDate = useWatch({ control, name: 'sobrietyStartDate' });
  
  const emotionalTriggers = (useWatch({ control, name: 'emotionalTriggers' }) || []) as string[];
  const contextHabits = (useWatch({ control, name: 'contextHabits' }) || []) as string[];
  const specificBehaviors = (useWatch({ control, name: 'specificBehaviors' }) || []) as string[];

  const emergencyPhoneValue = useWatch({ control, name: 'emergencyContactPhone' });
  const doctorPhoneValue = useWatch({ control, name: 'doctorPhone' });

  // 1. Fetch Addictions
  useEffect(() => {
    async function fetchAddictions() {
      const supabase = createClient();
      const { data } = await supabase.from('addiction_types').select('id, name, icon').order('name');
      if (data) {
        setAddictions(data);
      }
      setIsLoadingAddictions(false);
    }
    fetchAddictions();
  }, []);

  const toggleSelection = (field: MultiSelectField, currentArray: string[], value: string) => {
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    
    setValue(field, newArray, { shouldValidate: true });
  };

  const handleNext = () => {
    if (isStepLocked) return;

    if (step === 1 && (!selectedAddictionId || !sobrietyDate)) {
      toast.error("Veuillez remplir les champs obligatoires");
      return;
    }

    setIsStepLocked(true);
    setDirection(1);
    setStep(s => s + 1);
  };

  const handleBack = () => {
    if (isStepLocked) return;
    setIsStepLocked(true);
    setDirection(-1);
    setStep(s => s - 1);
  };

  const onSubmit = async (data: OnboardingFormValues) => {
    setServerError(null);
    const result = await completeOnboardingAction(data);
    if (result?.error) {
      setServerError(result.error);
      toast.error(result.error);
    } else {
      toast.success("Profil configuré !");
      router.refresh();
      router.push('/dashboard');
    }
  };

  const selectedAddictionName = addictions.find(a => a.id === selectedAddictionId)?.name || 'default';
  const specificOptions = SPECIFIC_BEHAVIORS[selectedAddictionName] || SPECIFIC_BEHAVIORS['default'];

  const variants = {
    enter: (direction: number) => ({ x: direction > 0 ? "100%" : "-100%", opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (direction: number) => ({ x: direction < 0 ? "100%" : "-100%", opacity: 0 })
  };
  const transition = { type: "spring", bounce: 0, duration: 0.35 } as const;

  return (
    <div className="min-h-screen bg-gray-bg flex flex-col justify-center p-4 sm:p-6 overflow-hidden">
      <div className="max-w-xl w-full mx-auto bg-white p-6 sm:p-8 rounded-3xl shadow-xl border border-white/50 relative flex flex-col h-[700px]">
        
        {/* Progress Bar */}
        <div className="flex gap-1.5 mb-6">
          {[1, 2, 3, 4, 5].map((s) => (
            <div key={s} className={`h-1.5 flex-1 rounded-full transition-colors duration-500 ${step >= s ? 'bg-gold' : 'bg-gray-100'}`} />
          ))}
        </div>

        {/* Titres dynamiques */}
        <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 font-sans">
            {step === 1 && "Votre combat"}
            {step === 2 && "Vos déclencheurs"}
            {step === 3 && "Vos contextes"}
            {step === 4 && "Vos habitudes"}
            {step === 5 && "Vos soutiens"}
            </h1>
            <p className="text-gray-500 text-sm">
            {step === 1 && "Définissons votre point de départ."}
            {step === 2 && "Quelles émotions provoquent l'envie ?"}
            {step === 3 && "Quand et où êtes-vous le plus vulnérable ?"}
            {step === 4 && "Quels comportements adoptez-vous ?"}
            {step === 5 && "En cas d'urgence, qui appeler ?"}
            </p>

            {serverError && (
              <div className="mt-2 text-xs text-error font-medium">{serverError}</div>
            )}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 flex flex-col relative overflow-hidden">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            
            {/* STEP 1: Addiction & Date */}
            {step === 1 && (
              <motion.div key="step1" custom={direction} variants={variants} initial="enter" animate="center" exit="exit" transition={transition} className="space-y-6 absolute w-full h-full overflow-y-auto pb-20">
                 <div className="grid grid-cols-2 gap-3">
                    {addictions.map((addiction) => (
                      <button
                        key={addiction.id} type="button"
                        onClick={() => setValue('addictionTypeId', addiction.id, { shouldValidate: true })}
                        className={`p-3 rounded-xl border text-left transition-all ${selectedAddictionId === addiction.id ? 'border-gold bg-gold/5 ring-1 ring-gold/20' : 'border-gray-200 hover:bg-gray-50'}`}
                      >
                        <span className="text-2xl block mb-1">{addiction.icon}</span>
                        <span className="text-sm font-medium">{addiction.name}</span>
                      </button>
                    ))}
                  </div>
                  <CustomDatePicker label="Date de début" value={sobrietyDate} onChange={(d) => setValue('sobrietyStartDate', d)} minDate={oneYearAgo} maxDate={today} />
              </motion.div>
            )}

            {/* STEP 2: Emotionnel */}
            {step === 2 && (
              <motion.div key="step2" custom={direction} variants={variants} initial="enter" animate="center" exit="exit" transition={transition} className="space-y-3 absolute w-full h-full overflow-y-auto pb-20">
                {EMOTIONAL_TRIGGERS.map((item) => (
                  <SelectionCard 
                    key={item.id} 
                    {...item} 
                    selected={emotionalTriggers.includes(item.id)} 
                    onClick={() => toggleSelection('emotionalTriggers', emotionalTriggers, item.id)} 
                  />
                ))}
              </motion.div>
            )}

            {/* STEP 3: Contexte */}
            {step === 3 && (
              <motion.div key="step3" custom={direction} variants={variants} initial="enter" animate="center" exit="exit" transition={transition} className="space-y-3 absolute w-full h-full overflow-y-auto pb-20">
                {CONTEXT_HABITS.map((item) => (
                  <SelectionCard 
                    key={item.id} 
                    {...item} 
                    selected={contextHabits.includes(item.id)} 
                    onClick={() => toggleSelection('contextHabits', contextHabits, item.id)} 
                  />
                ))}
              </motion.div>
            )}

            {/* STEP 4: Spécifique */}
            {step === 4 && (
              <motion.div key="step4" custom={direction} variants={variants} initial="enter" animate="center" exit="exit" transition={transition} className="space-y-3 absolute w-full h-full overflow-y-auto pb-20">
                {specificOptions.map((item) => (
                  <SelectionCard 
                    key={item.id}
                    id={item.id} 
                    label={item.label} 
                    icon={item.icon}
                    selected={specificBehaviors.includes(item.id)} 
                    onClick={() => toggleSelection('specificBehaviors', specificBehaviors, item.id)} 
                  />
                ))}
              </motion.div>
            )}

            {/* STEP 5: Contacts */}
            {step === 5 && (
              <motion.div key="step5" custom={direction} variants={variants} initial="enter" animate="center" exit="exit" transition={transition} className="space-y-6 absolute w-full h-full overflow-y-auto pb-20">
                
                {/* Contact SOS (Optionnel maintenant) */}
                <div className="bg-red-50 p-4 rounded-xl border border-red-100">
                    {/* ✅ CORRECTION LABEL : "Optionnel" au lieu de "Obligatoire" */}
                    <label className="text-sm font-medium text-red-800 block mb-2">Contact SOS (Optionnel)</label>
                    <PhoneInput value={emergencyPhoneValue || ''} onChange={(v) => setValue('emergencyContactPhone', v)} error={errors.emergencyContactPhone?.message} />
                    <p className="text-xs text-red-600/80 mt-2">Recommandé en cas de forte tentation.</p>
                </div>

                <div className="space-y-4">
                    <label className="text-sm font-medium text-gray-700 block">Pasteurs ou Mentors (Optionnel)</label>
                    
                    {/* LISTE DYNAMIQUE DES PASTEURS */}
                    <div className="space-y-3">
                        {fields.map((field, index) => (
                            <div key={field.id} className="flex items-start gap-2">
                                <div className="flex-1">
                                    {/* ✅ CORRECTION FOCUS : Utilisation de Controller + field.id comme key */}
                                    <Controller
                                      control={control}
                                      name={`pastorPhones.${index}`}
                                      render={({ field: { onChange, value } }) => (
                                        <PhoneInput 
                                            value={value} 
                                            onChange={onChange}
                                            // Placeholder dynamique pour guider
                                            // placeholder={`Numéro pasteur ${index + 1}`} 
                                        />
                                      )}
                                    />
                                </div>
                                {/* ✅ CORRECTION : Bouton supprimer dès le 2ème champ (index 1) */}
                                {index > 0 && (
                                    <button
                                        type="button"
                                        onClick={() => remove(index)}
                                        className="mt-1 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Supprimer ce numéro"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                )}
                            </div>
                        ))}

                        {/* ✅ CORRECTION LIMITE : Message si 3 numéros atteints, sinon bouton Ajouter */}
                        {fields.length < 3 ? (
                            <button
                                type="button"
                                onClick={() => append('')}
                                className="flex items-center gap-2 text-sm font-medium text-gold hover:text-gold-accent transition-colors px-1 py-1"
                            >
                                <div className="w-5 h-5 rounded-full border border-gold flex items-center justify-center">
                                    <Plus size={12} strokeWidth={3} />
                                </div>
                                Ajouter un autre numéro
                            </button>
                        ) : (
                            <div className="flex items-center gap-2 text-xs text-warning font-medium bg-warning/10 p-2 rounded-lg animate-in fade-in">
                                <AlertCircle size={14} />
                                Vous avez atteint le nombre maximum de 3 contacts.
                            </div>
                        )}
                    </div>

                    <div className="pt-2 border-t border-gray-100">
                        <label className="text-sm font-medium text-gray-700 block mb-2">Médecin (Optionnel)</label>
                        <PhoneInput value={doctorPhoneValue || ''} onChange={(v) => setValue('doctorPhone', v)} />
                    </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="absolute bottom-0 left-0 right-0 bg-white pt-4 border-t border-gray-100 flex gap-3">
            {step > 1 && (
                <Button 
                    type="button" 
                    variant="secondary" 
                    onClick={handleBack} 
                    className="flex-1"
                    disabled={isStepLocked}
                >
                    <ChevronLeft className="mr-2 h-4 w-4" /> Retour
                </Button>
            )}
            {step < 5 ? (
                <Button 
                    type="button" 
                    onClick={handleNext} 
                    className="flex-[2]"
                    disabled={isStepLocked}
                >
                    Continuer <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
            ) : (
                <Button 
                    type="submit" 
                    disabled={isSubmitting || isStepLocked} 
                    className="flex-[2]"
                >
                    {isSubmitting ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <>Terminer <Save className="ml-2 h-4 w-4" /></>
                    )}
                </Button>
            )}
          </div>

        </form>
      </div>
    </div>
  );
}