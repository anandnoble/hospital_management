import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://fqgpmcijsloyjgcoldhe.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZxZ3BtY2lqc2xveWpnY29sZGhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkwMjMzMTIsImV4cCI6MjEwNDU5OTMxMn0.NI9hdcbigyfRPjy5MslPw2eFmz36LAz0HVThPfkBsFk';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
