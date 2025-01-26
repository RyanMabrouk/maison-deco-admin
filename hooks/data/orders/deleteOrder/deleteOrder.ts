'use server';
import { createClient } from '@/lib/supabase';

export async function deleteOrder(id: string) {
  const supabase = createClient();

  return await supabase.from('orders').delete().eq('id', id);
}
