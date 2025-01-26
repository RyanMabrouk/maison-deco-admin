'use server';
import { createClient } from '@/lib/supabase';
import { CategoriesQueryArgs } from './getQuery';

export async function getCategories(args: CategoriesQueryArgs) {
  const supabase = createClient();
  return await supabase
    .from('categories')
    .select('*,categories_translations(*)', { count: 'exact', head: false })
    .match(args.match ?? {});
}
