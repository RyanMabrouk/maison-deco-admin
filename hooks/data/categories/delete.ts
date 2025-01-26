'use server';
import { createClient } from '@/lib/supabase';

export async function deleteCategory(slug: string) {
  const supabase = createClient();
  return await supabase.from('categories').delete().eq('slug', slug);
}
