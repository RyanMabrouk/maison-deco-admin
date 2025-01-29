'use server';
import { createClient } from '@/lib/supabase';
import { TablesInsert } from '@/types/database.types';

export async function createCoupon(data: { payload: TablesInsert<'coupons'> }) {
  const supabase = createClient();
  const { error: error1 } = await supabase.from('coupons').insert(data.payload);

  return { error: error1 };
}
