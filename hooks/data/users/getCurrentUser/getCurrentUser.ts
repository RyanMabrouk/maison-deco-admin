'use server';
import { createClient } from '@/lib/supabase';

export async function getCurrentUser() {
  const supabase = createClient();
  const user = await supabase.auth.getUser();
  return await supabase
    .from('users')
    .select('*')
    .match({ id: user.data.user?.id })
    .single();
}
