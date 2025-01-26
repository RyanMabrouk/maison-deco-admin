'use server';
import { createClient } from '@/lib/supabase';

export async function getProductById(slug: string) {
  const supabase = createClient();
  return await supabase
    .from('products')
    .select('*,products_translations(*),products_categories(*)')
    .eq('slug', slug)
    .single();
}
