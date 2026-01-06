/**
 * English Dictionary
 *
 * Complete translation dictionary for all static and standardized content
 * across the Hannibal media platform.
 */

export const en = {
  // ============================================================================
  // Navigation
  // ============================================================================
  nav: {
    home: "Home",
    about: "About",
    contact: "Contact",
    privacy: "Privacy Policy",
    mainNav: "Main navigation",
    footerNav: "Footer navigation",
  },

  // ============================================================================
  // Actions & Buttons
  // ============================================================================
  action: {
    subscribe: "Subscribe",
    subscribed: "Subscribed!",
    postComment: "Post Comment",
    posting: "Posting...",
    reply: "Reply",
    share: "Share",
    save: "Save",
    saved: "Saved",
    print: "Print article",
    viewAll: "View all articles",
    readMore: "Read more",
    loadMore: "Load more",
    search: "Search",
    close: "Close",
    open: "Open",
    cancel: "Cancel",
    confirm: "Confirm",
    delete: "Delete",
    edit: "Edit",
  },

  // ============================================================================
  // Time & Reading
  // ============================================================================
  time: {
    minRead: "{count} min read",
    min: "{count} min",
    ago: "{time} ago",
    justNow: "Just now",
    today: "Today",
    yesterday: "Yesterday",
  },

  // ============================================================================
  // Comments Section
  // ============================================================================
  comments: {
    title: "Comments",
    count: "{count} comment",
    countPlural: "{count} comments",
    placeholder: "Share your thoughts...",
    empty: "No comments yet. Be the first to share your thoughts!",
    loginRequired: "Please log in to comment",
    success: "Comment posted successfully!",
    error: "Failed to post comment. Please try again.",
  },

  // ============================================================================
  // Newsletter
  // ============================================================================
  newsletter: {
    title: "Stay Updated",
    description: "Get the latest from {siteName}",
    placeholder: "Enter your email",
    button: "Subscribe",
    success: "Thanks for subscribing!",
    error: "Something went wrong. Please try again.",
    alreadySubscribed: "You're already subscribed!",
  },

  // ============================================================================
  // Article Categories
  // ============================================================================
  category: {
    business: "Business",
    politics: "Politics",
    technology: "Technology",
    science: "Science",
    health: "Health",
    sports: "Sports",
    artsAndEntertainment: "Arts and Entertainment",
    environment: "Environment",
    all: "All Categories",
  },

  // ============================================================================
  // Article Components
  // ============================================================================
  article: {
    related: "Related Articles",
    popular: "Popular Articles",
    latest: "Latest Articles",
    latestStories: "Latest Stories",
    trendingNow: "Trending Now",
    popularThisWeek: "Popular This Week",
    readFullStory: "Read Full Story",
    stayInTheLoop: "Stay in the Loop",
    joinThousands: "Join thousands of readers",
    getLatestStories:
      "Get the latest stories from {siteName} delivered straight to your inbox. No spam, unsubscribe anytime.",
    successfullySubscribed: "Successfully subscribed!",
    checkInbox: "Check your inbox for confirmation.",
    contactAuthor: "Contact author",
    trending: "Trending",
    featured: "Featured",
    toc: "Table of Contents",
    onThisPage: "On this page",
    aboutAuthor: "About the Author",
    about: "About {author}",
    byAuthor: "By {author}",
    publishedOn: "Published on {date}",
    updatedOn: "Updated on {date}",
    readingTime: "{count} minute read",
    readingTimePlural: "{count} minutes read",
    shareArticle: "Share this article",
    bookmarkArticle: "Bookmark this article",
    printArticle: "Print this article",
  },

  // ============================================================================
  // Category Page
  // ============================================================================
  categoryPage: {
    title: "{category} Articles",
    description: "Browse all {category} articles on {siteName}",
    articlesCount: "{count} article in this category",
    articlesCountPlural: "{count} articles in this category",
    noArticles: "No articles found in this category",
    noArticlesDescription: "Check back soon for new content!",
  },

  // ============================================================================
  // Author Page
  // ============================================================================
  author: {
    articles: "Articles",
    articleCount: "{count} article",
    articleCountPlural: "{count} articles",
    followers: "Followers",
    following: "Following",
    memberSince: "Member since",
    allArticles: "All Articles",
    noArticles: "No articles found",
    noArticlesDescription: "This author hasn't published any articles yet.",
    follow: "Follow",
    unfollow: "Unfollow",
    bio: "Biography",
  },

  // ============================================================================
  // Search
  // ============================================================================
  search: {
    placeholder: "Search articles...",
    noResults: "No results found",
    noResultsDescription: "Try adjusting your search terms",
    searching: "Searching...",
    results: "{count} result",
    resultsPlural: "{count} results",
    recentSearches: "Recent Searches",
    popularSearches: "Popular Searches",
  },

  // ============================================================================
  // Footer
  // ============================================================================
  footer: {
    quickLinks: "Quick Links",
    contact: "Contact",
    followUs: "Follow Us",
    copyright: "© {year} {siteName}. All rights reserved.",
    poweredBy: "Powered by Hannibal",
  },

  // ============================================================================
  // Error Messages
  // ============================================================================
  error: {
    notFound: "Not Found",
    pageNotFound: "Page Not Found",
    articleNotFound: "Article Not Found",
    categoryNotFound: "Category Not Found",
    authorNotFound: "Author Not Found",
    somethingWrong: "Something went wrong",
    tryAgain: "Please try again",
    goHome: "Go to Homepage",
    serverError: "Server Error",
    unauthorized: "Unauthorized",
    forbidden: "Forbidden",
    noArticles: "No articles found",
    noArticlesDescription: "Check back soon for new content",
  },

  // ============================================================================
  // Accessibility Labels (ARIA)
  // ============================================================================
  aria: {
    search: "Search (Ctrl+K)",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    toggleTheme: "Toggle theme",
    followOnX: "Follow {siteName} on X",
    followOnFacebook: "Follow {siteName} on Facebook",
    followOnInstagram: "Follow {siteName} on Instagram",
    followOnLinkedIn: "Follow {siteName} on LinkedIn",
    mainNav: "Main navigation",
    footerNav: "Footer navigation",
    skipToContent: "Skip to content",
    logo: "{siteName} logo",
    bookmarkArticle: "Bookmark this article",
    removeBookmark: "Remove bookmark",
  },

  // ============================================================================
  // SEO & Metadata
  // ============================================================================
  seo: {
    defaultTitle: "{siteName} - Latest News and Articles",
    defaultDescription: "Stay informed with the latest news, analysis, and insights from {siteName}",
    articleTitle: "{title} - {siteName}",
    categoryTitle: "{category} Articles - {siteName}",
    authorTitle: "{author} - {siteName}",
    searchTitle: "Search Results - {siteName}",
    aboutTitle: "About {siteName}",
    contactTitle: "Contact {siteName}",
    privacyTitle: "Privacy Policy - {siteName}",
    keywords: "news, articles, {siteName}",
  },

  // ============================================================================
  // Social Sharing
  // ============================================================================
  social: {
    shareOn: "Share on {platform}",
    copyLink: "Copy link",
    linkCopied: "Link copied!",
    shareVia: "Share via",
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
    required: "This field is required",
    invalidEmail: "Please enter a valid email address",
    tooShort: "Too short",
    tooLong: "Too long",
    invalidUrl: "Please enter a valid URL",
    submit: "Submit",
    submitting: "Submitting...",
    success: "Success!",
    error: "Error",
  },

  // ============================================================================
  // Pagination
  // ============================================================================
  pagination: {
    previous: "Previous",
    next: "Next",
    page: "Page {page}",
    of: "of",
    showing: "Showing {start} to {end} of {total}",
  },

  // ============================================================================
  // Filters & Sorting
  // ============================================================================
  filter: {
    filterBy: "Filter by",
    sortBy: "Sort by",
    newest: "Newest",
    oldest: "Oldest",
    popular: "Most Popular",
    trending: "Trending",
    relevance: "Relevance",
    clear: "Clear filters",
    apply: "Apply",
  },

  // ============================================================================
  // Loading States
  // ============================================================================
  loading: {
    loading: "Loading...",
    loadingArticles: "Loading articles...",
    loadingComments: "Loading comments...",
    pleaseWait: "Please wait",
  },

  // ============================================================================
  // Breaking News
  // ============================================================================
  breakingNews: {
    title: "Breaking News",
    dismiss: "Dismiss breaking news",
  },
} as const

export type Dictionary = typeof en
