import { GenericOps } from '@/types';
import { getCategories } from './get';

export interface CategoriesQueryArgs
  extends Omit<GenericOps<'categories'>, 'pagination'> {}

const categoriesQuery = (args: CategoriesQueryArgs) => ({
  queryKey: ['categories', args],
  queryFn: async () => {
    const res = await getCategories(args);
    return res;
  }
});
export { categoriesQuery };
