'use client';
import { useQuery } from '@tanstack/react-query';
import { carouselsQuery, CarouselsQueryArgs } from './getQuery';

export default function useCarousels(args: CarouselsQueryArgs) {
  const query = useQuery(carouselsQuery(args));
  return query;
}
