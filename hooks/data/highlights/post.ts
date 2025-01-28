'use server';
import { createClient } from '@/lib/supabase';
import { TablesInsert } from '@/types/database.types';

export async function createHighlight(data: {
  payload: TablesInsert<'highlights'>;
  translations: TablesInsert<'highlights_translations'>[];
  products_ids: string[];
}) {
  const supabase = createClient();
  const { error: error1 } = await supabase
    .from('highlights')
    .insert(data.payload);
  if (error1) {
    return { error: error1 };
  }

  const [{ error: error2 }, { error: error3 }] = await Promise.all([
    supabase.from('highlights_translations').insert(data.translations),
    supabase.from('highlight_products').insert(
      data.products_ids.map((slug) => ({
        highlight_slug: data.payload.slug,
        product_slug: slug
      }))
    )
  ]);
  console.log('🚀 ~ error3:', error3);
  console.log('🚀 ~ error2:', error2);

  return { error: error2 || error3 };
}
