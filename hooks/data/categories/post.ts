'use server';
import { createClient } from '@/lib/supabase';
import { TablesInsert } from '@/types/database.types';

export async function createCategory(data: {
  payload: TablesInsert<'categories'>;
  translations: TablesInsert<'categories_translations'>[];
}) {
  const supabase = createClient();
  const { error: error1 } = await supabase
    .from('categories')
    .insert(data.payload);
  if (error1) {
    return { error: error1 };
  }

  const { error: error2 } = await supabase
    .from('categories_translations')
    .insert(data.translations);
  if (error2) {
    return { error: error2 };
  }
  return { error: null };
}
