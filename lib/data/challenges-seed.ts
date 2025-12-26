export interface ChallengeSeed {
    week_number: number;
    type: 'specific' | 'transversal';
    target_addiction: string; // "Tous", "Alcool", "Tabac", etc.
    title: string;
    description: string;
    action_text: string;
    scripture_text: string;
    scripture_reference: string;
  }

export const CHALLENGES_DATA = [
    {
      "week_number": 1,
      "type": "specific",
      "target_addiction": "Alcool",
      "title": "Faire place nette",
      "description": "L'environnement déclenche l'envie. Cette semaine, retirez toute trace d'alcool de votre domicile pour ne pas tenter le diable.",
      "action_text": "J'ai vidé ma maison de tout alcool.",
      "scripture_text": "Ne donnez aucune prise au diable.",
      "scripture_reference": "Éphésiens 4:27"
    },
    {
      "week_number": 1,
      "type": "specific",
      "target_addiction": "Tabac",
      "title": "La date d'arrêt",
      "description": "L'engagement commence par une décision datée. Fixez votre 'Jour J' ou, si c'est déjà fait, jetez tous les cendriers et briquets.",
      "action_text": "J'ai jeté mes accessoires fumeurs.",
      "scripture_text": "Fortifie-toi et prends courage. Ne t'effraie point et ne t'épouvante point.",
      "scripture_reference": "Josué 1:9"
    },
    {
      "week_number": 1,
      "type": "specific",
      "target_addiction": "Porno",
      "title": "Couper l'accès",
      "description": "La volonté ne suffit pas toujours. Installez un filtre internet ou bloquez les sites à risque sur vos appareils. C'est un acte d'humilité.",
      "action_text": "J'ai installé un filtre de contenu.",
      "scripture_text": "Fuis les passions de la jeunesse.",
      "scripture_reference": "2 Timothée 2:22"
    },
    {
      "week_number": 1,
      "type": "specific",
      "target_addiction": "Ecrans",
      "title": "Le couvre-feu digital",
      "description": "Le sommeil est crucial pour la volonté. Bannissez les écrans de votre chambre à coucher pour retrouver le repos de Dieu.",
      "action_text": "J'ai sorti les écrans de ma chambre.",
      "scripture_text": "En paix je me couche et je m'endors, car toi seul, Seigneur, tu me donnes la sécurité.",
      "scripture_reference": "Psaume 4:9"
    },
    {
      "week_number": 2,
      "type": "transversal",
      "target_addiction": "Tous",
      "title": "Identité Retrouvée",
      "description": "Vous n'êtes pas votre addiction. Vous êtes un enfant de Dieu. Cette semaine, rappelez-vous qui vous êtes vraiment en Christ.",
      "action_text": "J'ai écrit 'Je suis aimé de Dieu' sur mon miroir.",
      "scripture_text": "Si quelqu'un est en Christ, il est une nouvelle créature.",
      "scripture_reference": "2 Corinthiens 5:17"
    },
    {
      "week_number": 3,
      "type": "specific",
      "target_addiction": "Alcool",
      "title": "Identifier les déclencheurs (HALT)",
      "description": "La faim, la colère, la solitude ou la fatigue (HALT) mènent souvent au verre. Notez chaque envie et l'émotion associée.",
      "action_text": "J'ai noté mes émotions lors d'une envie.",
      "scripture_text": "Soyez sobres, veillez. Votre adversaire, le diable, rôde comme un lion rugissant.",
      "scripture_reference": "1 Pierre 5:8"
    },
    {
      "week_number": 3,
      "type": "specific",
      "target_addiction": "Tabac",
      "title": "Remplacer le geste",
      "description": "Le besoin oral est fort. Préparez des bâtons de carotte, des chewing-gums ou de l'eau pour occuper votre bouche quand l'envie monte.",
      "action_text": "J'ai utilisé un substitut sain à chaque envie.",
      "scripture_text": "Tout m'est permis, mais je ne me laisserai asservir par rien.",
      "scripture_reference": "1 Corinthiens 6:12"
    },
    {
      "week_number": 3,
      "type": "specific",
      "target_addiction": "Porno",
      "title": "La transparence radicale",
      "description": "Le secret nourrit l'addiction. Confiez votre lutte à une personne de confiance ou un groupe. Brisez le silence pour briser la honte.",
      "action_text": "J'ai parlé de ma lutte à une personne de confiance.",
      "scripture_text": "Confessez donc vos péchés les uns aux autres, et priez les uns pour les autres.",
      "scripture_reference": "Jacques 5:16"
    },
    {
      "week_number": 3,
      "type": "specific",
      "target_addiction": "Ecrans",
      "title": "La zone blanche",
      "description": "Définissez des zones ou des moments 'sans téléphone' (ex: à table, aux toilettes). Redécouvrez la présence aux autres.",
      "action_text": "J'ai respecté mes zones sans téléphone.",
      "scripture_text": "Rachetez le temps, car les jours sont mauvais.",
      "scripture_reference": "Éphésiens 5:16"
    },
    {
      "week_number": 4,
      "type": "transversal",
      "target_addiction": "Tous",
      "title": "La Gratitude comme Arme",
      "description": "L'addiction cherche à combler un vide. La gratitude remplit ce vide. Remplacez la plainte par le remerciement chaque matin.",
      "action_text": "J'ai noté 3 choses pour lesquelles je suis reconnaissant chaque jour.",
      "scripture_text": "Rendez grâces en toutes choses, car c'est à votre égard la volonté de Dieu.",
      "scripture_reference": "1 Thessaloniciens 5:18"
    },
    {
      "week_number": 5,
      "type": "specific",
      "target_addiction": "Alcool",
      "title": "Changer la routine",
      "description": "Si vous buviez en rentrant du travail, changez votre rituel. Prenez une douche, marchez, appelez un ami. Brisez l'automatisme.",
      "action_text": "J'ai créé une nouvelle routine de soirée.",
      "scripture_text": "Ne vous conformez pas au siècle présent, mais soyez transformés.",
      "scripture_reference": "Romains 12:2"
    },
    {
      "week_number": 5,
      "type": "specific",
      "target_addiction": "Tabac",
      "title": "Le souffle de vie",
      "description": "L'envie de fumer dure rarement plus de 5 minutes. Quand elle vient, faites 10 respirations profondes en priant.",
      "action_text": "J'ai prié et respiré au lieu de fumer.",
      "scripture_text": "Que tout ce qui respire loue l'Éternel !",
      "scripture_reference": "Psaume 150:6"
    },
    {
      "week_number": 5,
      "type": "specific",
      "target_addiction": "Porno",
      "title": "Le rebond du regard",
      "description": "Job a fait un pacte avec ses yeux. Quand une image tentante apparaît, détournez le regard immédiatement (le rebond).",
      "action_text": "J'ai détourné le regard immédiatement face à la tentation.",
      "scripture_text": "J'avais fait un pacte avec mes yeux.",
      "scripture_reference": "Job 31:1"
    },
    {
      "week_number": 5,
      "type": "specific",
      "target_addiction": "Ecrans",
      "title": "Le mode nuances de gris",
      "description": "Les couleurs vives des apps stimulent la dopamine. Passez votre téléphone en noir et blanc pour le rendre moins attrayant.",
      "action_text": "J'ai activé le mode 'nuances de gris'.",
      "scripture_text": "Détourne mes yeux de la vue des choses vaines.",
      "scripture_reference": "Psaume 119:37"
    },
    {
      "week_number": 6,
      "type": "transversal",
      "target_addiction": "Tous",
      "title": "Le Pardon de Soi",
      "description": "La culpabilité est un moteur de rechute. Dieu vous a pardonné; vous devez maintenant accepter ce pardon pour avancer.",
      "action_text": "J'ai écrit une lettre de pardon à moi-même et l'ai lue.",
      "scripture_text": "Il n'y a donc maintenant aucune condamnation pour ceux qui sont en Jésus-Christ.",
      "scripture_reference": "Romains 8:1"
    },
    {
      "week_number": 7,
      "type": "specific",
      "target_addiction": "Alcool",
      "title": "La boisson alternative",
      "description": "Ne restez pas les mains vides lors d'événements. Trouvez votre boisson sans alcool préférée et ayez-la toujours à la main.",
      "action_text": "J'ai identifié ma boisson alternative favorite.",
      "scripture_text": "Ne vous enivrez pas de vin... soyez remplis de l'Esprit.",
      "scripture_reference": "Éphésiens 5:18"
    },
    {
      "week_number": 7,
      "type": "specific",
      "target_addiction": "Tabac",
      "title": "Nettoyage de printemps",
      "description": "L'odeur du tabac incrustée peut déclencher l'envie. Lavez vos vêtements, draps et nettoyez votre voiture à fond.",
      "action_text": "J'ai nettoyé mes affaires pour éliminer l'odeur.",
      "scripture_text": "Purifie-moi avec l'hysope, et je serai pur.",
      "scripture_reference": "Psaume 51:9"
    },
    {
      "week_number": 7,
      "type": "specific",
      "target_addiction": "Porno",
      "title": "Gérer la solitude",
      "description": "La solitude est un déclencheur majeur. Prévoyez un plan : si vous êtes seul et tenté, qui appelez-vous ? Où allez-vous ?",
      "action_text": "J'ai établi un plan d'action pour la solitude.",
      "scripture_text": "Deux valent mieux qu'un... car si l'un tombe, l'autre le relève.",
      "scripture_reference": "Ecclésiaste 4:9-10"
    },
    {
      "week_number": 7,
      "type": "specific",
      "target_addiction": "Ecrans",
      "title": "Désactiver les notifications",
      "description": "Reprenez le contrôle. Désactivez toutes les notifications non-essentielles (réseaux sociaux, jeux, actus).",
      "action_text": "J'ai désactivé les notifications non-essentielles.",
      "scripture_text": "C'est dans le calme et la confiance que sera votre force.",
      "scripture_reference": "Ésaïe 30:15"
    },
    {
      "week_number": 8,
      "type": "transversal",
      "target_addiction": "Tous",
      "title": "La Discipline du Corps",
      "description": "Le corps est le temple de l'Esprit. Honorez-le par une activité physique ou une marche de 20 min cette semaine.",
      "action_text": "J'ai fait 20 minutes d'activité physique 3 fois.",
      "scripture_text": "Ne savez-vous pas que votre corps est le temple du Saint-Esprit ?",
      "scripture_reference": "1 Corinthiens 6:19"
    },
    {
      "week_number": 9,
      "type": "specific",
      "target_addiction": "Alcool",
      "title": "Éviter les terrains glissants",
      "description": "Il y a des lieux associés à la consommation. Cette semaine, ayez le courage de refuser une invitation à risque.",
      "action_text": "J'ai évité une situation ou un lieu à risque.",
      "scripture_text": "L'homme prudent voit le mal et se cache.",
      "scripture_reference": "Proverbes 22:3"
    },
    {
      "week_number": 9,
      "type": "specific",
      "target_addiction": "Tabac",
      "title": "L'épargne visible",
      "description": "Le tabac coûte cher. Mettez l'argent que vous auriez dépensé dans un bocal transparent ou un compte épargne visible.",
      "action_text": "J'ai mis de côté l'argent du tabac non acheté.",
      "scripture_text": "Pourquoi pesez-vous de l'argent pour ce qui ne nourrit pas ?",
      "scripture_reference": "Ésaïe 55:2"
    },
    {
      "week_number": 9,
      "type": "specific",
      "target_addiction": "Porno",
      "title": "Comprendre la racine",
      "description": "La luxure cache souvent un besoin d'intimité ou de réconfort. Demandez au Saint-Esprit : 'De quoi ai-je vraiment faim ?'",
      "action_text": "J'ai prié pour identifier le manque émotionnel.",
      "scripture_text": "Celui qui vient à moi n'aura jamais faim.",
      "scripture_reference": "Jean 6:35"
    },
    {
      "week_number": 9,
      "type": "specific",
      "target_addiction": "Ecrans",
      "title": "Le réveil analogique",
      "description": "Si votre téléphone est votre réveil, c'est la première chose que vous touchez. Achetez un vrai réveil et laissez le téléphone loin.",
      "action_text": "J'ai utilisé un réveil classique cette semaine.",
      "scripture_text": "Fais-moi dès le matin entendre ta bonté.",
      "scripture_reference": "Psaume 143:8"
    },
    {
      "week_number": 10,
      "type": "transversal",
      "target_addiction": "Tous",
      "title": "Service et Altruisme",
      "description": "Le meilleur moyen de s'oublier soi-même est de servir les autres. Faites un acte de bonté désintéressé cette semaine.",
      "action_text": "J'ai rendu service à quelqu'un sans rien attendre.",
      "scripture_text": "Servez-vous les uns les autres par amour.",
      "scripture_reference": "Galates 5:13"
    },
    {
      "week_number": 11,
      "type": "specific",
      "target_addiction": "Alcool",
      "title": "Gérer le stress autrement",
      "description": "L'alcool est un faux anxiolytique. Trouvez une méthode saine : prière, sport, bain chaud.",
      "action_text": "J'ai utilisé une méthode saine pour décompresser.",
      "scripture_text": "Déchargez-vous sur lui de tous vos soucis.",
      "scripture_reference": "1 Pierre 5:7"
    },
    {
      "week_number": 11,
      "type": "specific",
      "target_addiction": "Tabac",
      "title": "Mains occupées",
      "description": "L'ennui appelle la cigarette. Gardez vos mains occupées : dessin, bricolage, balle anti-stress.",
      "action_text": "J'ai occupé mes mains lors des temps morts.",
      "scripture_text": "Tout ce que ta main trouve à faire, fais-le avec ta force.",
      "scripture_reference": "Ecclésiaste 9:10"
    },
    {
      "week_number": 11,
      "type": "specific",
      "target_addiction": "Porno",
      "title": "Hygiène du sommeil",
      "description": "La fatigue affaiblit le cortex préfrontal (la volonté). Couchez-vous à heure fixe cette semaine pour dormir 7-8h.",
      "action_text": "J'ai respecté un horaire de sommeil régulier.",
      "scripture_text": "Il donne le repos à ceux qu'il aime.",
      "scripture_reference": "Psaume 127:2"
    },
    {
      "week_number": 11,
      "type": "specific",
      "target_addiction": "Ecrans",
      "title": "Le repas sacré",
      "description": "Les écrans à table tuent la communion. Interdiction totale des téléphones pendant les repas.",
      "action_text": "J'ai mangé sans écran à chaque repas.",
      "scripture_text": "Ils prenaient leur nourriture avec joie et simplicité de cœur.",
      "scripture_reference": "Actes 2:46"
    },
    {
      "week_number": 12,
      "type": "transversal",
      "target_addiction": "Tous",
      "title": "La Patience",
      "description": "La guérison est un marathon, pas un sprint. Acceptez que le processus prenne du temps. Soyez doux avec vous-même.",
      "action_text": "J'ai prié pour la patience face à mes progrès.",
      "scripture_text": "Mais que la patience accomplisse parfaitement son œuvre.",
      "scripture_reference": "Jacques 1:4"
    },
    {
      "week_number": 13,
      "type": "specific",
      "target_addiction": "Alcool",
      "title": "Visualiser la fin du film",
      "description": "Quand l'envie monte, ne pensez pas au premier verre, mais à la gueule de bois et au regret du lendemain. Jouez le film jusqu'au bout.",
      "action_text": "J'ai visualisé les conséquences négatives avant d'agir.",
      "scripture_text": "La fin d'une chose vaut mieux que son commencement.",
      "scripture_reference": "Ecclésiaste 7:8"
    },
    {
      "week_number": 13,
      "type": "specific",
      "target_addiction": "Tabac",
      "title": "Identifier les associations",
      "description": "Café = cigarette ? Pause = cigarette ? Changez l'ordre des choses. Prenez le café ailleurs ou à un autre moment.",
      "action_text": "J'ai brisé une association d'habitude.",
      "scripture_text": "Voici, je fais toutes choses nouvelles.",
      "scripture_reference": "Apocalypse 21:5"
    },
    {
      "week_number": 13,
      "type": "specific",
      "target_addiction": "Porno",
      "title": "Nettoyage des réseaux",
      "description": "Les réseaux sociaux regorgent de pièges (soft porn). Désabonnez-vous des comptes qui vous font trébucher, même un peu.",
      "action_text": "J'ai nettoyé mes abonnements Instagram/TikTok.",
      "scripture_text": "Si ton œil droit est pour toi une occasion de chute, arrache-le.",
      "scripture_reference": "Matthieu 5:29"
    },
    {
      "week_number": 13,
      "type": "specific",
      "target_addiction": "Ecrans",
      "title": "Loisir hors-ligne",
      "description": "Redécouvrez un hobby qui ne nécessite pas de batterie : lecture papier, instrument, sport, cuisine.",
      "action_text": "J'ai passé 2h sur un loisir non-numérique.",
      "scripture_text": "Il y a un temps pour tout sous le ciel.",
      "scripture_reference": "Ecclésiaste 3:1"
    },
    {
      "week_number": 14,
      "type": "transversal",
      "target_addiction": "Tous",
      "title": "L'Honnêteté",
      "description": "Le mensonge protège l'addiction. Soyez totalement honnête avec quelqu'un cette semaine, même sur une petite chose.",
      "action_text": "J'ai dit la vérité même quand c'était inconfortable.",
      "scripture_text": "Débarrassez-vous du mensonge et dites la vérité.",
      "scripture_reference": "Éphésiens 4:25"
    },
    {
      "week_number": 15,
      "type": "specific",
      "target_addiction": "Alcool",
      "title": "La pression sociale",
      "description": "Préparez une phrase clé pour refuser un verre sans vous justifier : 'Non merci, je me sens mieux sans alcool'.",
      "action_text": "J'ai répété ma phrase de refus à voix haute.",
      "scripture_text": "Mieux vaut se réfugier en l'Éternel que de se confier en l'homme.",
      "scripture_reference": "Psaume 118:8"
    },
    {
      "week_number": 15,
      "type": "specific",
      "target_addiction": "Tabac",
      "title": "L'eau purificatrice",
      "description": "L'eau aide à éliminer la nicotine et occupe la bouche. Buvez un grand verre d'eau à chaque envie de fumer.",
      "action_text": "J'ai bu de l'eau à chaque envie de cigarette.",
      "scripture_text": "Il me dirige près des eaux paisibles.",
      "scripture_reference": "Psaume 23:2"
    },
    {
      "week_number": 15,
      "type": "specific",
      "target_addiction": "Porno",
      "title": "La douche froide",
      "description": "Une technique physique simple : une douche froide ou s'asperger le visage d'eau glacée pour couper l'excitation (effet 'dive reflex').",
      "action_text": "J'ai utilisé le froid pour calmer une pulsion.",
      "scripture_text": "Je traite durement mon corps et je le tiens assujetti.",
      "scripture_reference": "1 Corinthiens 9:27"
    },
    {
      "week_number": 15,
      "type": "specific",
      "target_addiction": "Ecrans",
      "title": "Le jeûne intermittent",
      "description": "Choisissez une journée ou une demi-journée cette semaine pour un jeûne total d'écrans (Sabbat digital).",
      "action_text": "J'ai fait une demi-journée sans aucun écran.",
      "scripture_text": "Arrêtez, et sachez que je suis Dieu.",
      "scripture_reference": "Psaume 46:11"
    },
    {
      "week_number": 16,
      "type": "transversal",
      "target_addiction": "Tous",
      "title": "Célébrer les victoires",
      "description": "Ne regardez pas seulement le chemin qui reste, mais celui parcouru. Fêtez vos progrès, même minimes.",
      "action_text": "J'ai célébré ma sobriété par une récompense saine.",
      "scripture_text": "La joie de l'Éternel sera votre force.",
      "scripture_reference": "Néhémie 8:10"
    },
    {
      "week_number": 17,
      "type": "specific",
      "target_addiction": "Alcool",
      "title": "Réhydratation spirituelle",
      "description": "L'alcool déshydrate. Cette semaine, buvez beaucoup d'eau et priez pour être rempli de l'Eau Vive.",
      "action_text": "J'ai bu 2L d'eau par jour en pensant à Jésus.",
      "scripture_text": "Celui qui boira de l'eau que je lui donnerai n'aura jamais soif.",
      "scripture_reference": "Jean 4:14"
    },
    {
      "week_number": 17,
      "type": "specific",
      "target_addiction": "Tabac",
      "title": "Le goût retrouvé",
      "description": "Après quelques semaines, le goût revient. Savourez consciemment vos repas, remerciez Dieu pour les saveurs.",
      "action_text": "J'ai pris le temps de vraiment goûter mes aliments.",
      "scripture_text": "Goûtez et voyez combien l'Éternel est bon !",
      "scripture_reference": "Psaume 34:9"
    },
    {
      "week_number": 17,
      "type": "specific",
      "target_addiction": "Porno",
      "title": "Intimité réelle",
      "description": "Cherchez une connexion émotionnelle réelle (amicale ou familiale). Appelez quelqu'un pour savoir comment il va vraiment.",
      "action_text": "J'ai eu une conversation de cœur à cœur.",
      "scripture_text": "L'ami aime en tout temps.",
      "scripture_reference": "Proverbes 17:17"
    },
    {
      "week_number": 17,
      "type": "specific",
      "target_addiction": "Ecrans",
      "title": "Regarder le ciel",
      "description": "Nous regardons trop vers le bas (téléphone). Levez la tête. Regardez les nuages, les étoiles, les arbres.",
      "action_text": "J'ai passé du temps à contempler la création.",
      "scripture_text": "Les cieux racontent la gloire de Dieu.",
      "scripture_reference": "Psaume 19:2"
    },
    {
      "week_number": 18,
      "type": "transversal",
      "target_addiction": "Tous",
      "title": "La Prière de l'Écoute",
      "description": "Ne parlez pas tout le temps. Prenez 5 minutes de silence total pour laisser Dieu parler à votre cœur.",
      "action_text": "J'ai gardé le silence devant Dieu pendant 5 minutes.",
      "scripture_text": "Parle, car ton serviteur écoute.",
      "scripture_reference": "1 Samuel 3:10"
    },
    {
      "week_number": 19,
      "type": "specific",
      "target_addiction": "Alcool",
      "title": "Analyser la rechute (ou le risque)",
      "description": "Si vous avez failli, pourquoi ? Si non, quel est le plus gros risque à venir ? Anticipez le scénario.",
      "action_text": "J'ai identifié ma prochaine zone de danger.",
      "scripture_text": "Examinez toutes choses; retenez ce qui est bon.",
      "scripture_reference": "1 Thessaloniciens 5:21"
    },
    {
      "week_number": 19,
      "type": "specific",
      "target_addiction": "Tabac",
      "title": "Bouger pour expirer",
      "description": "Le tabac encrasse. Faites un exercice cardio qui vous essouffle pour sentir vos poumons travailler et se nettoyer.",
      "action_text": "J'ai fait une séance de sport intense.",
      "scripture_text": "Il donne de la force à celui qui est fatigué.",
      "scripture_reference": "Ésaïe 40:29"
    },
    {
      "week_number": 19,
      "type": "specific",
      "target_addiction": "Porno",
      "title": "La garde des pensées",
      "description": "La bataille commence dans la tête. Dès qu'une pensée impure arrive, capturez-la et remplacez-la par un verset.",
      "action_text": "J'ai capturé mes pensées avant qu'elles ne deviennent des actes.",
      "scripture_text": "Nous amenons toute pensée captive à l'obéissance de Christ.",
      "scripture_reference": "2 Corinthiens 10:5"
    },
    {
      "week_number": 19,
      "type": "specific",
      "target_addiction": "Ecrans",
      "title": "Tri des applications",
      "description": "Supprimez les applications que vous n'avez pas utilisées depuis 1 mois. Allégez votre téléphone et votre esprit.",
      "action_text": "J'ai supprimé 3 applications inutiles.",
      "scripture_text": "Rejetons tout fardeau et le péché qui nous enveloppe.",
      "scripture_reference": "Hébreux 12:1"
    },
    {
      "week_number": 20,
      "type": "transversal",
      "target_addiction": "Tous",
      "title": "Pardonner aux autres",
      "description": "La rancœur est un poison que l'on boit en espérant que l'autre meure. Pardonnez à ceux qui vous ont blessé pour guérir.",
      "action_text": "J'ai prié pour bénir quelqu'un qui m'a blessé.",
      "scripture_text": "Pardonnez-vous réciproquement, comme Dieu vous a pardonné en Christ.",
      "scripture_reference": "Éphésiens 4:32"
    },
    {
      "week_number": 21,
      "type": "specific",
      "target_addiction": "Alcool",
      "title": "Découverte sans alcool",
      "description": "Allez dans un bar ou un café et commandez fièrement un sans-alcool. Réappropriez-vous les lieux sans le produit.",
      "action_text": "J'ai commandé une boisson soft dans un lieu public.",
      "scripture_text": "Sois fort et courageux.",
      "scripture_reference": "Josué 1:6"
    },
    {
      "week_number": 21,
      "type": "specific",
      "target_addiction": "Tabac",
      "title": "Le parfum de la liberté",
      "description": "Sentez vos vêtements ou vos cheveux. Ils ne sentent plus le tabac. Appréciez cette nouvelle odeur de propre.",
      "action_text": "J'ai remercié Dieu pour ma propreté retrouvée.",
      "scripture_text": "Nous sommes pour Dieu la bonne odeur de Christ.",
      "scripture_reference": "2 Corinthiens 2:15"
    },
    {
      "week_number": 21,
      "type": "specific",
      "target_addiction": "Porno",
      "title": "Comprendre le 'cycle'",
      "description": "Identifiez votre cycle : Déclencheur -> Pensée -> Rituel -> Acte. Interrompez le rituel (ex: ne pas aller dans la chambre).",
      "action_text": "J'ai brisé mon rituel habituel avant la chute.",
      "scripture_text": "L'homme prudent voit le mal et se cache.",
      "scripture_reference": "Proverbes 27:12"
    },
    {
      "week_number": 21,
      "type": "specific",
      "target_addiction": "Ecrans",
      "title": "Pas de téléphone aux toilettes",
      "description": "C'est une habitude hygiénique et mentale. Laissez le téléphone dehors. C'est un temps mort nécessaire.",
      "action_text": "J'ai laissé mon téléphone hors des toilettes/salle de bain.",
      "scripture_text": "Tout a été fait pour un but.",
      "scripture_reference": "Proverbes 16:4"
    },
    {
      "week_number": 22,
      "type": "transversal",
      "target_addiction": "Tous",
      "title": "L'Humilité",
      "description": "Reconnaître qu'on ne peut pas y arriver seul est une force. Demandez de l'aide à Dieu ou à un ami cette semaine.",
      "action_text": "J'ai demandé de l'aide concrète à quelqu'un.",
      "scripture_text": "Dieu résiste aux orgueilleux, mais il fait grâce aux humbles.",
      "scripture_reference": "Jacques 4:6"
    },
    {
      "week_number": 23,
      "type": "specific",
      "target_addiction": "Alcool",
      "title": "Calculer les économies",
      "description": "Calculez combien vous avez économisé depuis le début. Offrez-vous un livre ou un don avec cet argent.",
      "action_text": "J'ai calculé l'argent économisé et l'ai bien utilisé.",
      "scripture_text": "L'âme du paresseux a des désirs qu'il ne peut satisfaire.",
      "scripture_reference": "Proverbes 13:4"
    },
    {
      "week_number": 23,
      "type": "specific",
      "target_addiction": "Tabac",
      "title": "Nettoyage dentaire",
      "description": "Le tabac jaunit les dents. Prenez rendez-vous chez le dentiste ou faites un soin blanchissant maison. Marquez le renouveau.",
      "action_text": "J'ai pris soin de mon sourire cette semaine.",
      "scripture_text": "Tu me laveras, et je serai plus blanc que la neige.",
      "scripture_reference": "Psaume 51:7"
    },
    {
      "week_number": 23,
      "type": "specific",
      "target_addiction": "Porno",
      "title": "Respect de l'autre",
      "description": "Priez spécifiquement pour les personnes que vous avez regardées/désirées, en demandant à Dieu de les bénir comme des êtres humains, pas des objets.",
      "action_text": "J'ai prié pour la dignité des personnes que je convoitais.",
      "scripture_text": "L'amour ne fait point de mal au prochain.",
      "scripture_reference": "Romains 13:10"
    },
    {
      "week_number": 23,
      "type": "specific",
      "target_addiction": "Ecrans",
      "title": "Le rangement numérique",
      "description": "Organisez vos photos ou fichiers. Le désordre numérique crée du stress. Mettez de l'ordre.",
      "action_text": "J'ai trié et organisé mes dossiers numériques.",
      "scripture_text": "Que tout se fasse avec bienséance et avec ordre.",
      "scripture_reference": "1 Corinthiens 14:40"
    },
    {
      "week_number": 24,
      "type": "transversal",
      "target_addiction": "Tous",
      "title": "La Générosité",
      "description": "L'addiction rend égoïste. Contrez cela en donnant : argent, temps ou écoute. Ouvrez votre main.",
      "action_text": "J'ai donné quelque chose à quelqu'un dans le besoin.",
      "scripture_text": "Il y a plus de bonheur à donner qu'à recevoir.",
      "scripture_reference": "Actes 20:35"
    },
    {
      "week_number": 25,
      "type": "specific",
      "target_addiction": "Alcool",
      "title": "Gérer les émotions fortes",
      "description": "Quand une grosse colère ou tristesse arrive, ne l'anesthésiez pas. Vivez-la, écrivez-la, pleurez si besoin.",
      "action_text": "J'ai accepté de ressentir une émotion négative sans boire.",
      "scripture_text": "Heureux les affligés, car ils seront consolés !",
      "scripture_reference": "Matthieu 5:4"
    },
    {
      "week_number": 25,
      "type": "specific",
      "target_addiction": "Tabac",
      "title": "Le test du miroir",
      "description": "Regardez-vous dans le miroir et dites : 'Je ne suis plus fumeur'. Définissez votre identité par vos choix, pas votre passé.",
      "action_text": "J'ai proclamé ma nouvelle identité devant le miroir.",
      "scripture_text": "Je te loue de ce que je suis une créature si merveilleuse.",
      "scripture_reference": "Psaume 139:14"
    },
    {
      "week_number": 25,
      "type": "specific",
      "target_addiction": "Porno",
      "title": "Médias sains",
      "description": "Regardez un film ou lisez un livre qui présente des relations saines, pures et romantiques, sans sexualisation.",
      "action_text": "J'ai nourri mon esprit avec du contenu pur.",
      "scripture_text": "Que tout ce qui est vrai, tout ce qui est honorable... soit l'objet de vos pensées.",
      "scripture_reference": "Philippiens 4:8"
    },
    {
      "week_number": 25,
      "type": "specific",
      "target_addiction": "Ecrans",
      "title": "Silence radio",
      "description": "Coupez votre téléphone 1h avant de dormir. Lisez, priez, parlez. Préparez votre cerveau au sommeil.",
      "action_text": "J'ai éteint mon téléphone 1h avant le coucher.",
      "scripture_text": "Tu gardes dans une paix parfaite l'esprit qui s'appuie sur toi.",
      "scripture_reference": "Ésaïe 26:3"
    },
    {
      "week_number": 26,
      "type": "transversal",
      "target_addiction": "Tous",
      "title": "Persévérance",
      "description": "Vous êtes à la moitié de l'année. Ne lâchez rien. La guérison est une longue marche. Renouvelez votre vœu.",
      "action_text": "J'ai renouvelé mon engagement pour les 6 prochains mois.",
      "scripture_text": "Courons avec persévérance dans la carrière qui nous est ouverte.",
      "scripture_reference": "Hébreux 12:1"
    },
    {
      "week_number": 27,
      "type": "specific",
      "target_addiction": "Alcool",
      "title": "La liste de gratitude (Santé)",
      "description": "Listez 3 améliorations physiques depuis que vous avez réduit/arrêté (sommeil, peau, énergie).",
      "action_text": "J'ai noté 3 bienfaits physiques de ma sobriété.",
      "scripture_text": "Bien-aimé, je souhaite que tu prospères à tous égards et sois en bonne santé.",
      "scripture_reference": "3 Jean 1:2"
    },
    {
      "week_number": 27,
      "type": "specific",
      "target_addiction": "Tabac",
      "title": "Éviter les fumeurs",
      "description": "Cette semaine, si vos collègues sortent fumer, restez à l'intérieur. Ne vous exposez pas à la fumée passive ou à la tentation.",
      "action_text": "J'ai évité de rejoindre le groupe de fumeurs.",
      "scripture_text": "Ne vous mettez pas avec les infidèles sous un joug étranger.",
      "scripture_reference": "2 Corinthiens 6:14"
    },
    {
      "week_number": 27,
      "type": "specific",
      "target_addiction": "Porno",
      "title": "Objectiver le regard",
      "description": "Dans la rue, quand vous croisez quelqu'un d'attirant, dites-vous mentalement : 'C'est une sœur/un frère en Christ'.",
      "action_text": "J'ai transformé mon regard de convoitise en regard fraternel.",
      "scripture_text": "Traite... les femmes jeunes comme des sœurs, en toute pureté.",
      "scripture_reference": "1 Timothée 5:2"
    },
    {
      "week_number": 27,
      "type": "specific",
      "target_addiction": "Ecrans",
      "title": "Désabonnement massif",
      "description": "Les newsletters et pubs encombrent votre esprit. Désabonnez-vous de 5 listes de diffusion inutiles.",
      "action_text": "J'ai nettoyé ma boîte mail.",
      "scripture_text": "Recherchez la paix et poursuivez-la.",
      "scripture_reference": "Psaume 34:14"
    },
    {
      "week_number": 28,
      "type": "transversal",
      "target_addiction": "Tous",
      "title": "Communauté",
      "description": "Nous sommes membres les uns des autres. Participez activement à une réunion, un culte ou un groupe cette semaine.",
      "action_text": "J'ai participé activement à une rencontre communautaire.",
      "scripture_text": "N'abandonnons pas notre assemblée.",
      "scripture_reference": "Hébreux 10:25"
    },
    {
      "week_number": 29,
      "type": "specific",
      "target_addiction": "Alcool",
      "title": "Servir sans alcool",
      "description": "Proposez de conduire (SAM) lors d'une sortie. Soyez celui qui protège les autres par sa sobriété.",
      "action_text": "J'ai été le conducteur désigné ou le protecteur de la soirée.",
      "scripture_text": "Que chacun de vous regarde, non ses propres qualités, mais celles des autres.",
      "scripture_reference": "Philippiens 2:4"
    },
    {
      "week_number": 29,
      "type": "specific",
      "target_addiction": "Tabac",
      "title": "Réparation",
      "description": "Le tabac a peut-être abîmé des relations (odeur, nervosité). Demandez pardon à un proche pour ces désagréments passés.",
      "action_text": "J'ai demandé pardon à un proche impacté par mon tabagisme.",
      "scripture_text": "Autant que cela dépend de vous, soyez en paix avec tous.",
      "scripture_reference": "Romains 12:18"
    },
    {
      "week_number": 29,
      "type": "specific",
      "target_addiction": "Porno",
      "title": "Le filtre des yeux",
      "description": "Faites attention à ce que vous regardez à la TV/Netflix. Si une scène est explicite, avancez ou éteignez. Ne tolérez pas le 'soft'.",
      "action_text": "J'ai zappé ou coupé une scène inappropriée.",
      "scripture_text": "Je ne mettrai rien de mauvais devant mes yeux.",
      "scripture_reference": "Psaume 101:3"
    },
    {
      "week_number": 29,
      "type": "specific",
      "target_addiction": "Ecrans",
      "title": "Notifications VIP",
      "description": "Configurez votre téléphone pour que seuls les appels de la famille proche sonnent. Le reste peut attendre.",
      "action_text": "J'ai filtré mes appels pour prioriser l'essentiel.",
      "scripture_text": "Mais une seule chose est nécessaire.",
      "scripture_reference": "Luc 10:42"
    },
    {
      "week_number": 30,
      "type": "transversal",
      "target_addiction": "Tous",
      "title": "Le Repos (Sabbat)",
      "description": "Dieu s'est reposé. Vous n'êtes pas une machine. Prenez un vrai jour de repos sans travail et sans souci de performance.",
      "action_text": "J'ai pris un jour de vrai repos spirituel et physique.",
      "scripture_text": "Souviens-toi du jour du repos, pour le sanctifier.",
      "scripture_reference": "Exode 20:8"
    },
    {
      "week_number": 31,
      "type": "specific",
      "target_addiction": "Alcool",
      "title": "Nouveaux plaisirs",
      "description": "L'alcool volait votre dopamine. Trouvez une nouvelle source de plaisir sain : musique, cuisine, sport extrême.",
      "action_text": "J'ai testé une nouvelle activité plaisante.",
      "scripture_text": "Il rassasie de biens ta vieillesse.",
      "scripture_reference": "Psaume 103:5"
    },
    {
      "week_number": 31,
      "type": "specific",
      "target_addiction": "Tabac",
      "title": "Exercice de souffle",
      "description": "Apprenez une technique de respiration (cohérence cardiaque) pour gérer le stress sans nicotine.",
      "action_text": "J'ai pratiqué 5 minutes de cohérence cardiaque.",
      "scripture_text": "L'esprit de Dieu m'a créé, et le souffle du Tout-Puissant m'anime.",
      "scripture_reference": "Job 33:4"
    },
    {
      "week_number": 31,
      "type": "specific",
      "target_addiction": "Porno",
      "title": "Fuir l'oisiveté",
      "description": "Le roi David a chuté quand il est resté oisif au palais. Planifiez vos journées pour ne pas avoir de temps vide non structuré.",
      "action_text": "J'ai structuré mon temps libre pour éviter l'oisiveté.",
      "scripture_text": "Veillez donc avec soin sur votre conduite.",
      "scripture_reference": "Éphésiens 5:15"
    },
    {
      "week_number": 31,
      "type": "specific",
      "target_addiction": "Ecrans",
      "title": "Le téléphone au panier",
      "description": "En rentrant chez vous, déposez le téléphone dans une corbeille à l'entrée et n'y touchez plus pendant 1h.",
      "action_text": "J'ai laissé mon téléphone à l'entrée en rentrant.",
      "scripture_text": "L'Éternel gardera ton départ et ton arrivée.",
      "scripture_reference": "Psaume 121:8"
    },
    {
      "week_number": 32,
      "type": "transversal",
      "target_addiction": "Tous",
      "title": "L'Espérance",
      "description": "Ne désespérez jamais, même après une chute. Dieu peut tout restaurer. Écrivez un espoir que vous avez pour votre futur.",
      "action_text": "J'ai écrit un rêve pour mon avenir libéré.",
      "scripture_text": "Car je connais les projets que j'ai formés sur vous... projets de paix et non de malheur.",
      "scripture_reference": "Jérémie 29:11"
    },
    {
      "week_number": 33,
      "type": "specific",
      "target_addiction": "Alcool",
      "title": "Témoignage inspirant",
      "description": "Lisez ou écoutez le témoignage de quelqu'un qui s'est sorti de l'alcoolisme. Cela renforce la conviction que c'est possible.",
      "action_text": "J'ai écouté un témoignage de guérison.",
      "scripture_text": "Ils l'ont vaincu à cause du sang de l'agneau et à cause de la parole de leur témoignage.",
      "scripture_reference": "Apocalypse 12:11"
    },
    {
      "week_number": 33,
      "type": "specific",
      "target_addiction": "Tabac",
      "title": "Lieux non-fumeurs",
      "description": "Fréquentez des lieux où il est interdit de fumer (musée, cinéma, bibliothèque) pour vous habituer à ne pas fumer.",
      "action_text": "J'ai passé du temps dans un lieu culturel non-fumeur.",
      "scripture_text": "Une chose que je demande à l'Éternel... c'est d'habiter toute ma vie dans la maison de l'Éternel.",
      "scripture_reference": "Psaume 27:4"
    },
    {
      "week_number": 33,
      "type": "specific",
      "target_addiction": "Porno",
      "title": "Éviter la comparaison",
      "description": "La pornographie fausse la réalité. Arrêtez de comparer votre corps ou celui de votre conjoint aux standards irréels.",
      "action_text": "J'ai renoncé à comparer mon corps ou celui des autres.",
      "scripture_text": "L'homme regarde à ce qui frappe les yeux, mais l'Éternel regarde au cœur.",
      "scripture_reference": "1 Samuel 16:7"
    },
    {
      "week_number": 33,
      "type": "specific",
      "target_addiction": "Ecrans",
      "title": "Détox réseaux",
      "description": "Supprimez l'application de réseau social la plus chronophage de votre téléphone pour 3 jours.",
      "action_text": "J'ai supprimé mon app la plus chronophage pour 3 jours.",
      "scripture_text": "Ne vous conformez pas au siècle présent.",
      "scripture_reference": "Romains 12:2"
    },
    {
      "week_number": 34,
      "type": "transversal",
      "target_addiction": "Tous",
      "title": "La Sagesse",
      "description": "La sagesse est l'application pratique de la vérité. Demandez à Dieu la sagesse pour gérer une situation compliquée.",
      "action_text": "J'ai demandé la sagesse à Dieu face à un problème.",
      "scripture_text": "Si quelqu'un d'entre vous manque de sagesse, qu'il la demande à Dieu.",
      "scripture_reference": "Jacques 1:5"
    },
    {
      "week_number": 35,
      "type": "specific",
      "target_addiction": "Alcool",
      "title": "L'effet de groupe",
      "description": "Si vos amis insistent pour que vous buviez, il est peut-être temps de changer d'amis ou de poser une limite ferme.",
      "action_text": "J'ai posé une limite ferme avec mes amis buveurs.",
      "scripture_text": "Les mauvaises compagnies corrompent les bonnes mœurs.",
      "scripture_reference": "1 Corinthiens 15:33"
    },
    {
      "week_number": 35,
      "type": "specific",
      "target_addiction": "Tabac",
      "title": "Prendre soin de soi",
      "description": "Faites quelque chose qui améliore votre santé (massage, spa, bon repas sain). Récompensez votre corps de ne pas fumer.",
      "action_text": "J'ai offert un moment de bien-être à mon corps.",
      "scripture_text": "Bien-aimé, je souhaite que tu prospères... et sois en bonne santé.",
      "scripture_reference": "3 Jean 1:2"
    },
    {
      "week_number": 35,
      "type": "specific",
      "target_addiction": "Porno",
      "title": "La victoire sur la honte",
      "description": "La honte dit 'je suis mauvais'. La culpabilité dit 'j'ai fait quelque chose de mauvais'. Rejetez la honte, elle vient de l'Accusateur.",
      "action_text": "J'ai prié pour briser le lien de la honte.",
      "scripture_text": "Ceux qui regardent vers lui sont rayonnants de joie, et leur visage ne se couvre pas de honte.",
      "scripture_reference": "Psaume 34:5"
    },
    {
      "week_number": 35,
      "type": "specific",
      "target_addiction": "Ecrans",
      "title": "Écrire à la main",
      "description": "Écrivez une lettre ou une carte postale à la main cette semaine. Retrouvez le plaisir du papier et de la lenteur.",
      "action_text": "J'ai écrit une lettre manuscrite.",
      "scripture_text": "Que l'amour et la fidélité ne t'abandonnent pas; lie-les à ton cou.",
      "scripture_reference": "Proverbes 3:3"
    },
    {
      "week_number": 36,
      "type": "transversal",
      "target_addiction": "Tous",
      "title": "La Fidélité",
      "description": "Dieu est fidèle. Soyez fidèle dans les petites choses (horaires, promesses) pour fortifier votre caractère.",
      "action_text": "J'ai tenu une petite promesse faite à quelqu'un.",
      "scripture_text": "Celui qui est fidèle dans les moindres choses l'est aussi dans les grandes.",
      "scripture_reference": "Luc 16:10"
    },
    {
      "week_number": 37,
      "type": "specific",
      "target_addiction": "Alcool",
      "title": "Le verre d'eau",
      "description": "Au restaurant, commandez de l'eau immédiatement en arrivant. Cela coupe l'automatisme de la carte des vins.",
      "action_text": "J'ai commandé de l'eau en premier au restaurant.",
      "scripture_text": "L'eau vive jaillira.",
      "scripture_reference": "Jean 7:38"
    },
    {
      "week_number": 37,
      "type": "specific",
      "target_addiction": "Tabac",
      "title": "Visualisation positive",
      "description": "Imaginez vos poumons roses et propres. Visualisez votre vie à 80 ans, en forme, respirant librement.",
      "action_text": "J'ai visualisé ma santé future avec espoir.",
      "scripture_text": "Car je vais restaurer ta santé et guérir tes blessures.",
      "scripture_reference": "Jérémie 30:17"
    },
    {
      "week_number": 37,
      "type": "specific",
      "target_addiction": "Porno",
      "title": "L'Alliance",
      "description": "Si vous êtes marié, renouvelez vos vœux intérieurement. Si célibataire, engagez-vous envers votre futur conjoint à la pureté.",
      "action_text": "J'ai prié pour mon (futur) mariage.",
      "scripture_text": "Que le mariage soit honoré de tous, et le lit conjugal exempt de souillure.",
      "scripture_reference": "Hébreux 13:4"
    },
    {
      "week_number": 37,
      "type": "specific",
      "target_addiction": "Ecrans",
      "title": "Marcher sans musique",
      "description": "Marchez 15 minutes sans écouteurs, sans podcast. Juste les bruits de la rue ou de la nature.",
      "action_text": "J'ai marché en écoutant simplement le monde autour.",
      "scripture_text": "Arrêtez, et sachez que je suis Dieu.",
      "scripture_reference": "Psaume 46:11"
    },
    {
      "week_number": 38,
      "type": "transversal",
      "target_addiction": "Tous",
      "title": "La Paix",
      "description": "L'agitation nourrit l'addiction. Cherchez la paix intérieure. Priez pour la paix dans votre cœur avant de dormir.",
      "action_text": "J'ai remis mes inquiétudes à Dieu pour trouver la paix.",
      "scripture_text": "Je vous laisse la paix, je vous donne ma paix.",
      "scripture_reference": "Jean 14:27"
    },
    {
      "week_number": 39,
      "type": "specific",
      "target_addiction": "Alcool",
      "title": "Savoir dire NON",
      "description": "Exercez-vous devant un miroir à dire 'Non' fermement. Le 'Non' à l'alcool est un 'Oui' à votre vie.",
      "action_text": "J'ai dit non à une proposition qui ne me convenait pas.",
      "scripture_text": "Que votre oui soit oui, que votre non soit non.",
      "scripture_reference": "Matthieu 5:37"
    },
    {
      "week_number": 39,
      "type": "specific",
      "target_addiction": "Tabac",
      "title": "Le stress sans tabac",
      "description": "La prochaine fois que vous êtes stressé, notez ce qui vous stresse au lieu de fumer. Attaquez la cause, pas le symptôme.",
      "action_text": "J'ai affronté la source de mon stress sans fumer.",
      "scripture_text": "Ne vous inquiétez de rien.",
      "scripture_reference": "Philippiens 4:6"
    },
    {
      "week_number": 39,
      "type": "specific",
      "target_addiction": "Porno",
      "title": "La fuite physique",
      "description": "Comme Joseph face à la femme de Potiphar : si la tentation est trop forte, fuyez physiquement la pièce (sortez dehors).",
      "action_text": "J'ai quitté physiquement un lieu de tentation.",
      "scripture_text": "Elle le saisit par son vêtement... il lui laissa son vêtement et s'enfuit.",
      "scripture_reference": "Genèse 39:12"
    },
    {
      "week_number": 39,
      "type": "specific",
      "target_addiction": "Ecrans",
      "title": "Le week-end déconnecté",
      "description": "Essayez de passer un samedi ou dimanche entier sans réseaux sociaux. Juste les appels/SMS essentiels.",
      "action_text": "J'ai limité mon usage au strict minimum ce week-end.",
      "scripture_text": "Il y a un temps pour se taire, et un temps pour parler.",
      "scripture_reference": "Ecclésiaste 3:7"
    },
    {
      "week_number": 40,
      "type": "transversal",
      "target_addiction": "Tous",
      "title": "L'Amour (Agapé)",
      "description": "L'opposé de l'addiction n'est pas la sobriété, c'est la connexion. Aimez activement quelqu'un cette semaine par des actes.",
      "action_text": "J'ai montré de l'amour concret à un proche.",
      "scripture_text": "Toutes vos œuvres, faites-les avec amour.",
      "scripture_reference": "1 Corinthiens 16:14"
    },
    {
      "week_number": 41,
      "type": "specific",
      "target_addiction": "Alcool",
      "title": "Nouvelles traditions",
      "description": "Créez une tradition de fête sans alcool (ex: un gâteau spécial, un jeu de société) pour les célébrations.",
      "action_text": "J'ai instauré une nouvelle tradition festive saine.",
      "scripture_text": "Voici, je fais toutes choses nouvelles.",
      "scripture_reference": "Apocalypse 21:5"
    },
    {
      "week_number": 41,
      "type": "specific",
      "target_addiction": "Tabac",
      "title": "Le bilan financier",
      "description": "Regardez combien coûte un paquet aujourd'hui. Imaginez ce montant investi sur 10 ans.",
      "action_text": "J'ai réfléchi à la mauvaise gestion que représente le tabac.",
      "scripture_text": "L'argent mal acquis diminue, mais celui qui amasse peu à peu l'augmente.",
      "scripture_reference": "Proverbes 13:11"
    },
    {
      "week_number": 41,
      "type": "specific",
      "target_addiction": "Porno",
      "title": "Garder les yeux",
      "description": "Quand vous naviguez sur internet, soyez intentionnel. Ne surfez pas au hasard. Allez sur un site pour un but précis, puis fermez.",
      "action_text": "J'ai utilisé internet avec un but précis sans errer.",
      "scripture_text": "Que tes yeux regardent droit en face.",
      "scripture_reference": "Proverbes 4:25"
    },
    {
      "week_number": 41,
      "type": "specific",
      "target_addiction": "Ecrans",
      "title": "Le dîner aux chandelles",
      "description": "Organisez un repas (seul, en couple ou amis) avec une lumière tamisée et sans aucune technologie.",
      "action_text": "J'ai pris un repas à la bougie, sans technologie.",
      "scripture_text": "Tu es la lumière de ma lampe.",
      "scripture_reference": "Psaume 18:28"
    },
    {
      "week_number": 42,
      "type": "transversal",
      "target_addiction": "Tous",
      "title": "Le Courage",
      "description": "Il faut du courage pour changer. Faites une chose qui vous fait peur (mais qui est saine) cette semaine.",
      "action_text": "J'ai affronté une petite peur cette semaine.",
      "scripture_text": "Prends courage et tiens bon.",
      "scripture_reference": "Josué 1:6"
    },
    {
      "week_number": 43,
      "type": "specific",
      "target_addiction": "Alcool",
      "title": "Aider un autre",
      "description": "Si vous vous sentez fort, encouragez quelqu'un qui débute son parcours (sans faire la leçon).",
      "action_text": "J'ai encouragé quelqu'un qui lutte.",
      "scripture_text": "Consolez-vous donc les uns les autres par ces paroles.",
      "scripture_reference": "1 Thessaloniciens 4:18"
    },
    {
      "week_number": 43,
      "type": "specific",
      "target_addiction": "Tabac",
      "title": "La liberté de mouvement",
      "description": "Profitez de votre souffle retrouvée. Montez des escaliers en courant ou faites une longue marche rapide.",
      "action_text": "J'ai testé mon endurance physique avec joie.",
      "scripture_text": "Il me rend semblable à la biche; il m'affermit sur les hauteurs.",
      "scripture_reference": "Habacuc 3:19"
    },
    {
      "week_number": 43,
      "type": "specific",
      "target_addiction": "Porno",
      "title": "La racine du rejet",
      "description": "Souvent, on cherche le porno pour ne pas se sentir rejeté. Méditez sur votre acceptation totale par Dieu.",
      "action_text": "J'ai médité sur le fait que Dieu m'a choisi et accepté.",
      "scripture_text": "Je vous ai appelés amis.",
      "scripture_reference": "Jean 15:15"
    },
    {
      "week_number": 43,
      "type": "specific",
      "target_addiction": "Ecrans",
      "title": "Le livre papier",
      "description": "Lisez 30 minutes dans un livre papier. La lecture profonde répare l'attention fragmentée par les écrans.",
      "action_text": "J'ai lu un livre papier pendant 30 minutes.",
      "scripture_text": "Applique-toi à la lecture.",
      "scripture_reference": "1 Timothée 4:13"
    },
    {
      "week_number": 44,
      "type": "transversal",
      "target_addiction": "Tous",
      "title": "La Présence",
      "description": "Soyez totalement présent là où vous êtes. Ne soyez pas ailleurs dans votre tête. Écoutez vraiment les gens.",
      "action_text": "J'ai écouté quelqu'un sans l'interrompre ni penser à autre chose.",
      "scripture_text": "Que tout homme soit prompt à écouter, lent à parler.",
      "scripture_reference": "Jacques 1:19"
    },
    {
      "week_number": 45,
      "type": "specific",
      "target_addiction": "Alcool",
      "title": "Vigilance continue",
      "description": "Attention à l'excès de confiance ('je peux prendre juste un verre'). Restez humble. Le danger rôde toujours.",
      "action_text": "J'ai réaffirmé ma vigilance face à la tentation.",
      "scripture_text": "Que celui qui croit être debout prenne garde de tomber.",
      "scripture_reference": "1 Corinthiens 10:12"
    },
    {
      "week_number": 45,
      "type": "specific",
      "target_addiction": "Tabac",
      "title": "Nettoyage final",
      "description": "Y a-t-il encore un vieux briquet dans un tiroir ? Une odeur dans un manteau d'hiver ? Éliminez les derniers vestiges.",
      "action_text": "J'ai jeté les derniers restes de mon ancienne vie de fumeur.",
      "scripture_text": "Ote le mal du milieu de toi.",
      "scripture_reference": "Deutéronome 13:5"
    },
    {
      "week_number": 45,
      "type": "specific",
      "target_addiction": "Porno",
      "title": "Pureté du cœur",
      "description": "Heureux ceux qui ont le cœur pur. Priez pour que Dieu nettoie non seulement vos actes, mais vos désirs profonds.",
      "action_text": "J'ai demandé à Dieu de purifier mes désirs.",
      "scripture_text": "O Dieu ! crée en moi un cœur pur.",
      "scripture_reference": "Psaume 51:10"
    },
    {
      "week_number": 45,
      "type": "specific",
      "target_addiction": "Ecrans",
      "title": "Créer, ne pas consommer",
      "description": "Au lieu de consommer du contenu (vidéo, feed), créez quelque chose (dessin, texte, bricolage, cuisine).",
      "action_text": "J'ai passé du temps à créer au lieu de consommer.",
      "scripture_text": "Il a rempli Beçalel... d'habileté, d'intelligence et de savoir-faire.",
      "scripture_reference": "Exode 35:31"
    },
    {
      "week_number": 46,
      "type": "transversal",
      "target_addiction": "Tous",
      "title": "Gratitude Avancée",
      "description": "Remerciez Dieu pour les épreuves passées, car elles ont forgé votre caractère actuel. C'est le niveau expert de la gratitude.",
      "action_text": "J'ai remercié Dieu pour une difficulté qui m'a fait grandir.",
      "scripture_text": "Nous nous glorifions même des afflictions.",
      "scripture_reference": "Romains 5:3"
    },
    {
      "week_number": 47,
      "type": "specific",
      "target_addiction": "Alcool",
      "title": "S'amuser sobre",
      "description": "Redécouvrez que le rire et la joie sont possibles et plus vrais sans alcool. Riez aux éclats cette semaine.",
      "action_text": "J'ai ri de bon cœur sans aucun stimulant.",
      "scripture_text": "Il remplira ta bouche de rires.",
      "scripture_reference": "Job 8:21"
    },
    {
      "week_number": 47,
      "type": "specific",
      "target_addiction": "Tabac",
      "title": "Le témoignage muet",
      "description": "Votre teint s'améliore, votre odeur aussi. Votre corps témoigne de votre liberté. Soyez-en fier.",
      "action_text": "J'ai remercié Dieu pour l'amélioration de mon apparence.",
      "scripture_text": "Votre corps est le temple du Saint-Esprit.",
      "scripture_reference": "1 Corinthiens 6:19"
    },
    {
      "week_number": 47,
      "type": "specific",
      "target_addiction": "Porno",
      "title": "La garde des sens",
      "description": "Soyez le sentinelle de votre âme. Si une conversation devient vulgaire, changez de sujet ou partez.",
      "action_text": "J'ai refusé de participer à une conversation vulgaire.",
      "scripture_text": "Qu'il ne sorte de votre bouche aucune parole mauvaise.",
      "scripture_reference": "Éphésiens 4:29"
    },
    {
      "week_number": 47,
      "type": "specific",
      "target_addiction": "Ecrans",
      "title": "La vraie rencontre",
      "description": "Invitez un ami à prendre un café sans sortir votre téléphone une seule fois. Privilégiez le visage à l'interface.",
      "action_text": "J'ai passé un moment de qualité avec un ami, sans téléphone.",
      "scripture_text": "J'espère vous voir bientôt, et nous parlerons de vive voix.",
      "scripture_reference": "3 Jean 1:14"
    },
    {
      "week_number": 48,
      "type": "transversal",
      "target_addiction": "Tous",
      "title": "L'Intégrité",
      "description": "Faites ce que vous dites. Soyez la même personne en public et en privé. L'intégrité est le socle de la liberté durable.",
      "action_text": "J'ai agi en privé comme je le ferais en public.",
      "scripture_text": "L'intégrité des hommes droits les dirige.",
      "scripture_reference": "Proverbes 11:3"
    },
    {
      "week_number": 49,
      "type": "specific",
      "target_addiction": "Alcool",
      "title": "Préparer les fêtes",
      "description": "Les fêtes approchent peut-être (ou une période chargée). Prévoyez votre stratégie de défense dès maintenant.",
      "action_text": "J'ai planifié ma stratégie pour les prochains événements festifs.",
      "scripture_text": "Préparez votre esprit à l'action, soyez sobres.",
      "scripture_reference": "1 Pierre 1:13"
    },
    {
      "week_number": 49,
      "type": "specific",
      "target_addiction": "Tabac",
      "title": "Rester zen",
      "description": "Si le stress monte, n'oubliez pas : la cigarette ne calme pas le stress, elle calme juste le manque de nicotine.",
      "action_text": "J'ai géré une période de tension sans tabac.",
      "scripture_text": "La paix de Dieu, qui surpasse toute intelligence, gardera vos cœurs.",
      "scripture_reference": "Philippiens 4:7"
    },
    {
      "week_number": 49,
      "type": "specific",
      "target_addiction": "Porno",
      "title": "Anticiper la fatigue",
      "description": "La fin d'année ou de cycle fatigue. Quand on est fatigué, on est vulnérable. Reposez-vous avant d'être épuisé.",
      "action_text": "J'ai pris du repos préventif pour ne pas être vulnérable.",
      "scripture_text": "Venez à l'écart... et reposez-vous un peu.",
      "scripture_reference": "Marc 6:31"
    },
    {
      "week_number": 49,
      "type": "specific",
      "target_addiction": "Ecrans",
      "title": "Cadeau de présence",
      "description": "Le plus beau cadeau est votre attention. Décidez d'offrir votre présence totale à vos proches cette semaine.",
      "action_text": "J'ai offert mon attention totale à ma famille.",
      "scripture_text": "Mon fils, donne-moi ton cœur.",
      "scripture_reference": "Proverbes 23:26"
    },
    {
      "week_number": 50,
      "type": "transversal",
      "target_addiction": "Tous",
      "title": "La Louange",
      "description": "La louange est une arme de guerre. Quand la tentation est là, mettez de la musique de louange et chantez. Cela change l'atmosphère.",
      "action_text": "J'ai combattu une pensée négative par la louange.",
      "scripture_text": "Chantez à l'Éternel, bénissez son nom !",
      "scripture_reference": "Psaume 96:2"
    },
    {
      "week_number": 51,
      "type": "specific",
      "target_addiction": "Alcool",
      "title": "Bilan de l'année",
      "description": "Regardez le chemin parcouru. Comptez les jours sobres. Voyez la grâce de Dieu dans votre vie.",
      "action_text": "J'ai fait le bilan positif de ma sobriété.",
      "scripture_text": "Tu couronnes l'année de tes biens.",
      "scripture_reference": "Psaume 65:11"
    },
    {
      "week_number": 51,
      "type": "specific",
      "target_addiction": "Tabac",
      "title": "Inspirer les autres",
      "description": "Votre arrêt peut motiver un proche. Partagez votre réussite humblement si l'occasion se présente.",
      "action_text": "J'ai partagé ma joie d'être libre du tabac.",
      "scripture_text": "Racontez parmi les nations sa gloire.",
      "scripture_reference": "Psaume 96:3"
    },
    {
      "week_number": 51,
      "type": "specific",
      "target_addiction": "Porno",
      "title": "Liberté durable",
      "description": "Vous avez appris à lutter. Continuez à appliquer ces outils. La liberté s'entretient chaque jour.",
      "action_text": "J'ai listé les outils qui m'ont le plus aidé cette année.",
      "scripture_text": "C'est pour la liberté que Christ nous a affranchis.",
      "scripture_reference": "Galates 5:1"
    },
    {
      "week_number": 51,
      "type": "specific",
      "target_addiction": "Ecrans",
      "title": "Bilan numérique",
      "description": "Regardez votre temps d'écran moyen cette semaine vs la semaine 1. Appréciez le temps regagné pour vivre.",
      "action_text": "J'ai comparé mon temps d'écran et réalisé le progrès.",
      "scripture_text": "Enseigne-nous à bien compter nos jours.",
      "scripture_reference": "Psaume 90:12"
    },
    {
      "week_number": 52,
      "type": "transversal",
      "target_addiction": "Tous",
      "title": "Engagement Futur",
      "description": "Une année se termine, une vie de liberté continue. Renouvelez votre alliance avec Dieu pour rester libre, un jour à la fois.",
      "action_text": "J'ai prié pour consacrer l'année à venir à Dieu.",
      "scripture_text": "Je cours vers le but, pour remporter le prix de la vocation céleste.",
      "scripture_reference": "Philippiens 3:14"
    }
  ]