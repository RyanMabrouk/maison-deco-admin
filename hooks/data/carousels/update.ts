'use server';
import { createClient } from '@/lib/supabase';
import { TablesInsert } from '@/types/database.types';

export async function updateCarousel(data: {
  id: string;
  payload: TablesInsert<'carousels'>;
  translations: TablesInsert<'carousels_translations'>[];
}) {
  const supabase = createClient();

  const [{ error: error1 }] = await Promise.all([
    supabase.from('carousels').update(data.payload).eq('id', data.id),
    supabase
      .from('carousels_translations')
      .upsert(data.translations)
      .eq('carousel_item_id', data.id)
  ]);

  return { error: error1 };
}
