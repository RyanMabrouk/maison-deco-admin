'use client';

import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import Table from './table';
import Link from 'next/link';
import useHighlights from '@/hooks/data/highlights/getHighlights/useHighlights';
import { usePagination } from '../context/usePagination';

export default function Highlights() {
  const { filter } = usePagination();
  const { data: highlights, isLoading } = useHighlights(filter);

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading
          title={`Sélections spéciales (${
            isLoading ? 0 : highlights?.data?.length ?? 0
          })`}
          description="Liste de toutes les sélections spéciales"
        />
        <Link href="/dashboard/highlight">
          <button className="w-fit rounded-md bg-color2 px-4 py-2 text-lg text-white hover:opacity-50">
            Ajouter une sélection spéciale
          </button>
        </Link>
      </div>
      <Separator />

      <Table />
    </>
  );
}
