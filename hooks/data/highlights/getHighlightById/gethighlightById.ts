'use server';
import { createClient } from '@/lib/supabase';

export async function getHighlightById(slug: string) {
  const supabase = createClient();
  return await supabase
    .from('highlights')
    .select('*,highlights_translations(*),highlight_products(products(*))')
    .match({ slug })
    .single();
}
