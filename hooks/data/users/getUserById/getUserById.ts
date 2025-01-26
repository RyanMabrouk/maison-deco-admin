'use server';
import { createClient } from '@/lib/supabase';

export async function getUserById(id: string) {
  const supabase = createClient();
  return await supabase.from('users').select('*').match({ id }).single();
}
