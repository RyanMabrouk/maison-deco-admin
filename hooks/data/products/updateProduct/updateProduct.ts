'use server';
import { createClient } from '@/lib/supabase';
import { TablesInsert, TablesUpdate } from '@/types/database.types';

export async function updateProduct(data: {
  slug: string;
  payload: TablesUpdate<'products'>;
  translations: TablesInsert<'products_translations'>[];
  categories_to_add: TablesInsert<'products_categories'>[];
  categories_to_remove: {
    category_slug: string;
  }[];
}) {
  console.log('🚀 ~ categories_to_remove:', data.categories_to_remove);
  console.log('🚀 ~ categories_to_add:', data.categories_to_add);
  const supabase = createClient();

  const [
    { error: error1 },
    { error: error2 },
    { error: error3 },
    { error: error4 }
  ] = await Promise.all([
    supabase.from('products').update(data.payload).eq('slug', data.slug),
    supabase.from('products_translations').upsert(data.translations),
    supabase.from('products_categories').insert(data.categories_to_add),
    supabase
      .from('products_categories')
      .delete()
      .eq('product_slug', data.slug)
      .in(
        'category_slug',
        data.categories_to_remove.map((c) => c.category_slug)
      )
  ]);

  return { error: error1 || error2 || error3 || error4 };
}
