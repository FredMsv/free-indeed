import { getNotifications, markAllAsRead } from "@/lib/actions/notification-data-actions";
import Link from "next/link";
import { ArrowLeft, Bell, CheckCircle2, MessageCircle, Info } from "lucide-react";

export default async function NotificationsPage() {
  const notifications = await getNotifications(50); // On en charge un peu plus ici

  // On marque tout comme lu à l'ouverture de la page (UX simple)
  if (notifications.some(n => !n.is_read)) {
    await markAllAsRead();
  }

  const getIcon = (type: string) => {
    switch(type) {
        case 'support': return <MessageCircle size={20} className="text-purple-600"/>;
        case 'reminder': return <Bell size={20} className="text-yellow-600"/>;
        case 'challenge': return <CheckCircle2 size={20} className="text-green-600"/>;
        default: return <Info size={20} className="text-blue-600"/>;
    }
  };

  const getBg = (type: string) => {
    switch(type) {
        case 'support': return 'bg-purple-100';
        case 'reminder': return 'bg-yellow-100';
        case 'challenge': return 'bg-green-100';
        default: return 'bg-blue-100';
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <div className="flex items-center gap-4 mb-4">
        <Link href="/dashboard" className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-500 text-sm">Votre historique d&apos;activité.</p>
        </div>
      </div>

      <div className="space-y-3">
        {notifications.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-gray-200">
                <p className="text-gray-400">Aucune notification.</p>
                <p className="text-sm text-gray-500">Tout est calme pour le moment.</p>
            </div>
        ) : (
            notifications.map((notif) => (
                <Link 
                    href={notif.link || '#'} 
                    key={notif.id}
                    className={`block bg-white p-4 rounded-2xl border transition-all hover:shadow-md ${!notif.is_read ? 'border-l-4 border-l-blue-500 border-gray-100' : 'border-gray-100 opacity-80'}`}
                >
                    <div className="flex gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${getBg(notif.type)}`}>
                            {getIcon(notif.type)}
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <h3 className={`text-sm font-bold ${!notif.is_read ? 'text-gray-900' : 'text-gray-600'}`}>
                                    {notif.title}
                                </h3>
                                <span className="text-[10px] text-gray-400">
                                    {new Date(notif.created_at).toLocaleDateString()}
                                </span>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{notif.message}</p>
                        </div>
                    </div>
                </Link>
            ))
        )}
      </div>
    </div>
  );
}