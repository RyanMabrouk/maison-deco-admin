'use server';

import { createClient } from '@/lib/supabase';
import { TablesUpdate } from '@/types/database.types';

export interface IUpdateUser extends Omit<TablesUpdate<'users'>, 'email'> {}

export async function updateUser({
  payload,
  user_id
}: {
  payload: IUpdateUser;
  user_id: string;
}) {
  const supabase = createClient();
  return await supabase
    .from('users')
    .update({ ...payload })
    .eq('id', user_id);
}
