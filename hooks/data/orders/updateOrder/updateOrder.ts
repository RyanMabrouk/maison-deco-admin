'use server';
import { createClient } from '@/lib/supabase';
import { TablesUpdate } from '@/types/database.types';

export async function updateOrder(data: {
  id: string;
  payload: TablesUpdate<'orders'>;
}) {
  const supabase = createClient();

  const [{ error: error1 }] = await Promise.all([
    supabase.from('orders').update(data.payload).eq('id', data.id)
  ]);

  return { error: error1 };
}
