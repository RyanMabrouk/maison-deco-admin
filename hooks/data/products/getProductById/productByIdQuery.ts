import { getProductById } from './getProductById';

const productByIdQuery = (id: string) => ({
  queryKey: ['products', id],
  queryFn: async () => {
    return await getProductById(id);
  }
});
export { productByIdQuery };
