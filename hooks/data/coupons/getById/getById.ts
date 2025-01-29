'use server';
import { createClient } from '@/lib/supabase';

export async function getCouponsById(id: string) {
  const supabase = createClient();
  return await supabase.from('coupons').select('*').match({ id }).single();
}
