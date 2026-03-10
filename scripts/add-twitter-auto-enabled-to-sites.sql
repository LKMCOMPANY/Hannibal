-- Add per-media toggle for automatic X (Twitter) post scheduling
-- When false, articles published with x_post will not create scheduled tweets for this site.

ALTER TABLE sites
ADD COLUMN IF NOT EXISTS twitter_auto_enabled BOOLEAN NOT NULL DEFAULT false;

COMMENT ON COLUMN sites.twitter_auto_enabled IS 'When true, publishing an article with x_post will schedule a tweet for this site. When false, X auto-post is paused for this media.';

-- All medias start paused; enable per media in settings if desired
UPDATE sites SET twitter_auto_enabled = false WHERE twitter_auto_enabled = true;
