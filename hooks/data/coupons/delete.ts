'use server';
import { createClient } from '@/lib/supabase';

export async function deleteCoupon(id: string) {
  const supabase = createClient();
  return await supabase.from('coupons').delete().eq('id', id);
}
