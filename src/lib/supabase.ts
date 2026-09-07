import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://uwshugnbtmguxmwxtdhk.supabase.co';
const supabaseAnonKey = 'sb_publishable_0ogHMrJKkm4mHFJJntCbzg_sn4tzsGu';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

