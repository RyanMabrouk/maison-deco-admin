'use server';
import { createClient } from '@/lib/supabase';

export async function deleteCarousel(id: string) {
  const supabase = createClient();
  return await supabase.from('carousels').delete().eq('id', id);
}
