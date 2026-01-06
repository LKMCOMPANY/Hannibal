-- Add campaign_images column to campaigns table
-- This column stores an array of image URLs that will be randomly used for published articles

ALTER TABLE campaigns 
ADD COLUMN IF NOT EXISTS campaign_images TEXT[];

-- Add index for campaigns with images
CREATE INDEX IF NOT EXISTS idx_campaigns_with_images ON campaigns(id) WHERE campaign_images IS NOT NULL AND array_length(campaign_images, 1) > 0;

-- Add comment for documentation
COMMENT ON COLUMN campaigns.campaign_images IS 'Array of image URLs to be randomly used for published articles in the campaign';
