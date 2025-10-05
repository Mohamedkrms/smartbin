-- Recreate bin_status_view to ensure it works with smart_bins table

-- Drop existing view if it exists
DROP VIEW IF EXISTS bin_status_view CASCADE;

-- Create the bin_status_view
CREATE VIEW bin_status_view AS
SELECT 
    sb.id,
    sb.bin_code,
    sb.location_name,
    sb.address,
    sb.latitude,
    sb.longitude,
    sb.bin_type,
    sb.capacity_percentage,
    sb.status,
    sb.last_collected,
    sb.created_at,
    sb.updated_at,
    -- Calculate capacity status
    CASE 
        WHEN sb.capacity_percentage >= 90 THEN 'surcharge'
        WHEN sb.capacity_percentage <= 10 THEN 'vide'
        ELSE 'normal'
    END as capacity_status,
    -- Calculate days since last collection
    CASE 
        WHEN sb.last_collected IS NULL THEN NULL
        ELSE EXTRACT(DAY FROM (NOW() - sb.last_collected))
    END as days_since_collection
FROM smart_bins sb
WHERE sb.status = 'active';

-- Grant permissions on the view
GRANT SELECT ON bin_status_view TO authenticated;
GRANT SELECT ON bin_status_view TO anon;

-- Test the view
SELECT * FROM bin_status_view LIMIT 5;
