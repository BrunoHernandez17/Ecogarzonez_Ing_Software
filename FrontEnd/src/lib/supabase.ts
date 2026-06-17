import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://agystiwblxczuvuzofme.supabase.co';
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || '';

if (!supabaseAnonKey) {
  console.warn('Supabase VITE_SUPABASE_ANON_KEY is missing. Make sure to set it in Vercel or your local .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
