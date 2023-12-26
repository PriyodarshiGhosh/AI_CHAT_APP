import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL; // Replace with your Supabase URL
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_KEY; // Replace with your Supabase public key

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
