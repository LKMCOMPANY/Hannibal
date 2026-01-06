/**
 * German Dictionary
 *
 * Vollständiges Übersetzungswörterbuch für alle statischen und standardisierten Inhalte
 * der Hannibal-Medienplattform.
 */

import type { Dictionary } from "./en"

export const de: Dictionary = {
  // ============================================================================
  // Navigation
  // ============================================================================
  nav: {
    home: "Startseite",
    about: "Über uns",
    contact: "Kontakt",
    privacy: "Datenschutz",
    mainNav: "Hauptnavigation",
    footerNav: "Fußzeilennavigation",
  },

  // ============================================================================
  // Actions & Buttons
  // ============================================================================
  action: {
    subscribe: "Abonnieren",
    subscribed: "Abonniert!",
    postComment: "Kommentar posten",
    posting: "Wird gepostet...",
    reply: "Antworten",
    share: "Teilen",
    save: "Speichern",
    saved: "Gespeichert",
    print: "Artikel drucken",
    viewAll: "Alle Artikel anzeigen",
    readMore: "Mehr lesen",
    loadMore: "Mehr laden",
    search: "Suchen",
    close: "Schließen",
    open: "Öffnen",
    cancel: "Abbrechen",
    confirm: "Bestätigen",
    delete: "Löschen",
    edit: "Bearbeiten",
  },

  // ============================================================================
  // Time & Reading
  // ============================================================================
  time: {
    minRead: "{count} Min. Lesezeit",
    min: "{count} Min.",
    ago: "vor {time}",
    justNow: "Gerade eben",
    today: "Heute",
    yesterday: "Gestern",
  },

  // ============================================================================
  // Comments Section
  // ============================================================================
  comments: {
    title: "Kommentare",
    count: "{count} Kommentar",
    countPlural: "{count} Kommentare",
    placeholder: "Teilen Sie Ihre Gedanken...",
    empty: "Noch keine Kommentare. Seien Sie der Erste, der seine Gedanken teilt!",
    loginRequired: "Bitte melden Sie sich an, um zu kommentieren",
    success: "Kommentar erfolgreich gepostet!",
    error: "Kommentar konnte nicht gepostet werden. Bitte versuchen Sie es erneut.",
  },

  // ============================================================================
  // Newsletter
  // ============================================================================
  newsletter: {
    title: "Bleiben Sie auf dem Laufenden",
    description: "Erhalten Sie das Neueste von {siteName}",
    placeholder: "Geben Sie Ihre E-Mail ein",
    button: "Abonnieren",
    success: "Vielen Dank für Ihr Abonnement!",
    error: "Etwas ist schief gelaufen. Bitte versuchen Sie es erneut.",
    alreadySubscribed: "Sie haben bereits abonniert!",
  },

  // ============================================================================
  // Article Categories
  // ============================================================================
  category: {
    business: "Wirtschaft",
    politics: "Politik",
    technology: "Technologie",
    science: "Wissenschaft",
    health: "Gesundheit",
    sports: "Sport",
    artsAndEntertainment: "Kunst und Unterhaltung",
    environment: "Umwelt",
    all: "Alle Kategorien",
  },

  // ============================================================================
  // Article Components
  // ============================================================================
  article: {
    related: "Verwandte Artikel",
    popular: "Beliebte Artikel",
    latest: "Neueste Artikel",
    latestStories: "Neueste Geschichten",
    trendingNow: "Jetzt im Trend",
    popularThisWeek: "Beliebt diese Woche",
    readFullStory: "Vollständige Geschichte lesen",
    stayInTheLoop: "Bleiben Sie informiert",
    joinThousands: "Schließen Sie sich Tausenden von Lesern an",
    getLatestStories:
      "Erhalten Sie die neuesten Geschichten von {siteName} direkt in Ihren Posteingang. Kein Spam, jederzeit abbestellbar.",
    successfullySubscribed: "Erfolgreich abonniert!",
    checkInbox: "Überprüfen Sie Ihren Posteingang zur Bestätigung.",
    contactAuthor: "Autor kontaktieren",
    trending: "Im Trend",
    featured: "Hervorgehoben",
    toc: "Inhaltsverzeichnis",
    onThisPage: "Auf dieser Seite",
    aboutAuthor: "Über den Autor",
    about: "Über {author}",
    byAuthor: "Von {author}",
    publishedOn: "Veröffentlicht am {date}",
    updatedOn: "Aktualisiert am {date}",
    readingTime: "{count} Minute Lesezeit",
    readingTimePlural: "{count} Minuten Lesezeit",
    shareArticle: "Diesen Artikel teilen",
    bookmarkArticle: "Diesen Artikel speichern",
    printArticle: "Diesen Artikel drucken",
  },

  // ============================================================================
  // Category Page
  // ============================================================================
  categoryPage: {
    title: "{category}-Artikel",
    description: "Durchsuchen Sie alle {category}-Artikel auf {siteName}",
    articlesCount: "{count} Artikel in dieser Kategorie",
    articlesCountPlural: "{count} Artikel in dieser Kategorie",
    noArticles: "Keine Artikel in dieser Kategorie gefunden",
    noArticlesDescription: "Schauen Sie bald wieder vorbei für neue Inhalte!",
  },

  // ============================================================================
  // Author Page
  // ============================================================================
  author: {
    articles: "Artikel",
    articleCount: "{count} Artikel",
    articleCountPlural: "{count} Artikel",
    followers: "Follower",
    following: "Folgt",
    memberSince: "Mitglied seit",
    allArticles: "Alle Artikel",
    noArticles: "Keine Artikel gefunden",
    noArticlesDescription: "Dieser Autor hat noch keine Artikel veröffentlicht.",
    follow: "Folgen",
    unfollow: "Nicht mehr folgen",
    bio: "Biografie",
  },

  // ============================================================================
  // Search
  // ============================================================================
  search: {
    placeholder: "Artikel suchen...",
    noResults: "Keine Ergebnisse gefunden",
    noResultsDescription: "Versuchen Sie, Ihre Suchbegriffe anzupassen",
    searching: "Suche läuft...",
    results: "{count} Ergebnis",
    resultsPlural: "{count} Ergebnisse",
    recentSearches: "Letzte Suchen",
    popularSearches: "Beliebte Suchen",
  },

  // ============================================================================
  // Footer
  // ============================================================================
  footer: {
    quickLinks: "Schnelllinks",
    contact: "Kontakt",
    followUs: "Folgen Sie uns",
    copyright: "© {year} {siteName}. Alle Rechte vorbehalten.",
    poweredBy: "Betrieben von Hannibal",
  },

  // ============================================================================
  // Error Messages
  // ============================================================================
  error: {
    notFound: "Nicht gefunden",
    pageNotFound: "Seite nicht gefunden",
    articleNotFound: "Artikel nicht gefunden",
    categoryNotFound: "Kategorie nicht gefunden",
    authorNotFound: "Autor nicht gefunden",
    somethingWrong: "Etwas ist schief gelaufen",
    tryAgain: "Bitte versuchen Sie es erneut",
    goHome: "Zur Startseite",
    serverError: "Serverfehler",
    unauthorized: "Nicht autorisiert",
    forbidden: "Verboten",
  },

  // ============================================================================
  // Accessibility Labels (ARIA)
  // ============================================================================
  aria: {
    search: "Suchen (Strg+K)",
    openMenu: "Menü öffnen",
    closeMenu: "Menü schließen",
    toggleTheme: "Design wechseln",
    followOnX: "{siteName} auf X folgen",
    followOnFacebook: "{siteName} auf Facebook folgen",
    followOnInstagram: "{siteName} auf Instagram folgen",
    followOnLinkedIn: "{siteName} auf LinkedIn folgen",
    mainNav: "Hauptnavigation",
    footerNav: "Fußzeilennavigation",
    skipToContent: "Zum Inhalt springen",
    logo: "{siteName}-Logo",
    bookmarkArticle: "Diesen Artikel speichern",
    removeBookmark: "Lesezeichen entfernen",
  },

  // ============================================================================
  // SEO & Metadata
  // ============================================================================
  seo: {
    defaultTitle: "{siteName} - Neueste Nachrichten und Artikel",
    defaultDescription: "Bleiben Sie informiert mit den neuesten Nachrichten, Analysen und Einblicken von {siteName}",
    articleTitle: "{title} - {siteName}",
    categoryTitle: "{category}-Artikel - {siteName}",
    authorTitle: "{author} - {siteName}",
    searchTitle: "Suchergebnisse - {siteName}",
    aboutTitle: "Über {siteName}",
    contactTitle: "{siteName} kontaktieren",
    privacyTitle: "Datenschutz - {siteName}",
    keywords: "Nachrichten, Artikel, {siteName}",
  },

  // ============================================================================
  // Social Sharing
  // ============================================================================
  social: {
    shareOn: "Auf {platform} teilen",
    copyLink: "Link kopieren",
    linkCopied: "Link kopiert!",
    shareVia: "Teilen über",
    twitter: "Twitter",
    facebook: "Facebook",
    linkedin: "LinkedIn",
    email: "E-Mail",
    whatsapp: "WhatsApp",
    reddit: "Reddit",
  },

  // ============================================================================
  // Forms & Validation
  // ============================================================================
  form: {
    required: "Dieses Feld ist erforderlich",
    invalidEmail: "Bitte geben Sie eine gültige E-Mail-Adresse ein",
    tooShort: "Zu kurz",
    tooLong: "Zu lang",
    invalidUrl: "Bitte geben Sie eine gültige URL ein",
    submit: "Absenden",
    submitting: "Wird gesendet...",
    success: "Erfolg!",
    error: "Fehler",
  },

  // ============================================================================
  // Pagination
  // ============================================================================
  pagination: {
    previous: "Zurück",
    next: "Weiter",
    page: "Seite {page}",
    of: "von",
    showing: "Zeige {start} bis {end} von {total}",
  },

  // ============================================================================
  // Filters & Sorting
  // ============================================================================
  filter: {
    filterBy: "Filtern nach",
    sortBy: "Sortieren nach",
    newest: "Neueste",
    oldest: "Älteste",
    popular: "Beliebteste",
    trending: "Im Trend",
    relevance: "Relevanz",
    clear: "Filter löschen",
    apply: "Anwenden",
  },

  // ============================================================================
  // Loading States
  // ============================================================================
  loading: {
    loading: "Lädt...",
    loadingArticles: "Artikel werden geladen...",
    loadingComments: "Kommentare werden geladen...",
    pleaseWait: "Bitte warten",
  },

  // ============================================================================
  // Breaking News
  // ============================================================================
  breakingNews: {
    title: "Eilmeldung",
    dismiss: "Eilmeldung schließen",
  },
} as const
