'use client';
import { useQuery } from '@tanstack/react-query';
import { getOrdersStatsPerCategory } from './statsPerCategory';

export default function useStatsParCategory() {
  const query = useQuery({
    queryKey: ['orders', 'stats', 'category'],
    queryFn: async () => {
      return await getOrdersStatsPerCategory();
    }
  });
  return query;
}
