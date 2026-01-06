/**
 * Croatian Dictionary
 *
 * Complete translation dictionary for Croatian language (hr)
 */

import type { Dictionary } from "./en"

export const hr: Dictionary = {
  // ============================================================================
  // Navigation
  // ============================================================================
  nav: {
    home: "Početna",
    about: "O nama",
    contact: "Kontakt",
    privacy: "Politika privatnosti",
    mainNav: "Glavna navigacija",
    footerNav: "Navigacija u podnožju",
  },

  // ============================================================================
  // Actions & Buttons
  // ============================================================================
  action: {
    subscribe: "Pretplati se",
    subscribed: "Pretplaćeni!",
    postComment: "Objavi komentar",
    posting: "Objavljivanje...",
    reply: "Odgovori",
    share: "Podijeli",
    save: "Spremi",
    saved: "Spremljeno",
    print: "Ispiši članak",
    viewAll: "Pogledaj sve članke",
    readMore: "Pročitaj više",
    loadMore: "Učitaj više",
    search: "Pretraži",
    close: "Zatvori",
    open: "Otvori",
    cancel: "Odustani",
    confirm: "Potvrdi",
    delete: "Obriši",
    edit: "Uredi",
  },

  // ============================================================================
  // Time & Reading
  // ============================================================================
  time: {
    minRead: "{count} min čitanja",
    min: "{count} min",
    ago: "prije {time}",
    justNow: "Upravo sada",
    today: "Danas",
    yesterday: "Jučer",
  },

  // ============================================================================
  // Comments Section
  // ============================================================================
  comments: {
    title: "Komentari",
    count: "{count} komentar",
    countPlural: "{count} komentara",
    placeholder: "Podijelite svoje mišljenje...",
    empty: "Još nema komentara. Budite prvi koji će podijeliti svoje mišljenje!",
    loginRequired: "Molimo prijavite se za komentiranje",
    success: "Komentar uspješno objavljen!",
    error: "Neuspjelo objavljivanje komentara. Molimo pokušajte ponovno.",
  },

  // ============================================================================
  // Newsletter
  // ============================================================================
  newsletter: {
    title: "Ostanite informirani",
    description: "Primajte najnovije vijesti od {siteName}",
    placeholder: "Unesite svoju e-mail adresu",
    button: "Pretplati se",
    success: "Hvala na pretplati!",
    error: "Nešto je pošlo po zlu. Molimo pokušajte ponovno.",
    alreadySubscribed: "Već ste pretplaćeni!",
  },

  // ============================================================================
  // Article Categories
  // ============================================================================
  category: {
    business: "Poslovanje",
    politics: "Politika",
    technology: "Tehnologija",
    science: "Znanost",
    health: "Zdravlje",
    sports: "Sport",
    artsAndEntertainment: "Umjetnost i zabava",
    environment: "Okoliš",
    all: "Sve kategorije",
  },

  // ============================================================================
  // Article Components
  // ============================================================================
  article: {
    related: "Povezani članci",
    popular: "Popularni članci",
    latest: "Najnoviji članci",
    latestStories: "Najnovije priče",
    trendingNow: "Trenutno popularno",
    popularThisWeek: "Popularno ovaj tjedan",
    readFullStory: "Pročitaj cijelu priču",
    stayInTheLoop: "Ostanite u toku",
    joinThousands: "Pridružite se tisućama čitatelja",
    getLatestStories:
      "Primajte najnovije priče od {siteName} direktno u svoj inbox. Bez spama, odjava u bilo kojem trenutku.",
    successfullySubscribed: "Uspješno pretplaćeni!",
    checkInbox: "Provjerite svoj inbox za potvrdu.",
    contactAuthor: "Kontaktirajte autora",
    trending: "Popularno",
    featured: "Istaknuto",
    toc: "Sadržaj",
    onThisPage: "Na ovoj stranici",
    aboutAuthor: "O autoru",
    about: "O {author}",
    byAuthor: "Autor: {author}",
    publishedOn: "Objavljeno {date}",
    updatedOn: "Ažurirano {date}",
    readingTime: "{count} minuta čitanja",
    readingTimePlural: "{count} minuta čitanja",
    shareArticle: "Podijeli ovaj članak",
    bookmarkArticle: "Spremi ovaj članak",
    printArticle: "Ispiši ovaj članak",
  },

  // ============================================================================
  // Category Page
  // ============================================================================
  categoryPage: {
    title: "{category} članci",
    description: "Pregledajte sve {category} članke na {siteName}",
    articlesCount: "{count} članak u ovoj kategoriji",
    articlesCountPlural: "{count} članaka u ovoj kategoriji",
    noArticles: "Nema pronađenih članaka u ovoj kategoriji",
    noArticlesDescription: "Provjerite uskoro za novi sadržaj!",
  },

  // ============================================================================
  // Author Page
  // ============================================================================
  author: {
    articles: "Članci",
    articleCount: "{count} članak",
    articleCountPlural: "{count} članaka",
    followers: "Pratitelji",
    following: "Praćenje",
    memberSince: "Član od",
    allArticles: "Svi članci",
    noArticles: "Nema pronađenih članaka",
    noArticlesDescription: "Ovaj autor još nije objavio nijedan članak.",
    follow: "Prati",
    unfollow: "Prestani pratiti",
    bio: "Biografija",
  },

  // ============================================================================
  // Search
  // ============================================================================
  search: {
    placeholder: "Pretraži članke...",
    noResults: "Nema rezultata",
    noResultsDescription: "Pokušajte prilagoditi pojmove za pretraživanje",
    searching: "Pretraživanje...",
    results: "{count} rezultat",
    resultsPlural: "{count} rezultata",
    recentSearches: "Nedavna pretraživanja",
    popularSearches: "Popularna pretraživanja",
  },

  // ============================================================================
  // Footer
  // ============================================================================
  footer: {
    quickLinks: "Brze poveznice",
    contact: "Kontakt",
    followUs: "Pratite nas",
    copyright: "© {year} {siteName}. Sva prava pridržana.",
    poweredBy: "Pokreće Hannibal",
  },

  // ============================================================================
  // Error Messages
  // ============================================================================
  error: {
    notFound: "Nije pronađeno",
    pageNotFound: "Stranica nije pronađena",
    articleNotFound: "Članak nije pronađen",
    categoryNotFound: "Kategorija nije pronađena",
    authorNotFound: "Autor nije pronađen",
    somethingWrong: "Nešto je pošlo po zlu",
    tryAgain: "Molimo pokušajte ponovno",
    goHome: "Idi na početnu stranicu",
    serverError: "Greška poslužitelja",
    unauthorized: "Neovlašteno",
    forbidden: "Zabranjeno",
  },

  // ============================================================================
  // Accessibility Labels (ARIA)
  // ============================================================================
  aria: {
    search: "Pretraži (Ctrl+K)",
    openMenu: "Otvori izbornik",
    closeMenu: "Zatvori izbornik",
    toggleTheme: "Promijeni temu",
    followOnX: "Pratite {siteName} na X-u",
    followOnFacebook: "Pratite {siteName} na Facebooku",
    followOnInstagram: "Pratite {siteName} na Instagramu",
    followOnLinkedIn: "Pratite {siteName} na LinkedInu",
    mainNav: "Glavna navigacija",
    footerNav: "Navigacija u podnožju",
    skipToContent: "Preskoči na sadržaj",
    logo: "{siteName} logo",
    bookmarkArticle: "Spremi ovaj članak",
    removeBookmark: "Ukloni oznaku",
  },

  // ============================================================================
  // SEO & Metadata
  // ============================================================================
  seo: {
    defaultTitle: "{siteName} - Najnovije vijesti i članci",
    defaultDescription: "Ostanite informirani s najnovijim vijestima, analizama i uvjetima od {siteName}",
    articleTitle: "{title} - {siteName}",
    categoryTitle: "{category} članci - {siteName}",
    authorTitle: "{author} - {siteName}",
    searchTitle: "Rezultati pretraživanja - {siteName}",
    aboutTitle: "O {siteName}",
    contactTitle: "Kontakt {siteName}",
    privacyTitle: "Politika privatnosti - {siteName}",
    keywords: "vijesti, članci, {siteName}",
  },

  // ============================================================================
  // Social Sharing
  // ============================================================================
  social: {
    shareOn: "Podijeli na {platform}",
    copyLink: "Kopiraj poveznicu",
    linkCopied: "Poveznica kopirana!",
    shareVia: "Podijeli putem",
    twitter: "Twitter",
    facebook: "Facebook",
    linkedin: "LinkedIn",
    email: "E-mail",
    whatsapp: "WhatsApp",
    reddit: "Reddit",
  },

  // ============================================================================
  // Forms & Validation
  // ============================================================================
  form: {
    required: "Ovo polje je obavezno",
    invalidEmail: "Molimo unesite valjanu e-mail adresu",
    tooShort: "Prekratko",
    tooLong: "Predugo",
    invalidUrl: "Molimo unesite valjani URL",
    submit: "Pošalji",
    submitting: "Slanje...",
    success: "Uspjeh!",
    error: "Greška",
  },

  // ============================================================================
  // Pagination
  // ============================================================================
  pagination: {
    previous: "Prethodno",
    next: "Sljedeće",
    page: "Stranica {page}",
    of: "od",
    showing: "Prikazuje se {start} do {end} od {total}",
  },

  // ============================================================================
  // Filters & Sorting
  // ============================================================================
  filter: {
    filterBy: "Filtriraj po",
    sortBy: "Sortiraj po",
    newest: "Najnovije",
    oldest: "Najstarije",
    popular: "Najpopularnije",
    trending: "Popularno",
    relevance: "Relevantnost",
    clear: "Očisti filtere",
    apply: "Primijeni",
  },

  // ============================================================================
  // Loading States
  // ============================================================================
  loading: {
    loading: "Učitavanje...",
    loadingArticles: "Učitavanje članaka...",
    loadingComments: "Učitavanje komentara...",
    pleaseWait: "Molimo pričekajte",
  },

  // ============================================================================
  // Breaking News
  // ============================================================================
  breakingNews: {
    title: "Najnovije vijesti",
    dismiss: "Odbaci najnovije vijesti",
  },
} as const
