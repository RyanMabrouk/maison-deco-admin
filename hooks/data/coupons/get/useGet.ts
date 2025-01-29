'use client';
import { useQuery } from '@tanstack/react-query';
import { couponsQuery, CouponsQueryArgs } from './getQuery';

export default function useCoupons(args: CouponsQueryArgs) {
  const query = useQuery(couponsQuery(args));
  return query;
}
