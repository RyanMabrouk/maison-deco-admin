'use client';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { PaginationProvider, usePagination } from '../context/usePagination';
import Table from './table';
import useOrders from '@/hooks/data/orders/getOrders/useGet';

function Base() {
  const { filter } = usePagination();
  const { data: orders } = useOrders(filter);

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading
          title={`Commandes (${orders?.meta?.total_count || 0})`}
          description="Liste de tous les commandes disponibles"
        />{' '}
      </div>
      <Separator />
      <Table />
    </>
  );
}
export default function OrdersComponent() {
  return (
    <PaginationProvider>
      <Base />
    </PaginationProvider>
  );
}
