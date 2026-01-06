-- Autonomous Publications Table
-- Tracks all autonomous publications with source data and results
-- Pattern similar to campaign_publications for consistency

-- ============================================================================
-- Autonomous Publications Table
-- ============================================================================
CREATE TABLE IF NOT EXISTS autonomous_publications (
  id SERIAL PRIMARY KEY,
  site_id INTEGER NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
  scheduled_for TIMESTAMP WITH TIME ZONE NOT NULL,
  executed_at TIMESTAMP WITH TIME ZONE,
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  generated_article_id INTEGER REFERENCES articles(id) ON DELETE SET NULL,
  source_query TEXT,
  source_article_data JSONB,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  
  CONSTRAINT autonomous_publications_status_check CHECK (status IN ('pending', 'processing', 'published', 'failed'))
);

-- ============================================================================
-- Indexes for Performance
-- ============================================================================

-- Index for site lookups
CREATE INDEX IF NOT EXISTS idx_autonomous_publications_site ON autonomous_publications(site_id);

-- Index for status queries
CREATE INDEX IF NOT EXISTS idx_autonomous_publications_status ON autonomous_publications(status);

-- Index for scheduled publications
CREATE INDEX IF NOT EXISTS idx_autonomous_publications_scheduled ON autonomous_publications(scheduled_for);

-- Index for date-based queries
CREATE INDEX IF NOT EXISTS idx_autonomous_publications_executed ON autonomous_publications(executed_at) WHERE executed_at IS NOT NULL;

-- Index for generated article lookups
CREATE INDEX IF NOT EXISTS idx_autonomous_publications_article ON autonomous_publications(generated_article_id) WHERE generated_article_id IS NOT NULL;

-- Index for NewsAPI article ID lookups (anti-duplicate)
-- This indexes the 'id' field inside the JSONB source_article_data
CREATE INDEX IF NOT EXISTS idx_autonomous_publications_source_id ON autonomous_publications((source_article_data->>'id'));

-- Composite index for recent publications per site (anti-duplicate within time window)
CREATE INDEX IF NOT EXISTS idx_autonomous_publications_site_scheduled ON autonomous_publications(site_id, scheduled_for DESC);

-- ============================================================================
-- Updated At Trigger
-- ============================================================================

-- Use existing update_updated_at_column function from campaigns migration
DROP TRIGGER IF EXISTS update_autonomous_publications_updated_at ON autonomous_publications;
CREATE TRIGGER update_autonomous_publications_updated_at
  BEFORE UPDATE ON autonomous_publications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- Comments for Documentation
-- ============================================================================

COMMENT ON TABLE autonomous_publications IS 'Tracks autonomous article publications from NewsAPI for each media site';
COMMENT ON COLUMN autonomous_publications.site_id IS 'Reference to the media site';
COMMENT ON COLUMN autonomous_publications.scheduled_for IS 'When this publication was scheduled (in UTC)';
COMMENT ON COLUMN autonomous_publications.executed_at IS 'When the publication was actually executed';
COMMENT ON COLUMN autonomous_publications.status IS 'Publication status: pending, processing, published, failed';
COMMENT ON COLUMN autonomous_publications.generated_article_id IS 'Reference to the created article';
COMMENT ON COLUMN autonomous_publications.source_query IS 'NewsAPI query parameters used';
COMMENT ON COLUMN autonomous_publications.source_article_data IS 'Full NewsAPI article data (JSONB) for reference and duplicate detection';
COMMENT ON COLUMN autonomous_publications.error_message IS 'Error message if publication failed';

