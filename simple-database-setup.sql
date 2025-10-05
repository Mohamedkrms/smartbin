-- Simple Database Setup for Smart Bin
-- Copy and paste this into your Supabase SQL Editor

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  clerk_id TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('member', 'agent_municipal', 'chef_municipal')),
  points INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create smart_bins table
CREATE TABLE IF NOT EXISTS smart_bins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  location TEXT NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  fill_level INTEGER DEFAULT 0 CHECK (fill_level >= 0 AND fill_level <= 100),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'maintenance', 'offline')),
  last_collection TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create collections table
CREATE TABLE IF NOT EXISTS collections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  bin_id UUID NOT NULL REFERENCES smart_bins(id) ON DELETE CASCADE,
  agent_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  collected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_users_clerk_id ON users(clerk_id);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Insert sample data
INSERT INTO smart_bins (location, latitude, longitude, fill_level, status) VALUES
('Downtown Plaza', 40.7128, -74.0060, 75, 'active'),
('Central Park', 40.7829, -73.9654, 30, 'active'),
('City Hall', 40.7505, -73.9934, 90, 'active'),
('Market Square', 40.7589, -73.9851, 45, 'active'),
('University Campus', 40.7505, -73.9934, 20, 'active')
ON CONFLICT DO NOTHING;

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE smart_bins ENABLE ROW LEVEL SECURITY;
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;

-- Create comprehensive RLS policies for users table
-- Allow all operations for now (Clerk handles authentication)
CREATE POLICY "Allow all users operations" ON users FOR ALL USING (true);
CREATE POLICY "Allow all users insert" ON users FOR INSERT WITH CHECK (true);

-- Create RLS policies for smart_bins table
-- Allow all operations for now (Clerk handles authentication)
CREATE POLICY "Allow all smart_bins operations" ON smart_bins FOR ALL USING (true);
CREATE POLICY "Allow all smart_bins insert" ON smart_bins FOR INSERT WITH CHECK (true);

-- Create RLS policies for collections table
-- Allow all operations for now (Clerk handles authentication)
CREATE POLICY "Allow all collections operations" ON collections FOR ALL USING (true);
CREATE POLICY "Allow all collections insert" ON collections FOR INSERT WITH CHECK (true);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_smart_bins_updated_at ON smart_bins;
CREATE TRIGGER update_smart_bins_updated_at BEFORE UPDATE ON smart_bins FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create a function to get user role
CREATE OR REPLACE FUNCTION get_user_role(user_clerk_id TEXT)
RETURNS TEXT AS $$
DECLARE
  user_role TEXT;
BEGIN
  SELECT role INTO user_role FROM users WHERE clerk_id = user_clerk_id;
  RETURN COALESCE(user_role, 'member');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Success message
SELECT 'Database setup completed successfully with all tables and policies!' as message;
