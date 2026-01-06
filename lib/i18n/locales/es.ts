/**
 * Spanish Dictionary
 *
 * Diccionario de traducción completo para todo el contenido estático y estandarizado
 * de la plataforma de medios Hannibal.
 */

import type { Dictionary } from "./en"

export const es: Dictionary = {
  // ============================================================================
  // Navigation
  // ============================================================================
  nav: {
    home: "Inicio",
    about: "Acerca de",
    contact: "Contacto",
    privacy: "Política de privacidad",
    mainNav: "Navegación principal",
    footerNav: "Navegación del pie de página",
  },

  // ============================================================================
  // Actions & Buttons
  // ============================================================================
  action: {
    subscribe: "Suscribirse",
    subscribed: "¡Suscrito!",
    postComment: "Publicar comentario",
    posting: "Publicando...",
    reply: "Responder",
    share: "Compartir",
    save: "Guardar",
    saved: "Guardado",
    print: "Imprimir artículo",
    viewAll: "Ver todos los artículos",
    readMore: "Leer más",
    loadMore: "Cargar más",
    search: "Buscar",
    close: "Cerrar",
    open: "Abrir",
    cancel: "Cancelar",
    confirm: "Confirmar",
    delete: "Eliminar",
    edit: "Editar",
  },

  // ============================================================================
  // Time & Reading
  // ============================================================================
  time: {
    minRead: "{count} min de lectura",
    min: "{count} min",
    ago: "hace {time}",
    justNow: "Justo ahora",
    today: "Hoy",
    yesterday: "Ayer",
  },

  // ============================================================================
  // Comments Section
  // ============================================================================
  comments: {
    title: "Comentarios",
    count: "{count} comentario",
    countPlural: "{count} comentarios",
    placeholder: "Comparte tus pensamientos...",
    empty: "Aún no hay comentarios. ¡Sé el primero en compartir tus pensamientos!",
    loginRequired: "Por favor inicia sesión para comentar",
    success: "¡Comentario publicado con éxito!",
    error: "Error al publicar el comentario. Por favor, inténtalo de nuevo.",
  },

  // ============================================================================
  // Newsletter
  // ============================================================================
  newsletter: {
    title: "Mantente actualizado",
    description: "Recibe lo último de {siteName}",
    placeholder: "Ingresa tu correo electrónico",
    button: "Suscribirse",
    success: "¡Gracias por suscribirte!",
    error: "Algo salió mal. Por favor, inténtalo de nuevo.",
    alreadySubscribed: "¡Ya estás suscrito!",
  },

  // ============================================================================
  // Article Categories
  // ============================================================================
  category: {
    business: "Negocios",
    politics: "Política",
    technology: "Tecnología",
    science: "Ciencia",
    health: "Salud",
    sports: "Deportes",
    artsAndEntertainment: "Arte y entretenimiento",
    environment: "Medio ambiente",
    all: "Todas las categorías",
  },

  // ============================================================================
  // Article Components
  // ============================================================================
  article: {
    related: "Artículos relacionados",
    popular: "Artículos populares",
    latest: "Últimos artículos",
    latestStories: "Últimas historias",
    trendingNow: "Tendencias actuales",
    popularThisWeek: "Popular esta semana",
    readFullStory: "Leer historia completa",
    stayInTheLoop: "Mantente informado",
    joinThousands: "Únete a miles de lectores",
    getLatestStories:
      "Recibe las últimas historias de {siteName} directamente en tu bandeja de entrada. Sin spam, cancela en cualquier momento.",
    successfullySubscribed: "¡Suscripción exitosa!",
    checkInbox: "Revisa tu bandeja de entrada para confirmar.",
    contactAuthor: "Contactar al autor",
    trending: "Tendencia",
    featured: "Destacado",
    toc: "Tabla de contenidos",
    onThisPage: "En esta página",
    aboutAuthor: "Acerca del autor",
    about: "Acerca de {author}",
    byAuthor: "Por {author}",
    publishedOn: "Publicado el {date}",
    updatedOn: "Actualizado el {date}",
    readingTime: "{count} minuto de lectura",
    readingTimePlural: "{count} minutos de lectura",
    shareArticle: "Compartir este artículo",
    bookmarkArticle: "Guardar este artículo",
    printArticle: "Imprimir este artículo",
  },

  // ============================================================================
  // Category Page
  // ============================================================================
  categoryPage: {
    title: "Artículos de {category}",
    description: "Explora todos los artículos de {category} en {siteName}",
    articlesCount: "{count} artículo en esta categoría",
    articlesCountPlural: "{count} artículos en esta categoría",
    noArticles: "No se encontraron artículos en esta categoría",
    noArticlesDescription: "¡Vuelve pronto para nuevo contenido!",
  },

  // ============================================================================
  // Author Page
  // ============================================================================
  author: {
    articles: "Artículos",
    articleCount: "{count} artículo",
    articleCountPlural: "{count} artículos",
    followers: "Seguidores",
    following: "Siguiendo",
    memberSince: "Miembro desde",
    allArticles: "Todos los artículos",
    noArticles: "No se encontraron artículos",
    noArticlesDescription: "Este autor aún no ha publicado ningún artículo.",
    follow: "Seguir",
    unfollow: "Dejar de seguir",
    bio: "Biografía",
  },

  // ============================================================================
  // Search
  // ============================================================================
  search: {
    placeholder: "Buscar artículos...",
    noResults: "No se encontraron resultados",
    noResultsDescription: "Intenta ajustar tus términos de búsqueda",
    searching: "Buscando...",
    results: "{count} resultado",
    resultsPlural: "{count} resultados",
    recentSearches: "Búsquedas recientes",
    popularSearches: "Búsquedas populares",
  },

  // ============================================================================
  // Footer
  // ============================================================================
  footer: {
    quickLinks: "Enlaces rápidos",
    contact: "Contacto",
    followUs: "Síguenos",
    copyright: "© {year} {siteName}. Todos los derechos reservados.",
    poweredBy: "Desarrollado por Hannibal",
  },

  // ============================================================================
  // Error Messages
  // ============================================================================
  error: {
    notFound: "No encontrado",
    pageNotFound: "Página no encontrada",
    articleNotFound: "Artículo no encontrado",
    categoryNotFound: "Categoría no encontrada",
    authorNotFound: "Autor no encontrado",
    somethingWrong: "Algo salió mal",
    tryAgain: "Por favor, inténtalo de nuevo",
    goHome: "Ir al inicio",
    serverError: "Error del servidor",
    unauthorized: "No autorizado",
    forbidden: "Prohibido",
    noArticles: "No se encontraron artículos",
    noArticlesDescription: "Vuelva pronto para nuevo contenido",
  },

  // ============================================================================
  // Accessibility Labels (ARIA)
  // ============================================================================
  aria: {
    search: "Buscar (Ctrl+K)",
    openMenu: "Abrir menú",
    closeMenu: "Cerrar menú",
    toggleTheme: "Cambiar tema",
    followOnX: "Seguir a {siteName} en X",
    followOnFacebook: "Seguir a {siteName} en Facebook",
    followOnInstagram: "Seguir a {siteName} en Instagram",
    followOnLinkedIn: "Seguir a {siteName} en LinkedIn",
    mainNav: "Navegación principal",
    footerNav: "Navegación del pie de página",
    skipToContent: "Saltar al contenido",
    logo: "Logo de {siteName}",
    bookmarkArticle: "Guardar este artículo",
    removeBookmark: "Quitar marcador",
  },

  // ============================================================================
  // SEO & Metadata
  // ============================================================================
  seo: {
    defaultTitle: "{siteName} - Últimas noticias y artículos",
    defaultDescription: "Mantente informado con las últimas noticias, análisis y perspectivas de {siteName}",
    articleTitle: "{title} - {siteName}",
    categoryTitle: "Artículos de {category} - {siteName}",
    authorTitle: "{author} - {siteName}",
    searchTitle: "Resultados de búsqueda - {siteName}",
    aboutTitle: "Acerca de {siteName}",
    contactTitle: "Contactar a {siteName}",
    privacyTitle: "Política de privacidad - {siteName}",
    keywords: "noticias, artículos, {siteName}",
  },

  // ============================================================================
  // Social Sharing
  // ============================================================================
  social: {
    shareOn: "Compartir en {platform}",
    copyLink: "Copiar enlace",
    linkCopied: "¡Enlace copiado!",
    shareVia: "Compartir vía",
    twitter: "Twitter",
    facebook: "Facebook",
    linkedin: "LinkedIn",
    email: "Correo electrónico",
    whatsapp: "WhatsApp",
    reddit: "Reddit",
  },

  // ============================================================================
  // Forms & Validation
  // ============================================================================
  form: {
    required: "Este campo es obligatorio",
    invalidEmail: "Por favor ingresa un correo electrónico válido",
    tooShort: "Demasiado corto",
    tooLong: "Demasiado largo",
    invalidUrl: "Por favor ingresa una URL válida",
    submit: "Enviar",
    submitting: "Enviando...",
    success: "¡Éxito!",
    error: "Error",
  },

  // ============================================================================
  // Pagination
  // ============================================================================
  pagination: {
    previous: "Anterior",
    next: "Siguiente",
    page: "Página {page}",
    of: "de",
    showing: "Mostrando {start} a {end} de {total}",
  },

  // ============================================================================
  // Filters & Sorting
  // ============================================================================
  filter: {
    filterBy: "Filtrar por",
    sortBy: "Ordenar por",
    newest: "Más reciente",
    oldest: "Más antiguo",
    popular: "Más popular",
    trending: "Tendencia",
    relevance: "Relevancia",
    clear: "Limpiar filtros",
    apply: "Aplicar",
  },

  // ============================================================================
  // Loading States
  // ============================================================================
  loading: {
    loading: "Cargando...",
    loadingArticles: "Cargando artículos...",
    loadingComments: "Cargando comentarios...",
    pleaseWait: "Por favor espera",
  },

  // ============================================================================
  // Breaking News
  // ============================================================================
  breakingNews: {
    title: "Última hora",
    dismiss: "Cerrar noticias de última hora",
  },
} as const
