'use client';
import React, { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { columns } from './columns';
import { usePagination } from '../context/usePagination';
import { GenericTableData } from '@/components/genericTableData';
import { Separator } from '@/components/ui/separator';
import { SwitchGeneric } from '@/components/switchGeneric';
import { productsQuery } from '@/hooks/data/products/getProducts/productsQuery';
import useCoupons from '@/hooks/data/coupons/get/useGet';
import { Tables } from '@/types/database.types';

export default function Table() {
  const { filter, setFilter } = usePagination();

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [columnState, setColumnState] = useState<
    {
      accessorKey: keyof Tables<'coupons'>;
      header: string;
      visible: boolean;
      cell?: ReturnType<typeof columns>[number]['cell'];
    }[]
  >([
    {
      accessorKey: 'code',
      header: 'Code',
      visible: true
    },
    {
      accessorKey: 'active',
      header: 'Actif',
      visible: true,
      cell: ({ row }) => <div>{row.original.active ? 'Actif' : 'Inactif'}</div>
    },
    {
      accessorKey: 'discount',
      header: 'Réduction',
      visible: true,
      cell: ({ row }) => (
        <div>
          {row.original.discount_type === 'amount'
            ? -row.original.discount
            : -row.original.discount + '%'}
        </div>
      )
    },
    {
      accessorKey: 'times_used',
      header: "Nombre d'utilisations",
      visible: true
    },
    {
      accessorKey: 'max_uses',
      header: 'Utilisations max',
      visible: true
    },
    {
      accessorKey: 'created_at',
      header: 'Créé le',
      visible: true,
      cell: ({ row }) => (
        <div className="flex w-full items-center justify-center">
          {new Date(row.original.created_at ?? '').toLocaleString()}
        </div>
      )
    }
  ]);

  const { data: coupons, isLoading } = useCoupons(filter);

  const queryClient = useQueryClient();

  useEffect(() => {
    if (coupons?.meta?.has_next_page) {
      queryClient.prefetchQuery(
        productsQuery({
          ...filter,
          pagination: {
            ...filter.pagination,
            page: filter.pagination.page + 1
          }
        })
      );
    }
  }, [filter.pagination.page, coupons?.meta?.has_next_page]);

  const toggleColumnVisibility = (accessorKey: string) => {
    setColumnState((prevState) =>
      prevState.map((col) =>
        col.accessorKey === accessorKey
          ? { ...col, visible: !col.visible }
          : col
      )
    );
  };

  return (
    <div>
      <h1 className="mt-4 text-xl font-semibold">
        Configurer l&apos;affichage du tableau
      </h1>
      <div className="flex flex-wrap gap-4 pb-5 pt-3">
        {columnState.map((col) => (
          <SwitchGeneric
            key={col.accessorKey}
            label={col.header}
            checked={col.visible}
            onChange={() => toggleColumnVisibility(col.accessorKey)}
          />
        ))}
      </div>
      <Separator />

      <GenericTableData
        searchColumnName="code"
        pagination_data={coupons}
        columns={columns({
          selectedIds,
          setSelectedIds,
          columnState
        })}
        onSearchChange={(searchQuery) => {
          setFilter((prev) => ({
            ...prev,
            ilike: {
              ...prev.ilike,
              code: searchQuery
            }
          }));
        }}
        setPage={(page) => {
          setFilter((prev) => ({
            ...prev,
            pagination: {
              ...prev.pagination,
              page
            }
          }));
        }}
        isLoading={isLoading}
      />
    </div>
  );
}
