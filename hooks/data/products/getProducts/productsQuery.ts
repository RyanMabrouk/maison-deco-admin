import { infinityPagination } from '@/helpers/infinityPagination';
import { GenericOps } from '@/types';
import { getProducts } from './getProducts';
import { Tables } from '@/types/database.types';

export interface ProductsQueryArgs extends GenericOps<'products'> {
  ilike?: Partial<{ [k in keyof Tables<'products'>]: string }>;
}

const productsQuery = (args: ProductsQueryArgs) => ({
  queryKey: ['products', args],
  queryFn: async () => {
    const { page, limit } = args.pagination;

    const res = await getProducts(args);

    return infinityPagination(res.data ?? [], {
      page,
      limit,
      total_count: res.count ?? 0
    });
  }
});
export { productsQuery };
