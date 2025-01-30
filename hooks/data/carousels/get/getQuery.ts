import { GenericOps } from '@/types';
import { getCarousels } from './get';

export interface CarouselsQueryArgs
  extends Omit<GenericOps<'carousels'>, 'pagination'> {}

const carouselsQuery = (args: CarouselsQueryArgs) => ({
  queryKey: ['carousels', args],
  queryFn: async () => {
    const res = await getCarousels(args);
    return res;
  }
});
export { carouselsQuery };
