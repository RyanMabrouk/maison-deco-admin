'use server';
import { createClient } from '@/lib/supabase';
import { TablesUpdate } from '@/types/database.types';

export async function updateCoupon(data: {
  id: string;
  payload: TablesUpdate<'coupons'>;
}) {
  const supabase = createClient();

  const [{ error: error1 }] = await Promise.all([
    supabase.from('coupons').update(data.payload).eq('id', data.id)
  ]);

  return { error: error1 };
}
