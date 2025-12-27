"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, ShieldAlert, Menu, LogOut, Activity, 
  Settings, Book, HandHelping, LucideUser, Mountain, Bell 
} from 'lucide-react';
import { signOutAction } from '@/lib/actions/auth-actions';
import { getUnreadNotificationCount } from '@/lib/actions/notification-data-actions';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';
import { Tables } from '@/lib/types/supabase';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const pathname = usePathname();
  const supabase = createClient();

  useEffect(() => {
    const fetchInitialData = async () => {
        const count = await getUnreadNotificationCount();
        setUnreadCount(count);
    };
    fetchInitialData();

    // ÉCOUTEUR TEMPS RÉEL UNIVERSEL
    const channel = supabase
      .channel('realtime_notifications')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notifications' },
        (payload) => {
          const newNotif = payload.new as Tables<'notifications'>;
          
          // 1. Incrémenter le badge visuel
          setUnreadCount(prev => prev + 1);

          // 2. Déclencher le Toast pour TOUTE notification [cite: 264]
          toast(newNotif.title, {
            description: newNotif.message,
            duration: 6000,
            action: newNotif.link ? {
              label: 'Ouvrir',
              onClick: () => window.location.href = newNotif.link as string
            } : undefined
          });

          // 3. Animation spécifique si c'est un badge
          if (newNotif.type === 'challenge') {
            confetti({
              particleCount: 150,
              spread: 70,
              origin: { y: 0.6 },
              colors: ['#ffc300', '#ffffff', '#4CAF50']
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  const navigation = [
    { name: 'Tableau de bord', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Mon Journal', href: '/journal', icon: Book },
    { name: 'Défis', href: '/challenges', icon: Mountain },
    { name: 'Mes statistiques', href: '/stats', icon: Activity },
    { name: 'Communauté', href: '/community', icon: HandHelping},
    { name: 'Mon Profil', href: '/profile', icon: LucideUser },
    { name: 'Notifications', href: '/notifications', icon: Bell, badge: unreadCount },
    { name: 'Paramètres', href: '/settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out flex flex-col h-full
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
          <div className="h-16 flex items-center px-6 border-b border-gray-100 flex-shrink-0">
            <span className="text-xl font-bold font-sans text-gray-900">Free <span className="text-gold">Indeed</span></span>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-colors relative
                    ${isActive 
                      ? 'bg-gold/10 text-gold' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
                  `}
                >
                  <div className="relative">
                    <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                    {item.badge ? (
                        <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full border-2 border-white">
                            {item.badge > 9 ? '9+' : item.badge}
                        </span>
                    ) : null}
                  </div>
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-gray-100 space-y-2 flex-shrink-0">
            <Link href="/sos">
              <div className="flex items-center justify-center gap-2 w-full bg-error/10 text-error font-bold py-3 rounded-xl hover:bg-error/20 transition-colors cursor-pointer">
                <ShieldAlert size={20} />
                SOS
              </div>
            </Link>
            
            <button 
              onClick={() => signOutAction()}
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-400 hover:text-gray-600 w-full transition-colors"
            >
              <LogOut size={20} />
              Déconnexion
            </button>
          </div>
      </aside>

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:hidden flex-shrink-0">
          <span className="font-bold text-gray-900">Tableau de bord</span>
          <div className="flex items-center gap-4">
             <Link href="/notifications" className="relative text-gray-600">
                <Bell size={24} />
                {unreadCount > 0 && <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />}
             </Link>
             <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-gray-600">
                <Menu size={24} />
             </button>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8 overflow-y-auto bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}