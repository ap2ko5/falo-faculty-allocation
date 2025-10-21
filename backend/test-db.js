import { supabase } from './src/config/database.js';

async function testConnection() {
  console.log('\n🔍 Testing Supabase Connection...\n');

  // Test 1: Check departments
  console.log('Test 1: Fetching departments...');
  const { data: depts, error: deptError } = await supabase
    .from('departments')
    .select('*');
  
  if (deptError) {
    console.error('❌ Error fetching departments:', deptError.message);
    console.error('Details:', deptError);
  } else {
    console.log('✅ Departments found:', depts?.length || 0);
    console.log('Data:', depts);
  }

  // Test 2: Check faculty
  console.log('\nTest 2: Fetching faculty...');
  const { data: faculty, error: facError } = await supabase
    .from('faculty')
    .select('*');
  
  if (facError) {
    console.error('❌ Error fetching faculty:', facError.message);
    console.error('Details:', facError);
  } else {
    console.log('✅ Faculty found:', faculty?.length || 0);
    console.log('Data:', faculty);
  }

  // Test 3: Check if admin user exists
  console.log('\nTest 3: Checking for admin user...');
  const { data: admin, error: adminError } = await supabase
    .from('faculty')
    .select('*')
    .eq('email', 'admin')
    .maybeSingle();
  
  if (adminError) {
    console.error('❌ Error checking admin:', adminError.message);
    console.error('Details:', adminError);
  } else if (!admin) {
    console.log('⚠️  No admin user found with email "admin"');
  } else {
    console.log('✅ Admin user found:');
    console.log('  Name:', admin.name);
    console.log('  Email:', admin.email);
    console.log('  Role:', admin.role);
    console.log('  Password hash:', admin.password.substring(0, 20) + '...');
  }

  // Test 4: List all tables
  console.log('\nTest 4: Checking table structure...');
  const tables = ['departments', 'faculty', 'courses', 'classes', 'allocations'];
  for (const table of tables) {
    const { count, error } = await supabase
      .from(table)
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      console.log(`  ❌ ${table}: Error - ${error.message}`);
    } else {
      console.log(`  ✅ ${table}: ${count} rows`);
    }
  }

  console.log('\n✅ Connection test complete!\n');
}

testConnection().catch(console.error);
