// Quick Database Test Script
// Run this to quickly test your database setup

const { createClient } = require('@supabase/supabase-js');

// Test with sample credentials (you'll need to replace these)
const supabaseUrl = 'https://your-project-ref.supabase.co';
const supabaseKey = 'your-anon-key-here';

console.log('🧪 Quick Database Test');
console.log('=====================');

// Check if credentials are provided
if (supabaseUrl.includes('your-project-ref') || supabaseKey.includes('your-anon-key')) {
  console.log('❌ Please update the credentials in this script first!');
  console.log('📝 Edit quick-db-test.js and replace:');
  console.log('   - supabaseUrl with your actual Supabase URL');
  console.log('   - supabaseKey with your actual anon key');
  console.log('');
  console.log('🔗 Get these from: https://supabase.com/dashboard');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function quickTest() {
  try {
    console.log('🔗 Testing Supabase connection...');
    
    // Test basic connection
    const { data, error } = await supabase
      .from('municipalities')
      .select('count(*)')
      .limit(1);
    
    if (error) {
      console.log('❌ Connection failed:', error.message);
      console.log('');
      console.log('🔧 Possible solutions:');
      console.log('   1. Check your Supabase URL and API key');
      console.log('   2. Make sure the database tables exist');
      console.log('   3. Run the supabase-setup.sql script first');
      return;
    }
    
    console.log('✅ Connection successful!');
    
    // Test table access
    console.log('');
    console.log('📊 Testing table access...');
    
    const tables = ['municipalities', 'users', 'user_role_transfers'];
    
    for (const table of tables) {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);
      
      if (error) {
        console.log(`❌ Table '${table}': ${error.message}`);
      } else {
        console.log(`✅ Table '${table}': Accessible`);
      }
    }
    
    // Test sample data
    console.log('');
    console.log('🏛️ Testing municipalities data...');
    
    const { data: municipalities, error: municipalitiesError } = await supabase
      .from('municipalities')
      .select('*')
      .limit(3);
    
    if (municipalitiesError) {
      console.log('❌ Cannot fetch municipalities:', municipalitiesError.message);
    } else {
      console.log(`✅ Found ${municipalities.length} municipalities`);
      if (municipalities.length > 0) {
        console.log('   Sample municipalities:');
        municipalities.forEach(m => {
          console.log(`   - ${m.name} (${m.code})`);
        });
      }
    }
    
    console.log('');
    console.log('🎉 Database test completed!');
    console.log('');
    console.log('📝 Next steps:');
    console.log('   1. Create .env.local with your credentials');
    console.log('   2. Run: npm run dev');
    console.log('   3. Test user registration and login');
    
  } catch (error) {
    console.log('❌ Test failed:', error.message);
  }
}

quickTest();

