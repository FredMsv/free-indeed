"use client";

import { useState, useEffect, useTransition } from 'react';
import { Bell, BellOff, Loader2, Clock, Users, CheckCircle2, Mountain, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { 
  getNotificationSettings, 
  updateNotificationSettings, 
  unsubscribeFromPush 
} from '@/lib/actions/notification-actions';
import { NotificationSettings, DEFAULT_NOTIFICATION_SETTINGS } from '@/lib/types/user-settings';

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export default function NotificationManager() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, startTransition] = useTransition();
  const [settings, setSettings] = useState<NotificationSettings>(DEFAULT_NOTIFICATION_SETTINGS);

  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      setIsSupported(true);
      checkSubscription();
      loadSettings();
    } else {
      setIsLoading(false);
    }
  }, []);

  async function loadSettings() {
    const data = await getNotificationSettings();
    setSettings(data);
  }

  async function checkSubscription() {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      setIsSubscribed(!!subscription);
    } catch (error) {
      console.error('SW Error:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function subscribeToPush() {
    setIsLoading(true);
    try {
      const registration = await navigator.serviceWorker.ready;
      const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      if (!vapidKey) throw new Error("Clé VAPID manquante");

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidKey)
      });

      const response = await fetch('/api/notifications/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ subscription, userAgent: navigator.userAgent })
      });

      if (!response.ok) throw new Error('Erreur sauvegarde serveur');
      setIsSubscribed(true);
      toast.success("Notifications activées !");
    } catch (error) {
      console.error('Subscription error:', error);
      toast.error("Impossible d'activer les notifications.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleUnsubscribe() {
    if (!confirm("Voulez-vous vraiment désactiver toutes les notifications ?")) return;
    setIsLoading(true);
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      if (subscription) await subscription.unsubscribe();
      await unsubscribeFromPush();
      setIsSubscribed(false);
      toast.success("Notifications désactivées.");
    } catch (error) {
      toast.error("Erreur lors de la désactivation.");
    } finally {
      setIsLoading(false);
    }
  }

  const handleSettingChange = (key: keyof NotificationSettings, value: boolean | string) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    startTransition(async () => {
      const res = await updateNotificationSettings(newSettings);
      if (!res.success) toast.error("Erreur de sauvegarde");
    });
  };

  if (!isSupported) return <div className="p-4 bg-gray-50 rounded-xl text-sm text-gray-500">Non supporté.</div>;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex items-center justify-between">
        <div className="flex gap-4 items-center">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isSubscribed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
            {isSubscribed ? <Bell size={20} /> : <BellOff size={20} />}
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-sm">Notifications Push</h3>
            <p className="text-xs text-gray-500">{isSubscribed ? "Actives" : "Désactivées"}</p>
          </div>
        </div>
        {!isSubscribed ? (
          <button onClick={subscribeToPush} disabled={isLoading} className="px-4 py-2 bg-gray-900 text-white rounded-xl text-xs font-bold hover:bg-black transition-all">
            {isLoading ? <Loader2 className="animate-spin" size={14} /> : "Activer"}
          </button>
        ) : (
          <button onClick={handleUnsubscribe} disabled={isLoading} className="px-3 py-1.5 bg-red-50 text-red-600 border border-red-100 rounded-lg text-xs font-bold hover:bg-red-100 transition-all">Désactiver</button>
        )}
      </div>

      {isSubscribed && (
        <div className="p-6 space-y-6 bg-gray-50/50 animate-in slide-in-from-top-2">
          
          {/* 1. RAPPEL QUOTIDIEN */}
          <div className="flex items-start justify-between">
            <div className="flex gap-3">
                <div className="mt-0.5 text-blue-500"><Clock size={18} /></div>
                <div>
                    <label className="text-sm font-bold text-gray-900 block">Rappel d&apos;engagement</label>
                    <p className="text-xs text-gray-500">Valider votre journée.</p>
                </div>
            </div>
            <div className="flex flex-col items-end gap-2">
                <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={settings.daily_reminder} onChange={(e) => handleSettingChange('daily_reminder', e.target.checked)} className="sr-only peer" />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-500"></div>
                </label>
                {settings.daily_reminder && (
                    <input type="time" value={settings.reminder_time} onChange={(e) => handleSettingChange('reminder_time', e.target.value)} className="text-xs border border-gray-200 rounded-lg p-1 bg-white text-gray-700 outline-none" />
                )}
            </div>
          </div>

          <div className="h-px bg-gray-200" />

          {/* 2. DÉFIS HEBDOMADAIRES */}
          <div className="flex items-start justify-between">
            <div className="flex gap-3">
                <div className="mt-0.5 text-yellow-600"><Mountain size={18} /></div>
                <div>
                    <label className="text-sm font-bold text-gray-900 block">Défis Hebdomadaires</label>
                    <p className="text-xs text-gray-500">Recevoir mon nouveau défi.</p>
                </div>
            </div>
            <div className="flex flex-col items-end gap-2">
                <div className="flex gap-1">
                    <select 
                        value={settings.challenge_day}
                        onChange={(e) => handleSettingChange('challenge_day', e.target.value)}
                        className="text-xs border border-gray-200 rounded-lg p-1 bg-white text-gray-700 outline-none"
                    >
                        <option value="1">Lundi</option>
                        <option value="2">Mardi</option>
                        <option value="3">Mercredi</option>
                        <option value="4">Jeudi</option>
                        <option value="5">Vendredi</option>
                        <option value="6">Samedi</option>
                        <option value="7">Dimanche</option>
                    </select>
                    <input type="time" value={settings.challenge_time} onChange={(e) => handleSettingChange('challenge_time', e.target.value)} className="text-xs border border-gray-200 rounded-lg p-1 bg-white text-gray-700 outline-none" />
                </div>
            </div>
          </div>
          
          {/* 2b. RAPPELS RETARD */}
          <div className="flex items-start justify-between pl-8">
             <div className="flex gap-2 items-center">
                <AlertCircle size={14} className="text-gray-400"/>
                <span className="text-xs text-gray-500">Rappels si défi non validé</span>
             </div>
             <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={settings.challenge_reminders} onChange={(e) => handleSettingChange('challenge_reminders', e.target.checked)} className="sr-only peer" />
                <div className="w-9 h-4 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-yellow-500"></div>
             </label>
          </div>

          <div className="h-px bg-gray-200" />

          {/* 3. COMMUNAUTÉ */}
          <div className="flex items-start justify-between">
            <div className="flex gap-3">
                <div className="mt-0.5 text-purple-500"><Users size={18} /></div>
                <div>
                    <label className="text-sm font-bold text-gray-900 block">Groupe de soutien</label>
                    <p className="text-xs text-gray-500">Activité du chat.</p>
                </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={settings.community_activity} onChange={(e) => handleSettingChange('community_activity', e.target.checked)} className="sr-only peer" />
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-500"></div>
            </label>
          </div>

          <div className="flex justify-end pt-2">
             {isSaving ? <span className="text-[10px] text-gray-400 flex items-center gap-1"><Loader2 size={10} className="animate-spin"/> Sauvegarde...</span> : <span className="text-[10px] text-green-600 flex items-center gap-1"><CheckCircle2 size={10}/> Enregistré</span>}
          </div>
        </div>
      )}
    </div>
  );
}