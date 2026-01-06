-- Add selected_image_url column to campaign_publications table if it doesn't exist
-- This column stores the image URL that was randomly selected for each publication

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'campaign_publications' 
    AND column_name = 'selected_image_url'
  ) THEN
    ALTER TABLE campaign_publications 
    ADD COLUMN selected_image_url TEXT;
    
    COMMENT ON COLUMN campaign_publications.selected_image_url IS 'The image URL randomly selected from campaign_images for this publication';
  END IF;
END $$;
