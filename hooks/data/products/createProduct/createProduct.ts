'use server';
import { createClient } from '@/lib/supabase';
import { TablesInsert } from '@/types/database.types';

export async function createProduct(data: {
  payload: TablesInsert<'products'>;
  translations: TablesInsert<'products_translations'>[];
  categories: TablesInsert<'products_categories'>[];
}) {
  const supabase = createClient();

  const { error: error1 } = await supabase
    .from('products')
    .insert(data.payload);

  if (error1) {
    return { error: error1 };
  }

  const [{ error: error2 }, { error: error3 }] = await Promise.all([
    supabase.from('products_translations').insert(data.translations),
    supabase.from('products_categories').insert(data.categories)
  ]);

  return {
    error: error2 || error3
  };
}
