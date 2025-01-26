'use client';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { useRouter } from 'next/navigation';
import { PaginationProvider, usePagination } from '../context/usePagination';
import Table from './table';
import useProducts from '@/hooks/data/products/getProducts/useProducts';

function Base() {
  const router = useRouter();
  const { filter } = usePagination();
  const { data: books } = useProducts(filter);

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading
          title={`Produits (${books?.meta?.total_count || 0})`}
          description="Liste de tous les produits disponibles"
        />{' '}
        <button
          className="w-fit rounded-md bg-color2 px-4 py-2 text-lg text-white hover:opacity-50"
          onClick={() => router.push(`/dashboard/product`)}
        >
          Ajouter un nouveau produit
        </button>
      </div>
      <Separator />
      <Table />
    </>
  );
}
export default function ProductsComponent() {
  return (
    <PaginationProvider>
      <Base />
    </PaginationProvider>
  );
}
