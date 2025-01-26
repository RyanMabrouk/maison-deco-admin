'use client';
import { useQuery } from '@tanstack/react-query';
import { orderByIdQuery } from './ByIdQuery';
export default function useOrderById(id: string) {
  const query = useQuery(orderByIdQuery(id));
  return query;
}
