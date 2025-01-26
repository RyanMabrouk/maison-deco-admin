'use client';
import { useQuery } from '@tanstack/react-query';
import { productsQuery, ProductsQueryArgs } from './productsQuery';

export default function useProducts(args: ProductsQueryArgs) {
  const query = useQuery(productsQuery(args));
  return query;
}
