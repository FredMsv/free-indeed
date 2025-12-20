import { CheckCircle2, Trophy, CalendarDays } from 'lucide-react';

export default function DashboardPage() {
  // Simulé pour l'instant (viendra de la DB plus tard)
  const userFirstName = "Thomas"; 
  const daysSober = 12;

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* 👋 Header de bienvenue */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bonjour, {userFirstName} 👋</h1>
          <p className="text-gray-500">Un jour à la fois. Voici votre progression.</p>
        </div>
        <div className="text-sm bg-gold/10 text-gold px-4 py-2 rounded-full font-medium self-start md:self-auto">
          Phase : Stabilisation
        </div>
      </div>

      {/* 📊 Grille de Widgets Principaux */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Widget 1: Compteur Principal */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gold"></div>
          <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center mb-4 text-gold">
            <Trophy size={24} />
          </div>
          <span className="text-4xl font-bold text-gray-900 mb-1">{daysSober}</span>
          <span className="text-sm text-gray-500 font-medium uppercase tracking-wide">Jours de liberté</span>
        </div>

        {/* Widget 2: Engagement Quotidien */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4 text-gray-900 font-semibold">
              <CheckCircle2 className="text-gray-400" size={20} />
              Engagement du jour
            </div>
            <p className="text-gray-600 text-sm">
              Je m&apos;engage à rester sobre aujourd&apos;hui, peu importent les défis.
            </p>
          </div>
          <button className="mt-4 w-full py-2 bg-gray-50 hover:bg-gold hover:text-white text-gray-600 font-medium rounded-lg transition-all text-sm border border-gray-200 hover:border-gold">
            Je valide mon engagement
          </button>
        </div>

        {/* Widget 3: Prochaine étape */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-4 text-gray-900 font-semibold">
            <CalendarDays className="text-blue-500" size={20} />
            Prochain Jalon
          </div>
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Objectif 14 jours</span>
              <span className="text-gray-900 font-medium">85%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full" style={{ width: '85%' }}></div>
            </div>
            <p className="text-xs text-gray-400">Plus que 2 jours pour atteindre votre prochain trophée !</p>
          </div>
        </div>

      </div>

      {/* Zone de contenu secondaire (Graphique / Journal) - Vide pour l'instant */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 min-h-[300px] flex items-center justify-center text-gray-400 border-dashed">
        <p>Bientôt : Graphique d&apos;humeur et Journal de bord</p>
      </div>

    </div>
  );
}