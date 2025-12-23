export interface BibleVerse {
    text: string;
    reference: string;
  }
  
  export const DAILY_VERSES: Record<string, BibleVerse[]> = {
    'ALCOOL': [
      { text: "Ne vous enivrez pas de vin : c'est de la débauche. Soyez, au contraire, remplis de l'Esprit.", reference: "Éphésiens 5:18" },
      { text: "Le vin est moqueur, les boissons fortes sont tumultueuses ; quiconque en fait excès n'est pas sage.", reference: "Proverbes 20:1" }
    ],
    'TABAC': [
      { text: "Ne savez-vous pas que votre corps est le temple du Saint-Esprit qui est en vous ?", reference: "1 Corinthiens 6:19" },
      { text: "Tout m'est permis, mais tout n'est pas utile ; tout m'est permis, mais je ne me laisserai asservir par quoi que ce soit.", reference: "1 Corinthiens 6:12" }
    ],
    'PORNO': [
      { text: "Crée en moi un cœur pur, ô Dieu, renouvèle en moi un esprit bien disposé.", reference: "Psaume 51:10" },
      { text: "Heureux ceux qui ont le cœur pur, car ils verront Dieu !", reference: "Matthieu 5:8" }
    ],
    'ECRANS': [
      { text: "Détourne mes yeux de la vue des choses vaines, fais-moi vivre dans ta voie !", reference: "Psaume 119:37" },
      { text: "Fais attention à ta manière de vivre. Ne te conduis pas comme un ignorant, mais comme un sage.", reference: "Éphésiens 5:15" }
    ],
    'DEFAULT': [
      { text: "Je puis tout par celui qui me fortifie.", reference: "Philippiens 4:13" },
      { text: "Ne t'ai-je pas donné cet ordre : Fortifie-toi et prends courage ?", reference: "Josué 1:9" }
    ]
  };