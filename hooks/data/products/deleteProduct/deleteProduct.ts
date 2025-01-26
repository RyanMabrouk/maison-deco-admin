'use server';
import { createClient } from '@/lib/supabase';

export async function deleteProduct(id: string) {
  const supabase = createClient();

  return await supabase.from('products').delete().eq('id', id);
}
