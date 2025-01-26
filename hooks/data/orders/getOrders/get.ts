'use server';
import { paginateQuery } from '@/helpers/paginateQuery';
import { createClient } from '@/lib/supabase';
import { OrdersQueryArgs } from './getQuery';
import { Tables } from '@/types/database.types';

export async function getOrders(args: OrdersQueryArgs) {
  const supabase = createClient();

  const { page, limit } = args.pagination;
  const { start, end } = paginateQuery({ page, limit });

  let query = supabase
    .from('orders')
    .select('*', {
      count: 'exact',
      head: false
    })
    .range(start, end)
    .match(args.match ?? {});

  if (args.ilike) {
    (Object.keys(args.ilike) as (keyof Tables<'orders'>)[]).forEach((key) => {
      if (args.ilike?.[key]) {
        query = query.ilike(key, `%${args.ilike[key]}%`);
      }
    });
  }

  return await query;
}
