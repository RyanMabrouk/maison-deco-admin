'use server';
import { createClient } from '@/lib/supabase';
import { TablesInsert } from '@/types/database.types';

export async function createCarousel(data: {
  payload: TablesInsert<'carousels'>;
  translations: Omit<
    TablesInsert<'carousels_translations'>,
    'carousel_item_id'
  >[];
}) {
  const supabase = createClient();
  const { error: error1, data: new_carousel } = await supabase
    .from('carousels')
    .insert(data.payload)
    .select('id');
  if (error1 || new_carousel === null) {
    return { error: error1 };
  }

  const [{ error: error2 }] = await Promise.all([
    supabase.from('carousels_translations').insert(
      data.translations.map((translation) => ({
        ...translation,
        carousel_item_id: new_carousel[0].id
      }))
    )
  ]);

  return { error: error2 };
}
