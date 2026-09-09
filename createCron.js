const fs = require('fs');
fs.mkdirSync('api', { recursive: true });
const code = `import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return res.status(500).json({ error: 'Missing Supabase keys' });
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  const { data, error } = await supabase.from('categories').select('id').limit(1);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json({ status: 'Awake', time: new Date().toISOString() });
}`;
fs.writeFileSync('api/cron.js', code, 'utf8');
fs.writeFileSync('vercel.json', JSON.stringify({ crons: [{ path: '/api/cron', schedule: '0 12 * * *' }] }, null, 2), 'utf8');