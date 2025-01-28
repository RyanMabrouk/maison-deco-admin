'use server';
import { createClient } from '@/lib/supabase';

export async function deleteHighlight(slug: string) {
  const supabase = createClient();
  return await supabase.from('highlights').delete().eq('slug', slug);
}
