import { supabase } from './src/config/database.js';
import bcrypt from 'bcrypt';

console.log('\n🔍 Verifying Database Schema After Update...\n');

async function verifySchema() {
  try {
    // Test 1: Check if new column names exist
    console.log('Test 1: Checking new column structure...');
    const { data: faculty, error: facultyError } = await supabase
      .from('faculty')
      .select('id, email, name, department_id, password, role')
      .limit(1);
    
    if (facultyError) {
      console.log('❌ FAILED: New columns not found');
      console.log('Error:', facultyError.message);
      console.log('\n🚨 YOU NEED TO RUN THE SQL SCRIPT IN SUPABASE DASHBOARD! 🚨\n');
      return false;
    }
    
    console.log('✅ PASSED: New columns exist (id, email, name, department_id)\n');
    
    // Test 2: Check if admin user exists
    console.log('Test 2: Checking for admin user...');
    const { data: admin, error: adminError } = await supabase
      .from('faculty')
      .select('*')
      .eq('email', 'admin')
      .maybeSingle();
    
    if (adminError) {
      console.log('❌ FAILED:', adminError.message);
      return false;
    }
    
    if (!admin) {
      console.log('❌ FAILED: Admin user not found');
      console.log('Expected username: admin');
      return false;
    }
    
    console.log('✅ PASSED: Admin user exists');
    console.log('   Username:', admin.email);
    console.log('   Name:', admin.name);
    console.log('   Role:', admin.role);
    console.log('   Department ID:', admin.department_id);
    
    // Test 3: Check if password is bcrypt hashed
    console.log('\nTest 3: Checking password format...');
    if (admin.password.startsWith('$2b$') || admin.password.startsWith('$2a$')) {
      console.log('✅ PASSED: Password is bcrypt hashed');
      console.log('   Hash prefix:', admin.password.substring(0, 10) + '...');
      
      // Test 4: Try password verification
      console.log('\nTest 4: Testing password verification...');
      const match = await bcrypt.compare('admin123', admin.password);
      if (match) {
        console.log('✅ PASSED: Password "admin123" matches hash');
      } else {
        console.log('❌ FAILED: Password does not match');
        console.log('   Try password: admin123');
      }
    } else {
      console.log('❌ FAILED: Password is NOT hashed (plain text)');
      console.log('   Current password:', admin.password);
      console.log('   Expected format: $2b$10$...');
      return false;
    }
    
    // Test 5: Check all tables
    console.log('\nTest 5: Checking all tables...');
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
    
    // Test 6: List all faculty users
    console.log('\nTest 6: All available users...');
    const { data: allFaculty, error: listError } = await supabase
      .from('faculty')
      .select('id, email, name, role, department_id');
    
    if (!listError && allFaculty) {
      console.log('Available login credentials:');
      allFaculty.forEach(f => {
        console.log(`  - Username: ${f.email}`);
        console.log(`    Name: ${f.name}`);
        console.log(`    Role: ${f.role}`);
        console.log(`    Password: admin123 (for test accounts)`);
        console.log('');
      });
    }
    
    console.log('\n✅ ✅ ✅ DATABASE SCHEMA IS CORRECT! ✅ ✅ ✅');
    console.log('\n🎉 You can now test login at: http://localhost:3000');
    console.log('   Username: admin');
    console.log('   Password: admin123\n');
    
    return true;
    
  } catch (err) {
    console.log('\n❌ Unexpected error:', err.message);
    return false;
  }
}

verifySchema().then(success => {
  if (!success) {
    console.log('\n📋 MANUAL STEPS REQUIRED:');
    console.log('1. Go to https://app.supabase.com');
    console.log('2. Login and select your project');
    console.log('3. Click "SQL Editor" in the left sidebar');
    console.log('4. Click "New Query"');
    console.log('5. Open: C:\\Users\\HP\\Desktop\\dbms project\\falo-faculty-allocation\\supabase_setup_fixed.sql');
    console.log('6. Copy ALL contents and paste into SQL Editor');
    console.log('7. Click "Run" button');
    console.log('8. Run this script again: node verify-schema.js\n');
  }
  process.exit(success ? 0 : 1);
});
