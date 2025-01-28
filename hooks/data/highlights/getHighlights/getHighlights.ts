'use server';
import { paginateQuery } from '@/helpers/paginateQuery';
import { createClient } from '@/lib/supabase';
import { Tables } from '@/types/database.types';
import { HighlightsQueryArgs } from './highlightsQuery';

export async function getHighlights(args: HighlightsQueryArgs) {
  const supabase = createClient();

  const { page, limit } = args.pagination;
  const { start, end } = paginateQuery({ page, limit });

  let query = supabase
    .from('highlights')
    .select('*,highlights_translations(*)', {
      count: 'exact',
      head: false
    })
    .range(start, end)
    .match(args.match ?? {});

  if (args.ilike) {
    (Object.keys(args.ilike) as (keyof Tables<'highlights'>)[]).forEach(
      (key) => {
        if (args.ilike?.[key]) {
          query = query.ilike(key, `%${args.ilike[key]}%`);
        }
      }
    );
  }

  return await query;
}
