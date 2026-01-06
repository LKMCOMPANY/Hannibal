import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function incrementArticleViews(articleId: number, siteId: number) {
  try {
    await sql`SELECT increment_article_views(${articleId}, ${siteId})`
  } catch (error) {
    console.error("Error incrementing article views:", error)
  }
}

export async function getArticleViews(articleId: number) {
  try {
    const result = await sql`
      SELECT view_count 
      FROM article_views 
      WHERE article_id = ${articleId}
    `
    return result[0]?.view_count || 0
  } catch (error) {
    console.error("Error getting article views:", error)
    return 0
  }
}

export async function getTrendingArticles(siteId: number, limit = 5) {
  try {
    const result = await sql`
      SELECT * FROM get_trending_articles(${siteId}, ${limit})
    `
    return result
  } catch (error) {
    console.error("Error getting trending articles:", error)
    return []
  }
}

export async function toggleBookmark(articleId: number, userIdentifier: string, siteId: number) {
  try {
    const existing = await sql`
      SELECT id FROM article_bookmarks 
      WHERE article_id = ${articleId} AND user_identifier = ${userIdentifier}
    `

    if (existing.length > 0) {
      await sql`
        DELETE FROM article_bookmarks 
        WHERE article_id = ${articleId} AND user_identifier = ${userIdentifier}
      `
      return { bookmarked: false }
    } else {
      await sql`
        INSERT INTO article_bookmarks (article_id, user_identifier, site_id)
        VALUES (${articleId}, ${userIdentifier}, ${siteId})
      `
      return { bookmarked: true }
    }
  } catch (error) {
    console.error("Error toggling bookmark:", error)
    throw error
  }
}

export async function isArticleBookmarked(articleId: number, userIdentifier: string) {
  try {
    const result = await sql`
      SELECT id FROM article_bookmarks 
      WHERE article_id = ${articleId} AND user_identifier = ${userIdentifier}
    `
    return result.length > 0
  } catch (error) {
    console.error("Error checking bookmark:", error)
    return false
  }
}

export async function getArticleComments(articleId: number) {
  try {
    const result = await sql`
      SELECT 
        c.*,
        (SELECT COUNT(*) FROM comment_likes WHERE comment_id = c.id) as likes_count
      FROM comments c
      WHERE c.article_id = ${articleId} 
        AND c.status = 'approved'
        AND c.parent_id IS NULL
      ORDER BY c.created_at DESC
    `

    // Get replies for each comment
    for (const comment of result) {
      const replies = await sql`
        SELECT 
          c.*,
          (SELECT COUNT(*) FROM comment_likes WHERE comment_id = c.id) as likes_count
        FROM comments c
        WHERE c.parent_id = ${comment.id}
          AND c.status = 'approved'
        ORDER BY c.created_at ASC
      `
      comment.replies = replies
    }

    return result
  } catch (error) {
    console.error("Error getting comments:", error)
    return []
  }
}

export async function createComment(data: {
  articleId: number
  siteId: number
  authorName: string
  authorEmail?: string
  content: string
  parentId?: number
}) {
  try {
    const result = await sql`
      INSERT INTO comments (
        article_id, 
        site_id, 
        author_name, 
        author_email, 
        content, 
        parent_id,
        status
      )
      VALUES (
        ${data.articleId},
        ${data.siteId},
        ${data.authorName},
        ${data.authorEmail || null},
        ${data.content},
        ${data.parentId || null},
        'pending'
      )
      RETURNING *
    `
    return result[0]
  } catch (error) {
    console.error("Error creating comment:", error)
    throw error
  }
}

export async function subscribeToNewsletter(email: string, siteId: number) {
  try {
    const result = await sql`
      INSERT INTO newsletter_subscriptions (email, site_id, status)
      VALUES (${email}, ${siteId}, 'active')
      ON CONFLICT (site_id, email) 
      DO UPDATE SET 
        status = 'active',
        subscribed_at = NOW(),
        unsubscribed_at = NULL,
        updated_at = NOW()
      RETURNING *
    `
    return result[0]
  } catch (error) {
    console.error("Error subscribing to newsletter:", error)
    throw error
  }
}

export async function getAuthorStats(authorId: number) {
  try {
    const result = await sql`
      SELECT * FROM author_stats WHERE author_id = ${authorId}
    `
    return result[0]
  } catch (error) {
    console.error("Error getting author stats:", error)
    return null
  }
}
