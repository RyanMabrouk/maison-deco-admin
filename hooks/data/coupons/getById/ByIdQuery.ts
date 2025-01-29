import { getCouponsById } from './getById';

const couponByIdQuery = (id: string) => ({
  queryKey: ['coupons', id],
  queryFn: async () => {
    const res = await getCouponsById(id);
    return res;
  }
});
export { couponByIdQuery };
