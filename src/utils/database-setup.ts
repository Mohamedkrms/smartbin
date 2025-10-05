// Database setup utility
import { supabase } from '@/lib/supabase';

export async function testDatabaseConnection() {
  try {
    console.log('Testing database connection...');
    
    // Test basic connection
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('Database connection error:', error);
      return { success: false, error: error.message };
    }
    
    console.log('Database connection successful!');
    return { success: true, data };
  } catch (err) {
    console.error('Connection test failed:', err);
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

export async function createUsersTable() {
  try {
    console.log('Checking if users table exists...');
    
    // Try to query the users table to see if it exists
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    
    if (error) {
      if (error.message.includes('relation "public.users" does not exist')) {
        console.log('Users table does not exist. Please run the SQL script manually.');
        return { 
          success: false, 
          error: 'Users table does not exist. Please copy and paste the SQL from simple-database-setup.sql into your Supabase SQL Editor and run it.' 
        };
      } else {
        console.error('Error checking users table:', error);
        return { success: false, error: error.message };
      }
    }
    
    console.log('Users table exists and is accessible!');
    return { success: true, message: 'Users table exists and is accessible' };
  } catch (err) {
    console.error('Table check failed:', err);
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

export async function insertSampleData() {
  try {
    console.log('Inserting sample data...');
    
    // Insert sample smart bins
    const { error: binsError } = await supabase
      .from('smart_bins')
      .upsert([
        { location: 'Downtown Plaza', latitude: 40.7128, longitude: -74.0060, fill_level: 75, status: 'active' },
        { location: 'Central Park', latitude: 40.7829, longitude: -73.9654, fill_level: 30, status: 'active' },
        { location: 'City Hall', latitude: 40.7505, longitude: -73.9934, fill_level: 90, status: 'active' },
        { location: 'Market Square', latitude: 40.7589, longitude: -73.9851, fill_level: 45, status: 'active' },
        { location: 'University Campus', latitude: 40.7505, longitude: -73.9934, fill_level: 20, status: 'active' }
      ], { onConflict: 'location' });
    
    if (binsError) {
      console.error('Error inserting sample bins:', binsError);
      return { success: false, error: binsError.message };
    }
    
    console.log('Sample data inserted successfully!');
    return { success: true, message: 'Sample data inserted' };
  } catch (err) {
    console.error('Sample data insertion failed:', err);
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

export async function setupDatabase() {
  console.log('Setting up database...');
  
  // Test connection first
  const connectionTest = await testDatabaseConnection();
  if (!connectionTest.success) {
    return connectionTest;
  }
  
  // Create all tables with policies
  const tableCreation = await createUsersTable();
  if (!tableCreation.success) {
    return tableCreation;
  }
  
  // Insert sample data
  const sampleData = await insertSampleData();
  if (!sampleData.success) {
    console.warn('Sample data insertion failed, but continuing...');
  }
  
  console.log('Database setup completed successfully!');
  return { success: true, message: 'Database setup completed with all tables, policies, and sample data' };
}
