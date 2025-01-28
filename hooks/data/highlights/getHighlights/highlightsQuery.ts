import { infinityPagination } from '@/helpers/infinityPagination';
import { GenericOps } from '@/types';
import { Tables } from '@/types/database.types';
import { getHighlights } from './getHighlights';

export interface HighlightsQueryArgs extends GenericOps<'highlights'> {
  ilike?: Partial<{ [k in keyof Tables<'highlights'>]: string }>;
}

const highlightsQuery = (args: HighlightsQueryArgs) => ({
  queryKey: ['highlights', args],
  queryFn: async () => {
    const { page, limit } = args.pagination;

    const res = await getHighlights(args);

    return infinityPagination(res.data ?? [], {
      page,
      limit,
      total_count: res.count ?? 0
    });
  }
});
export { highlightsQuery };
