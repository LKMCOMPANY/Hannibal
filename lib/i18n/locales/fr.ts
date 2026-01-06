/**
 * French Dictionary
 *
 * Dictionnaire de traduction complet pour tout le contenu statique et standardisé
 * de la plateforme média Hannibal.
 */

import type { Dictionary } from "./en"

export const fr: Dictionary = {
  // ============================================================================
  // Navigation
  // ============================================================================
  nav: {
    home: "Accueil",
    about: "À propos",
    contact: "Contact",
    privacy: "Politique de confidentialité",
    mainNav: "Navigation principale",
    footerNav: "Navigation du pied de page",
  },

  // ============================================================================
  // Actions & Buttons
  // ============================================================================
  action: {
    subscribe: "S'abonner",
    subscribed: "Abonné!",
    postComment: "Publier le commentaire",
    posting: "Publication...",
    reply: "Répondre",
    share: "Partager",
    save: "Enregistrer",
    saved: "Enregistré",
    print: "Imprimer l'article",
    viewAll: "Voir tous les articles",
    readMore: "Lire la suite",
    loadMore: "Charger plus",
    search: "Rechercher",
    close: "Fermer",
    open: "Ouvrir",
    cancel: "Annuler",
    confirm: "Confirmer",
    delete: "Supprimer",
    edit: "Modifier",
  },

  // ============================================================================
  // Time & Reading
  // ============================================================================
  time: {
    minRead: "{count} min de lecture",
    min: "{count} min",
    ago: "il y a {time}",
    justNow: "À l'instant",
    today: "Aujourd'hui",
    yesterday: "Hier",
  },

  // ============================================================================
  // Comments Section
  // ============================================================================
  comments: {
    title: "Commentaires",
    count: "{count} commentaire",
    countPlural: "{count} commentaires",
    placeholder: "Partagez vos pensées...",
    empty: "Aucun commentaire pour le moment. Soyez le premier à partager vos pensées!",
    loginRequired: "Veuillez vous connecter pour commenter",
    success: "Commentaire publié avec succès!",
    error: "Échec de la publication du commentaire. Veuillez réessayer.",
  },

  // ============================================================================
  // Newsletter
  // ============================================================================
  newsletter: {
    title: "Restez informé",
    description: "Recevez les dernières nouvelles de {siteName}",
    placeholder: "Entrez votre email",
    button: "S'abonner",
    success: "Merci de vous être abonné!",
    error: "Une erreur s'est produite. Veuillez réessayer.",
    alreadySubscribed: "Vous êtes déjà abonné!",
  },

  // ============================================================================
  // Article Categories
  // ============================================================================
  category: {
    business: "Affaires",
    politics: "Politique",
    technology: "Technologie",
    science: "Science",
    health: "Santé",
    sports: "Sports",
    artsAndEntertainment: "Arts et divertissement",
    environment: "Environnement",
    all: "Toutes les catégories",
  },

  // ============================================================================
  // Article Components
  // ============================================================================
  article: {
    related: "Articles connexes",
    popular: "Articles populaires",
    latest: "Derniers articles",
    latestStories: "Dernières actualités",
    trendingNow: "Tendances actuelles",
    popularThisWeek: "Populaire cette semaine",
    readFullStory: "Lire l'article complet",
    stayInTheLoop: "Restez informé",
    joinThousands: "Rejoignez des milliers de lecteurs",
    getLatestStories:
      "Recevez les dernières actualités de {siteName} directement dans votre boîte de réception. Pas de spam, désabonnement à tout moment.",
    successfullySubscribed: "Abonnement réussi!",
    checkInbox: "Vérifiez votre boîte de réception pour confirmation.",
    contactAuthor: "Contacter l'auteur",
    trending: "Tendance",
    featured: "À la une",
    toc: "Table des matières",
    onThisPage: "Sur cette page",
    aboutAuthor: "À propos de l'auteur",
    about: "À propos de {author}",
    byAuthor: "Par {author}",
    publishedOn: "Publié le {date}",
    updatedOn: "Mis à jour le {date}",
    readingTime: "{count} minute de lecture",
    readingTimePlural: "{count} minutes de lecture",
    shareArticle: "Partager cet article",
    bookmarkArticle: "Enregistrer cet article",
    printArticle: "Imprimer cet article",
  },

  // ============================================================================
  // Category Page
  // ============================================================================
  categoryPage: {
    title: "Articles {category}",
    description: "Parcourir tous les articles {category} sur {siteName}",
    articlesCount: "{count} article dans cette catégorie",
    articlesCountPlural: "{count} articles dans cette catégorie",
    noArticles: "Aucun article trouvé dans cette catégorie",
    noArticlesDescription: "Revenez bientôt pour du nouveau contenu!",
  },

  // ============================================================================
  // Author Page
  // ============================================================================
  author: {
    articles: "Articles",
    articleCount: "{count} article",
    articleCountPlural: "{count} articles",
    followers: "Abonnés",
    following: "Abonnements",
    memberSince: "Membre depuis",
    allArticles: "Tous les articles",
    noArticles: "Aucun article trouvé",
    noArticlesDescription: "Cet auteur n'a pas encore publié d'articles.",
    follow: "Suivre",
    unfollow: "Ne plus suivre",
    bio: "Biographie",
  },

  // ============================================================================
  // Search
  // ============================================================================
  search: {
    placeholder: "Rechercher des articles...",
    noResults: "Aucun résultat trouvé",
    noResultsDescription: "Essayez d'ajuster vos termes de recherche",
    searching: "Recherche en cours...",
    results: "{count} résultat",
    resultsPlural: "{count} résultats",
    recentSearches: "Recherches récentes",
    popularSearches: "Recherches populaires",
  },

  // ============================================================================
  // Footer
  // ============================================================================
  footer: {
    quickLinks: "Liens rapides",
    contact: "Contact",
    followUs: "Suivez-nous",
    copyright: "© {year} {siteName}. Tous droits réservés.",
    poweredBy: "Propulsé par Hannibal",
  },

  // ============================================================================
  // Error Messages
  // ============================================================================
  error: {
    notFound: "Non trouvé",
    pageNotFound: "Page non trouvée",
    articleNotFound: "Article non trouvé",
    categoryNotFound: "Catégorie non trouvée",
    authorNotFound: "Auteur non trouvé",
    somethingWrong: "Une erreur s'est produite",
    tryAgain: "Veuillez réessayer",
    goHome: "Aller à l'accueil",
    serverError: "Erreur du serveur",
    unauthorized: "Non autorisé",
    forbidden: "Interdit",
  },

  // ============================================================================
  // Accessibility Labels (ARIA)
  // ============================================================================
  aria: {
    search: "Rechercher (Ctrl+K)",
    openMenu: "Ouvrir le menu",
    closeMenu: "Fermer le menu",
    toggleTheme: "Changer le thème",
    followOnX: "Suivre {siteName} sur X",
    followOnFacebook: "Suivre {siteName} sur Facebook",
    followOnInstagram: "Suivre {siteName} sur Instagram",
    followOnLinkedIn: "Suivre {siteName} sur LinkedIn",
    mainNav: "Navigation principale",
    footerNav: "Navigation du pied de page",
    skipToContent: "Aller au contenu",
    logo: "Logo de {siteName}",
    bookmarkArticle: "Enregistrer cet article",
    removeBookmark: "Retirer le signet",
  },

  // ============================================================================
  // SEO & Metadata
  // ============================================================================
  seo: {
    defaultTitle: "{siteName} - Dernières nouvelles et articles",
    defaultDescription: "Restez informé avec les dernières nouvelles, analyses et perspectives de {siteName}",
    articleTitle: "{title} - {siteName}",
    categoryTitle: "Articles {category} - {siteName}",
    authorTitle: "{author} - {siteName}",
    searchTitle: "Résultats de recherche - {siteName}",
    aboutTitle: "À propos de {siteName}",
    contactTitle: "Contacter {siteName}",
    privacyTitle: "Politique de confidentialité - {siteName}",
    keywords: "actualités, articles, {siteName}",
  },

  // ============================================================================
  // Social Sharing
  // ============================================================================
  social: {
    shareOn: "Partager sur {platform}",
    copyLink: "Copier le lien",
    linkCopied: "Lien copié!",
    shareVia: "Partager via",
    twitter: "Twitter",
    facebook: "Facebook",
    linkedin: "LinkedIn",
    email: "Email",
    whatsapp: "WhatsApp",
    reddit: "Reddit",
  },

  // ============================================================================
  // Forms & Validation
  // ============================================================================
  form: {
    required: "Ce champ est requis",
    invalidEmail: "Veuillez entrer une adresse email valide",
    tooShort: "Trop court",
    tooLong: "Trop long",
    invalidUrl: "Veuillez entrer une URL valide",
    submit: "Soumettre",
    submitting: "Envoi en cours...",
    success: "Succès!",
    error: "Erreur",
  },

  // ============================================================================
  // Pagination
  // ============================================================================
  pagination: {
    previous: "Précédent",
    next: "Suivant",
    page: "Page {page}",
    of: "sur",
    showing: "Affichage de {start} à {end} sur {total}",
  },

  // ============================================================================
  // Filters & Sorting
  // ============================================================================
  filter: {
    filterBy: "Filtrer par",
    sortBy: "Trier par",
    newest: "Plus récent",
    oldest: "Plus ancien",
    popular: "Plus populaire",
    trending: "Tendance",
    relevance: "Pertinence",
    clear: "Effacer les filtres",
    apply: "Appliquer",
  },

  // ============================================================================
  // Loading States
  // ============================================================================
  loading: {
    loading: "Chargement...",
    loadingArticles: "Chargement des articles...",
    loadingComments: "Chargement des commentaires...",
    pleaseWait: "Veuillez patienter",
  },

  // ============================================================================
  // Breaking News
  // ============================================================================
  breakingNews: {
    title: "Dernière minute",
    dismiss: "Fermer les dernières nouvelles",
  },
} as const
