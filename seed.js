import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://uwshugnbtmguxmwxtdhk.supabase.co',
  'sb_publishable_0ogHMrJKkm4mHFJJntCbzg_sn4tzsGu'
);

async function seed() {
  console.log('Seeding data...');
  
  // 1. Categories
  const { data: cat1, error: err1 } = await supabase.from('categories').insert([
    { name: 'To\'y tortlari', image_url: 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=500&q=80', sort_order: 1 },
    { name: 'Tug\'ilgan kun', image_url: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=500&q=80', sort_order: 2 },
    { name: 'Shirinliklar', image_url: 'https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=500&q=80', sort_order: 3 },
    { name: 'Kekslar', image_url: 'https://images.unsplash.com/photo-1550617931-e17a7b70dce2?w=500&q=80', sort_order: 4 }
  ]).select();

  if (err1) {
    console.error('Error categories:', err1);
    return;
  }
  console.log('Categories created:', cat1.length);

  // 2. Products
  const products = [
    {
      category_id: cat1[0].id,
      name: 'Oltin tojli to\'y torti',
      description: 'Yong\'oqli va shokoladli maxsus krem bilan tayyorlangan 3 qavatli to\'y torti.',
      price: 850000,
      image_url: 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=500&q=80',
      is_available: true,
      is_featured: true
    },
    {
      category_id: cat1[1].id,
      name: 'Meva-jamli Qulupnayli',
      description: 'Tabiiy qulupnay va malina qo\'shilgan bolalar uchun maxsus tort.',
      price: 250000,
      image_url: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=500&q=80',
      is_available: true,
      is_featured: true
    },
    {
      category_id: cat1[2].id,
      name: 'Shokoladli Trufel',
      description: 'Haqiqiy Belgiya shokoladidan tayyorlangan 12 talik trufellar to\'plami.',
      price: 120000,
      image_url: 'https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=500&q=80',
      is_available: true,
      is_featured: false
    },
    {
      category_id: cat1[3].id,
      name: 'Qulupnayli Keks (6ta)',
      description: 'Eritilgan oq shokolad va qaymoqli krem bilan bezatilgan kekslar.',
      price: 80000,
      image_url: 'https://images.unsplash.com/photo-1550617931-e17a7b70dce2?w=500&q=80',
      is_available: true,
      is_featured: true
    }
  ];

  const { error: err2 } = await supabase.from('products').insert(products);
  
  if (err2) {
    console.error('Error products:', err2);
    return;
  }
  console.log('Products created successfully!');
}

seed();
