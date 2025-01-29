import { infinityPagination } from '@/helpers/infinityPagination';
import { GenericOps } from '@/types';
import { Tables } from '@/types/database.types';
import { getCoupons } from './get';

export interface CouponsQueryArgs extends GenericOps<'coupons'> {
  ilike?: Partial<{ [k in keyof Tables<'coupons'>]: string }>;
}

const couponsQuery = (args: CouponsQueryArgs) => ({
  queryKey: ['coupons', args],
  queryFn: async () => {
    const { page, limit } = args.pagination;

    const res = await getCoupons(args);

    return infinityPagination(res.data ?? [], {
      page,
      limit,
      total_count: res.count ?? 0
    });
  }
});
export { couponsQuery };
