'use server';
import { createClient } from '@/lib/supabase';
import { TablesInsert } from '@/types/database.types';

export async function updateHighlight(data: {
  slug: string;
  payload: TablesInsert<'highlights_translations'>[];
  products_ids: string[];
}) {
  const supabase = createClient();

  const [{ error: error1 }] = await Promise.all([
    supabase
      .from('highlights_translations')
      .upsert(data.payload)
      .eq('slug', data.slug),
    supabase
      .from('highlight_products')
      .delete()
      .eq('highlight_slug', data.slug),
    supabase.from('highlight_products').insert(
      data.products_ids.map((slug) => ({
        highlight_slug: data.slug,
        product_slug: slug
      }))
    )
  ]);

  return { error: error1 };
}
