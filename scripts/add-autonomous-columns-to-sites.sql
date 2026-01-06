-- Add autonomous publication system columns to sites table
-- This migration adds timezone support and autonomous scheduling configuration

-- Add timezone column for local time scheduling
ALTER TABLE sites 
ADD COLUMN IF NOT EXISTS timezone VARCHAR(100) DEFAULT 'UTC';

-- Add autonomous publication columns
ALTER TABLE sites 
ADD COLUMN IF NOT EXISTS autonomous_hours INTEGER[] DEFAULT ARRAY[]::INTEGER[],
ADD COLUMN IF NOT EXISTS autonomous_active BOOLEAN DEFAULT false;

-- Add comments for documentation
COMMENT ON COLUMN sites.timezone IS 'IANA timezone identifier (e.g., America/New_York, Europe/Paris, Asia/Tokyo) for autonomous publication scheduling';
COMMENT ON COLUMN sites.autonomous_hours IS 'Array of hours (0-23) for autonomous publication scheduling in local timezone';
COMMENT ON COLUMN sites.autonomous_active IS 'Whether autonomous publication is enabled for this site';

-- Create indexes for efficient queries
CREATE INDEX IF NOT EXISTS idx_sites_timezone ON sites(timezone);
CREATE INDEX IF NOT EXISTS idx_sites_autonomous_active ON sites(autonomous_active) WHERE autonomous_active = true;

-- Add constraint to ensure hours are valid (0-23)
ALTER TABLE sites ADD CONSTRAINT IF NOT EXISTS check_autonomous_hours_valid 
CHECK (autonomous_hours <@ ARRAY[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23]);
</parameter>
