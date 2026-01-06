-- Campaign System Database Schema
-- Creates tables for managing content distribution campaigns

-- ============================================================================
-- Campaigns Table
-- ============================================================================
CREATE TABLE IF NOT EXISTS campaigns (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  source_article_id INTEGER NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  custom_instructions TEXT,
  deployment_speed_minutes INTEGER NOT NULL DEFAULT 60,
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  
  CONSTRAINT campaigns_status_check CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled')),
  CONSTRAINT campaigns_deployment_speed_check CHECK (deployment_speed_minutes >= 1 AND deployment_speed_minutes <= 1440)
);

-- Index for status queries
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON campaigns(status);

-- Index for source article lookups
CREATE INDEX IF NOT EXISTS idx_campaigns_source_article ON campaigns(source_article_id);

-- Index for date-based queries
CREATE INDEX IF NOT EXISTS idx_campaigns_created_at ON campaigns(created_at DESC);

-- ============================================================================
-- Campaign Publications Table
-- ============================================================================
CREATE TABLE IF NOT EXISTS campaign_publications (
  id SERIAL PRIMARY KEY,
  campaign_id INTEGER NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  target_site_id INTEGER NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
  generated_article_id INTEGER REFERENCES articles(id) ON DELETE SET NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  error_message TEXT,
  scheduled_for TIMESTAMP WITH TIME ZONE,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  
  CONSTRAINT campaign_publications_status_check CHECK (status IN ('pending', 'processing', 'published', 'failed', 'cancelled')),
  CONSTRAINT campaign_publications_unique_campaign_site UNIQUE (campaign_id, target_site_id)
);

-- Index for campaign lookups
CREATE INDEX IF NOT EXISTS idx_campaign_publications_campaign ON campaign_publications(campaign_id);

-- Index for site lookups
CREATE INDEX IF NOT EXISTS idx_campaign_publications_site ON campaign_publications(target_site_id);

-- Index for status queries
CREATE INDEX IF NOT EXISTS idx_campaign_publications_status ON campaign_publications(status);

-- Index for scheduled publications
CREATE INDEX IF NOT EXISTS idx_campaign_publications_scheduled ON campaign_publications(scheduled_for) WHERE status = 'pending';

-- Index for generated article lookups
CREATE INDEX IF NOT EXISTS idx_campaign_publications_article ON campaign_publications(generated_article_id) WHERE generated_article_id IS NOT NULL;

-- ============================================================================
-- Updated At Triggers
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for campaigns table
DROP TRIGGER IF EXISTS update_campaigns_updated_at ON campaigns;
CREATE TRIGGER update_campaigns_updated_at
  BEFORE UPDATE ON campaigns
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for campaign_publications table
DROP TRIGGER IF EXISTS update_campaign_publications_updated_at ON campaign_publications;
CREATE TRIGGER update_campaign_publications_updated_at
  BEFORE UPDATE ON campaign_publications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- Comments for Documentation
-- ============================================================================

COMMENT ON TABLE campaigns IS 'Content distribution campaigns for multi-site publishing';
COMMENT ON COLUMN campaigns.deployment_speed_minutes IS 'Minutes between each publication (1-1440)';
COMMENT ON COLUMN campaigns.status IS 'Campaign status: pending, processing, completed, failed, cancelled';

COMMENT ON TABLE campaign_publications IS 'Individual publication records for each target site in a campaign';
COMMENT ON COLUMN campaign_publications.scheduled_for IS 'When this publication should be processed';
COMMENT ON COLUMN campaign_publications.status IS 'Publication status: pending, processing, published, failed, cancelled';
