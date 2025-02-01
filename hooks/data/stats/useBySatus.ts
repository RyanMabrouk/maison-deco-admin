'use client';
import { useQuery } from '@tanstack/react-query';
import { getOrdersStatsByStatus } from './statsByStatus';

export default function useOrdersStatsByStatus() {
  const query = useQuery({
    queryKey: ['orders', 'statsByStatus'],
    queryFn: async () => {
      return await getOrdersStatsByStatus();
    }
  });
  return query;
}
