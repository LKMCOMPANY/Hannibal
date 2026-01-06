-- X Publications Table
-- Tracks all scheduled and posted tweets for articles
-- Status workflow: pending → posted/failed/paused/cancelled

-- ============================================================================
-- X Publications Table
-- ============================================================================
CREATE TABLE IF NOT EXISTS x_publications (
  id SERIAL PRIMARY KEY,
  article_id INTEGER NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  site_id INTEGER NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
  
  -- Tweet content
  x_post_text TEXT NOT NULL,
  article_url TEXT NOT NULL,
  
  -- Scheduling (10 minutes delay after article publication)
  scheduled_for TIMESTAMP WITH TIME ZONE NOT NULL,
  posted_at TIMESTAMP WITH TIME ZONE,
  
  -- Status workflow
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  
  -- Twitter API response
  twitter_post_id VARCHAR(255),           -- Tweet ID from Twitter API
  twitter_post_url TEXT,                  -- Full URL: https://x.com/handle/status/ID
  error_message TEXT,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT x_publications_status_check CHECK (
    status IN ('pending', 'posted', 'failed', 'paused', 'cancelled')
  ),
  CONSTRAINT x_publications_unique_article UNIQUE (article_id)
);

-- ============================================================================
-- Indexes for Performance
-- ============================================================================

-- Index for article lookups
CREATE INDEX IF NOT EXISTS idx_x_publications_article ON x_publications(article_id);

-- Index for site lookups
CREATE INDEX IF NOT EXISTS idx_x_publications_site ON x_publications(site_id);

-- Index for status queries
CREATE INDEX IF NOT EXISTS idx_x_publications_status ON x_publications(status);

-- Index for scheduled publications (pending only)
CREATE INDEX IF NOT EXISTS idx_x_publications_scheduled ON x_publications(scheduled_for) 
  WHERE status = 'pending';

-- Index for date-based queries
CREATE INDEX IF NOT EXISTS idx_x_publications_posted ON x_publications(posted_at) 
  WHERE posted_at IS NOT NULL;

-- Composite index for site+status queries
CREATE INDEX IF NOT EXISTS idx_x_publications_site_status ON x_publications(site_id, status);

-- ============================================================================
-- Updated At Trigger
-- ============================================================================

-- Use existing update_updated_at_column function
DROP TRIGGER IF EXISTS update_x_publications_updated_at ON x_publications;
CREATE TRIGGER update_x_publications_updated_at
  BEFORE UPDATE ON x_publications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- Comments for Documentation
-- ============================================================================

COMMENT ON TABLE x_publications IS 'Tracks scheduled and posted tweets for published articles';
COMMENT ON COLUMN x_publications.article_id IS 'Reference to the published article';
COMMENT ON COLUMN x_publications.site_id IS 'Reference to the media site (contains Twitter credentials)';
COMMENT ON COLUMN x_publications.x_post_text IS 'Tweet text (includes article URL)';
COMMENT ON COLUMN x_publications.scheduled_for IS 'When to post the tweet (article published_at + 10 minutes)';
COMMENT ON COLUMN x_publications.status IS 'Publication status: pending (waiting), posted (success), failed (error), paused (user paused), cancelled (user cancelled)';
COMMENT ON COLUMN x_publications.twitter_post_id IS 'Tweet ID returned by Twitter API';
COMMENT ON COLUMN x_publications.twitter_post_url IS 'Full URL to the posted tweet on X/Twitter';

