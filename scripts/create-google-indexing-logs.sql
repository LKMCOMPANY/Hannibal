-- ============================================================================
-- Google Indexing Logs Table
-- Tracks all indexing requests (API + Sitemap ping) for analytics and quota
-- ============================================================================

CREATE TABLE IF NOT EXISTS google_indexing_logs (
  id SERIAL PRIMARY KEY,
  article_id INTEGER NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  method TEXT NOT NULL CHECK (method IN ('api', 'ping')),
  success BOOLEAN NOT NULL DEFAULT false,
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_indexing_logs_article_id ON google_indexing_logs(article_id);
CREATE INDEX IF NOT EXISTS idx_indexing_logs_created_at ON google_indexing_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_indexing_logs_method_date ON google_indexing_logs(method, created_at);

-- Comment
COMMENT ON TABLE google_indexing_logs IS 'Tracks Google indexing requests for quota management and analytics';
COMMENT ON COLUMN google_indexing_logs.method IS 'Indexing method: api (fast, quota 200/day) or ping (slow, unlimited)';
COMMENT ON COLUMN google_indexing_logs.success IS 'Whether the indexing request succeeded';

