import { getOrderById } from './getById';

const orderByIdQuery = (id: string) => ({
  queryKey: ['orders', id],
  queryFn: async () => {
    return await getOrderById(id);
  }
});
export { orderByIdQuery };
