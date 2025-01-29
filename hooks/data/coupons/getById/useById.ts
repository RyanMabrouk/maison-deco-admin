'use client';
import { useQuery } from '@tanstack/react-query';
import { couponByIdQuery } from './ByIdQuery';
export default function useCouponsById(id: string) {
  const query = useQuery(couponByIdQuery(id));
  return query;
}
