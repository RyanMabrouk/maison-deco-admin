'use client';
import { useQuery } from '@tanstack/react-query';
import { getOrdersStatsPerMonth } from './statsPerMonth';

export default function useOrdersStatsPerMonth() {
  const query = useQuery({
    queryKey: ['orders', 'statsPerMonth'],
    queryFn: async () => {
      return await getOrdersStatsPerMonth();
    }
  });
  return query;
}
