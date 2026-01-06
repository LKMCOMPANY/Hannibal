/**
 * Italian Dictionary
 *
 * Dizionario di traduzione completo per tutti i contenuti statici e standardizzati
 * della piattaforma mediatica Hannibal.
 */

import type { Dictionary } from "./en"

export const it: Dictionary = {
  // ============================================================================
  // Navigation
  // ============================================================================
  nav: {
    home: "Home",
    about: "Chi siamo",
    contact: "Contatti",
    privacy: "Privacy Policy",
    mainNav: "Navigazione principale",
    footerNav: "Navigazione footer",
  },

  // ============================================================================
  // Actions & Buttons
  // ============================================================================
  action: {
    subscribe: "Iscriviti",
    subscribed: "Iscritto!",
    postComment: "Pubblica commento",
    posting: "Pubblicazione...",
    reply: "Rispondi",
    share: "Condividi",
    save: "Salva",
    saved: "Salvato",
    print: "Stampa articolo",
    viewAll: "Vedi tutti gli articoli",
    readMore: "Leggi di più",
    loadMore: "Carica altro",
    search: "Cerca",
    close: "Chiudi",
    open: "Apri",
    cancel: "Annulla",
    confirm: "Conferma",
    delete: "Elimina",
    edit: "Modifica",
  },

  // ============================================================================
  // Time & Reading
  // ============================================================================
  time: {
    minRead: "{count} min di lettura",
    min: "{count} min",
    ago: "{time} fa",
    justNow: "Proprio ora",
    today: "Oggi",
    yesterday: "Ieri",
  },

  // ============================================================================
  // Comments Section
  // ============================================================================
  comments: {
    title: "Commenti",
    count: "{count} commento",
    countPlural: "{count} commenti",
    placeholder: "Condividi i tuoi pensieri...",
    empty: "Nessun commento ancora. Sii il primo a condividere i tuoi pensieri!",
    loginRequired: "Effettua il login per commentare",
    success: "Commento pubblicato con successo!",
    error: "Impossibile pubblicare il commento. Riprova.",
  },

  // ============================================================================
  // Newsletter
  // ============================================================================
  newsletter: {
    title: "Rimani aggiornato",
    description: "Ricevi le ultime novità da {siteName}",
    placeholder: "Inserisci la tua email",
    button: "Iscriviti",
    success: "Grazie per esserti iscritto!",
    error: "Qualcosa è andato storto. Riprova.",
    alreadySubscribed: "Sei già iscritto!",
  },

  // ============================================================================
  // Article Categories
  // ============================================================================
  category: {
    business: "Business",
    politics: "Politica",
    technology: "Tecnologia",
    science: "Scienza",
    health: "Salute",
    sports: "Sport",
    artsAndEntertainment: "Arte e intrattenimento",
    environment: "Ambiente",
    all: "Tutte le categorie",
  },

  // ============================================================================
  // Article Components
  // ============================================================================
  article: {
    related: "Articoli correlati",
    popular: "Articoli popolari",
    latest: "Ultimi articoli",
    latestStories: "Ultime storie",
    trendingNow: "Di tendenza ora",
    popularThisWeek: "Popolare questa settimana",
    readFullStory: "Leggi la storia completa",
    stayInTheLoop: "Rimani informato",
    joinThousands: "Unisciti a migliaia di lettori",
    getLatestStories:
      "Ricevi le ultime storie da {siteName} direttamente nella tua casella di posta. Niente spam, cancellati in qualsiasi momento.",
    successfullySubscribed: "Iscrizione riuscita!",
    checkInbox: "Controlla la tua casella di posta per la conferma.",
    contactAuthor: "Contatta l'autore",
    trending: "Di tendenza",
    featured: "In evidenza",
    toc: "Indice",
    onThisPage: "In questa pagina",
    aboutAuthor: "Informazioni sull'autore",
    about: "Informazioni su {author}",
    byAuthor: "Di {author}",
    publishedOn: "Pubblicato il {date}",
    updatedOn: "Aggiornato il {date}",
    readingTime: "{count} minuto di lettura",
    readingTimePlural: "{count} minuti di lettura",
    shareArticle: "Condividi questo articolo",
    bookmarkArticle: "Salva questo articolo",
    printArticle: "Stampa questo articolo",
  },

  // ============================================================================
  // Category Page
  // ============================================================================
  categoryPage: {
    title: "Articoli {category}",
    description: "Sfoglia tutti gli articoli {category} su {siteName}",
    articlesCount: "{count} articolo in questa categoria",
    articlesCountPlural: "{count} articoli in questa categoria",
    noArticles: "Nessun articolo trovato in questa categoria",
    noArticlesDescription: "Torna presto per nuovi contenuti!",
  },

  // ============================================================================
  // Author Page
  // ============================================================================
  author: {
    articles: "Articoli",
    articleCount: "{count} articolo",
    articleCountPlural: "{count} articoli",
    followers: "Follower",
    following: "Seguiti",
    memberSince: "Membro dal",
    allArticles: "Tutti gli articoli",
    noArticles: "Nessun articolo trovato",
    noArticlesDescription: "Questo autore non ha ancora pubblicato articoli.",
    follow: "Segui",
    unfollow: "Smetti di seguire",
    bio: "Biografia",
  },

  // ============================================================================
  // Search
  // ============================================================================
  search: {
    placeholder: "Cerca articoli...",
    noResults: "Nessun risultato trovato",
    noResultsDescription: "Prova a modificare i termini di ricerca",
    searching: "Ricerca in corso...",
    results: "{count} risultato",
    resultsPlural: "{count} risultati",
    recentSearches: "Ricerche recenti",
    popularSearches: "Ricerche popolari",
  },

  // ============================================================================
  // Footer
  // ============================================================================
  footer: {
    quickLinks: "Link rapidi",
    contact: "Contatti",
    followUs: "Seguici",
    copyright: "© {year} {siteName}. Tutti i diritti riservati.",
    poweredBy: "Powered by Hannibal",
  },

  // ============================================================================
  // Error Messages
  // ============================================================================
  error: {
    notFound: "Non trovato",
    pageNotFound: "Pagina non trovata",
    articleNotFound: "Articolo non trovato",
    categoryNotFound: "Categoria non trovata",
    authorNotFound: "Autore non trovato",
    somethingWrong: "Qualcosa è andato storto",
    tryAgain: "Riprova",
    goHome: "Vai alla home",
    serverError: "Errore del server",
    unauthorized: "Non autorizzato",
    forbidden: "Vietato",
  },

  // ============================================================================
  // Accessibility Labels (ARIA)
  // ============================================================================
  aria: {
    search: "Cerca (Ctrl+K)",
    openMenu: "Apri menu",
    closeMenu: "Chiudi menu",
    toggleTheme: "Cambia tema",
    followOnX: "Segui {siteName} su X",
    followOnFacebook: "Segui {siteName} su Facebook",
    followOnInstagram: "Segui {siteName} su Instagram",
    followOnLinkedIn: "Segui {siteName} su LinkedIn",
    mainNav: "Navigazione principale",
    footerNav: "Navigazione footer",
    skipToContent: "Vai al contenuto",
    logo: "Logo {siteName}",
    bookmarkArticle: "Salva questo articolo",
    removeBookmark: "Rimuovi segnalibro",
  },

  // ============================================================================
  // SEO & Metadata
  // ============================================================================
  seo: {
    defaultTitle: "{siteName} - Ultime notizie e articoli",
    defaultDescription: "Rimani informato con le ultime notizie, analisi e approfondimenti da {siteName}",
    articleTitle: "{title} - {siteName}",
    categoryTitle: "Articoli {category} - {siteName}",
    authorTitle: "{author} - {siteName}",
    searchTitle: "Risultati di ricerca - {siteName}",
    aboutTitle: "Chi siamo - {siteName}",
    contactTitle: "Contatta {siteName}",
    privacyTitle: "Privacy Policy - {siteName}",
    keywords: "notizie, articoli, {siteName}",
  },

  // ============================================================================
  // Social Sharing
  // ============================================================================
  social: {
    shareOn: "Condividi su {platform}",
    copyLink: "Copia link",
    linkCopied: "Link copiato!",
    shareVia: "Condividi tramite",
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
    required: "Questo campo è obbligatorio",
    invalidEmail: "Inserisci un indirizzo email valido",
    tooShort: "Troppo corto",
    tooLong: "Troppo lungo",
    invalidUrl: "Inserisci un URL valido",
    submit: "Invia",
    submitting: "Invio in corso...",
    success: "Successo!",
    error: "Errore",
  },

  // ============================================================================
  // Pagination
  // ============================================================================
  pagination: {
    previous: "Precedente",
    next: "Successivo",
    page: "Pagina {page}",
    of: "di",
    showing: "Mostrando {start} a {end} di {total}",
  },

  // ============================================================================
  // Filters & Sorting
  // ============================================================================
  filter: {
    filterBy: "Filtra per",
    sortBy: "Ordina per",
    newest: "Più recenti",
    oldest: "Più vecchi",
    popular: "Più popolari",
    trending: "Di tendenza",
    relevance: "Rilevanza",
    clear: "Cancella filtri",
    apply: "Applica",
  },

  // ============================================================================
  // Loading States
  // ============================================================================
  loading: {
    loading: "Caricamento...",
    loadingArticles: "Caricamento articoli...",
    loadingComments: "Caricamento commenti...",
    pleaseWait: "Attendere prego",
  },

  // ============================================================================
  // Breaking News
  // ============================================================================
  breakingNews: {
    title: "Ultime notizie",
    dismiss: "Chiudi ultime notizie",
  },
} as const
