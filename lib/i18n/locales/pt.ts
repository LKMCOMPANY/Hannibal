/**
 * Portuguese Dictionary
 *
 * Dicionário de tradução completo para todo o conteúdo estático e padronizado
 * da plataforma de mídia Hannibal.
 */

import type { Dictionary } from "./en"

export const pt: Dictionary = {
  // ============================================================================
  // Navigation
  // ============================================================================
  nav: {
    home: "Início",
    about: "Sobre",
    contact: "Contato",
    privacy: "Política de Privacidade",
    mainNav: "Navegação principal",
    footerNav: "Navegação do rodapé",
  },

  // ============================================================================
  // Actions & Buttons
  // ============================================================================
  action: {
    subscribe: "Inscrever-se",
    subscribed: "Inscrito!",
    postComment: "Publicar comentário",
    posting: "Publicando...",
    reply: "Responder",
    share: "Compartilhar",
    save: "Salvar",
    saved: "Salvo",
    print: "Imprimir artigo",
    viewAll: "Ver todos os artigos",
    readMore: "Ler mais",
    loadMore: "Carregar mais",
    search: "Pesquisar",
    close: "Fechar",
    open: "Abrir",
    cancel: "Cancelar",
    confirm: "Confirmar",
    delete: "Excluir",
    edit: "Editar",
  },

  // ============================================================================
  // Time & Reading
  // ============================================================================
  time: {
    minRead: "{count} min de leitura",
    min: "{count} min",
    ago: "há {time}",
    justNow: "Agora mesmo",
    today: "Hoje",
    yesterday: "Ontem",
  },

  // ============================================================================
  // Comments Section
  // ============================================================================
  comments: {
    title: "Comentários",
    count: "{count} comentário",
    countPlural: "{count} comentários",
    placeholder: "Compartilhe seus pensamentos...",
    empty: "Ainda não há comentários. Seja o primeiro a compartilhar seus pensamentos!",
    loginRequired: "Por favor, faça login para comentar",
    success: "Comentário publicado com sucesso!",
    error: "Falha ao publicar comentário. Por favor, tente novamente.",
  },

  // ============================================================================
  // Newsletter
  // ============================================================================
  newsletter: {
    title: "Mantenha-se atualizado",
    description: "Receba as últimas notícias de {siteName}",
    placeholder: "Digite seu e-mail",
    button: "Inscrever-se",
    success: "Obrigado por se inscrever!",
    error: "Algo deu errado. Por favor, tente novamente.",
    alreadySubscribed: "Você já está inscrito!",
  },

  // ============================================================================
  // Article Categories
  // ============================================================================
  category: {
    business: "Negócios",
    politics: "Política",
    technology: "Tecnologia",
    science: "Ciência",
    health: "Saúde",
    sports: "Esportes",
    artsAndEntertainment: "Artes e entretenimento",
    environment: "Meio ambiente",
    all: "Todas as categorias",
  },

  // ============================================================================
  // Article Components
  // ============================================================================
  article: {
    related: "Artigos relacionados",
    popular: "Artigos populares",
    latest: "Últimos artigos",
    latestStories: "Últimas histórias",
    trendingNow: "Em alta agora",
    popularThisWeek: "Popular esta semana",
    readFullStory: "Ler história completa",
    stayInTheLoop: "Mantenha-se informado",
    joinThousands: "Junte-se a milhares de leitores",
    getLatestStories:
      "Receba as últimas histórias de {siteName} diretamente na sua caixa de entrada. Sem spam, cancele a qualquer momento.",
    successfullySubscribed: "Inscrito com sucesso!",
    checkInbox: "Verifique sua caixa de entrada para confirmação.",
    contactAuthor: "Contatar autor",
    trending: "Em alta",
    featured: "Destaque",
    toc: "Índice",
    onThisPage: "Nesta página",
    aboutAuthor: "Sobre o autor",
    about: "Sobre {author}",
    byAuthor: "Por {author}",
    publishedOn: "Publicado em {date}",
    updatedOn: "Atualizado em {date}",
    readingTime: "{count} minuto de leitura",
    readingTimePlural: "{count} minutos de leitura",
    shareArticle: "Compartilhar este artigo",
    bookmarkArticle: "Salvar este artigo",
    printArticle: "Imprimir este artigo",
  },

  // ============================================================================
  // Category Page
  // ============================================================================
  categoryPage: {
    title: "Artigos de {category}",
    description: "Navegue por todos os artigos de {category} em {siteName}",
    articlesCount: "{count} artigo nesta categoria",
    articlesCountPlural: "{count} artigos nesta categoria",
    noArticles: "Nenhum artigo encontrado nesta categoria",
    noArticlesDescription: "Volte em breve para novo conteúdo!",
  },

  // ============================================================================
  // Author Page
  // ============================================================================
  author: {
    articles: "Artigos",
    followers: "Seguidores",
    following: "Seguindo",
    memberSince: "Membro desde",
    allArticles: "Todos os artigos",
    noArticles: "Nenhum artigo encontrado",
    noArticlesDescription: "Este autor ainda não publicou nenhum artigo.",
    follow: "Seguir",
    unfollow: "Deixar de seguir",
    bio: "Biografia",
    articleCount: "{count} artigo",
    articleCountPlural: "{count} artigos",
  },

  // ============================================================================
  // Breaking News Section
  // ============================================================================
  breakingNews: {
    title: "Últimas Notícias",
    dismiss: "Dispensar últimas notícias",
  },

  // ============================================================================
  // Search
  // ============================================================================
  search: {
    placeholder: "Pesquisar artigos...",
    noResults: "Nenhum resultado encontrado",
    noResultsDescription: "Tente ajustar seus termos de pesquisa",
    searching: "Pesquisando...",
    results: "{count} resultado",
    resultsPlural: "{count} resultados",
    recentSearches: "Pesquisas recentes",
    popularSearches: "Pesquisas populares",
  },

  // ============================================================================
  // Footer
  // ============================================================================
  footer: {
    quickLinks: "Links rápidos",
    contact: "Contato",
    followUs: "Siga-nos",
    copyright: "© {year} {siteName}. Todos os direitos reservados.",
    poweredBy: "Desenvolvido por Hannibal",
  },

  // ============================================================================
  // Error Messages
  // ============================================================================
  error: {
    notFound: "Não encontrado",
    pageNotFound: "Página não encontrada",
    articleNotFound: "Artigo não encontrado",
    categoryNotFound: "Categoria não encontrada",
    authorNotFound: "Autor não encontrado",
    somethingWrong: "Algo deu errado",
    tryAgain: "Por favor, tente novamente",
    goHome: "Ir para a página inicial",
    serverError: "Erro do servidor",
    unauthorized: "Não autorizado",
    forbidden: "Proibido",
  },

  // ============================================================================
  // Accessibility Labels (ARIA)
  // ============================================================================
  aria: {
    search: "Pesquisar (Ctrl+K)",
    openMenu: "Abrir menu",
    closeMenu: "Fechar menu",
    toggleTheme: "Alternar tema",
    followOnX: "Seguir {siteName} no X",
    followOnFacebook: "Seguir {siteName} no Facebook",
    followOnInstagram: "Seguir {siteName} no Instagram",
    followOnLinkedIn: "Seguir {siteName} no LinkedIn",
    mainNav: "Navegação principal",
    footerNav: "Navegação do rodapé",
    skipToContent: "Pular para o conteúdo",
    logo: "Logo de {siteName}",
    bookmarkArticle: "Salvar este artigo",
    removeBookmark: "Remover marcador",
  },

  // ============================================================================
  // SEO & Metadata
  // ============================================================================
  seo: {
    defaultTitle: "{siteName} - Últimas notícias e artigos",
    defaultDescription: "Mantenha-se informado com as últimas notícias, análises e insights de {siteName}",
    articleTitle: "{title} - {siteName}",
    categoryTitle: "Artigos de {category} - {siteName}",
    authorTitle: "{author} - {siteName}",
    searchTitle: "Resultados da pesquisa - {siteName}",
    aboutTitle: "Sobre {siteName}",
    contactTitle: "Contatar {siteName}",
    privacyTitle: "Política de Privacidade - {siteName}",
    keywords: "notícias, artigos, {siteName}",
  },

  // ============================================================================
  // Social Sharing
  // ============================================================================
  social: {
    shareOn: "Compartilhar no {platform}",
    copyLink: "Copiar link",
    linkCopied: "Link copiado!",
    shareVia: "Compartilhar via",
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
    required: "Este campo é obrigatório",
    invalidEmail: "Por favor, insira um endereço de e-mail válido",
    tooShort: "Muito curto",
    tooLong: "Muito longo",
    invalidUrl: "Por favor, insira uma URL válida",
    submit: "Enviar",
    submitting: "Enviando...",
    success: "Sucesso!",
    error: "Erro",
  },

  // ============================================================================
  // Pagination
  // ============================================================================
  pagination: {
    previous: "Anterior",
    next: "Próximo",
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
    newest: "Mais recente",
    oldest: "Mais antigo",
    popular: "Mais popular",
    trending: "Em alta",
    relevance: "Relevância",
    clear: "Limpar filtros",
    apply: "Aplicar",
  },

  // ============================================================================
  // Loading States
  // ============================================================================
  loading: {
    loading: "Carregando...",
    loadingArticles: "Carregando artigos...",
    loadingComments: "Carregando comentários...",
    pleaseWait: "Por favor, aguarde",
  },
} as const
