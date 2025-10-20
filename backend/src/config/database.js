import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

// Create Supabase client for admin operations (using service role key)
export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

export const config = {
  port: process.env.PORT || 5051,
  jwtSecret: process.env.JWT_SECRET || 'default-secret',
  nodeEnv: process.env.NODE_ENV || 'development'
};

// Database initialization function
export const initializeDatabase = async () => {
  try {
    console.log('🔄 Testing Supabase connection...');

    // Test connection
    const { data, error } = await supabase.from('departments').select('count');
    if (error) throw error;

    console.log('✅ Supabase connection successful');

    return true;
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    throw error;
  }
};