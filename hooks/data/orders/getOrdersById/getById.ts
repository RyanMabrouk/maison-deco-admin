'use server';
import { createClient } from '@/lib/supabase';

export async function getOrderById(id: string) {
  const supabase = createClient();
  return await supabase.from('orders').select('*').eq('id', id).single();
}
