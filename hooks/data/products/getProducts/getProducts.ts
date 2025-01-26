'use server';
import { paginateQuery } from '@/helpers/paginateQuery';
import { createClient } from '@/lib/supabase';
import { ProductsQueryArgs } from './productsQuery';
import { Tables } from '@/types/database.types';

export async function getProducts(args: ProductsQueryArgs) {
  const supabase = createClient();

  const { page, limit } = args.pagination;
  const { start, end } = paginateQuery({ page, limit });

  let query = supabase
    .from('products')
    .select('*,products_translations(*),products_categories(*)', {
      count: 'exact',
      head: false
    })
    .range(start, end)
    .match(args.match ?? {});

  if (args.ilike) {
    (Object.keys(args.ilike) as (keyof Tables<'products'>)[]).forEach((key) => {
      if (args.ilike?.[key]) {
        query = query.ilike(key, `%${args.ilike[key]}%`);
      }
    });
  }

  return await query;
}
