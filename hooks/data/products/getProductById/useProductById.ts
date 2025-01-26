'use client';
import { useQuery } from '@tanstack/react-query';
import { productByIdQuery } from './productByIdQuery';
export default function useProductById(id: string) {
  const query = useQuery(productByIdQuery(id));
  return query;
}
