'use client';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { useRouter } from 'next/navigation';
import { PaginationProvider, usePagination } from '../context/usePagination';
import Table from './table';
import useCoupons from '@/hooks/data/coupons/get/useGet';

function Base() {
  const router = useRouter();
  const { filter } = usePagination();
  const { data: products } = useCoupons(filter);

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading
          title={`Coupons (${products?.meta?.total_count || 0})`}
          description="Liste de tous les coupons disponibles"
        />{' '}
        <button
          className="w-fit rounded-md bg-color2 px-4 py-2 text-lg text-white hover:opacity-50"
          onClick={() => router.push(`/dashboard/coupon`)}
        >
          Ajouter un nouveau coupon
        </button>
      </div>
      <Separator />
      <Table />
    </>
  );
}
export default function BaseComponent() {
  return (
    <PaginationProvider>
      <Base />
    </PaginationProvider>
  );
}
