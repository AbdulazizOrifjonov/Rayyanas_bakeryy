import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

const extraImages = [
  'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&q=80',
  'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?w=500&q=80'
];

async function run() {
  const { data: products } = await supabase.from('products').select('*');
  if (!products) return console.log('No products found');
  
  for (const p of products) {
    let imgs = [];
    if (p.image_url && p.image_url.startsWith('[')) {
       try { imgs = JSON.parse(p.image_url); } catch {}
    } else if (p.image_url) {
       imgs = [p.image_url];
    }
    
    if (imgs.length > 0 && imgs.length < 3) {
      if (imgs.length === 1) { imgs.push(extraImages[0]); imgs.push(extraImages[1]); }
      else if (imgs.length === 2) { imgs.push(extraImages[1]); }
      
      await supabase.from('products').update({ image_url: JSON.stringify(imgs) }).eq('id', p.id);
      console.log('Updated product:', p.name);
    }
  }
  console.log('Done!');
}
run();
