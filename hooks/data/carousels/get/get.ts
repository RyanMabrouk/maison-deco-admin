'use server';
import { createClient } from '@/lib/supabase';
import { CarouselsQueryArgs } from './getQuery';

export async function getCarousels(args: CarouselsQueryArgs) {
  const supabase = createClient();

  let query = supabase
    .from('carousels')
    .select('*,carousels_translations(*)', {
      count: 'exact',
      head: false
    })
    .order('created_at', { ascending: true })
    .match(args.match ?? {});

  return await query;
}
