'use client';
import { useQuery } from '@tanstack/react-query';
import { categoriesQuery, CategoriesQueryArgs } from './getQuery';

export default function useCategories(args: CategoriesQueryArgs) {
  const query = useQuery(categoriesQuery(args));
  return query;
}
