import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

// Check for required environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('your-project') || supabaseKey.includes('your-')) {
  console.warn('⚠️  WARNING: Supabase credentials not configured properly!');
  console.warn('⚠️  Please update backend/.env with your actual Supabase credentials.');
  console.warn('⚠️  The server will start but database operations will fail.');
}

// Create Supabase client for admin operations (using service role key)
export const supabase = supabaseUrl && supabaseKey 
  ? createClient(
      supabaseUrl,
      supabaseKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )
  : null;

export const config = {
  port: process.env.PORT || 5051,
  jwtSecret: process.env.JWT_SECRET || 'default-secret',
  nodeEnv: process.env.NODE_ENV || 'development'
};

// Database initialization function
export const initializeDatabase = async () => {
  try {
    if (!supabase) {
      console.log('⚠️  Skipping database initialization - Supabase not configured');
      console.log('⚠️  Please configure your Supabase credentials in backend/.env');
      return false;
    }

    console.log('🔄 Testing Supabase connection...');

    // Test connection
    const { data, error } = await supabase.from('departments').select('count');
    if (error) throw error;

    console.log('✅ Supabase connection successful');

    return true;
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    console.error('⚠️  Server will start but database operations will not work');
    console.error('⚠️  Please check your Supabase credentials in backend/.env');
    return false;
  }
};