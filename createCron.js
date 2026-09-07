const fs = require('fs');
fs.mkdirSync('api', { recursive: true });
const code = \import { createClient } from '@supabase/supabase-js';\n\nexport default async function handler(req, res) {\n  const supabaseUrl = process.env.VITE_SUPABASE_URL;\n  const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;\n  \n  if (!supabaseUrl || !supabaseAnonKey) {\n    return res.status(500).json({ error: 'Missing Supabase keys' });\n  }\n\n  const supabase = createClient(supabaseUrl, supabaseAnonKey);\n\n  const { data, error } = await supabase.from('categories').select('id').limit(1);\n  \n  if (error) {\n    return res.status(500).json({ error: error.message });\n  }\n\n  return res.status(200).json({ status: 'Awake', time: new Date().toISOString() });\n}\;
fs.writeFileSync('api/cron.js', code, 'utf8');
fs.writeFileSync('vercel.json', JSON.stringify({ crons: [{ path: '/api/cron', schedule: '0 12 * * *' }] }, null, 2), 'utf8');
