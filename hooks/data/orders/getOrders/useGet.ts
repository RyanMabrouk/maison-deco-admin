'use client';
import { useQuery } from '@tanstack/react-query';
import { ordersQuery, OrdersQueryArgs } from './getQuery';

export default function useOrders(args: OrdersQueryArgs) {
  const query = useQuery(ordersQuery(args));
  return query;
}
