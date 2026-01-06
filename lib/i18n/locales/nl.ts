/**
 * Dutch Dictionary
 *
 * Volledig vertaalwoordenboek voor alle statische en gestandaardiseerde inhoud
 * van het Hannibal mediaplatform.
 */

import type { Dictionary } from "./en"

export const nl: Dictionary = {
  nav: {
    home: "Home",
    about: "Over ons",
    contact: "Contact",
    privacy: "Privacybeleid",
    mainNav: "Hoofdnavigatie",
    footerNav: "Voettekstnavigatie",
  },

  action: {
    subscribe: "Abonneren",
    subscribed: "Geabonneerd!",
    postComment: "Reactie plaatsen",
    posting: "Plaatsen...",
    reply: "Antwoorden",
    share: "Delen",
    save: "Opslaan",
    saved: "Opgeslagen",
    print: "Artikel afdrukken",
    viewAll: "Alle artikelen bekijken",
    readMore: "Lees meer",
    loadMore: "Meer laden",
    search: "Zoeken",
    close: "Sluiten",
    open: "Openen",
    cancel: "Annuleren",
    confirm: "Bevestigen",
    delete: "Verwijderen",
    edit: "Bewerken",
  },

  time: {
    minRead: "{count} min lezen",
    min: "{count} min",
    ago: "{time} geleden",
    justNow: "Zojuist",
    today: "Vandaag",
    yesterday: "Gisteren",
  },

  comments: {
    title: "Reacties",
    count: "{count} reactie",
    countPlural: "{count} reacties",
    placeholder: "Deel je gedachten...",
    empty: "Nog geen reacties. Wees de eerste om je gedachten te delen!",
    loginRequired: "Log in om te reageren",
    success: "Reactie succesvol geplaatst!",
    error: "Kan reactie niet plaatsen. Probeer het opnieuw.",
  },

  newsletter: {
    title: "Blijf op de hoogte",
    description: "Ontvang het laatste van {siteName}",
    placeholder: "Voer je e-mailadres in",
    button: "Abonneren",
    success: "Bedankt voor je abonnement!",
    error: "Er is iets misgegaan. Probeer het opnieuw.",
    alreadySubscribed: "Je bent al geabonneerd!",
  },

  category: {
    business: "Zakelijk",
    politics: "Politiek",
    technology: "Technologie",
    science: "Wetenschap",
    health: "Gezondheid",
    sports: "Sport",
    artsAndEntertainment: "Kunst en entertainment",
    environment: "Milieu",
    all: "Alle categorieën",
  },

  article: {
    related: "Gerelateerde artikelen",
    popular: "Populaire artikelen",
    latest: "Laatste artikelen",
    latestStories: "Laatste verhalen",
    trendingNow: "Nu trending",
    popularThisWeek: "Populair deze week",
    readFullStory: "Lees het volledige verhaal",
    stayInTheLoop: "Blijf op de hoogte",
    joinThousands: "Sluit je aan bij duizenden lezers",
    getLatestStories:
      "Ontvang de laatste verhalen van {siteName} direct in je inbox. Geen spam, op elk moment opzegbaar.",
    successfullySubscribed: "Succesvol geabonneerd!",
    checkInbox: "Controleer je inbox voor bevestiging.",
    contactAuthor: "Contact met auteur",
    trending: "Trending",
    featured: "Uitgelicht",
    toc: "Inhoudsopgave",
    onThisPage: "Op deze pagina",
    aboutAuthor: "Over de auteur",
    about: "Over {author}",
    byAuthor: "Door {author}",
    publishedOn: "Gepubliceerd op {date}",
    updatedOn: "Bijgewerkt op {date}",
    readingTime: "{count} minuut leestijd",
    readingTimePlural: "{count} minuten leestijd",
    shareArticle: "Dit artikel delen",
    bookmarkArticle: "Dit artikel opslaan",
    printArticle: "Dit artikel afdrukken",
  },

  categoryPage: {
    title: "{category} artikelen",
    description: "Bekijk alle {category} artikelen op {siteName}",
    articlesCount: "{count} artikel in deze categorie",
    articlesCountPlural: "{count} artikelen in deze categorie",
    noArticles: "Geen artikelen gevonden in deze categorie",
    noArticlesDescription: "Kom binnenkort terug voor nieuwe inhoud!",
  },

  author: {
    articles: "Artikelen",
    followers: "Volgers",
    following: "Volgend",
    memberSince: "Lid sinds",
    allArticles: "Alle artikelen",
    noArticles: "Geen artikelen gevonden",
    noArticlesDescription: "Deze auteur heeft nog geen artikelen gepubliceerd.",
    follow: "Volgen",
    unfollow: "Ontvolgen",
    bio: "Biografie",
    articleCount: "{count} artikel",
    articleCountPlural: "{count} artikelen",
  },

  search: {
    placeholder: "Zoek artikelen...",
    noResults: "Geen resultaten gevonden",
    noResultsDescription: "Probeer je zoektermen aan te passen",
    searching: "Zoeken...",
    results: "{count} resultaat",
    resultsPlural: "{count} resultaten",
    recentSearches: "Recente zoekopdrachten",
    popularSearches: "Populaire zoekopdrachten",
  },

  breakingNews: {
    title: "Laatste Nieuws",
    dismiss: "Laatste nieuws sluiten",
  },

  footer: {
    quickLinks: "Snelle links",
    contact: "Contact",
    followUs: "Volg ons",
    copyright: "© {year} {siteName}. Alle rechten voorbehouden.",
    poweredBy: "Mogelijk gemaakt door Hannibal",
  },

  error: {
    notFound: "Niet gevonden",
    pageNotFound: "Pagina niet gevonden",
    articleNotFound: "Artikel niet gevonden",
    categoryNotFound: "Categorie niet gevonden",
    authorNotFound: "Auteur niet gevonden",
    somethingWrong: "Er is iets misgegaan",
    tryAgain: "Probeer het opnieuw",
    goHome: "Ga naar startpagina",
    serverError: "Serverfout",
    unauthorized: "Niet geautoriseerd",
    forbidden: "Verboden",
  },

  aria: {
    search: "Zoeken (Ctrl+K)",
    openMenu: "Menu openen",
    closeMenu: "Menu sluiten",
    toggleTheme: "Thema wisselen",
    followOnX: "Volg {siteName} op X",
    followOnFacebook: "Volg {siteName} op Facebook",
    followOnInstagram: "Volg {siteName} op Instagram",
    followOnLinkedIn: "Volg {siteName} op LinkedIn",
    mainNav: "Hoofdnavigatie",
    footerNav: "Voettekstnavigatie",
    skipToContent: "Ga naar inhoud",
    logo: "{siteName} logo",
    bookmarkArticle: "Dit artikel opslaan",
    removeBookmark: "Bladwijzer verwijderen",
  },

  seo: {
    defaultTitle: "{siteName} - Laatste nieuws en artikelen",
    defaultDescription: "Blijf op de hoogte met het laatste nieuws, analyses en inzichten van {siteName}",
    articleTitle: "{title} - {siteName}",
    categoryTitle: "{category} artikelen - {siteName}",
    authorTitle: "{author} - {siteName}",
    searchTitle: "Zoekresultaten - {siteName}",
    aboutTitle: "Over {siteName}",
    contactTitle: "Contact met {siteName}",
    privacyTitle: "Privacybeleid - {siteName}",
    keywords: "nieuws, artikelen, {siteName}",
  },

  social: {
    shareOn: "Delen op {platform}",
    copyLink: "Link kopiëren",
    linkCopied: "Link gekopieerd!",
    shareVia: "Delen via",
    twitter: "Twitter",
    facebook: "Facebook",
    linkedin: "LinkedIn",
    email: "E-mail",
    whatsapp: "WhatsApp",
    reddit: "Reddit",
  },

  form: {
    required: "Dit veld is verplicht",
    invalidEmail: "Voer een geldig e-mailadres in",
    tooShort: "Te kort",
    tooLong: "Te lang",
    invalidUrl: "Voer een geldige URL in",
    submit: "Verzenden",
    submitting: "Verzenden...",
    success: "Succes!",
    error: "Fout",
  },

  pagination: {
    previous: "Vorige",
    next: "Volgende",
    page: "Pagina {page}",
    of: "van",
    showing: "{start} tot {end} van {total} weergeven",
  },

  filter: {
    filterBy: "Filteren op",
    sortBy: "Sorteren op",
    newest: "Nieuwste",
    oldest: "Oudste",
    popular: "Populairste",
    trending: "Trending",
    relevance: "Relevantie",
    clear: "Filters wissen",
    apply: "Toepassen",
  },

  loading: {
    loading: "Laden...",
    loadingArticles: "Artikelen laden...",
    loadingComments: "Reacties laden...",
    pleaseWait: "Even geduld",
  },
} as const
