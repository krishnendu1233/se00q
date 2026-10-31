import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

const supabaseBUCKETUrl = process.env.NEXT_PUBLIC_BROLL_BUCKET_URL!;
const supabaseBUCKETAnonKey = process.env.NEXT_PUBLIC_BROLL_BUCKET_ANON_KEY!;

export const supabaseBUCKET = createClient(supabaseBUCKETUrl, supabaseBUCKETAnonKey);




