import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl \�\X�\�P[�ے�^JH�]\���\˜�]\�L
K���ۊ�\��܎�	�Z\��[���\X�\�H�^\��JNB�H�ۜ��\X�\�HHܙX]P�Y[�
�\X�\�U\��\X�\�P[�ے�^JN��ۜ��]K\��܈HH]�Z]�\X�\�K����J	��]Y�ܚY\��K��[X�
	�Y	�K�[Z]
JN�Y�
\��܊H�]\���\˜�]\�L
K���ۊ�\��܎�\��܋�Y\��Y�HJNB���]\���\˜�]\��
K���ۊ��]\Έ	�]�Z�I�[YN��]�]J
K��T����[��
HJN