'use client';
import { useQuery } from '@tanstack/react-query';
import { getOrdersStats } from './stats';

export default function useOrdersStats() {
  const query = useQuery({
    queryKey: ['orders', 'stats'],
    queryFn: async () => {
      return await getOrdersStats();
    }
  });
  return query;
}
