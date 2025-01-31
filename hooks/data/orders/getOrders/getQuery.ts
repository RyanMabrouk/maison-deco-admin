import { infinityPagination } from '@/helpers/infinityPagination';
import { GenericOps } from '@/types';
import { getOrders } from './get';
import { Tables } from '@/types/database.types';

export interface OrdersQueryArgs extends GenericOps<'orders'> {
  ilike?: Partial<{ [K in keyof Tables<'orders'>]: string }>;
  order?: {
    column: keyof Tables<'orders'>;
    direction: 'asc' | 'desc';
  };
}

const ordersQuery = (args: OrdersQueryArgs) => ({
  queryKey: ['orders', args],
  queryFn: async () => {
    const { page, limit } = args.pagination;

    const res = await getOrders(args);

    return infinityPagination(res.data ?? [], {
      page,
      limit,
      total_count: res.count ?? 0
    });
  }
});
export { ordersQuery };
