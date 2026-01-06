/**
 * Japanese Dictionary
 *
 * Hannibalメディアプラットフォームの
 * すべての静的および標準化されたコンテンツの完全な翻訳辞書。
 */

import type { Dictionary } from "./en"

export const ja: Dictionary = {
  // ============================================================================
  // Navigation
  // ============================================================================
  nav: {
    home: "ホーム",
    about: "概要",
    contact: "お問い合わせ",
    privacy: "プライバシーポリシー",
    mainNav: "メインナビゲーション",
    footerNav: "フッターナビゲーション",
  },

  // ============================================================================
  // Actions & Buttons
  // ============================================================================
  action: {
    subscribe: "購読する",
    subscribed: "購読済み！",
    postComment: "コメントを投稿",
    posting: "投稿中...",
    reply: "返信",
    share: "共有",
    save: "保存",
    saved: "保存済み",
    print: "記事を印刷",
    viewAll: "すべての記事を表示",
    readMore: "続きを読む",
    loadMore: "さらに読み込む",
    search: "検索",
    close: "閉じる",
    open: "開く",
    cancel: "キャンセル",
    confirm: "確認",
    delete: "削除",
    edit: "編集",
  },

  // ============================================================================
  // Time & Reading
  // ============================================================================
  time: {
    minRead: "{count}分で読めます",
    min: "{count}分",
    ago: "{time}前",
    justNow: "たった今",
    today: "今日",
    yesterday: "昨日",
  },

  // ============================================================================
  // Comments Section
  // ============================================================================
  comments: {
    title: "コメント",
    count: "{count}件のコメント",
    countPlural: "{count}件のコメント",
    placeholder: "あなたの考えを共有してください...",
    empty: "まだコメントがありません。最初にコメントを投稿しましょう！",
    loginRequired: "コメントするにはログインしてください",
    success: "コメントが正常に投稿されました！",
    error: "コメントの投稿に失敗しました。もう一度お試しください。",
  },

  // ============================================================================
  // Newsletter
  // ============================================================================
  newsletter: {
    title: "最新情報を受け取る",
    description: "{siteName}の最新情報を入手",
    placeholder: "メールアドレスを入力",
    button: "購読する",
    success: "ご購読ありがとうございます！",
    error: "エラーが発生しました。もう一度お試しください。",
    alreadySubscribed: "すでに購読済みです！",
  },

  // ============================================================================
  // Article Categories
  // ============================================================================
  category: {
    business: "ビジネス",
    politics: "政治",
    technology: "テクノロジー",
    science: "科学",
    health: "健康",
    sports: "スポーツ",
    artsAndEntertainment: "芸術とエンターテイメント",
    environment: "環境",
    all: "すべてのカテゴリー",
  },

  // ============================================================================
  // Article Components
  // ============================================================================
  article: {
    related: "関連記事",
    popular: "人気記事",
    latest: "最新記事",
    latestStories: "最新ニュース",
    trendingNow: "今トレンド",
    popularThisWeek: "今週の人気",
    readFullStory: "全文を読む",
    stayInTheLoop: "最新情報を入手",
    joinThousands: "何千人もの読者に参加",
    getLatestStories: "{siteName}の最新ニュースを受信トレイに直接お届けします。スパムなし、いつでも購読解除できます。",
    successfullySubscribed: "購読が完了しました！",
    checkInbox: "確認のため受信トレイをご確認ください。",
    contactAuthor: "著者に連絡",
    trending: "トレンド",
    featured: "注目",
    toc: "目次",
    onThisPage: "このページ",
    aboutAuthor: "著者について",
    about: "{author}について",
    byAuthor: "{author}著",
    publishedOn: "{date}に公開",
    updatedOn: "{date}に更新",
    readingTime: "{count}分で読めます",
    readingTimePlural: "{count}分で読めます",
    shareArticle: "この記事を共有",
    bookmarkArticle: "この記事を保存",
    printArticle: "この記事を印刷",
  },

  // ============================================================================
  // Category Page
  // ============================================================================
  categoryPage: {
    title: "{category}の記事",
    description: "{siteName}の{category}記事をすべて閲覧",
    articlesCount: "このカテゴリーに{count}件の記事",
    articlesCountPlural: "このカテゴリーに{count}件の記事",
    noArticles: "このカテゴリーに記事が見つかりません",
    noArticlesDescription: "新しいコンテンツをお楽しみに！",
  },

  // ============================================================================
  // Author Page
  // ============================================================================
  author: {
    articles: "記事",
    articleCount: "{count}件の記事",
    articleCountPlural: "{count}件の記事",
    followers: "フォロワー",
    following: "フォロー中",
    memberSince: "登録日",
    allArticles: "すべての記事",
    noArticles: "記事が見つかりません",
    noArticlesDescription: "この著者はまだ記事を公開していません。",
    follow: "フォロー",
    unfollow: "フォロー解除",
    bio: "プロフィール",
  },

  // ============================================================================
  // Search
  // ============================================================================
  search: {
    placeholder: "記事を検索...",
    noResults: "結果が見つかりません",
    noResultsDescription: "検索キーワードを調整してみてください",
    searching: "検索中...",
    results: "{count}件の結果",
    resultsPlural: "{count}件の結果",
    recentSearches: "最近の検索",
    popularSearches: "人気の検索",
  },

  // ============================================================================
  // Footer
  // ============================================================================
  footer: {
    quickLinks: "クイックリンク",
    contact: "お問い合わせ",
    followUs: "フォローする",
    copyright: "© {year} {siteName}. All rights reserved.",
    poweredBy: "Powered by Hannibal",
  },

  // ============================================================================
  // Error Messages
  // ============================================================================
  error: {
    notFound: "見つかりません",
    pageNotFound: "ページが見つかりません",
    articleNotFound: "記事が見つかりません",
    categoryNotFound: "カテゴリーが見つかりません",
    authorNotFound: "著者が見つかりません",
    somethingWrong: "エラーが発生しました",
    tryAgain: "もう一度お試しください",
    goHome: "ホームに戻る",
    serverError: "サーバーエラー",
    unauthorized: "未認証",
    forbidden: "禁止",
  },

  // ============================================================================
  // Accessibility Labels (ARIA)
  // ============================================================================
  aria: {
    search: "検索 (Ctrl+K)",
    openMenu: "メニューを開く",
    closeMenu: "メニューを閉じる",
    toggleTheme: "テーマを切り替え",
    followOnX: "Xで{siteName}をフォロー",
    followOnFacebook: "Facebookで{siteName}をフォロー",
    followOnInstagram: "Instagramで{siteName}をフォロー",
    followOnLinkedIn: "LinkedInで{siteName}をフォロー",
    mainNav: "メインナビゲーション",
    footerNav: "フッターナビゲーション",
    skipToContent: "コンテンツにスキップ",
    logo: "{siteName}ロゴ",
    bookmarkArticle: "この記事をブックマーク",
    removeBookmark: "ブックマークを削除",
  },

  // ============================================================================
  // SEO & Metadata
  // ============================================================================
  seo: {
    defaultTitle: "{siteName} - 最新ニュースと記事",
    defaultDescription: "{siteName}の最新ニュース、分析、洞察で情報を入手",
    articleTitle: "{title} - {siteName}",
    categoryTitle: "{category}記事 - {siteName}",
    authorTitle: "{author} - {siteName}",
    searchTitle: "検索結果 - {siteName}",
    aboutTitle: "{siteName}について",
    contactTitle: "{siteName}へのお問い合わせ",
    privacyTitle: "プライバシーポリシー - {siteName}",
    keywords: "ニュース、記事、{siteName}",
  },

  // ============================================================================
  // Social Sharing
  // ============================================================================
  social: {
    shareOn: "{platform}で共有",
    copyLink: "リンクをコピー",
    linkCopied: "リンクをコピーしました！",
    shareVia: "共有方法",
    twitter: "Twitter",
    facebook: "Facebook",
    linkedin: "LinkedIn",
    email: "メール",
    whatsapp: "WhatsApp",
    reddit: "Reddit",
  },

  // ============================================================================
  // Forms & Validation
  // ============================================================================
  form: {
    required: "この項目は必須です",
    invalidEmail: "有効なメールアドレスを入力してください",
    tooShort: "短すぎます",
    tooLong: "長すぎます",
    invalidUrl: "有効なURLを入力してください",
    submit: "送信",
    submitting: "送信中...",
    success: "成功！",
    error: "エラー",
  },

  // ============================================================================
  // Pagination
  // ============================================================================
  pagination: {
    previous: "前へ",
    next: "次へ",
    page: "ページ{page}",
    of: "/",
    showing: "{total}件中{start}〜{end}件を表示",
  },

  // ============================================================================
  // Filters & Sorting
  // ============================================================================
  filter: {
    filterBy: "フィルター",
    sortBy: "並び替え",
    newest: "新しい順",
    oldest: "古い順",
    popular: "人気順",
    trending: "トレンド",
    relevance: "関連性",
    clear: "フィルターをクリア",
    apply: "適用",
  },

  // ============================================================================
  // Loading States
  // ============================================================================
  loading: {
    loading: "読み込み中...",
    loadingArticles: "記事を読み込み中...",
    loadingComments: "コメントを読み込み中...",
    pleaseWait: "お待ちください",
  },

  // ============================================================================
  // Breaking News
  // ============================================================================
  breakingNews: {
    title: "速報",
    dismiss: "速報を閉じる",
  },
} as const
