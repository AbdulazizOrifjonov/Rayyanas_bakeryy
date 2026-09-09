import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function run() {
  const { data, error } = await supabase.from('cart_items').select('*').limit(1);
  console.log("cart_items:", error ? error.message : "exists");
  
  const { data: d2, error: e2 } = await supabase.from('favorites').select('*').limit(1);
  console.log("favorites:", e2 ? e2.message : "exists");
}
run();
